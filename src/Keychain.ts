import ExpoKeychain from './ExpoKeychain';

export type KeychainAccessibilityConstant = number;

/**
 * The data in the keychain item cannot be accessed after a restart until the device has been
 * unlocked once by the user. This may be useful if you need to access the item when the phone
 * is locked.
 */
export const AFTER_FIRST_UNLOCK: KeychainAccessibilityConstant = ExpoKeychain.AFTER_FIRST_UNLOCK;

/**
 * Similar to `AFTER_FIRST_UNLOCK`, except the entry is not migrated to a new device when restoring
 * from a backup.
 */
export const AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY: KeychainAccessibilityConstant =
  ExpoKeychain.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY;

/**
 * The data in the keychain item can always be accessed regardless of whether the device is locked.
 * This is the least secure option.
 *
 * @deprecated Use an accessibility level that provides some user protection, such as `AFTER_FIRST_UNLOCK`.
 */
export const ALWAYS: KeychainAccessibilityConstant = ExpoKeychain.ALWAYS;

/**
 * Similar to `WHEN_UNLOCKED_THIS_DEVICE_ONLY`, except the user must have set a passcode in order to
 * store an entry. If the user removes their passcode, the entry will be deleted.
 */
export const WHEN_PASSCODE_SET_THIS_DEVICE_ONLY: KeychainAccessibilityConstant =
  ExpoKeychain.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY;

/**
 * Similar to `ALWAYS`, except the entry is not migrated to a new device when restoring from a backup.
 *
 * @deprecated Use an accessibility level that provides some user protection, such as `AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY`.
 */
export const ALWAYS_THIS_DEVICE_ONLY: KeychainAccessibilityConstant =
  ExpoKeychain.ALWAYS_THIS_DEVICE_ONLY;

/**
 * The data in the keychain item can be accessed only while the device is unlocked by the user.
 */
export const WHEN_UNLOCKED: KeychainAccessibilityConstant = ExpoKeychain.WHEN_UNLOCKED;

/**
 * Similar to `WHEN_UNLOCKED`, except the entry is not migrated to a new device when restoring from
 * a backup.
 */
export const WHEN_UNLOCKED_THIS_DEVICE_ONLY: KeychainAccessibilityConstant =
  ExpoKeychain.WHEN_UNLOCKED_THIS_DEVICE_ONLY;

export type KeychainOptions = {
  /**
   * The item's service, equivalent to [`kSecAttrService`](https://developer.apple.com/documentation/security/ksecattrservice/).
   * If the item is set with the `keychainService` option, it will be required to later fetch the value.
   */
  keychainService?: string;
  /**
   * Requires biometric authentication when reading or updating an existing value. Creating a new
   * value does not prompt for authentication. This uses [`biometryCurrentSet`](https://developer.apple.com/documentation/security/secaccesscontrolcreateflags/2937192-biometrycurrentset).
   *
   * When using this option, configure the `expo-keychain` config plugin to set
   * `NSFaceIDUsageDescription` in your app's Info.plist.
   */
  requireAuthentication?: boolean;
  /**
   * Custom message displayed to the user while `requireAuthentication` option is turned on.
   */
  authenticationPrompt?: string;
  /**
   * Specifies when the stored entry is accessible, using iOS's `kSecAttrAccessible` property.
   * @see Apple's documentation on [keychain item accessibility](https://developer.apple.com/documentation/security/ksecattraccessible/).
   * @default Keychain.WHEN_UNLOCKED
   * @platform ios
   */
  keychainAccessible?: KeychainAccessibilityConstant;

  /**
   * Specifies the access group the stored entry belongs to.
   * @see Apple's documentation on [Sharing access to keychain items among a collection of apps](https://developer.apple.com/documentation/security/sharing-access-to-keychain-items-among-a-collection-of-apps).
   * @platform ios
   */
  accessGroup?: string;
};

/**
 * Returns whether the Keychain API is enabled on the current device. This does not check the app
 * permissions.
 *
 * @return Promise which fulfils with a `boolean`, indicating whether the Keychain API is available
 * on the current device. Currently, this resolves `true` on iOS and tvOS.
 */
export async function isAvailableAsync(): Promise<boolean> {
  return !!ExpoKeychain.getValueWithKeyAsync;
}

/**
 * Delete the value associated with the provided key.
 *
 * @param key The key that was used to store the associated value.
 * @param options A [`KeychainOptions`](#keychainoptions) object.
 *
 * @return A promise that rejects if the value can't be deleted.
 */
export async function deleteItemAsync(key: string, options: KeychainOptions = {}): Promise<void> {
  ensureValidKey(key);

  await ExpoKeychain.deleteValueWithKeyAsync(key, options);
}

/**
 * Reads the stored value associated with the provided key.
 *
 * @param key The key that was used to store the associated value.
 * @param options A [`KeychainOptions`](#keychainoptions) object.
 *
 * @return A promise that resolves to the previously stored value. It resolves with `null` if there is no entry
 * for the given key or if the key has been invalidated. It rejects if an error occurs while retrieving the value.
 *
 * > Keys are invalidated by the system when biometrics change, such as adding a new fingerprint or changing the face profile used for face recognition.
 * > After a key has been invalidated, it becomes impossible to read its value.
 * > This only applies to values stored with `requireAuthentication` set to `true`.
 */
export async function getItemAsync(
  key: string,
  options: KeychainOptions = {}
): Promise<string | null> {
  ensureValidKey(key);
  return await ExpoKeychain.getValueWithKeyAsync(key, options);
}

/**
 * Stores a key–value pair.
 *
 * @param key The key to associate with the stored value. Keys may contain alphanumeric characters, `.`, `-`, and `_`.
 * @param value The value to store.
 * @param options A [`KeychainOptions`](#keychainoptions) object.
 *
 * @return A promise that rejects if value cannot be stored on the device.
 */
export async function setItemAsync(
  key: string,
  value: string,
  options: KeychainOptions = {}
): Promise<void> {
  ensureValidKey(key);
  if (!isValidValue(value)) {
    throw new Error(
      `Invalid value provided to Keychain. Values must be strings; consider JSON-encoding your values if they are serializable.`
    );
  }

  await ExpoKeychain.setValueWithKeyAsync(value, key, options);
}

/**
 * Stores a key–value pair synchronously.
 * > **Note:** This function blocks the JavaScript thread, so the application may not be interactive when the `requireAuthentication` option is set to `true` until the user authenticates.
 *
 * @param key The key to associate with the stored value. Keys may contain alphanumeric characters, `.`, `-`, and `_`.
 * @param value The value to store.
 * @param options A [`KeychainOptions`](#keychainoptions) object.
 *
 */
export function setItem(key: string, value: string, options: KeychainOptions = {}): void {
  ensureValidKey(key);
  if (!isValidValue(value)) {
    throw new Error(
      `Invalid value provided to Keychain. Values must be strings; consider JSON-encoding your values if they are serializable.`
    );
  }

  return ExpoKeychain.setValueWithKeySync(value, key, options);
}

/**
 * Synchronously reads the stored value associated with the provided key.
 * > **Note:** This function blocks the JavaScript thread, so the application may not be interactive when reading a value with `requireAuthentication`
 * > option set to `true` until the user authenticates.
 * @param key The key to associate with the stored value. Keys may contain alphanumeric characters, `.`, `-`, and `_`.
 * @param options A [`KeychainOptions`](#keychainoptions) object.
 *
 * @return Previously stored value. It resolves with `null` if there is no entry
 * for the given key or if the key has been invalidated.
 */
export function getItem(key: string, options: KeychainOptions = {}): string | null {
  ensureValidKey(key);
  return ExpoKeychain.getValueWithKeySync(key, options);
}

/**
 * Checks if the value can be saved with `requireAuthentication` option enabled.
 * @return `true` if the device supports biometric authentication and the enrolled method is sufficiently secure. Otherwise, returns `false`. Always returns false on tvOS.
 * @platform ios
 */
export function canUseBiometricAuthentication(): boolean {
  return ExpoKeychain.canUseBiometricAuthentication();
}

function ensureValidKey(key: string) {
  if (!isValidKey(key)) {
    throw new Error(
      `Invalid key provided to Keychain. Keys must not be empty and contain only alphanumeric characters, ".", "-", and "_".`
    );
  }
}

function isValidKey(key: string) {
  return typeof key === 'string' && /^[\w.-]+$/.test(key);
}

function isValidValue(value: string) {
  return typeof value === 'string';
}
