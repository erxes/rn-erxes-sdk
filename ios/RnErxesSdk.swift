import Foundation
import MessengerSDK
import UIKit
import React

@objc(RnErxesSdk)
final class RnErxesSdk: NSObject {
    @objc
    static func requiresMainQueueSetup() -> Bool {
        true
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

            MessengerSDK.configure(
                MessengerConfig(
                    endpoint: endpoint,
                    integrationId: integrationId,
                    cachedCustomerId: cachedCustomerId
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
