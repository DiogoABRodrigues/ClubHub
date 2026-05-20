const { withDangerousMod, withAndroidManifest } = require('@expo/config-plugins');
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

const NETWORK_SECURITY_CONFIG = `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
  <base-config cleartextTrafficPermitted="false">
    <trust-anchors>
      <certificates src="system" />
    </trust-anchors>
  </base-config>
  <domain-config cleartextTrafficPermitted="false">
    <domain includeSubdomains="true">res.cloudinary.com</domain>
    <domain includeSubdomains="true">clubhub-c8u0.onrender.com</domain>
  </domain-config>
</network-security-config>`;

// Passo 1: escreve os ficheiros XML em res/
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

      // res/xml/network_security_config.xml
      const xmlDir = path.join(resDir, 'xml');
      fs.mkdirSync(xmlDir, { recursive: true });
      fs.writeFileSync(path.join(xmlDir, 'network_security_config.xml'), NETWORK_SECURITY_CONFIG);

      return config;
    },
  ]);
};

// Passo 2: adiciona o atributo networkSecurityConfig ao AndroidManifest.xml
const withNetworkSecurityManifest = (config) => {
  return withAndroidManifest(config, (config) => {
    const application = config.modResults.manifest.application[0];
    application.$['android:networkSecurityConfig'] = '@xml/network_security_config';
    return config;
  });
};

// Combina os dois passos num só plugin
const withAndroidFixes = (config) => {
  config = withNightModeFiles(config);
  config = withNetworkSecurityManifest(config);
  return config;
};

module.exports = withAndroidFixes;