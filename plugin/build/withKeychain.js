"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("expo/config-plugins");
const pkg = require("expo-keychain/package.json");
const BACKUP_RULES_PATH = "@xml/secure_store_backup_rules";
const EXTRACTION_RULES_PATH = "@xml/secure_store_data_extraction_rules";
const FACEID_USAGE = "Allow $(PRODUCT_NAME) to access your Face ID biometric data.";
const withKeychain = (config, { faceIDPermission, configureAndroidBackup = true } = {}) => {
    config_plugins_1.IOSConfig.Permissions.createPermissionsPlugin({
        NSFaceIDUsageDescription: FACEID_USAGE,
    })(config, {
        NSFaceIDUsageDescription: faceIDPermission,
    });
    return config;
};
exports.default = (0, config_plugins_1.createRunOncePlugin)(withKeychain, pkg.name, pkg.version);
