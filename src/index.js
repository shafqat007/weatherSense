import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import { ref, onValue } from 'firebase/database';
import axios from 'axios';

import { db } from '../config';

const FetchData = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        'rakkas-regular': require('../assets/fonts/rakkas-regular.ttf'),
      });
    }
    loadFont();
  }, []);

  useEffect(() => {
    const rootRef = ref(db);
    onValue(rootRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Data from Firebase:', data);
      setData(data);
    });
  }, []);

  const fetchWeatherData = async (selectedCity) => {
    try {
      const apiKey = '8d8fa321cd36e00ed12bb916c5b054a9';
      const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${apiKey}&units=metric`;
      const response = await axios.get(apiUrl);
      setWeather(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const fetchCitySuggestions = async (text) => {
    try {
      const apiKey = '8d8fa321cd36e00ed12bb916c5b054a9';
      const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${text}&limit=5&appid=${apiKey}`;
      const response = await axios.get(apiUrl);
      // Filter suggestions to only include the first four cities and format the suggestions as "City, Country"
      setSuggestions(response.data.slice(0, 4).map(city => `${city.name}, ${city.country}`));
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
    }
  };

  const handleInputChange = (text) => {
    setCity(text);
    fetchCitySuggestions(text);
  };

  const handleSuggestionPress = (selectedCity) => {
    setCity(selectedCity.split(',')[0]); // Extract city name from the suggestion text
    fetchWeatherData(selectedCity.split(',')[0]); // Pass only city name to fetchWeatherData
    setSuggestions([]);
  };

  const renderWeatherIcon = (condition) => {
    switch (condition) {
      case 'Clear':
        return <Image style={{ width: 150, height: 150 }} source={require('../assets/images/icons8-sun-240.png')} />;
      case 'Clouds':
        return <Image style={{ width: 150, height: 150 }} source={require('../assets/images/icons8-partly-cloudy-day-240.png')} />;
      case 'Rain':
        return <Image style={{ width: 150, height: 150 }} source={require('../assets/images/icons8-wet-240.png')} />;
      case 'Thunderstorm':
        return <Image style={{ width: 150, height: 150 }} source={require('../assets/images/icons8-storm-240.png')} />;
      case 'Snow':
        return <Image style={{ width: 150, height: 150 }} source={require('../assets/images/icons8-snow-storm-240.png')} />;
      case 'Haze':
        return <Image style={{ width: 150, height: 150 }} source={require('../assets/images/icons8-haze-240.png')} />;
      default:
        return <Image style={{ width: 150, height: 150 }} source={require('../assets/images/icons8-windsock-240.png')} />;
    }
  };

  return (
    <View style={styles.container}>
      
      <Image blurRadius={70} source={require('../assets/images/bg.png')} style={styles.backgroundImage} />
      <StatusBar style="light" />
      <TouchableOpacity style={styles.creditButton} onPress={() => navigation.navigate('Credit')}>
          <Image style={styles.creditIcon} source={require('../assets/images/icons8-forward-150.png')} />
        </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Text style={[styles.header, { fontFamily: 'rakkas-regular' }]}>weatherSense</Text>
        
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.input, { color: 'white', fontFamily: 'rakkas-regular' }]}
          placeholder="Enter city name"
          placeholderTextColor="#D9D9D9"
          value={city}
          onChangeText={handleInputChange}
        />
        <TouchableOpacity style={styles.searchButton} onPress={() => fetchWeatherData(city)}>
        <Image style={{ height: 40, width: 40 }} source={require('../assets/images/icons8-search-96.png')} />

        </TouchableOpacity>

      </View>
      <View style={styles.suggestionsContainer}>
        {suggestions.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => handleSuggestionPress(item)}>
            <Text style={styles.suggestion}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {weather && (
        <View style={styles.dataContainer}>
          <View style={styles.headContainer}>
            <Text style={[styles.label, { fontFamily: 'rakkas-regular', fontSize: 24 }]}>City: </Text>
            <Text style={[styles.data, { fontFamily: 'rakkas-regular', fontSize: 24 }]}>{weather.name}</Text>
          </View>
          <Text style={[styles.label, { fontFamily: 'rakkas-regular' }]}>Temperature: </Text>
          <Text style={[styles.data, { fontFamily: 'rakkas-regular' }]}>{weather.main.temp}°C</Text>
          <Text style={[styles.label, { fontFamily: 'rakkas-regular' }]}>Humidity: </Text>
          <Text style={[styles.data, { fontFamily: 'rakkas-regular' }]}>{weather.main.humidity}%</Text>
          <Text style={[styles.label, { fontFamily: 'rakkas-regular' }]}>Weather: </Text>
          <Text style={[styles.data, { fontFamily: 'rakkas-regular', textTransform: 'capitalize' }]}>{weather.weather[0].description}</Text>
          <View style={styles.weatherIcon}>
            {renderWeatherIcon(weather.weather[0].main)}
          </View>
        </View>
      )}
      {data && (
        <View style={styles.dataContainer}>
          <View style={styles.headContainer}>
            <Text style={[styles.label, { fontFamily: 'rakkas-regular', fontSize: 24 }]}>Sensor Data: </Text>
          </View>
          <Text style={[styles.label, { fontFamily: 'rakkas-regular' }]}>Temperature: </Text>
          <Text style={[styles.data, { fontFamily: 'rakkas-regular' }]}>{data.Temperature}°C</Text>
          <Text style={[styles.label, { fontFamily: 'rakkas-regular' }]}>Humidity: </Text>
          <Text style={[styles.data, { fontFamily: 'rakkas-regular' }]}>{data.Humidity}%</Text>
        </View>
      )}
    </View>
  );
};

export default FetchData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(100, 20, 40, 0.9)',
    alignItems: 'center',
    paddingTop: 50,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
 headerContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center', // Add this line to center the items horizontally
  marginBottom: 10,
},
  header: {
    fontSize: 40,
    textAlign: 'center',
    color: 'rgba(220, 250, 220, 0.9)',
    fontFamily: 'rakkas-regular',
    marginRight: 'auto',
  },
  creditButton: {
    position:'absolute',
    top:63,
    right:10,
    padding: 4,
    borderRadius: 5,
    marginLeft: 10,
  },
  creditIcon: {
    width: 30,
    height: 30,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Align horizontally to the center
    marginBottom: 15,
    width: '75%',
    borderBottomWidth: 1, // Add a border only at the bottom
    borderBottomColor: 'white', // Color of the border
    paddingBottom: 5, // Padding at the bottom to separate the line from the text
  },
  input: {
    flex: 1,
    height: 40, // Set height back to 40
    paddingHorizontal: 10,
    color: 'white',
  },
  searchButton: {
    padding: 2,
    marginLeft: -7,
  },
  suggestionsContainer: {
    width: '60%',
    marginBottom: 10,
    
  },
  suggestion: {
    backgroundColor: 'rgba(220, 220, 230, 0.4)',
    padding: 10,
    marginBottom: 4,
    fontSize: 16,
    color: 'black',
    borderRadius: 7,
  },
  headContainer: {
    backgroundColor: 'rgba(70, 155, 130, 0.3)',
    padding: 10,
    width: 'auto',
    borderRadius: 10,
    marginBottom: 15,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  dataContainer: {
    backgroundColor: 'rgba(70, 155, 130, 0.3)',
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 20,
    width: '70%',
    borderRadius: 10,
    marginBottom: 15,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: "relative"
  },
  label: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 5,
    color: 'white',
    flexDirection: 'row'
  },
  weatherIcon: {
    position: 'absolute',
    height: 200,
    width: '40%',
    top: 110,
    right: 40,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  data: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 5,
    color: 'cyan',
    flexDirection: 'row'
  },
});
