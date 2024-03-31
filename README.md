Weather App
Overview
This Weather App allows users to search for weather information by city name, view suggestions while typing, and fetch data from an ESP32 sensor (DHT11). The app retrieves weather data from the OpenWeatherMap API and displays it alongside sensor data fetched from Firebase Realtime Database.

Features
Search for weather information by city name
View suggestions while typing city names
Fetch and display sensor data from ESP32 (DHT11)
Background image with blur effect
Custom fonts for enhanced visual appeal
Responsive design for mobile devices
Technologies Used
React Native: Frontend framework for building mobile applications
Expo: Development toolchain for building React Native apps
Firebase Realtime Database: Cloud-hosted NoSQL database for storing sensor data
OpenWeatherMap API: External API for retrieving weather information
Axios: Promise-based HTTP client for making API requests
Font: Expo library for loading custom fonts
MaterialCommunityIcons: Expo vector icons library for UI components
Installation
Clone the repository:

bash
Copy code
git clone <repository-url>
Install dependencies:

Copy code
npm install
Set up Firebase Realtime Database:

Create a Firebase project and enable Realtime Database.
Replace the db variable in config.js with your Firebase configuration.
Set up OpenWeatherMap API:

Sign up for an API key on the OpenWeatherMap website.
Replace the apiKey variable in FetchData.js with your API key.
Usage
Start the development server:

sql
Copy code
npm start
Launch the app on an Android or iOS device using the Expo Go app or an emulator.

Enter a city name in the search bar to view weather information and sensor data.

Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request for any improvements or new features you'd like to see.

License
This project is licensed under the MIT License.
