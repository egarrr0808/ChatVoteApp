import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput, Button } from 'react-native';
import axios from 'axios';

const API_BASE_URL = 'http://207.127.93.169:8080'; // For Android emulator
// const API_BASE_URL = 'http://YOUR_PC_IP:8080'; // For physical Android device

const ChatRoomsScreen = ({ navigation }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const fetchChatRooms = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/chatrooms`);
      setChatRooms(response.data);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      Alert.alert('Error', 'Failed to fetch chat rooms');
    }
  };

  const createChatRoom = async () => {
    if (!newRoomName.trim()) {
      Alert.alert('Error', 'Please enter a room name');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/chatrooms`, {
        name: newRoomName,
        description: `Chat room: ${newRoomName}`,
        roomType: 'PUBLIC'
      });
      setNewRoomName('');
      fetchChatRooms(); // Refresh the list
      Alert.alert('Success', 'Chat room created successfully!');
    } catch (error) {
      console.error('Error creating chat room:', error);
      Alert.alert('Error', 'Failed to create chat room');
    }
  };

  const renderChatRoom = ({ item }) => (
    <TouchableOpacity
      style={styles.roomItem}
      onPress={() => navigation.navigate('Chat', { roomId: item.id, roomName: item.name })}
    >
      <Text style={styles.roomName}>{item.name}</Text>
      <Text style={styles.roomDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat Rooms</Text>
      
      <View style={styles.createRoomContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter room name"
          value={newRoomName}
          onChangeText={setNewRoomName}
        />
        <Button title="Create Room" onPress={createChatRoom} />
      </View>

      <FlatList
        data={chatRooms}
        renderItem={renderChatRoom}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
      />

      <Button
        title="View Polls"
        onPress={() => navigation.navigate('Polls')}
        color="green"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  createRoomContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  list: {
    flex: 1,
    marginBottom: 20,
  },
  roomItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  roomDescription: {
    fontSize: 14,
    color: 'gray',
  },
});

export default ChatRoomsScreen;

