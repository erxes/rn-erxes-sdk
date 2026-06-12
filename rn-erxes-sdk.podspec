require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

begin
  react_native_pods = Pod::Executable.execute_command(
    'node',
    [
      '-p',
      'require.resolve("react-native/scripts/react_native_pods.rb", {paths: [process.argv[1]]})',
      __dir__
    ]
  ).strip
  require react_native_pods
rescue StandardError
  # React Native Podfiles normally load react_native_pods.rb before evaluating
  # package podspecs. This fallback keeps podspec parsing useful in isolation.
end

Pod::Spec.new do |s|
  s.name         = 'rn-erxes-sdk'
  s.version      = package['version']
  s.summary      = package['description']
  s.description  = package['description']
  s.homepage     = package['homepage']
  s.license      = package['license']
  s.author       = package['author']
  s.platforms    = { :ios => '16.0' }
  s.source       = { :git => 'https://github.com/erxes/rn-erxes-sdk.git', :tag => "v#{s.version}" }
  s.source_files = 'ios/RnErxesSdk.{m,swift}'
  s.swift_version = '5.9'

  s.dependency 'React-Core'

  if defined?(spm_dependency)
    # Local-dev override: point at a local erxes-ios-sdk checkout to iterate the
    # native SDK without cutting a release, e.g.
    #   ERXES_IOS_SDK_LOCAL=../sdk pod install
    # `spm_dependency` treats a url that exists on disk as a local package (the
    # version requirement is ignored). Unset/missing path falls back to the tag.
    local_sdk = ENV['ERXES_IOS_SDK_LOCAL']
    local_sdk = File.expand_path(local_sdk, __dir__) if local_sdk && !local_sdk.empty?

    if local_sdk && File.exist?(local_sdk)
      Pod::UI.puts "[rn-erxes-sdk] using LOCAL erxes-ios-sdk at #{local_sdk}" if defined?(Pod::UI)
      spm_dependency(
        s,
        url: local_sdk,
        requirement: { :kind => 'exactVersion', :version => '0.30.4' },
        products: ['MessengerSDK']
      )
    else
      spm_dependency(
        s,
        url: 'https://github.com/erxes/erxes-ios-sdk.git',
        requirement: { :kind => 'exactVersion', :version => '0.30.4' },
        products: ['MessengerSDK']
      )
    end
  else
    raise 'rn-erxes-sdk requires React Native 0.81+ CocoaPods SPM support to install MessengerSDK 0.0.1'
  end
end
