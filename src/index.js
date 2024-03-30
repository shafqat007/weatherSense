import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import { ref, onValue } from 'firebase/database';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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

  const fetchWeatherData = async () => {
    try {
      const apiKey = '8d8fa321cd36e00ed12bb916c5b054a9';
      const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      const response = await axios.get(apiUrl);
      setWeather(response.data);
      navigation.navigate('WeatherDetail');
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const renderWeatherIcon = (condition) => {
    switch (condition) {
      case 'Clear':
        return <Ionicons name="sunny-outline" size={32} color="yellow" />;
      case 'Clouds':
        return <Ionicons name="cloudy-outline" size={32} color="gray" />;
      case 'Rain':
        return <Ionicons name="rainy-outline" size={32} color="blue" />;
      case 'Thunderstorm':
        return <Ionicons name="thunderstorm-outline" size={32} color="purple" />;
      case 'Snow':
        return <Ionicons name="snow-outline" size={32} color="white" />;
      default:
        return <Ionicons name="partly-sunny-outline" size={32} color="gray" />;
    }
  };

  const handleSuggestionPress = (city) => {
    setCity(city);
    setSuggestions([]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image blurRadius={70} source={require('../assets/images/bg.png')} style={styles.backgroundImage} />
      <StatusBar style="light" />
      <Text style={[styles.header, { fontFamily: 'rakkas-regular' }]}>Weather App</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.input, { color: 'white' }]}
          placeholder="Enter city name"
          placeholderTextColor="#D9D9D9"
          value={city}
          onChangeText={setCity}
        />
        <TouchableOpacity style={styles.searchButton} onPress={fetchWeatherData}>
          <MaterialCommunityIcons name="arrow-right-circle" size={32} color="white" />
        </TouchableOpacity>
      </View>
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSuggestionPress(item)}>
              <Text style={styles.suggestion}>{item}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionsContainer}
        />
      )}
      {weather && (
        <View style={styles.dataContainer}>
          <Text style={[styles.label, { fontFamily: 'rakkas-regular' , }]}>City: </Text>
          <Text style={[styles.data, { fontFamily: 'rakkas-regular' }]}>{weather.name}</Text>
          <Text style={[styles.label, { fontFamily: 'rakkas-regular' ,  }]}>Temperature: </Text>
          <Text style={[styles.data, { fontFamily: 'rakkas-regular', }]}>{weather.main.temp}°C</Text>
          <Text style={[styles.label, { fontFamily: 'rakkas-regular' }]}>Humidity: </Text>
          <Text style={[styles.data, { fontFamily: 'rakkas-regular', }]}>{weather.main.humidity}%</Text>
          <Text style={[styles.label, { fontFamily: 'rakkas-regular'  }]}>Weather: </Text>
          <Text style={[styles.data, { fontFamily: 'rakkas-regular', }]}>{weather.weather[0].description}</Text>
          {renderWeatherIcon(weather.weather[0].main)}

         
        </View>




      )}
      {data && (
        <View style={styles.dataContainer}>
          <Text style={[styles.label, { fontFamily: 'rakkas-regular' }]}>Sensor: </Text>
          <Text style={[styles.label, { fontFamily: 'rakkas-regular' ,  }]}>Temperature: </Text>
          <Text style={[styles.data, { fontFamily: 'rakkas-regular', }]}>{data.Temperature}°C</Text>
          <Text style={[styles.label, { fontFamily: 'rakkas-regular' ,  }]}>Humidity: </Text>
          <Text style={[styles.data, { fontFamily: 'rakkas-regular', }]}>{data.Humidity}%</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default FetchData;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  header: {
    fontSize: 40,
    textAlign: 'center',
    color: 'rgba(220, 250, 220, 0.9)',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    width: '80%',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
    color: 'white',
  },
  searchButton: {
    backgroundColor: '#3182CE',
    padding: 5,
    borderRadius: 5,
    marginLeft: -5,
  },
  suggestionsContainer: {
    width: '60%',
    marginBottom: 10,
  },
  suggestion: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 10,
    marginBottom: 4,
    fontSize: 16,
    color: 'black',
    borderRadius: 7,
  },
  dataContainer: {
    backgroundColor: 'rgba(70, 155, 130, 0.3)',
    padding: 20,
    width: '70%',
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
    color: 'cyan',
    flexDirection: 'row'
  },
  label: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
    color:'white',
    flexDirection: 'row'
  },
  data: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
    color:'cyan',
    flexDirection: 'row'
  },
});
