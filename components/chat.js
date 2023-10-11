import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import CustomActions from "./customactions";
import MapView from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ route, navigation, db, isConnected, storage }) => {
  const { name, backgroundColor, uid } = route.params; // gets name, colour, and User ID from route.params
  const [messages, setMessages] = useState([]); // sets message state

  // Function to load cached messages
  const loadCachedMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem("messages")) || "[]";
    setMessages(JSON.parse(cachedMessages));
  };

  let unsubMessages;

  useEffect(() => {
    // Set navigation options for the title
    navigation.setOptions({ title: name });

    if (isConnected === true) {
      // If a connection exists
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

      // Create a query to get the messages collection ordered by createdAt in descending order
      const q = query(
        collection(db, "messages"),
        orderBy("createdAt", "desc")
      );
      unsubMessages = onSnapshot(q, (documentsSnapshot) => {
        let newMessages = [];
        documentsSnapshot.forEach((doc) => {
          const messageData = doc.data();
          newMessages.push({
            _id: doc.id,
            ...messageData,
            createdAt: new Date(messageData.createdAt.toMillis()),
            // Assign a unique key based on the Firestore document ID
            key: doc.id,
          });
        });
        cachedMessages(newMessages);
        setMessages(newMessages);
      });
    } else {
      loadCachedMessages();
    }

    // Clean up function
    return () => {
      if (unsubMessages) {
        unsubMessages();
      }
    };
  }, [isConnected]);

  // Function to cache messages
  const cachedMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  // Render input toolbar function
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };

  const renderCustomActions = (props) => {
    return <CustomActions storage={storage} {...props} />;
  };

  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000", // Change the background color of the right-side chat bubble to black
          },
          left: {
            backgroundColor: "#fff", // Change the background color of the left-side chat bubble to white
          },
        }}
        textStyle={{
          right: {
            color: "#fff", // Change the text color of the right-side chat to white
          },
          left: {
            color: "#000", // Change the text color of the left-side chat to black
          },
        }}
      />
    );
  };

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={onSend}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        user={{
          _id: uid,
          name: name,
        }}
        renderInputToolbar={renderInputToolbar}
        placeholder="Type a message..."
      />
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView behavior="padding" />
      ) : null}
    </View>
  );
};

// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
