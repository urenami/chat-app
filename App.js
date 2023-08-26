import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNetInfo } from "@react-native-community/netinfo";
import { disableNetwork, enableNetwork } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import Start from './components/start';
import Chat from './components/chat'; 
import { firebaseConfig } from './firebase.config';

initializeApp(firebaseConfig);

const db = getFirestore();

const Stack = createNativeStackNavigator();

const App = () => {
  const netInfo = useNetInfo();
  const isConnected = netInfo.isConnected;

  useEffect(() => {
    if (isConnected) {
      enableNetwork(db);
    } else {
      disableNetwork(db);
    }
  }, [isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => (
            <Chat {...props} database={db} isConnected={isConnected} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
