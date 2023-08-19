import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text } from 'react-native';
import { GiftedChat, Message } from 'react-native-gifted-chat';

const Chat = ({ route, navigation }) => {
  const { name, backgroundColor } = route.params;

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [messageCounter, setMessageCounter] = useState(1); // Add this state for generating unique _id values

  useEffect(() => {
    navigation.setOptions({ title: name });
    setMessages([
      {
        _id: messageCounter,
        text: `Welcome to the chat, ${name}!`,
        system: true,
        createdAt: new Date(),
      },
      {
        _id: messageCounter + 1,
        text: 'Hello, this is a user message.',
        createdAt: new Date(),
        user: {
          _id: 1,
          name: name,
        },
      },
    ]);
    setMessageCounter(messageCounter + 2); // Increment counter for future messages
  }, []);

  const onSend = (newMessages = []) => {
    // Generate unique _id values for new messages
    const newMessageArray = newMessages.map((message) => ({
      ...message,
      _id: messageCounter + newMessages.indexOf(message),
    }));

    setMessages((prevMessages) =>
      GiftedChat.append(prevMessages, newMessageArray)
    );
    setInputText('');
    setMessageCounter(messageCounter + newMessages.length); // Increment counter for future messages
  };

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        user={{
          _id: 1,
          name: name,
        }}
        listViewProps={{
          style: { paddingTop: 20 },
        }}
        renderInputToolbar={() => (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              multiline
              placeholder="Type a message..."
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() =>
                onSend([{ text: inputText, user: { _id: 1 } }])
              }
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        )}
        renderMessage={(props) => {
          const textStyle = {
            color: 'white',
          };
          return <Message {...props} textStyle={textStyle} />;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    marginTop: -20,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 24,
    backgroundColor: '#F2F2F2',
    color: '#333',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Chat;
