import React, { Component } from 'react';
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";
//import Loading from './containers/Loading';
import Browser from './components/Browser';
import './App.css';

class App extends Component {
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

            if (window.web3 === undefined) {
              return(
                // Display a web3 warning.
                <div className="warning">
                  <p>This browser has no connection to the Ethereum network. </p>
                  <p>Please use the Chrome/FireFox extension MetaMask, or dedicated Ethereum browsers Mist or Parity.</p>
                </div>
              );
            }

            if(!initialized) {
              return(
                // Display a loading indicator.
                <div className="loading">
                  <h1>Loading dapp...</h1>
                  <img src="https://www.cryptokitties.co/images/loader.gif" width="120" alt="loading" />
                </div>
              );
            }

            return (
              <Browser drizzle={drizzle}/>
              )
            }}
        </DrizzleContext.Consumer>
      </DrizzleContext.Provider>
    );
  }
}

export default App;
