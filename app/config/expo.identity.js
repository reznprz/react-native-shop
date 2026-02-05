const ExpoIdentity = {
  owner: 'shk255',
  slug: 'shk255',
  projectId: '4629cf56-fad3-4bb6-999a-f28173158891',
  androidPackage: 'com.sajilohisabkitab25.shop',
  iosBundleIdentifier: 'com.sajilohisabkitab25.shop',
};

function getUpdatesUrl() {
  return `https://u.expo.dev/${ExpoIdentity.projectId}`;
}

module.exports = { ExpoIdentity, getUpdatesUrl };
