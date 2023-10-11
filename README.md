# Chat App

This repository contains the code for a simple chat app built using React Native and React Navigation. The app allows users to enter their username, choose a background color, and start chatting.

## Screens

The app consists of two screens:

1. **Start**: This screen is the entry point of the app. Users can enter their username and choose a background color. The available background color options are dark, light grey, dark purple, and olive. Once the user selects a username and a background color, they can navigate to the chat screen.

![Start](img/start.png)

2. **Chat**: This screen displays the chat interface. The background color of the screen is set based on the user's selection in the Start screen. The screen also shows the username at the top. Users can start chatting on this screen.

![Chat](img/chat.png)

## Installation

To run the app locally, follow these steps:

1. Clone the repository:

2. Install the dependencies:

3. Start the Metro server:

4. Run the app on a connected device or emulator:

Dependencies:

 **@react-navigation/native**: React Navigation library for screen navigation within the application.
- **@react-navigation/native-stack**: Native stack navigator for React Navigation.
- **@react-native-community/netinfo**: NetInfo library for detecting the network connection status.
- **firebase**: Firebase SDK for initializing Firebase app and Firestore.
- **react-native**: React Native framework for building mobile applications.
- **react-native-gifted-chat**: GiftedChat library for rendering chat UI and managing messages.
- **react-native-maps**: React Native Maps library for displaying a map view for location sharing.
- **expo-image-picker**: Expo library for accessing and selecting images from the device's gallery or camera.
- **expo-location**: Expo library for retrieving the user's current location.

Make sure to install these dependencies before running the app.

## Installation & Usage

To use these code fragments in your own React Native project:

- Install the required dependencies mentioned above.
- Create the necessary Firebase project and configure it with your own Firebase credentials.
- Copy the code fragments into their respective files in your project.
- Adjust the imports and dependencies according to your project's structure.
- Use the components and functions as needed in your application's screens and components.

Make sure to review and customize the code to fit your specific requirements and follow best practices for React Native and Firebase development.

Feel free to explore and customize the code to suit your needs.
