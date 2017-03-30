const express = require('express');
const fs = require('fs');
const app = express();
const request = require("request");


// initiate websocket
const wss = require('./server/websocket.js');
var CLIENTS=[];
//listening websocket connection, excuted once connection established
wss.on('connection', function (ws) {
    console.log(`[SERVER] connection()`);
    CLIENTS.push(ws);
    ws.send(FMDSLog, (err) => {
        if (err) {
            console.log(`[SERVER] error: ${err}`);
        }
    });
});



//setup server environment
app.set('port', (process.env.PORT || 3001));
// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}
var data, sessiontoken, bearertoken, subscribeRes, FMDSLog;



//const data = require('./server/channelAPI.js');
const initiateChannelAPI = () => {
  request.post({
    url: 'http://fabricdemo.xidio.com/fmds/api/watchable/web/authenticate',
    headers: {
      'Connection':'close',
      'Accept':'application/json',
      'Content-Type':'text/plain'
    },
    body: '9a5901f0-63f9-4938-87cc-7a9b733788c1_3a5a0a7f-3e23-4fb2-9e16-4df426cf2190'
  },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }else{
          sessiontoken = response.headers.sessiontoken.toString();
          //CLIENTS[0].send({'test':'test'});
          //get the channel metadata
          request({
            url: 'http://fabricdemo.xidio.com/fmds/api/watchable/web/channels/13216',
            headers: {
              'Connection':'close',
              'Accept':'application/json',
              'SessionToken' :sessiontoken }
          }, function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
               data = JSON.parse(body);
               FMDSLog = (JSON.stringify(response));
              //      wsInstance.send("response", (err) => {
              //          if (err) {
              //              console.log(`[SERVER] error: ${err}`);
              //          }
              //  });
               //console.log("data: " + data);
            }else{
              //console.log("Channel metadata error: "+ response.statusCode);
              //console.log(JSON.stringify(response.headers));
              data = response;
              FMDSLog = (JSON.stringify(response));
            }
          });

          //authenticate api, GET bearertoken
          request.post({
              //url: 'http://fabricdemo.xidio.com/fmds/api/watchable/web/users/authenticate',
              url: 'http://fabricdemo.xidio.com/fmds/api/watchable/stb/users/auto/login/3621c96bcdc8fc8e8a121ae6e537a495e6acf8b5a043648d8e1ca317a6ca92b0',
              headers: {
                'Connection':'close',
                'Content-Type': 'text/plain,application/json',
                'Accept':'application/json',
                'SessionToken' :sessiontoken
              },
              body: '{\"username\":\"test-user-without-access-001002\",\"password\":\"1234\", \"rememberMe\":\"true\"}'
            }, function(error, response, body) {
              if (!error && response.statusCode == 200) {
                  bearertoken = response.headers.authorization;
                 //console.log("authenticate: success " + JSON.stringify(response.headers));
              }else{
                console.log("error: "+ response.statusCode);
                console.log(JSON.stringify(response.headers));
              }
          });

        }
    }
  )
}
initiateChannelAPI();


const subscribeAPI = () =>{
  request.post({
    url: 'http://fabricdemo.xidio.com/fmds/api/watchable/stb/users/channels/13216/subscription',
    headers: {
      'Authorization': bearertoken,
      'Content-Type': 'text/plain,application/json',
      'Accept': 'vnd.fmds.v4' ,
      'SessionToken' :sessiontoken
    }
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
         subscribeRes = response;
         CLIENTS[0].send(JSON.stringify(response));
         //console.log("subscribe api: success " + JSON.stringify(response));
    }else{
      //console.log("subscribe api error: "+ response.statusCode);

      CLIENTS[0].send(JSON.stringify(response));
      //console.log(JSON.stringify(response));
    }
  });

  request.get({
    url: "http://fabricdemo.xidio.com/fmds/uapi/watchable/stb/users/channels/13216/subscription",
    headers: {
      "SessionToken": sessiontoken,
      "Authorization": bearertoken
    }
    }, function(error, response, body) {
      if(!error && response.statusCode == 200) {
          CLIENTS[0].send(JSON.stringify(response));
      }else {
          CLIENTS[0].send(JSON.stringify(response));
      }
  })
}

app.get('/channel', (req, res) => {
    //console.log("sessiontoken: " + sessiontoken);
    //console.log("bearetoken: " + bearertoken);
    res.json(data);
});

app.get('/subscribe', (req, res) => {
  //console.log(req.headers);

  subscribeAPI();
  function checkRes(){
    if(subscribeRes === undefined){
      setTimeout(function(){
        //console.log("subscribeRes:     "+subscribeRes);
        checkRes();
      }, 400);
    }else{
      res.json(subscribeRes);
    }
  }
  checkRes();


});


app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
