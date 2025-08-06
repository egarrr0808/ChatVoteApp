import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to ChatVote!</Text>
      <Text style={styles.subtitle}>You are logged in.</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Chat Rooms" 
          onPress={() => navigation.navigate('ChatRooms')} 
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Polls" 
          onPress={() => navigation.navigate('Polls')} 
          color="green"
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Logout" 
          onPress={() => navigation.navigate('Login')} 
          color="red"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
  },
  buttonContainer: {
    marginVertical: 10,
    width: '80%',
  },
});

export default HomeScreen;


