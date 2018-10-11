var wsbroker = "iot.eclipse.org";
var wsport = 80
var client = new Paho.MQTT.Client(wsbroker, wsport, '/ws', "myclientid_" + parseInt(Math.random() * 100, 10));
      
client.onConnectionLost = function (responseObject) {
  console.log("conexão perdida: " + responseObject.errorMessage);
};

client.onMessageArrived = function (message) {
  console.log(message.destinationName, ' -- ', message.payloadString);
  if (message.destinationName == 'sensor/temperatura') {
    document.getElementById("sensor").innerHTML = message.payloadString + " °C";
  }
  if (message.destinationName == 'sensor/temperatura-ar-condicionado') {
    document.getElementById("ar-condicionado").innerHTML = message.payloadString;
  }  
};

var options = {
  timeout: 3,
  onSuccess: function () {
    console.log("conectado ao servidor");
    client.subscribe('sensor/temperatura', {qos: 1});
    client.subscribe('sensor/lampada', {qos: 1});
    client.subscribe('sensor/ar-condicionado', {qos: 1});
    client.subscribe('sensor/temperatura-ar-condicionado', {qos: 1});
  },
  onFailure: function (message) {
    console.log("connexão falhou: " + message.errorMessage);
  }
};

function init() {
  client.connect(options);
}

function offLampada() {
  message = new Paho.MQTT.Message("0");
  message.destinationName = "sensor/lampada";
  client.send(message);
  alert("Lâmpada apagada!");
}

function onLampada() {
  message = new Paho.MQTT.Message("1");
  message.destinationName = "sensor/lampada";
  client.send(message);
  alert("Lâmpada acesa!");
}

function offAr() {
  message = new Paho.MQTT.Message("0");
  message.destinationName = "sensor/ar-condicionado";
  client.send(message);
  alert("Ar-condicionado desligado!");
}

function onAr() {
  message = new Paho.MQTT.Message("1");
  message.destinationName = "sensor/ar-condicionado";
  client.send(message);
  alert("Ar-condicionado ligado!");
}

function aumentaAr() {
  message = new Paho.MQTT.Message("2|"+document.getElementById("ar-condicionado").innerHTML);
  message.destinationName = "sensor/ar-condicionado";
  client.send(message);
}

function diminuiAr() {
  message = new Paho.MQTT.Message("3|"+document.getElementById("ar-condicionado").innerHTML);
  message.destinationName = "sensor/ar-condicionado";
  client.send(message);
}