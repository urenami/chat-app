import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { GiftedChat, InputToolbar, Message } from "react-native-gifted-chat";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from "./customactions";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'; 
import * as ImagePicker from 'expo-image-picker'; 
import * as Location from 'expo-location';  

const Chat = ({ route, navigation, database, storage, isConnected }) => {
  const { userId, userName, backgroundColor } = route.params;

  const [messages, setMessages] = useState([]);

  const generateReference = (uri) => {
    const timeStamp = (new Date()).getTime();
    const imageName = uri.split("/")[uri.split("/").length - 1];
    return `${userId}-${timeStamp}-${imageName}`;
  };

  const uploadAndSendImage = async (imageURI) => {
    const uniqueRefString = generateReference(imageURI);
    const newUploadRef = ref(storage, uniqueRefString);
    const response = await fetch(imageURI);
    const blob = await response.blob();
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
      const imageURL = await getDownloadURL(snapshot.ref)
      onSend([{ image: imageURL }]);
    });
  };

  const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled) await uploadAndSendImage(result.uri);
      else Alert.alert("Permissions haven't been granted.");
    }
  };

  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();
      if (!result.cancelled) await uploadAndSendImage(result.uri);
      else Alert.alert("Permissions haven't been granted.");
    }
  };

  const getLocation = async () => {
    let permissions = await Location.requestForegroundPermissionsAsync();
    if (permissions?.granted) {
      const location = await Location.getCurrentPositionAsync({});
      if (location) {
        onSend({
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
        });
      } else Alert.alert("Error occurred while fetching location");
    } else Alert.alert("Permissions haven't been granted.");
  };

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

  const onSend = (newMessages = []) => {
    if (newMessages.length > 0) {
      addDoc(collection(database, "messages"), {
        text: newMessages[0].text,
        createdAt: new Date(),
        user: {
          _id: userId,
          name: userName,
        },
      });
    }
  };

  const renderCustomActions = (props) => {
    return <CustomActions
      {...props}
      onPickImage={pickImage}  
      onTakePhoto={takePhoto}   
      onGetLocation={getLocation} 
    />;
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
        renderActions={renderCustomActions}
        renderMessage={(props) => {
          return (
            <Message
              {...props}
              containerStyle={styles.inputContainer}
              textInputStyle={styles.input}
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
