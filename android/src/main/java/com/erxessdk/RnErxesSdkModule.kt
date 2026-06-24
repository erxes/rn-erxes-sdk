package com.erxessdk

import androidx.compose.material.icons.Icons
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import com.erxes.messenger.ErxesMessenger
import com.erxes.messenger.config.ActionItem
import com.erxes.messenger.config.Appearance
import com.erxes.messenger.config.DisplayMode
import com.erxes.messenger.config.MessengerConfig
import com.erxes.messenger.config.MessengerUser
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.flow.filter
import kotlinx.coroutines.launch

/**
 * React Native bridge for the erxes Android Messenger SDK. Counterpart to the
 * iOS `RnErxesSdk` (see `ios/RnErxesSdk.swift`); the native module name, method
 * names, and event names match so the shared JS layer (`src/nativeIos.ts`) and
 * `NativeEventEmitter` wiring work unchanged across platforms.
 *
 * Android implements **chat mode** only. The classic-mode launcher/imperative-hide
 * methods (`showLauncher`/`hideLauncher`/`hideMessenger`) have no Android SDK
 * equivalent and are no-ops here so the cross-platform JS contract resolves
 * identically.
 */
class RnErxesSdkModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  /** Replaced on each `configure()`; collects `ErxesMessenger.isReady`. */
  private var readyScope: CoroutineScope? = null

  /** Active JS listener count — mirrors iOS `hasListeners` so we don't emit into the void. */
  private var listenerCount = 0

  override fun getName(): String = NAME

  // region Configuration

  @ReactMethod
  fun configure(options: ReadableMap, promise: Promise) {
    val integrationId = options.stringOrNull("integrationId")
    if (integrationId.isNullOrEmpty()) {
      promise.reject("missing_integration_id", "integrationId is required")
      return
    }

    val endpoint = endpoint(options)
    if (endpoint == null) {
      promise.reject("missing_endpoint", "endpoint, serverUrl, or subDomain is required")
      return
    }

    // Mirrors iOS: default to classic, opt into chat with displayMode: 'chat'.
    val displayMode = when (options.stringOrNull("displayMode")) {
      "chat" -> DisplayMode.CHAT
      else -> DisplayMode.CLASSIC
    }

    val appearance = hexColor(options.stringOrNull("primaryColor"))
      ?.let { Appearance(primaryColor = it) }
      ?: Appearance()

    val config = MessengerConfig(
      endpoint = endpoint,
      integrationId = integrationId,
      cachedCustomerId = options.stringOrNull("cachedCustomerId"),
      appearance = appearance,
      displayMode = displayMode,
      homeActions = actionItems(options.arrayOrNull("homeActions")),
      drawerActions = actionItems(options.arrayOrNull("drawerActions")),
    )

    // Route chat-mode action taps to JS as `onErxesAction` events.
    ErxesMessenger.onAction = { id ->
      if (listenerCount > 0) {
        emit(ACTION_EVENT, Arguments.createMap().apply { putString("id", id) })
      }
    }

    // Forward the connect handshake to JS as `onErxesReady`. `isReady` is a
    // StateFlow, so it replays its current value on collection (a `configure()`
    // after the SDK is already connected still notifies JS) and conflates
    // duplicates, so `filter { it }` emits once per connection — mirroring the
    // iOS Combine pipeline (`removeDuplicates().filter { $0 }`).
    readyScope?.cancel()
    val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)
    readyScope = scope
    scope.launch {
      ErxesMessenger.isReady
        .filter { it }
        .collect {
          if (listenerCount > 0) {
            emit(READY_EVENT, null)
          }
        }
    }

    // `configure()` registers chat-mode auto-present via activity lifecycle
    // callbacks, so run it on the main thread.
    UiThreadUtil.runOnUiThread {
      ErxesMessenger.configure(reactContext.applicationContext, config)

      // Present chat mode immediately (mirroring iOS, where `configure()` auto-
      // presents). The SDK's own auto-present only fires on the *next* activity
      // resume, but React Native calls `configure()` after the host activity is
      // already resumed — so that event never comes. Present from the current
      // activity instead. If there's no activity yet, the SDK's lifecycle
      // fallback still covers it on the next resume.
      if (displayMode == DisplayMode.CHAT) {
        reactContext.currentActivity?.let { ErxesMessenger.show(it) }
      }

      promise.resolve(null)
    }
  }

  // endregion

  // region User

  @ReactMethod
  fun setUser(options: ReadableMap, promise: Promise) {
    // Note: iOS `MessengerUser` carries `customData`; the Android SDK's
    // `MessengerUser` does not, so `customData` is accepted but ignored here.
    ErxesMessenger.setUser(
      MessengerUser(
        email = options.stringOrNull("email"),
        name = options.stringOrNull("name"),
        phone = options.stringOrNull("phone"),
      )
    )
    promise.resolve(null)
  }

  @ReactMethod
  fun clearUser(promise: Promise) {
    ErxesMessenger.clearUser()
    promise.resolve(null)
  }

  // endregion

  // region Presentation

  @ReactMethod
  fun showMessenger(promise: Promise) {
    val activity = reactContext.currentActivity
    if (activity == null) {
      promise.reject("missing_presenter", "Unable to find an activity to present from")
      return
    }
    UiThreadUtil.runOnUiThread {
      runCatching { ErxesMessenger.show(activity) }
        .onSuccess { promise.resolve(null) }
        .onFailure { promise.reject("show_failed", it.message, it) }
    }
  }

  // The launcher visibility / imperative-hide methods are classic-mode iOS
  // concepts with no Android SDK equivalent (chat mode auto-presents and is
  // dismissed by the user). No-op so the shared JS contract resolves identically.

  @ReactMethod
  fun hideMessenger(promise: Promise) {
    promise.resolve(null)
  }

  @ReactMethod
  fun showLauncher(promise: Promise) {
    promise.resolve(null)
  }

  @ReactMethod
  fun hideLauncher(promise: Promise) {
    promise.resolve(null)
  }

  // endregion

  // region Event emitter plumbing (required by NativeEventEmitter on Android)

  @ReactMethod
  fun addListener(eventName: String) {
    listenerCount += 1
  }

  @ReactMethod
  fun removeListeners(count: Int) {
    listenerCount = (listenerCount - count).coerceAtLeast(0)
  }

  override fun invalidate() {
    readyScope?.cancel()
    readyScope = null
    ErxesMessenger.onAction = null
    listenerCount = 0
    super.invalidate()
  }

  private fun emit(name: String, body: WritableMap?) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(name, body)
  }

  // endregion

  // region Parsing helpers (ported from the iOS bridge)

  private fun endpoint(options: ReadableMap): String? {
    options.stringOrNull("endpoint")?.let { return it }
    options.stringOrNull("serverUrl")?.let { return it }

    val subDomain = options.stringOrNull("subDomain") ?: return null
    return if (subDomain.startsWith("http://") || subDomain.startsWith("https://")) {
      subDomain
    } else {
      "https://$subDomain"
    }
  }

  /**
   * Parse `[{ id, title, androidIcon }]` from JS into `[ActionItem]`. Entries
   * without an `id` are skipped. `androidIcon` resolves, in order, to a Compose
   * Material icon by name (e.g. `"AccountCircle"`, `"Search"`) or a host-app
   * drawable resource name (e.g. `"ic_profile"`). When absent or unresolved, the
   * messenger renders its default icon. The iOS `systemIcon` (an SF Symbol) has no
   * Android equivalent and is ignored here.
   */
  private fun actionItems(value: ReadableArray?): List<ActionItem> {
    if (value == null) return emptyList()
    val items = mutableListOf<ActionItem>()
    for (i in 0 until value.size()) {
      val map = value.getMap(i) ?: continue
      val id = map.stringOrNull("id") ?: continue
      val iconName = map.stringOrNull("androidIcon")
      val vector = materialIcon(iconName)
      items.add(
        ActionItem(
          id = id,
          title = map.stringOrNull("title") ?: "",
          imageVector = vector,
          drawableRes = if (vector == null) drawableRes(iconName) else null,
        )
      )
    }
    return items
  }

  /**
   * Resolve a Compose Material (filled) icon by name, e.g. `"AccountCircle"` →
   * `Icons.Filled.AccountCircle`. Only a handful of icons ship in
   * `material-icons-core`; for the full set the host app must depend on
   * `androidx.compose.material:material-icons-extended` (and keep these classes in
   * release builds). Returns null if the name isn't a known Material icon.
   */
  private fun materialIcon(name: String?): ImageVector? {
    if (name.isNullOrEmpty()) return null
    return try {
      val cls = Class.forName("androidx.compose.material.icons.filled.${name}Kt")
      val getter = cls.getMethod("get$name", Icons.Filled::class.java)
      getter.invoke(null, Icons.Filled) as? ImageVector
    } catch (t: Throwable) {
      null
    }
  }

  /** Resolve a host-app drawable resource name to its id, or null if absent/unknown. */
  private fun drawableRes(name: String?): Int? {
    if (name.isNullOrEmpty()) return null
    val id = reactContext.resources.getIdentifier(name, "drawable", reactContext.packageName)
    return id.takeIf { it != 0 }
  }

  /** Parse a `#RGB`/`#RRGGBB`/`#RRGGBBAA` hex string into a Compose [Color]. */
  private fun hexColor(value: String?): Color? {
    var hex = value?.trim()?.removePrefix("#") ?: return null

    // Expand shorthand #RGB to #RRGGBB.
    if (hex.length == 3) {
      hex = hex.map { "$it$it" }.joinToString("")
    }

    if (hex.length != 6 && hex.length != 8) return null
    val intValue = hex.toLongOrNull(16) ?: return null

    return if (hex.length == 8) {
      Color(
        red = ((intValue shr 24) and 0xFF).toInt(),
        green = ((intValue shr 16) and 0xFF).toInt(),
        blue = ((intValue shr 8) and 0xFF).toInt(),
        alpha = (intValue and 0xFF).toInt(),
      )
    } else {
      Color(
        red = ((intValue shr 16) and 0xFF).toInt(),
        green = ((intValue shr 8) and 0xFF).toInt(),
        blue = (intValue and 0xFF).toInt(),
      )
    }
  }

  private fun ReadableMap.stringOrNull(key: String): String? =
    if (hasKey(key) && !isNull(key)) getString(key)?.ifEmpty { null } else null

  private fun ReadableMap.arrayOrNull(key: String): ReadableArray? =
    if (hasKey(key) && !isNull(key)) getArray(key) else null

  // endregion

  companion object {
    const val NAME = "RnErxesSdk"

    /** JS event fired when a chat-mode action is tapped. */
    private const val ACTION_EVENT = "onErxesAction"

    /** JS event fired when the connect handshake completes. */
    private const val READY_EVENT = "onErxesReady"
  }
}
