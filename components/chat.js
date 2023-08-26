import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { GiftedChat, InputToolbar, Message } from "react-native-gifted-chat";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ route, navigation, database, isConnected }) => {
  const { userId, userName, backgroundColor } = route.params;

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    navigation.setOptions({ title: userName });

    if (isConnected) {
      const q = query(
        collection(database, "messages"),
        orderBy("createdAt", "desc")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            _id: doc.id,
            text: data.text,
            createdAt: data.createdAt.toDate(),
            user: data.user,
          };
        });

        setMessages(fetchedMessages);

        AsyncStorage.setItem("cachedMessages", JSON.stringify(fetchedMessages));
      });

      return () => unsubscribe();
    } else {
      AsyncStorage.getItem("cachedMessages").then((cachedMessages) => {
        if (cachedMessages) {
          setMessages(JSON.parse(cachedMessages));
        }
      });
    }
  }, [database, isConnected]);

  const renderInputToolbar = (props) => {
    if (isConnected) {
      return <InputToolbar {...props} />;
    } else {
      return null;
    }
  };

  const onSend = (newMessages) => {
    addDoc(collection(database, "messages"), {
      text: newMessages[0].text,
      createdAt: new Date(),
      user: {
        _id: userId,
        name: userName,
      },
    });

    setInputText("");
  };

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: userId,
          name: userName,
        }}
        listViewProps={{
          style: { paddingTop: 20 },
        }}
        renderInputToolbar={renderInputToolbar}
        // ...
        renderMessage={(props) => {
          return (
            <Message
              {...props}
              containerStyle={styles.inputContainer}
              textInputStyle={styles.input}
              renderInputToolbar={(props) => (
                <InputToolbar
                  {...props}
                  containerStyle={styles.inputToolbarContainer}
                />
              )}
            />
          );
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
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 10,
  },
  inputToolbarContainer: {
    backgroundColor: "#F2F2F2",
    borderRadius: 20,
    paddingHorizontal: 8,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  input: {
    color: "#333",
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  sendButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});


export default Chat;
