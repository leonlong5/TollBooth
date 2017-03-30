
const request = require("request");
var data, sessiontoken, bearertoken, FMDSLog;

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
              url: 'http://fabricdemo.xidio.com/fmds/api/watchable/stb/users/auto/login/a50c42f1556c350e4e62dd182ba6ce5bc5e411dacb2bea0afb5bb60a52e8a014',
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
  );
module.exports = [data, sessiontoken, bearertoken, FMDSLog];
