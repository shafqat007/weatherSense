import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Font from 'expo-font';

const Credit = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }
    ).start();
  }, [fadeAnim]);

  useEffect(() => {
    Font.loadAsync({
      'rakkas-regular': require('../assets/fonts/rakkas-regular.ttf'),
    });
  }, []);

  return (
    <View style={styles.container}>
      <Image blurRadius={70} source={require('../assets/images/bg.png')} style={styles.backgroundImage} />
      
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image style={styles.creditIcon} source={require('../assets/images/icons8-forward-150.png')} />
      </TouchableOpacity>
      
      <Animated.View style={[styles.creditContainer, { opacity: fadeAnim }]}>
        <Text style={[styles.text, { fontSize:23,fontFamily: 'rakkas-regular' }]}>Developed by Shafqat Nawaz</Text>
        <Text style={[styles.version, {fontSize:20,marginTop:-2, color: 'cyan',fontFamily: 'rakkas-regular' }]}>weatherSense v1.0.0</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(100, 20, 40, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },



  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1, // Ensure the button is above the background image
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  creditContainer: {
    flex: 1,
    justifyContent: 'center', // Center text vertically
    alignItems: 'center',
    marginBottom: 50, // Add margin bottom for spacing
  },
  creditIcon: {
    width: 30,
    height: 30,
    transform: [{ rotate: '180deg' }],
  },
  text: {
    fontSize: 20,
    color: 'white',
  },
  version: {
    fontSize: 19,
    color: 'cyan',
    marginTop: 10, // Add margin top for spacing
  },
 backButton: {
    position: 'absolute',
    top: 63,
    left: 10,
    zIndex: 1, // Ensure the button is above the background image
    backgroundColor: 'rgba(255, 255, 255, 0)',
    padding: 4,
    borderRadius: 5,
  },
  creditContainer: {
    flex: 1,
    justifyContent: 'center', // Center text vertically
    alignItems: 'center',
    marginBottom: 50, // Add margin bottom for spacing
  },
  creditIcon: {
    width: 30,
    height: 30,
    transform: [{ rotate: '180deg' }],
  },
  text: {
    fontSize: 20,
    color: 'white',
  },
  version: {
    fontSize: 16,
    color: 'white',
    marginTop: 10, // Add margin top for spacing
  },
});

export default Credit;
