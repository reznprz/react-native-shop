# React Native Shop Project

This repository contains a React Native project configured to work with Expo. Below are the details of the setup and configuration used to ensure compatibility and resolve common issues, including the Babel configuration fix.

---

## Prerequisites

Before starting, ensure you have the following installed:

## Required Versions

Before starting, ensure the following versions of dependencies are used:

### Dependencies

- **Expo:** `^52.0.25`
- **React:** `18.3.1`
- **React DOM:** `18.3.1`
- **React Native:** `0.76.6`
- **React Native Gesture Handler:** `~2.20.2`
- **React Native Reanimated:** `^3.16.6`
- **React Native Safe Area Context:** `4.12.0`
- **React Native Screens:** `~4.4.0`
- **React Native SVG:** `15.8.0`
- **React Native Web:** `~0.19.13`

### Dev Dependencies

- **Babel Core:** `^7.21.0`
- **Babel Preset Expo:** `^12.0.6`
- **TailwindCSS:** `^3.4.17`
- **Typescript:** `^5.3.3`

### Use of local CLI

- **Node.js**: v14.x or later
- **npm**: v6.x or later (or **Yarn** as an alternative)
- **Expo CLI**: Local CLI is used (`npx expo`).

---

## Getting Started

### 1. Install Dependencies

Run the following command to install all necessary dependencies:

```bash
yarn install
```

### 2. Babel Configuration

module.exports = function (api) {
api.cache(true);
return {
presets: ['babel-preset-expo'],
};
};

### 3. Entry Point Update it in package.json

"main": "node_modules/expo/AppEntry.js"

### 4. remove the yarn.lock and install again

```bash
rm -rf node_modules yarn.lock
yarn install
```

### 5. remove the yarn.lock and install again

```bash
npx expo start -c
```

### Note. To run the app in andriod/Ios dowload the Expo Go App

- Android: https://play.google.com/store/apps/details?id=host.exp.exponent
- iOS: https://apps.apple.com/us/app/expo-go/id982107779

icon would be similar to - https://expo.dev/go

### After starting the app `npx expo start -c` would would see qr code scan that from your mobile camera and it would direct to the expo go app in your phone and run the react-native application. Your phone and laptop should be on same network.
