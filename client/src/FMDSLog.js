
import React from 'react';
import './log.css'
class FMDSLog extends React.Component {
  state = {
    logData: []
  };

  handleWS() {
    var ws = new WebSocket('ws://localhost:2223/');

    var that = this;
    ws.onmessage = function(event) {
      var str = JSON.stringify(JSON.parse(event.data), null, 2);
      //console.log(that.output(str));
      that.setState({
        logData: that.state.logData.concat(str)
      });
    };
  }
  componentWillMount() {
    this.handleWS();
  }



  render() {
    return (

          <div className="FMDSlog-data">

              <div className="ui message FMDSLog">

              {
                this.state.logData.map(function(item, i){
                    return <pre className="singleLog" key={i}><i className="cubes icon"></i>{item}</pre>
                })
              }
              </div>
          </div>
    );
  }
}

export default FMDSLog;
