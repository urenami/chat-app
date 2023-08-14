import { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput, ImageBackground, TouchableOpacity } from 'react-native';

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
        <View>
          <TouchableOpacity
            style={[styles.colorSelect__dot, { backgroundColor: dark }]}
            onPress={() => setColor(dark)}
          />

          <TouchableOpacity
            style={[styles.colorSelect__dot, { backgroundColor: lightgrey }]}
            onPress={() => setColor(lightgrey)}
          />

          <TouchableOpacity
            style={[styles.colorSelect__dot, { backgroundColor: darkpurple }]}
            onPress={() => setColor(darkpurple)}
          />

          <TouchableOpacity
            style={[styles.colorSelect__dot, { backgroundColor: olive }]}
            onPress={() => setColor(olive)}
          />
        </View>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate('Chat', { name: name, backgroundColor: color })}>
        <Text style={styles.chatButton__text}>Go to Chat</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    width: '88%',
    padding: 15,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 15
  },
  colorSelect__dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    margin: 5,
  },
  chatButton: {
    backgroundColor: "#757083",
    justifyContent: "center",
    width: "88%",
    padding: 16,
  },
  chatButton__text: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default Start;