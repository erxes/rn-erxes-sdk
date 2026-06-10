import Foundation

private final class ErxesMessengerBundleToken {}

extension Bundle {
    static var erxesMessengerResources: Bundle {
        let bundleName = "RnErxesSdkMessengerResources"
        let candidates = [
            Bundle(for: ErxesMessengerBundleToken.self).resourceURL,
            Bundle.main.resourceURL
        ]

        for candidate in candidates {
            guard let url = candidate?.appendingPathComponent("\(bundleName).bundle"),
                  let bundle = Bundle(url: url) else {
                continue
            }

            return bundle
        }

        return Bundle.main
    }
}
