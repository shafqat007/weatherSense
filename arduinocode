
#include <IOXhop_FirebaseESP32.h>
#include <DHT.h>
#include <WiFi.h>
#define DHTPIN 5
#define DHTTYPE DHT11 

DHT dht(DHTPIN,DHTTYPE);

#define WIFI_SSID "Spotlight"
#define WIFI_PASSWORD "changedtoglitch"
#define FIREBASE_AUTH "https://newweatherapp-522b7-default-rtdb.asia-southeast1.firebasedatabase.app/"
#define FIREBASE_HOST "s0djOvUvew4MeWDub4gzlLuK3XQ3Qq9kaKcgUF3P"
void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  Serial.print("DHT TEST");
  dht.begin();


  //CONNECTING WIFI
  WiFi.begin(WIFI_SSID,WIFI_PASSWORD);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED){
    Serial.println(".");
    delay(500);
  }
  Serial.println();
  Serial.println("Connected");
  Serial.println(WiFi.localIP());
  Firebase.begin(FIREBASE_AUTH,FIREBASE_HOST);
}


int  n = 0;
void loop() {

  delay(2000);
  // put your main code here, to run repeatedly:
float h = dht.readHumidity();
float t = dht.readTemperature();
if(isnan(h)||isnan(t)){
  Serial.println("Failed to read from DHT sensor!");
  return;
}
Serial.print("Humidity");
Serial.print(h);
Serial.print("%\t");
Serial.print("Temperature");
Serial.print(t);
Serial.print(" *C");

//setting value


Firebase.setFloat("Humidity",h);
//handle error
if(Firebase.failed()){
  Serial.print("Setting/number failed");
  Serial.println(Firebase.error());
  return;
}

delay(1000);
Firebase.setFloat("Temperature",t);
if(Firebase.failed()){
  Serial.print("Setting/number failed: ");
  Serial.println(Firebase.error());
  return;
}
Serial.println("      Temperature and Humidty Data Sent Successfully");
delay(1000);
}

