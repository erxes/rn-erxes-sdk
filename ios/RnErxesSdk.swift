import Foundation
import MessengerSDK
import UIKit
import React

@objc(RnErxesSdk)
final class RnErxesSdk: RCTEventEmitter {
    /// JS event fired when a chat-mode action (homeActions/drawerActions) is tapped.
    private static let actionEvent = "onErxesAction"

    /// True while JS has at least one listener attached, so we don't emit into the void.
    private var hasListeners = false

    override static func requiresMainQueueSetup() -> Bool {
        true
    }

    override func supportedEvents() -> [String] {
        [Self.actionEvent]
    }

    override func startObserving() {
        hasListeners = true
    }

    override func stopObserving() {
        hasListeners = false
    }

    @objc(configure:resolver:rejecter:)
    func configure(
        _ options: NSDictionary,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        Task { @MainActor in
            guard let integrationId = options["integrationId"] as? String, !integrationId.isEmpty else {
                reject("missing_integration_id", "integrationId is required", nil)
                return
            }

            guard let endpoint = Self.endpoint(from: options) else {
                reject("missing_endpoint", "endpoint, serverUrl, or subDomain is required", nil)
                return
            }

            let cachedCustomerId = Self.string(options["cachedCustomerId"])
            let displayMode = Self.string(options["displayMode"])
                .flatMap(DisplayMode.init(rawValue:)) ?? .classic
            let homeActions = Self.actionItems(options["homeActions"])
            let drawerActions = Self.actionItems(options["drawerActions"])

            var appearance = MessengerConfig.Appearance()
            if let primaryColor = Self.hexColor(options["primaryColor"]) {
                appearance.primaryColor = primaryColor
            }

            // Route chat-mode action taps to JS as `onErxesAction` events. The SDK
            // only hands back the tapped action's id (data-only across the bridge).
            MessengerSDK.shared.onAction = { [weak self] id in
                guard let self, self.hasListeners else { return }
                self.sendEvent(withName: Self.actionEvent, body: ["id": id])
            }

            MessengerSDK.configure(
                MessengerConfig(
                    endpoint: endpoint,
                    integrationId: integrationId,
                    cachedCustomerId: cachedCustomerId,
                    appearance: appearance,
                    displayMode: displayMode,
                    homeActions: homeActions,
                    drawerActions: drawerActions
                )
            )

            resolve(nil)
        }
    }

    @objc(setUser:resolver:rejecter:)
    func setUser(
        _ options: NSDictionary,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        Task { @MainActor in
            let email = Self.string(options["email"])
            let phone = Self.string(options["phone"])
            let name = Self.string(options["name"])
            let customData = Self.stringDictionary(options["customData"])

            MessengerSDK.setUser(
                MessengerUser(
                    email: email,
                    phone: phone,
                    name: name,
                    customData: customData
                )
            )

            resolve(nil)
        }
    }

    @objc(clearUser:rejecter:)
    func clearUser(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        Task { @MainActor in
            MessengerSDK.clearUser()
            resolve(nil)
        }
    }

    @objc(showMessenger:rejecter:)
    func showMessenger(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        Task { @MainActor in
            guard let presenter = Self.topViewController() else {
                reject("missing_presenter", "Unable to find a view controller to present from", nil)
                return
            }

            MessengerSDK.showMessenger(from: presenter)
            resolve(nil)
        }
    }

    @objc(showLauncher:rejecter:)
    func showLauncher(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        Task { @MainActor in
            MessengerSDK.showLauncher()
            resolve(nil)
        }
    }

    @objc(hideLauncher:rejecter:)
    func hideLauncher(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        Task { @MainActor in
            MessengerSDK.hideLauncher()
            resolve(nil)
        }
    }

    private static func endpoint(from options: NSDictionary) -> String? {
        if let endpoint = string(options["endpoint"]) ?? string(options["serverUrl"]) {
            return endpoint
        }

        guard let subDomain = string(options["subDomain"]) else {
            return nil
        }

        if subDomain.hasPrefix("http://") || subDomain.hasPrefix("https://") {
            return subDomain
        }

        return "https://\(subDomain)"
    }

    private static func string(_ value: Any?) -> String? {
        guard let value else { return nil }

        if let value = value as? String {
            return value.isEmpty ? nil : value
        }

        if let value = value as? NSNumber {
            return value.stringValue
        }

        return nil
    }

    /// Parse `[{ id, title, systemIcon }]` from JS into `[ActionItem]`.
    /// Entries without an `id` are skipped; `title`/`systemIcon` default to empty.
    private static func actionItems(_ value: Any?) -> [ActionItem] {
        guard let array = value as? [[String: Any]] else {
            return []
        }

        return array.compactMap { item in
            guard let id = string(item["id"]) else { return nil }
            return ActionItem(
                id: id,
                title: string(item["title"]) ?? "",
                systemIcon: string(item["systemIcon"]) ?? ""
            )
        }
    }

    /// Parse a `#RGB`/`#RRGGBB`/`#RRGGBBAA` hex string into a UIColor.
    private static func hexColor(_ value: Any?) -> UIColor? {
        guard var hex = string(value) else { return nil }
        if hex.hasPrefix("#") { hex.removeFirst() }

        // Expand shorthand #RGB to #RRGGBB.
        if hex.count == 3 {
            hex = hex.map { "\($0)\($0)" }.joined()
        }

        guard hex.count == 6 || hex.count == 8,
              let intValue = UInt64(hex, radix: 16) else {
            return nil
        }

        let hasAlpha = hex.count == 8
        let r, g, b, a: CGFloat
        if hasAlpha {
            r = CGFloat((intValue >> 24) & 0xFF) / 255
            g = CGFloat((intValue >> 16) & 0xFF) / 255
            b = CGFloat((intValue >> 8) & 0xFF) / 255
            a = CGFloat(intValue & 0xFF) / 255
        } else {
            r = CGFloat((intValue >> 16) & 0xFF) / 255
            g = CGFloat((intValue >> 8) & 0xFF) / 255
            b = CGFloat(intValue & 0xFF) / 255
            a = 1
        }
        return UIColor(red: r, green: g, blue: b, alpha: a)
    }

    private static func stringDictionary(_ value: Any?) -> [String: String] {
        guard let dictionary = value as? [String: Any] else {
            return [:]
        }

        return dictionary.reduce(into: [String: String]()) { result, item in
            if let stringValue = string(item.value) {
                result[item.key] = stringValue
            }
        }
    }

    @MainActor
    private static func topViewController() -> UIViewController? {
        topViewController(from: keyWindow()?.rootViewController)
    }

    @MainActor
    private static func topViewController(from root: UIViewController?) -> UIViewController? {
        if let navigation = root as? UINavigationController {
            return topViewController(from: navigation.visibleViewController)
        }

        if let tab = root as? UITabBarController {
            return topViewController(from: tab.selectedViewController)
        }

        if let presented = root?.presentedViewController {
            return topViewController(from: presented)
        }

        return root
    }

    @MainActor
    private static func keyWindow() -> UIWindow? {
        UIApplication.shared.connectedScenes
            .compactMap { $0 as? UIWindowScene }
            .flatMap(\.windows)
            .first { $0.isKeyWindow }
    }
}
