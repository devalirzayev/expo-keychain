import {
    ConfigPlugin,
    createRunOncePlugin,
    IOSConfig,
} from "expo/config-plugins"

const pkg = require("expo-keychain/package.json")

const BACKUP_RULES_PATH = "@xml/secure_store_backup_rules"
const EXTRACTION_RULES_PATH = "@xml/secure_store_data_extraction_rules"
const FACEID_USAGE =
    "Allow $(PRODUCT_NAME) to access your Face ID biometric data."

const withKeychain: ConfigPlugin<
    {
        faceIDPermission?: string | false
        configureAndroidBackup?: boolean
    } | void
> = (config, { faceIDPermission, configureAndroidBackup = true } = {}) => {
    IOSConfig.Permissions.createPermissionsPlugin({
        NSFaceIDUsageDescription: FACEID_USAGE,
    })(config, {
        NSFaceIDUsageDescription: faceIDPermission,
    })

    return config
}

export default createRunOncePlugin(withKeychain, pkg.name, pkg.version)
