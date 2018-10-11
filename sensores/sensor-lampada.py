import sys
import paho.mqtt.client as mqtt # importa o pacote mqtt

#topic = 'DZ/#' # define o topico que este script assinara


# funcao on_connect sera atribuida e chamada quando a conexao for iniciada
# ela printara na tela caso tudo ocorra certo durante a tentativa de conexao
# tambem ira assina o topico que foi declarado acima
def on_connect(client, userdata, flags, rc):
    print("[STATUS] Conectado ao Broker. Resultado de conexao: "+str(rc))

    client.subscribe('sensor/lampada')

# possui o mesmo cenario que o on_connect, porem, ela sera atrelada ao loop
# do script, pois toda vez que receber uma nova mensagem do topico assinado, ela sera invocada
def on_message(client, userdata, msg):

    message = str(msg.payload) # converte a mensagem recebida
    print("[MSG RECEBIDA] Topico: "+msg.topic+" / Mensagem: "+ message) # imprime no console a mensagem

    # testara se o topico desta mensagem sera igual ao topico que queremos, que neste caso remete ao led
    if msg.topic == 'sensor/lampada':

        # basicamente nessa condicional testara se o valor recebido sera 1, sendo 1 acende o led
        # e, caso receber qualquer outra coisa, apagara o led
        if(message == "b'1'"):
            print("Lâmpada Acesa")
        else:
            print("Lâmpada Apagada")

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