#include <Arduino_JSON.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
const char* ssid = "Coding";
const char* password = "87654321";
String serverName  = "http://157.245.120.161:3005";
String response;
static const int servoPin = 5;
unsigned long lastTime = 0;
unsigned int timerDelay = 5000;
bool valveState = true;
int sensorPin = 2;
volatile long pulse;
unsigned long lastTimes;
float volume;
double vls;

int value;
void setup() {
  Serial.begin(115200);
  pinMode(LED_BUILTIN, OUTPUT);
pinMode(16, OUTPUT);
pinMode(14, OUTPUT);
  Serial.println(" board initialized ... ");

  attachInterrupt(digitalPinToInterrupt(sensorPin), increase, RISING);
  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.println("..");
  }
  digitalWrite(LED_BUILTIN, HIGH);
 digitalWrite(14, HIGH);

}



ICACHE_RAM_ATTR void increase() {
  pulse++;
}

String httpGETRequest(double volume) {
  
  WiFiClient client;
  HTTPClient http;
  String serverPath;

   if(volume > 0 && volume <= 30) {
    serverPath = serverName + "/flow/change/" + String(volume) + "/" + String(vls);
   }
      if(volume <0 || volume == 0.00) {
    serverPath = serverName + "/flow/change/" + String(0) + "/" + String(vls);
   }
      if( volume >30) {
    serverPath = serverName + "/flow/change/" + String(30);
   }
  
  Serial.print("Server string: ");
  Serial.println(serverPath);
  http.begin(client, serverPath.c_str());
  int httpResponseCode = http.GET();
  String payload = "{}";
  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    payload = http.getString();
  }
  else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }
  http.end();
Serial.println(payload);
vls = 0;
  return payload;
}




void loop() {
  volume = 2.663 * pulse / 1000 * 30;
  if (millis() - lastTime > 2000) {
    pulse = 0;
    lastTime = millis();
    double volu = 0.03 * volume;
    vls = volu + vls;
  }
  Serial.print(volume);
  Serial.println(" L/m");

 if (millis() - lastTimes > timerDelay) {
    Serial.println("Msg Passed: 15s");

    if (WiFi.status() == WL_CONNECTED) {
      response = httpGETRequest(double(volume));
      //      Serial.println(response);

      JSONVar myObject = JSON.parse(response);
      if (JSON.typeof(myObject) == "undefined") {
        Serial.println("Parsing input failed!");
        return;
      }
      if (myObject["success"]) {
        JSONVar body = myObject["body"];
        if (JSON.typeof(body) == "undefined") {
          Serial.println("Parsing input failed!");
          return;
        }
        if (JSON.typeof(body) == "undefined") {
          Serial.println("Parsing input failed!");
          return;
        }

        
       
          
          valveState = (body["valve"]);
//          Serial.print(" VALUE: ");
//          delay(1000);
//          Serial.println(valveState);
//          Serial.println(body);
          if(valveState) {
            digitalWrite(16, HIGH);
            Serial.println(" OPENING VALVE ");
          }

            if(!valveState) {
            digitalWrite(16, LOW);
            Serial.println(" CLOSING VALVE ");
          }
         
        

      }

    }
    else {
      Serial.println("WiFi Disconnected");
    }
    lastTimes = millis();
  }

  }
