
import React from 'react';
import './log.css'
class Log extends React.Component {
  state = {
    data: []
  };

  componentWillMount() {
    this.handleFetchMetadata();
  }


  handleFetchMetadata = () => {
      var ws = new WebSocket('ws://localhost:2222/');
      var that = this;
      ws.onmessage = function(event) {
        //console.log( event.data);
        that.setState({
          data: that.state.data.concat(event.data)
        });
      };

  };


  render() {
    return (
      <div className="log-data">

          <div className="ui message">

          {
            this.state.data.map(function(item, i){
                return <div className="singleLog" key={i}><i className="right triangle icon"></i>{item}</div>
            })
          }
          </div>
      </div>
    );
  }
}

export default Log;
