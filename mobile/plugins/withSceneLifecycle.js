// iOS 27 SDK refuses to launch apps without the UIScene life cycle.
// Expo SDK 57 ships ExpoAppSceneDelegate, but the prebuild template still generates a
// window-based AppDelegate. This plugin wires the scene delegate on every prebuild.
const { withAppDelegate, withInfoPlist } = require('expo/config-plugins');

const SCENE_DELEGATE_CLASS = 'EXExpoAppSceneDelegate';

const LEGACY_WINDOW_BLOCK =
  /#if os\(iOS\) \|\| os\(tvOS\)\n\s*window = UIWindow\(frame: UIScreen\.main\.bounds\)\n\s*factory\.startReactNative\([\s\S]*?\)\n#endif\n/;

function withSceneManifest(config) {
  return withInfoPlist(config, (config) => {
    config.modResults.UIApplicationSceneManifest = {
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [
          {
            UISceneConfigurationName: 'Default Configuration',
            UISceneDelegateClassName: SCENE_DELEGATE_CLASS,
          },
        ],
      },
    };
    return config;
  });
}

function withSceneAppDelegate(config) {
  return withAppDelegate(config, (config) => {
    if (config.modResults.language !== 'swift') {
      throw new Error('withSceneLifecycle: only Swift AppDelegate is supported');
    }
    let src = config.modResults.contents;

    if (!src.includes('ExpoReactNativeFactoryProvider')) {
      src = src.replace(
        'class AppDelegate: ExpoAppDelegate {',
        'class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {'
      );
    }

    // The scene delegate creates the window and starts React Native in it.
    src = src.replace(
      LEGACY_WINDOW_BLOCK,
      '    // Window + React Native start live in ExpoAppSceneDelegate (UIScene life cycle).\n'
    );

    if (!src.includes('ExpoReactNativeFactoryProvider') || LEGACY_WINDOW_BLOCK.test(src)) {
      throw new Error('withSceneLifecycle: AppDelegate template changed, update the plugin');
    }

    config.modResults.contents = src;
    return config;
  });
}

module.exports = function withSceneLifecycle(config) {
  return withSceneAppDelegate(withSceneManifest(config));
};
