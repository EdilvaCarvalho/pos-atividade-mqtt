import paho.mqtt.client as mqtt
from struct import pack
from random import randint
from time import sleep

AREA_ID = 10
SENSOR_ID = 5000

# topico do sensor de temperatura
tt = "sensor/pos/temperatura"

# cria um identificador baseado no id do sensor
client = mqtt.Client(client_id = 'NODE:ss', protocol = mqtt.MQTTv31)
# conecta no broker
client.connect("iot.eclipse.org", 1883)

while True:
    # gera um valor de temperartura aleatório
    t = randint(0,50)
    # codificando o payload como big endian, 2 bytes
    # payload = pack(">H",t)
    # envia a publicação
    client.publish(tt,t,qos=0)
    #client.publish(tt,payload,qos=0)
    print (tt + "/" + str(t))

    sleep(5)
