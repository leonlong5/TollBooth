import React, { Component } from 'react';
import Channel from './Channel';
import FMDSLog from './FMDSLog';
import Log from './Log';

class App extends Component {

  render() {

    return (
      <div className='App'>
        <div className='ui container'>

          <h1>Channel</h1>
          <Channel />
          <h1>FMDS Log</h1>
          <FMDSLog />
          <h1>TollBooth TCP flow</h1>
          <Log />
        </div>
      </div>
    );
  }
}

export default App;
