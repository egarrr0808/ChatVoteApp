import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput, Button } from 'react-native';
import axios from 'axios';

const API_BASE_URL = 'http://207.127.93.169:8080'; // For Android emulator
// const API_BASE_URL = 'http://YOUR_PC_IP:8080'; // For physical Android device

const PollsScreen = ({ navigation }) => {
  const [polls, setPolls] = useState([]);
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOptions, setNewPollOptions] = useState(['', '']);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/polls`);
      setPolls(response.data);
    } catch (error) {
      console.error('Error fetching polls:', error);
      Alert.alert('Error', 'Failed to fetch polls');
    }
  };

  const createPoll = async () => {
    if (!newPollQuestion.trim()) {
      Alert.alert('Error', 'Please enter a poll question');
      return;
    }

    const validOptions = newPollOptions.filter(option => option.trim() !== '');
    if (validOptions.length < 2) {
      Alert.alert('Error', 'Please enter at least 2 options');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/polls`, {
        question: newPollQuestion,
        options: validOptions.map(option => ({ text: option })),
        createdBy: 1 // In a real app, this would be the current user's ID
      });
      setNewPollQuestion('');
      setNewPollOptions(['', '']);
      fetchPolls(); // Refresh the list
      Alert.alert('Success', 'Poll created successfully!');
    } catch (error) {
      console.error('Error creating poll:', error);
      Alert.alert('Error', 'Failed to create poll');
    }
  };

  const vote = async (pollId, optionId) => {
    try {
      await axios.post(`${API_BASE_URL}/api/polls/${pollId}/vote`, {
        optionId: optionId,
        userId: 1 // In a real app, this would be the current user's ID
      });
      fetchPolls(); // Refresh to show updated vote counts
      Alert.alert('Success', 'Vote recorded!');
    } catch (error) {
      console.error('Error voting:', error);
      Alert.alert('Error', 'Failed to record vote');
    }
  };

  const updatePollOption = (index, value) => {
    const updatedOptions = [...newPollOptions];
    updatedOptions[index] = value;
    setNewPollOptions(updatedOptions);
  };

  const addPollOption = () => {
    setNewPollOptions([...newPollOptions, '']);
  };

  const renderPoll = ({ item }) => (
    <View style={styles.pollItem}>
      <Text style={styles.pollQuestion}>{item.question}</Text>
      {item.options && item.options.map((option, index) => (
        <TouchableOpacity
          key={option.id}
          style={styles.optionButton}
          onPress={() => vote(item.id, option.id)}
        >
          <Text style={styles.optionText}>
            {option.text} ({option.voteCount || 0} votes)
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Polls</Text>
      
      <View style={styles.createPollContainer}>
        <Text style={styles.subtitle}>Create New Poll</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter poll question"
          value={newPollQuestion}
          onChangeText={setNewPollQuestion}
        />
        
        {newPollOptions.map((option, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder={`Option ${index + 1}`}
            value={option}
            onChangeText={(value) => updatePollOption(index, value)}
          />
        ))}
        
        <Button title="Add Option" onPress={addPollOption} color="gray" />
        <Button title="Create Poll" onPress={createPoll} />
      </View>

      <FlatList
        data={polls}
        renderItem={renderPoll}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
      />

      <Button
        title="Back to Chat Rooms"
        onPress={() => navigation.goBack()}
        color="blue"
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
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  createPollContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
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
  pollItem: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  pollQuestion: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionButton: {
    padding: 10,
    marginVertical: 2,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
  },
  optionText: {
    fontSize: 16,
  },
});

export default PollsScreen;

