/** EAS development build configuration for Kotor Stories.
 * This preserves the existing optional iOS Google Maps SDK config.
 * No API key or purchase secrets are committed in this file.
 */
module.exports = ({ config: base }) => {
  const iosKey = process.env.GOOGLE_MAPS_IOS_API_KEY;
  const androidKey = process.env.GOOGLE_MAPS_ANDROID_API_KEY;
  const development = process.env.EAS_BUILD_PROFILE === 'development';
  const mapOpts = {};
  if (iosKey) mapOpts.iosGoogleMapsApiKey = iosKey;
  if (androidKey) mapOpts.androidGoogleMapsApiKey = androidKey;
  const infoPlist = { ...(base.ios?.infoPlist || {}) };
  // Development iPhone reads the local LAN test server over HTTP.
  // Do not add a global NSAllowsArbitraryLoads exception to release builds.
  if (development) {
    infoPlist.NSLocalNetworkUsageDescription =
      'Kotor Stories connects to your computer to download test audio during development.';
    infoPlist.NSAppTransportSecurity = {
      ...(infoPlist.NSAppTransportSecurity || {}),
      NSAllowsLocalNetworking: true,
    };
  }
  return {
    ...base,
    ios: { ...(base.ios || {}), infoPlist },
    plugins: [
      ...(base.plugins || []),
      ...(Object.keys(mapOpts).length ? [['react-native-maps', mapOpts]] : []),
    ],
    extra: { ...(base.extra || {}), googleMapsIosReady: !!iosKey },
  };
};
