// src/config/expoIdentity.ts
export const ExpoIdentity = {
    owner: "shk25",
    slug: "sajilohisabkitab",
    projectId: "589511b4-857b-41b4-92c8-3b1a4df4e2a2",
  } as const;
  
  export function getUpdatesUrl() {
    return `https://u.expo.dev/${ExpoIdentity.projectId}`;
  }
  