import Browser from '../components/Browser';
import { CONTRACT_NAME, CONTRACT_ADDRESS, BYTECODE } from '../config';
import KittyCoreABI from '../contracts/KittyCoreABI.json';
import React, { Component } from 'react';
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";

class FakeBrowser extends Browser {
  async componentDidMount() {
    var x = 0;
    while (!this.props.drizzle.store.getState() && x < 10) {
      const delay = new Promise(resolve => setTimeout(resolve, 500));
      await delay;
      x++;
    }

    const kittyContract = new web3.eth.Contract(
      KittyCoreABI,
      this.props.contractAddress,
    );

    //Add the contract to the drizzle store

    this.props.drizzle.addContract({
      contractName: CONTRACT_NAME,
      web3Contract: kittyContract,
    });

    this.kittyLimit = parseInt(this.props.kittyLimit);
  }
}

export default FakeBrowser;