import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { db } from './config';

const FetchData = () => {
    const [weatherData, setWeatherData] = useState({ humidity: '', temperature: '' });
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchDataFromFirebase = async () => {
        try {
          const postsRef = db.ref('posts');
          postsRef.on('value', (snapshot) => {
            const data = snapshot.val();
            console.log('Data from Firebase:', data);
            if (data) {
              setWeatherData(data);
            }
          });
        } catch (error) {
          setError(error.message);
        }
      };
  
      fetchDataFromFirebase();
  
      return () => {
        db.ref('posts').off('value');
      };
    }, []);
  
    if (error) {
      return <Text>Error: {error}</Text>;
    }
  
    console.log('Weather Data:', weatherData);
  
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Temperature: {weatherData.temperature} °C</Text>
        <Text style={styles.text}>Humidity: {weatherData.humidity} %</Text>
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BF0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    marginVertical: 10,
  },
});

export default FetchData;
