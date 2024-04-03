import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import { ref, onValue } from 'firebase/database';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import MapView,{Marker} from 'react-native-maps';
import * as Location from 'expo-location';

import { db } from '../config';

const FetchData = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [userWeather, setUserWeather] = useState(null);
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [nightOnTop, setNightOnTop] = useState(false);
  const [color, setColor] = useState('white');
  const [mapRegion,setMapRegion] = useState({
    latitude:24.3752,
    longitude:91.8349,
    latitudeDelta:0.05,
    longitudeDelta:0.05

  })
  const [markerCoordinate, setMarkerCoordinate] = useState(null);
  const clearMarker = () => {
    setMarkerCoordinate(null);
  };
  const userLocation = async() =>{
    let {status} = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted'){
      setErrorMsg('Permission to access location was denied');
    }

    let location  = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
    setMapRegion({
      latitude:location.coords.latitude,
      longitude:location.coords.longitude,
      latitudeDelta:0.05,
      longitudeDelta:0.05
    });
    setMarkerCoordinate({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    console.log(location.coords.latitude,location.coords.longitude);
    fetchWeatherDataByCoords(location.coords.latitude, location.coords.longitude);
  }
  const fetchWeatherDataByCoords = async (latitude, longitude) => {
    try {
      const apiKey = '8d8fa321cd36e00ed12bb916c5b054a9';
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      const response = await axios.get(apiUrl);
      setUserWeather(response.data); // Set user's weather data
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };


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

  const toggleContainersOrder = () => {
    setNightOnTop(!nightOnTop);
    setColor(color === 'white' ? 'white' : 'white');
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
  const handleGoBack = () => {
    userLocation(); // Set user's current location as map region
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
        return <LottieView style={{
          width:140,height:140,
        } }source={require('../assets/images/icons8-sun.json')} autoPlay loop />
      case 'Clouds':
        return <LottieView style={{
          width:140,height:140,
        } }source={require('../assets/images/icons8-partly-cloudy-day.json')} autoPlay loop />
      case 'Rain':
        return <LottieView style={{
          width:140,height:140,
        } }source={require('../assets/images/icons8-rain.json')} autoPlay loop />
      case 'Thunderstorm':
        return <LottieView style={{
          width:140,height:140,
        } }source={require('../assets/images/icons8-cloud-lightning.json')} autoPlay loop />
      case 'Snow':
        return <LottieView style={{
          width:140,height:140,
        } }source={require('../assets/images/icons8-snow-storm.json')} autoPlay loop />
      case 'Haze':
        return   <LottieView style={{
          width:140,height:140,
        } }source={require('../assets/icons8-haze.json')} autoPlay loop />
      default:
        return  <LottieView style={{
          width:140,height:140,
        } }source={require('../assets/icons8-haze.json')} autoPlay loop />
    }
  };
  const renderuserWeatherIcon = (condition) => {
    switch (condition) {
      case 'Clear':
        return <LottieView style={{
          width:140,height:140,
        } }source={require('../assets/images/icons8-sun.json')} autoPlay loop />
      case 'Clouds':
        return <LottieView style={{
          width:140,height:140,
        } }source={require('../assets/images/icons8-partly-cloudy-day.json')} autoPlay loop />
      case 'Rain':
        return <LottieView style={{
          width:140,height:140,
        } }source={require('../assets/images/icons8-rain.json')} autoPlay loop />
      case 'Thunderstorm':
        return <LottieView style={{
          width:140,height:140,
        } }source={require('../assets/images/icons8-cloud-lightning.json')} autoPlay loop />
      case 'Snow':
        return <LottieView style={{
          width:140,height:140,
        } }source={require('../assets/images/icons8-snow-storm.json')} autoPlay loop />
      case 'Haze':
        return   <LottieView style={{
          width:140,height:140,
        } }source={require('../assets/icons8-haze.json')} autoPlay loop />
      default:
        return  <LottieView style={{
          width:140,height:140,
        } }source={require('../assets/icons8-haze.json')} autoPlay loop />
    }
  };

  return (
    
    <ScrollView>
     
      
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
        <View style={styles.daynight}>
  <TouchableOpacity onPress={toggleContainersOrder} style={styles.containerWrapper}>
    <View style={[styles.containers, { backgroundColor: color }, nightOnTop ? styles.nightContainer : styles.dayContainer]}>
      <View style={styles.headContainer}>
      <LottieView style={{
          width:40,height:40,
        } }source={require('../assets/icons8-sun.json')} autoPlay loop />
      </View>
      <Text style={[styles.daylabel, { fontFamily: 'rakkas-regular' }]}>Temperature: </Text>
      <Text style={[styles.daydata, { fontFamily: 'rakkas-regular' }]}>{weather.main.temp}°C</Text>
      <Text style={[styles.daylabel, { fontFamily: 'rakkas-regular' }]}>Humidity: </Text>
      <Text style={[styles.daydata, { fontFamily: 'rakkas-regular' }]}>{weather.main.humidity}%</Text>
      <Text style={[styles.daylabel, { fontFamily: 'rakkas-regular' }]}>Weather: </Text>
      <Text style={[styles.daydata, { fontFamily: 'rakkas-regular', textTransform: 'capitalize' }]}>{weather.weather[0].description}</Text>
      {nightOnTop ? null : (
        <View style={styles.weatherIcon}>
          {renderWeatherIcon(weather.weather[0].main)}
        </View>
      )}
    </View>
    <View style={[styles.containers, nightOnTop ? styles.dayContainer : styles.nightContainer]}>
      <View style={styles.headContainer}>
      <LottieView style={{
          width:40,height:40,
        } }source={require('../assets/lottie.json')} autoPlay loop />
      </View>
      <Text style={[styles.nightlabel, { fontFamily: 'rakkas-regular' }]}>Night Temp: </Text>
      <Text style={[styles.nightdata, { fontFamily: 'rakkas-regular' }]}>{weather.main.temp}°C</Text>
      <Text style={[styles.nightlabel, { fontFamily: 'rakkas-regular' }]}>NightHum: </Text>
      <Text style={[styles.nightdata, { fontFamily: 'rakkas-regular' }]}>{weather.main.humidity}%</Text>
      <Text style={[styles.nightlabel, { fontFamily: 'rakkas-regular' }]}>night Weather: </Text>
      <Text style={[styles.nightdata, { fontFamily: 'rakkas-regular', textTransform: 'capitalize' }]}>{weather.weather[0].description}</Text>
      {nightOnTop ? (
        <View style={styles.weatherIcon}>
          {renderWeatherIcon(weather.weather[0].main)}
        </View>
      ) : null}
    </View>
  </TouchableOpacity>
</View>

      )}
      {data && (
        <View style={styles.dataContainer}>
          <View style={styles.headContainer}>
            <Text style={[styles.label, { fontFamily: 'rakkas-regular', fontSize: 24 }]}>Sensor Data</Text>
          </View>
          <View style={styles.datalab1}>
          <View >
          <Text style={[styles.label, { fontFamily: 'rakkas-regular' }]}>Temperature</Text>
          <Text style={[styles.data, { fontFamily: 'rakkas-regular' }]}>{data.Temperature}°C</Text></View>
          <View>
          <Text style={[styles.label, { fontFamily: 'rakkas-regular' }]}>Humidity</Text>
          <Text style={[styles.data, { fontFamily: 'rakkas-regular' }]}>{data.Humidity}%</Text>
          </View>
        </View>
        </View>
    
      )}

{data && (
        <View style={styles.locationContainer}>
          <View style={styles.headContainer}>
           
          </View>
         <MapView style={styles.map} region={mapRegion}>
         
         {markerCoordinate && <Marker coordinate={markerCoordinate} title='Marker' />}
         </MapView>
        
        <View style={styles.buttonmap}>
        <Text style={[styles.label, { fontFamily: 'rakkas-regular', fontSize: 16 }]}>GPS Weather                       </Text>     
  <TouchableOpacity style={styles.searchButton} onPress={clearMarker}>
        <Image style={{ height: 30, width: 30 }} source={require('../assets/ree.png')} />

        </TouchableOpacity>
       
          <TouchableOpacity style={styles.searchButton} onPress={handleGoBack}>
        <Image style={{ height: 38, width: 30 ,alignSelf:'flex-end'}} source={require('../assets/lo.png')} />

        </TouchableOpacity>
 
       </View>
   
        </View>
      )}
      
 {userWeather &&(
        <View style={styles.daynight}>
  <TouchableOpacity onPress={toggleContainersOrder} style={styles.containerWrapper}>
    <View style={[styles.containers, { backgroundColor: color }, nightOnTop ? styles.nightContainer : styles.dayContainer]}>
      <View style={styles.headContainer}>
      <LottieView style={{
          width:40,height:40,
        } }source={require('../assets/icons8-sun.json')} autoPlay loop />
      </View>
      <Text style={[styles.daylabel, { fontFamily: 'rakkas-regular' }]}>Temperature: </Text>
      <Text style={[styles.daydata, { fontFamily: 'rakkas-regular' }]}>{userWeather.main.temp}°C</Text>
      <Text style={[styles.daylabel, { fontFamily: 'rakkas-regular' }]}>Humidity: </Text>
      <Text style={[styles.daydata, { fontFamily: 'rakkas-regular' }]}>{userWeather.main.humidity}%</Text>
      <Text style={[styles.daylabel, { fontFamily: 'rakkas-regular' }]}>Weather: </Text>
      <Text style={[styles.daydata, { fontFamily: 'rakkas-regular', textTransform: 'capitalize' }]}>{userWeather.weather[0].description}</Text>
      {nightOnTop ? null : (
        <View style={styles.weatherIcon}>
          {renderWeatherIcon(userWeather.weather[0].main)}
        </View>
      )}
    </View>
    <View style={[styles.containers, nightOnTop ? styles.dayContainer : styles.nightContainer]}>
      <View style={styles.headContainer}>
      <LottieView style={{
          width:40,height:40,
        } }source={require('../assets/lottie.json')} autoPlay loop />
      </View>
      <Text style={[styles.nightlabel, { fontFamily: 'rakkas-regular' }]}>Night Temp: </Text>
      <Text style={[styles.nightdata, { fontFamily: 'rakkas-regular' }]}>{userWeather.main.temp}°C</Text>
      <Text style={[styles.nightlabel, { fontFamily: 'rakkas-regular' }]}>NightHum: </Text>
      <Text style={[styles.nightdata, { fontFamily: 'rakkas-regular' }]}>{userWeather.main.humidity}%</Text>
      <Text style={[styles.nightlabel, { fontFamily: 'rakkas-regular' }]}>night Weather: </Text>
       <Text style={[styles.nightdata, { fontFamily: 'rakkas-regular', textTransform: 'capitalize' }]}>{userWeather.weather[0].description}</Text>
       {nightOnTop ? (
        <View style={styles.weatherIcon}>
          {renderuserWeatherIcon(userWeather.weather[0].main)}
        </View>
      ) : null}
    </View>
  </TouchableOpacity>
</View>

      )}
         
{/* 
{ data && (
   <View style={styles.dataContainer}>
          <View style={styles.headContainer}>
            <Text style={[styles.label, { fontFamily: 'rakkas-regular', fontSize: 24 }]}>Sensor Data: </Text>
          </View>
          <Text style={[styles.label, { fontFamily: 'rakkas-regular' }]}>Temperature: </Text>
          <Text style={[styles.data, { fontFamily: 'rakkas-regular' }]}>{userWeather.main.temp}°C</Text>
          <Text style={[styles.label, { fontFamily: 'rakkas-regular' }]}>Humidity: </Text>
          <Text style={[styles.data, { fontFamily: 'rakkas-regular' }]}>%</Text>
        </View>
      )} */}
    </View>
    </ScrollView>
  );
};

export default FetchData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(100, 20, 40, 0.9)',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom:270
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
  buttonmap:{
flexDirection:'row',
justifyContent:'center',
alignItems:'center',
width:'100%',
marginBottom:-3,
backgroundColor: 'rgba(220, 220, 230, 0)',
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
    // backgroundColor: 'rgba(70, 155, 130, 0.3)',
    padding: 0,
    width: 'auto',
    borderRadius: 0,
    marginBottom: 4,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  map:{
    width:Dimensions.get('window').width*0.69,
    height:Dimensions.get('window').height*0.3,
    alignSelf: 'center',
    borderRadius: 10, 
  },
  dataContainer: {
    backgroundColor: 'rgba(70, 155, 130, 0.3)',
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 20,
    width: '72%',
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'flex-start',

  },
  locationContainer: {
    backgroundColor: 'rgba(70, 155, 130, 0.3)',
    paddingLeft: 2,
    paddingTop: 2,
    paddingBottom: 2,
    paddingRight: 2,
    width: '72%',
    borderRadius: 10,
    marginBottom: -20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',

  },

  daynight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20
  },
  containerWrapper: {
    flexDirection: 'row', // Stack containers vertically
    paddingHorizontal: 10,
    
    zIndex:0,
    elevation:10,
    margin:20,
    width:'70%'
  },
  containers: {
    backgroundColor: 'rgba(0, 0, 0, 1)',
    paddingHorizontal: 0,
    paddingVertical: -20,
    width:'10%',
    borderRadius: 10,
    marginBottom: -1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    elevation:5
    
  },

  dayContainer: {
    paddingTop:10,
    paddingBottom:10,
    flex: 3, // Occupies 2/3 of the available space
marginHorizontal:-15,
elevation:4,
zIndex:2,
alignItems:'flex-start',paddingLeft:10,
  },

  nightContainer: {
textAlign:'right',
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:10,
    flex: 1, // Occupies 1/3 of the available space
    marginHorizontal:-15,
    elevation:0,
    alignItems:'flex-start'
    
  },
  
  daylabel: {
    fontSize: 10,
    textAlign: 'center',

    color: 'black',
    flexDirection: 'row'
  },
  nightlabel: {
    fontSize: 10,
    textAlign: 'center',

    color: 'white',
    flexDirection: 'row'
  },
  daydata: {
    fontSize: 10,
    textAlign: 'center',
  
    color: 'rgba(255, 0, 0, 1)',
    flexDirection: 'row'
  },

  label: {
    fontSize: 15,
alignItems:'center',
textAlign: 'center',
    marginTop: -2,
    color: 'white',

    
  },
  datalab1:{
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
    width:'100%',
  },
  data: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: -3,
    color: 'cyan',
  
  },
  nightdata: {
    fontSize: 10,
    textAlign: 'center',

    color: 'cyan',
    flexDirection: 'row'
  },
  weatherIcon: {
    position: 'absolute',
    height: 200,
    width: '20%',
    top: 40,
    right: 30,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
   
  },

});