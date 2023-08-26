import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ImageBackground, TouchableOpacity } from 'react-native';
import { getAuth, signInAnonymously } from 'firebase/auth'; 

const Start = ({ navigation }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('');

  const bgColors = {
    dark: '#090C08',
    lightgrey: '#8A95A5',
    darkpurple: '#474056',
    olive: '#B9C6AE',
  };

  const { dark, lightgrey, darkpurple, olive } = bgColors;

  const handleStartChatting = async () => {
    try {
      const auth = getAuth(); 

      // Sign in anonymously
      const userCredential = await signInAnonymously(auth);

      if (userCredential.user) {
        const { uid } = userCredential.user;

        // Navigate to Chat screen with user's info
        navigation.navigate('Chat', {
          userId: uid,
          userName: name, 
          backgroundColor: color,
        });
      }
    } catch (error) {
      console.error('Error signing in anonymously:', error);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/BackgroundImage.png')}
      style={styles.container}
    >
      <Text>Hello!</Text>
      <TextInput
        style={styles.textInput}
        value={name}
        onChangeText={setName}
        placeholder='Type your username here'
      />

      <View>
        <Text>Choose your background colour:</Text>
        <View style={styles.colorSelect__container}>
          <TouchableOpacity
            style={[
              styles.colorSelect__dot,
              { backgroundColor: dark },
              color === dark ? styles.selectedColor : null,
            ]}
            onPress={() => setColor(dark)}
          />

          <TouchableOpacity
            style={[
              styles.colorSelect__dot,
              { backgroundColor: lightgrey },
              color === lightgrey ? styles.selectedColor : null,
            ]}
            onPress={() => setColor(lightgrey)}
          />

          <TouchableOpacity
            style={[
              styles.colorSelect__dot,
              { backgroundColor: darkpurple },
              color === darkpurple ? styles.selectedColor : null,
            ]}
            onPress={() => setColor(darkpurple)}
          />

          <TouchableOpacity
            style={[
              styles.colorSelect__dot,
              { backgroundColor: olive },
              color === olive ? styles.selectedColor : null,
            ]}
            onPress={() => setColor(olive)}
          />
        </View>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={handleStartChatting}
        >
          <Text style={styles.chatButton__text}>Start Chatting</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    width: '88%',
    padding: 15,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 15,
  },
  colorSelect__container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorSelect__dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    margin: 5,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: '#fff', 
  },
  chatButton: {
    backgroundColor: '#757083',
    justifyContent: 'center',
    width: '88%',
    padding: 16,
  },
  chatButton__text: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default Start;
