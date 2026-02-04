const ExpoIdentity = {
  owner: 'shk25',
  slug: 'sajilohisabkitab',
  projectId: '589511b4-857b-41b4-92c8-3b1a4df4e2a2',
  androidPackage: 'com.sajilohisabkitab.shop',
  iosBundleIdentifier: 'com.sajilohisabkitab.shop',
};

function getUpdatesUrl() {
  return `https://u.expo.dev/${ExpoIdentity.projectId}`;
}

module.exports = { ExpoIdentity, getUpdatesUrl };
