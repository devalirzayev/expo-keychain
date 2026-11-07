import { NativeModule, registerWebModule } from 'expo';

class ExpoKeychain extends NativeModule {}

export default registerWebModule(ExpoKeychain, 'ExpoKeychain');
