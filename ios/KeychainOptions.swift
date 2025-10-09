import ExpoModulesCore

internal struct KeychainOptions: Record {
  @Field
  var authenticationPrompt: String?

  @Field
  var keychainAccessible: KeychainAccessible = .whenUnlocked

  @Field
  var keychainService: String?

  @Field
  var requireAuthentication: Bool

  @Field
  var accessGroup: String?
}
