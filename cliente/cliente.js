var wsbroker = "iot.eclipse.org";
var wsport = 80
var client = new Paho.MQTT.Client(wsbroker, wsport, '/ws', "myclientid_" + parseInt(Math.random() * 100, 10));
      
client.onConnectionLost = function (responseObject) {
  console.log("conexão perdida: " + responseObject.errorMessage);
};

client.onMessageArrived = function (message) {
  console.log(message.destinationName, ' -- ', message.payloadString);
  if (message.destinationName == 'sensor/pos/temperatura') {
    document.getElementById("sensor").innerHTML = message.payloadString + " °C";
  }
  if (message.destinationName == 'sensor/pos/temperatura-ar-condicionado') {
    document.getElementById("ar-condicionado").innerHTML = message.payloadString + " °C";
  }
  if (message.destinationName == 'sensor/pos/lampada1') {
    if (message.payloadString == 'acesa') {
      document.getElementById("lampada").src = "../img/lampadaAcesa.jpg";
    } else {
      document.getElementById("lampada").src = "../img/lampadaApagada.jpg";
    }
  }
};

var options = {
  timeout: 3,
  onSuccess: function () {
    console.log("conectado ao servidor");
    client.subscribe('sensor/pos/temperatura', {qos: 1});
    client.subscribe('sensor/pos/lampada', {qos: 1});
    client.subscribe('sensor/pos/lampada1', {qos: 1});
    client.subscribe('sensor/pos/ar-condicionado', {qos: 1});
    client.subscribe('sensor/pos/temperatura-ar-condicionado', {qos: 1});
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
  message.destinationName = "sensor/pos/lampada";
  client.send(message);
  //alert("Lâmpada apagada!");
}

function onLampada() {
  message = new Paho.MQTT.Message("1");
  message.destinationName = "sensor/pos/lampada";
  client.send(message);
  //alert("Lâmpada acesa!");
}

function offAr() {
  message = new Paho.MQTT.Message("0");
  message.destinationName = "sensor/pos/ar-condicionado";
  client.send(message);
  document.getElementById('btn-aumentaAr').disabled=true;
  document.getElementById('btn-diminuiAr').disabled=true;
}

function onAr() {
  message = new Paho.MQTT.Message("1");
  message.destinationName = "sensor/pos/ar-condicionado";
  client.send(message);
  document.getElementById('btn-aumentaAr').disabled=false;
  document.getElementById('btn-diminuiAr').disabled=false;
}

function aumentaAr() {
  message = new Paho.MQTT.Message("2");
  message.destinationName = "sensor/pos/ar-condicionado";
  client.send(message);
}

function diminuiAr() {
  message = new Paho.MQTT.Message("3");
  message.destinationName = "sensor/pos/ar-condicionado";
  client.send(message);
}