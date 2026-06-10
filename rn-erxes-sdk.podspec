require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

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
  s.source_files = 'ios/**/*.{h,m,mm,swift}'
  s.resource_bundles = {
    'RnErxesSdkMessengerResources' => ['ios/MessengerSDK/Resources/**/*']
  }
  s.swift_version = '5.9'

  s.dependency 'React-Core'
end
