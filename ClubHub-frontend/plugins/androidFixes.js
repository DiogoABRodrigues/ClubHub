const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const COLORS = `<?xml version="1.0" encoding="utf-8"?>
<resources>
  <color name="splashscreen_background">#800000</color>
  <color name="iconBackground">#800000</color>
  <color name="colorPrimary">#800000</color>
  <color name="notification_color">#800000</color>
</resources>`;

const STYLES = `<?xml version="1.0" encoding="utf-8"?>
<resources>
  <style name="Theme.App.SplashScreen" parent="Theme.SplashScreen">
    <item name="windowSplashScreenBackground">@color/splashscreen_background</item>
    <item name="postSplashScreenTheme">@style/AppTheme</item>
    <item name="android:windowBackground">@color/splashscreen_background</item>
  </style>
</resources>`;

const withNightModeFiles = (config) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const resDir = path.join(
        config.modRequest.platformProjectRoot,
        'app', 'src', 'main', 'res'
      );

      // values-night/colors.xml
      const nightColorsDir = path.join(resDir, 'values-night');
      fs.mkdirSync(nightColorsDir, { recursive: true });
      fs.writeFileSync(path.join(nightColorsDir, 'colors.xml'), COLORS);

      // values-night/styles.xml
      fs.writeFileSync(path.join(nightColorsDir, 'styles.xml'), STYLES);

      // values-v31/colors.xml (Android 12+)
      const v31Dir = path.join(resDir, 'values-v31');
      fs.mkdirSync(v31Dir, { recursive: true });
      fs.writeFileSync(path.join(v31Dir, 'colors.xml'), COLORS);

      return config;
    },
  ]);
};

module.exports = withNightModeFiles;