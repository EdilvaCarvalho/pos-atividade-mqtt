import sys
import paho.mqtt.client as mqtt # importa o pacote mqtt

temperatura = 25

# funcao on_connect sera atribuida e chamada quando a conexao for iniciada
# ela printara na tela caso tudo ocorra certo durante a tentativa de conexao
# tambem ira assina o topico que foi declarado acima
def on_connect(client, userdata, flags, rc):
    print("[STATUS] Conectado ao Broker. Resultado de conexao: "+str(rc))

    client.subscribe('sensor/pos/ar-condicionado')

# possui o mesmo cenario que o on_connect, porem, ela sera atrelada ao loop
# do script, pois toda vez que receber uma nova mensagem do topico assinado, ela sera invocada
def on_message(client, userdata, msg):

    message = str(msg.payload) # converte a mensagem recebida
    print("[MSG RECEBIDA] Topico: "+msg.topic+" / Mensagem: "+ message) # imprime no console a mensagem

    # testara se o topico desta mensagem sera igual ao topico que queremos, que neste caso remete ao led
    if msg.topic == 'sensor/pos/ar-condicionado':

        global temperatura

        if(message == "b'1'"):
            print("Ar-condicionado Ligado")
            client.publish('sensor/pos/temperatura-ar-condicionado', temperatura, qos=0)
        elif(message == "b'0'"):
            print("Ar-condicionado Desligado")
            client.publish('sensor/pos/temperatura-ar-condicionado', '--', qos=0)
        elif(message == "b'2'"):
            temperatura = temperatura+1
            print("Temperatura do Ar-condicionado: " + str(temperatura))
            client.publish('sensor/pos/temperatura-ar-condicionado', temperatura, qos=0)
        else:
            temperatura = temperatura-1
            print("Temperatura do Ar-condicionado: " + str(temperatura))
            client.publish('sensor/pos/temperatura-ar-condicionado', temperatura, qos=0)


try:
    print("[STATUS] Inicializando MQTT...")

    client = mqtt.Client() # instancia a conexao
    client.on_connect = on_connect # define o callback do evento on_connect
    client.on_message = on_message # define o callback do evento on_message

    client.connect("iot.eclipse.org", 1883, 60) # inicia a conexao
    client.loop_forever() # a conexao mqtt entrara em loop ou seja, ficara escutando e processando todas mensagens recebidas

except KeyboardInterrupt:
    print ("\nScript finalizado.")
    sys.exit(0)