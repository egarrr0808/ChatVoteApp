import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ChatRoomsScreen from './src/screens/ChatRoomsScreen';
import ChatScreen from './src/screens/ChatScreen';
import PollsScreen from './src/screens/PollsScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'ChatVote' }} />
        <Stack.Screen name="ChatRooms" component={ChatRoomsScreen} options={{ title: 'Chat Rooms' }} />
        <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Chat' }} />
        <Stack.Screen name="Polls" component={PollsScreen} options={{ title: 'Polls' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
