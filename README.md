# ChatsApp

A chat app for you and your friends

## Features

- Chat messages are saved in a database
- User can send location, gallery picture or can take a photo and send it in the chat
- User can set a backgroundcolor from a given preset

## Project requirements

- Project built using React Native
- Database: Google Firestore/Firebase
- Tools/Libraries: Expo, Gifted chat (library)

## Development Setup

### Expo: Framework for jump-starting react-native-projects

Documentation: [Expo](https://docs.expo.dev/get-started/installation/)

- Install the command line tool globally

```
npm install --global expo-cli
```

- Create a new project named "my-app"

```
npx create-expo-app my-app
```

- Start the development server

```
expo start
```

Optionally you can register an account with expo, but it is not needed for development purposes.

### Installation

#### React navigation

```
npm i react-navigation
```

```
npm install @react-navigation/native @react-navigation/stack
```

```
expo install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view
```

#### Android Studio

- Download [Android Studio](https://developer.android.com/studio)
- If you are on Windows make sure to follow these [Instructions](https://images.careerfoundry.com/public/courses/fullstack-immersion/A5/E1/Full-Stack_Immersion_Exercise_5.1_Windows_10_Environment_Set-up_for_Android_Studio.pdf)
- During the installation make sure to check "Android Virtual Device"
- After you are done with the installation open up the application and select "Virtual Device Manager from the plus dropdown menu"
- This will open up a selection of emulated devices you can choose from
- Select one, and after it's installation you can press the play button to start it

When running your app with "expo start", press "a" to open it with android, if you need to reload your app at any time, press "r". All available commands are shown in your terminal window too.

#### Gifted Chat

Documentation: [Gifted Chat](https://github.com/FaridSafi/react-native-gifted-chat)

```
npm install react-native-gifted-chat
```

- Import it into your app

```
import { GiftedChat } from "react-native-gifted-chat";
```

#### Google Cloud Firestore

Documentation: [Firestore](https://firebase.google.com/docs/firestore)

```
npm install firebase
```

- Register your app in the [Console](https://console.firebase.google.com/)
- Copy the config settings into your app as instructed
- Also set up anonymous authentication in your [firebase](https://console.firebase.google.com/) project

#### Async storage - Offline functionalities

```
expo install @react-native-community/async-storage
```
