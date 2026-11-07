import { ConfigPlugin, createRunOncePlugin, IOSConfig } from 'expo/config-plugins';

const pkg = require('../../package.json');

const FACEID_USAGE = 'Allow $(PRODUCT_NAME) to access your Face ID biometric data.';

const withKeychain: ConfigPlugin<
  {
    faceIDPermission?: string | false;
  } | void
> = (config, { faceIDPermission } = {}) => {
  IOSConfig.Permissions.createPermissionsPlugin({
    NSFaceIDUsageDescription: FACEID_USAGE,
  })(config, {
    NSFaceIDUsageDescription: faceIDPermission,
  });

  return config;
};

export default createRunOncePlugin(withKeychain, pkg.name, pkg.version);
