

import { View, Text, StyleSheet,Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { db } from '../config';
import { ref, onValue } from 'firebase/database';
import { StatusBar } from 'expo-status-bar'

// Import the fonts
import * as Font from 'expo-font';

// Register custom fonts
Font.loadAsync({
  // Replace 'YourFontName' with the actual font family name
  YourFontNameRegular: require('../assets/fonts/rakkas-regular.ttf'),
  
  // Add more font weights if necessary
});

const FetchData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const rootRef = ref(db); // Reference the root node of the database
    onValue(rootRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Data from Firebase:', data);
      setData(data);
    });
  }, []);

  return (
    <View className='flex-1 relative' >
      <StatusBar style="light"/>
      <Image blurRadius={70}source={require('../assets/images/bg.png')}
 className = 'absolute h-full w-full' 
  />    
      <Text style={[styles.header, { fontFamily: 'YourFontNameRegular' }]}>WeatherApp</Text>
      {data && (
        <View style={styles.dataContainer}>
          {/* Display data */}
          <Text  style={[styles.text, { fontFamily: 'YourFontNameRegular' }]}>Temperature: {data.Temperature}</Text>
          <Text style={[styles.text, { fontFamily: 'YourFontNameRegular' }]}>Humidity: {data.Humidity}</Text>
         

      
        </View>
      )}
    </View>
  );
};

export default FetchData;

const styles = StyleSheet.create({
  
  header: {
    fontSize: 40,
    textAlign: 'center',
    marginTop: 50,
    color: 'rgba(200, 250, 220, 0.9)', // Dark color
  },
  dataContainer: {
    backgroundColor: 'rgba(70, 155, 130, 0.3)', // Slightly transparent background for data
    padding: 20,
    borderRadius: 20,
    marginTop: 10,
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 10,
    color: 'rgba(130, 250, 250, 0.9)', // Darker color
  },
});


