<template>
  <v-app>
    <v-container>
      <div style="font-size:40px">MQTT TEST</div>
      <v-card rounded elevation="4">
        <v-card-title>Configuracion</v-card-title>
        <v-card-text>
          <v-row >
            
            <v-col cols="12" md="4" class="" >
            
              <div >
                 <div class="d-flex justify-left"><h2>BROKER</h2></div>
                 <v-text-field  v-model="connection.host" ></v-text-field>
              </div>
            </v-col>
            <v-col cols="12" md="4" class="" >
            
              <div >
                 <div class="d-flex justify-left"><h2>PORT</h2></div>
                 <v-text-field  v-model="connection.port" ></v-text-field>
              </div>
            </v-col>
            <v-col cols="12" md="4" class="" >
            
              <div >
                 <div class="d-flex justify-left"><h2>ENDPOINT</h2></div>
                 <v-text-field  v-model="connection.endpoint" ></v-text-field>
              </div>
            </v-col>
            <v-col cols="12" md="4" class="" >
            
              <div >
                 <div class="d-flex justify-left"><h2>Client ID</h2></div>
                 <v-text-field  v-model="connection.clientId" ></v-text-field>
              </div>
            </v-col>
            <v-col cols="12" md="4" class="" >
            
              <div >
                 <div class="d-flex justify-left"><h2>USERNAME</h2></div>
                 <v-text-field  v-model="connection.username" ></v-text-field>
              </div>
            </v-col>
            <v-col cols="12" md="4" class="" >
            
              <div >
                 <div class="d-flex justify-left"><h2>PASSWOD</h2></div>
                 <v-text-field  v-model="connection.password" ></v-text-field>
              </div>
            </v-col>
          </v-row>
          <div class="d-flex justify-left" >
            <v-btn class="mx-3" @click="createConnection" :disabled="client.connected" color="green" dark>{{ client.connected ? 'Connected' : 'Connect' }}</v-btn>
            <v-btn color="red" v-if="client.connected" @click="destroyConnection" dark>DESCONECTAR</v-btn>
          </div>
        </v-card-text>
    </v-card>

          <v-card rounded elevation="4" class="my-5">
        <v-card-title>Suscribirse</v-card-title>
        <v-card-text>
          <v-row >
             <v-col cols="12" md="4" class="" >
              <div >
                 <div class="d-flex justify-left"><h2>TOPIC</h2></div>
                 <v-text-field  v-model="subscription.topic" ></v-text-field>
              </div>
            </v-col>
            <v-col cols="12" md="4" class="" >
              <div >
                <div class="d-flex justify-left"><h2>QOS</h2></div>
                <v-select
                  v-model="subscription.qos"
                  :items="qosList"
                  :label="(subscription.qos).toString()"
                ></v-select>
              </div>
            </v-col>
            <v-col cols="12" md="4" class="" >
              <div >
               <div class="d-flex justify-left"><h2>Subs</h2></div>
                 <v-btn :disabled="!client.connected" @click="doSubscribe" class="mx-3" color="green" dark>{{ subscribeSuccess ? 'Subscribed' : 'Subscribe' }}</v-btn>
                 <v-btn  :disabled="!client.connected" @click="doUnSubscribe" v-if="subscribeSuccess" color="red" dark>Desuscribirse</v-btn>
               </div>
            </v-col>
       
          </v-row>
        
        </v-card-text>
    </v-card>

          <v-card rounded elevation="4">
        <v-card-title>Publicar</v-card-title>
        <v-card-text>
          <v-row >
       <v-col cols="12" md="4" class="" >
              <div >
                 <div class="d-flex justify-left"><h2>TOPIC</h2></div>
                 <v-text-field  v-model="publish.topic" ></v-text-field>
              </div>
            </v-col>
            <v-col cols="12" md="4" class="" >
              <div >
                <div class="d-flex justify-left"><h2>PAYLOAD</h2></div>
                <v-text-field  v-model="publish.payload" ></v-text-field>
              </div>
            </v-col> 
             <v-col cols="12" md="4" class="" >
              <div >
                <div class="d-flex justify-left"><h2>QOS</h2></div>
                <v-select
                  v-model="publish.qos"
                  :items="qosList"
                 
                ></v-select>
              </div>
            </v-col>         
            <v-col cols="12" md="4" class="" >
              <div >
               <div class="d-flex justify-left"><h2>Pubs</h2></div>
                 <v-btn class="mx-3" color="green" :disabled="!client.connected" @click="doPublish" dark>Publish</v-btn>
                
               </div>
            </v-col>
       
          </v-row>
       
        </v-card-text>
    </v-card>
    <v-card class="my-5" elevation="4">
      <v-card-title>Message recive</v-card-title>
        <v-card-text>
          <v-textarea
            name="input-7-1"
            label="Default style"
            v-model="receiveNews"
            type="textarea"
          ></v-textarea>
        </v-card-text>
    </v-card>
    <!-- <v-card>
      <v-card-title>Peso</v-card-title>
      <v-card-text>
        <div style="font-size:80px">
          {{receiveNews}} .Kg
        </div>
       
      </v-card-text>
      <div style="margin-top:50px">
              <apexchart  type="line" :options="options" :series="series"></apexchart>
            </div>
    </v-card> -->
    </v-container>
  </v-app>
</template>
<script>


import mqtt from 'mqtt';

 const gradients = [
    ['#222'],
    ['#42b3f4'],
    ['red', 'orange', 'yellow'],
    ['purple', 'violet'],
    ['#00c6ff', '#F0F', '#FF0'],
    ['#f72047', '#ffd200', '#1feaea'],
  ]
export default {
  name: 'Dashboard',
  data(){
    return{
      options: {
        chart: {
          id: 'vuechart-example',
          zoom:{
          enable:false
        },
        },
        theme:{
          mode:'dark'
        },
        
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
        }
      },
      series: [{
        name: 'series-1',
       data: [30, 40, 45, 50, 49, 60, 70, 81]
      },
    
    ],
         fill: true,
      selectedGradient: gradients[4],
      gradients,
      padding: 8,
      radius: 10,
      value: [],
      width: 2,
      connection: {
        host: '87.88.86.193',
        port: 8083,
        endpoint: '/mqtt',
        clean: true, // Reserved session
        connectTimeout: 5000, // Time out
        reconnectPeriod: 5000, // Reconnection interval
        // Certification Information
        clientId: 'mqttjs_3be2c321',
        username: 'emqx_test',
        password: 'emqx_test',
      },
      subscription: {
        topic: 'topic/mqttx',
        qos: 0,
      },
      publish: {
        topic: 'topic/browser',
        qos: 0,
        payload: '{ "msg": "Hello, I am browser." }',
      },
      receiveNews: '',
      qosList: [
        0,1,2
      ],
      client: {
        connected: false,
      },
      subscribeSuccess: false,
    }
    },
    methods:{
        updateChart(data) {
          console.log(data);
         
          this.series = [{
            data: data
          }]
     },
          createConnection() {
  
      const { host, port, endpoint, ...options } = this.connection
      const connectUrl = `ws://${host}:${port}${endpoint}`
      try {
        this.client = mqtt.connect(connectUrl, options)
      } catch (error) {
        console.log('mqtt.connect error', error)
      }
      this.client.on('connect', () => {
        console.log('Connection succeeded!')
      })
      this.client.on('error', error => {
        console.log('Connection failed', error)
      })
      this.client.on('message', (topic, message) => {
        this.receiveNews='';
        this.receiveNews = this.receiveNews.concat(message);
        this.value.push(parseInt(this.receiveNews ));
      
       this.updateChart(this.value);
       // console.log(`Received message ${message} from topic ${topic}`)
      })
    },
     doSubscribe() {
      const { topic, qos } = this.subscription
      this.client.subscribe(topic, { qos }, (error, res) => {
        if (error) {
          console.log('Subscribe to topics error', error)
          return
        }
        this.subscribeSuccess = true
        console.log('Subscribe to topics res', res)
      })
    },
    
    doUnSubscribe() {
      const { topic } = this.subscription
      this.client.unsubscribe(topic, error => {
        if (error) {
          console.log('Unsubscribe error', error)
        }
      })
    },
    
    doPublish() {
      
      //this.publish.qos='1';
      const { topic, qos, payload } = this.publish
      //console.log(this.publish);
      this.client.publish(topic, payload, qos, error => {
        if (error) {
          console.log('Publish error', error)
        }
      })
    },
    
    destroyConnection() {
      if (this.client.connected) {
        try {
          this.client.end()
          this.client = {
            connected: false,
          }
          console.log('Successfully disconnected!')
        } catch (error) {
          console.log('Disconnect failed')
        }
      }
    }
    }
  
}
</script>

