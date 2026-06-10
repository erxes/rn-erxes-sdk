import Foundation

final class NetworkClient {
    static let shared = NetworkClient()

    private(set) var graphqlEndpoint: URL?

    private init() {}

    func configure(endpoint: String) {
        let base = endpoint.hasSuffix("/") ? String(endpoint.dropLast()) : endpoint
        graphqlEndpoint = URL(string: "\(base)/gateway/graphql")
    }
}
