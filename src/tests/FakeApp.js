import React, { Component } from 'react';
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";
import FakeBrowser from './FakeBrowser';
import App from '../App';

class FakeApp extends App {

  render() {
    const drizzleOptions = {
      contracts: []
    };
    const drizzle = new Drizzle(drizzleOptions);
    return (
      <DrizzleContext.Provider drizzle={drizzle}>
        <DrizzleContext.Consumer>
          {drizzleContext => {

            const {drizzle, initialized} = drizzleContext;
            // console.log("dddadapp");
            // if(!initialized) {
            //   return(
            //     // Display a loading indicator.
            //     <div className="loading">
            //       <h1>Loading dapp...</h1>
            //       <img src="https://www.cryptokitties.co/images/loader.gif" width="120" alt="loading" />
            //     </div>
            //   );
            // }

            return (
              <FakeBrowser drizzle={drizzle} contractAddress={this.props.contractAddress} kittyLimit={this.props.kittyLimit}/>
            )
          }}
        </DrizzleContext.Consumer>
      </DrizzleContext.Provider>
    );
  }
}

export default FakeApp;
