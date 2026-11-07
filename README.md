# expo-keychain

Expo module for storing string key-value pairs in Apple Keychain. It supports iOS and tvOS. Android and web are not supported.

## Installation

```sh
npx expo install expo-keychain
```

For bare React Native projects, install the native pods after installing the package:

```sh
npx pod-install
```

## Face ID configuration

When using `requireAuthentication`, add the config plugin to set `NSFaceIDUsageDescription` in your app's Info.plist:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-keychain",
        {
          "faceIDPermission": "Allow $(PRODUCT_NAME) to use Face ID to access stored credentials."
        }
      ]
    ]
  }
}
```

Run `npx expo prebuild` after changing the plugin configuration.

## Usage

```ts
import * as Keychain from 'expo-keychain';

await Keychain.setItemAsync('session_token', token);

const storedToken = await Keychain.getItemAsync('session_token');

await Keychain.deleteItemAsync('session_token');
```

Keys can contain letters, numbers, `.`, `-`, and `_`. Values must be strings; use `JSON.stringify` and `JSON.parse` for structured data.

Synchronous methods are also available:

```ts
Keychain.setItem('session_token', token);
const storedToken = Keychain.getItem('session_token');
```

Synchronous methods block the JavaScript thread. Avoid them when using biometric authentication.

## API

### Methods

- `isAvailableAsync()` returns whether the native Keychain API is available.
- `setItemAsync(key, value, options?)` stores a string value.
- `getItemAsync(key, options?)` returns the stored string or `null`.
- `deleteItemAsync(key, options?)` deletes the value associated with the key.
- `setItem(key, value, options?)` stores a value synchronously.
- `getItem(key, options?)` reads a value synchronously.
- `canUseBiometricAuthentication()` returns whether suitable biometric authentication is available. It always returns `false` on tvOS.

### KeychainOptions

- `keychainService`: the Keychain service name. Use the same value when reading, updating, or deleting an item.
- `keychainAccessible`: when the item is accessible. Defaults to `WHEN_UNLOCKED`.
- `accessGroup`: the Keychain access group. The app must have the matching entitlement.
- `requireAuthentication`: requires biometric authentication when reading or updating an existing value. Defaults to `false`.
- `authenticationPrompt`: custom message shown during authentication.

Entries stored with `requireAuthentication` use `biometryCurrentSet`. Changing the enrolled biometrics can invalidate these entries.

### Accessibility constants

- `AFTER_FIRST_UNLOCK`
- `AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY`
- `WHEN_PASSCODE_SET_THIS_DEVICE_ONLY`
- `WHEN_UNLOCKED`
- `WHEN_UNLOCKED_THIS_DEVICE_ONLY`
- `ALWAYS` and `ALWAYS_THIS_DEVICE_ONLY` are deprecated because they do not protect access while the device is locked.

## License

MIT
