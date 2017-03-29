
import React from 'react';

class Channel extends React.Component {
  state = {
    channels: {},
    links: {},
    subscribe: {},
    subscribed: false
  };

  componentWillMount() {
    this.handleFetchMetadata();
  }


  handleFetchMetadata = () => {
    fetch(`channel`, {
        accept: 'application/json',
      }).then((response) => response.json())
      .then((responseJson) => {
            this.setState({
              channels: responseJson,
              links: responseJson.links
            });
      })

  };

  handleSubscribe = () => {
    //this.setState({subscribed: !this.state.subscribed});

    fetch('subscribe',{
    }).then((response) => response.json())
    .then((responseJson) => {

        if(responseJson.statusCode===200){
            this.setState({
              subscribe: responseJson,
              subscribed: true
            });
        }
    })
  };


  render() {
    var text = this.state.subscribed ? 'UnSubscribe' : 'Subscribe';
    return (
      <div className="Channel-metadata">
        <div>ID: {this.state.channels.id}</div>
        <div>{this.state.logData}</div>
        <div className="channel-img"><img alt='Logo' src={this.state.links['logo-image']} /></div>
        <div className="channel-title"><i className="television icon"></i>{this.state.channels.title}</div>
        <div className="channel-description">{this.state.channels.description}</div>
        <p>Number of videos: {this.state.channels.numOfVideos}</p>
        <div><button className="ui primary basic button" onClick={this.handleSubscribe}>{text}</button></div>
      </div>
    );
  }
}

export default Channel;
