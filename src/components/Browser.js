import React, { Component } from 'react';
import { object } from 'prop-types';
import Web3 from 'web3';
import KittyCoreABI from '../contracts/KittyCoreABI.json';
import { CONTRACT_NAME, CONTRACT_ADDRESS } from '../config';

class Browser extends Component {

  //TODO: make kitty react component

  constructor() {
    super();
    this.state = {id: '', genes: '', generation: '', birthTime: ''};
    this.updateWithKittyData = this.updateWithKittyData.bind(this);
  }

  componentDidMount() {
    const web3 = new Web3(window.web3.currentProvider);

    //Initialize the contract instance

    const kittyContract = new web3.eth.Contract(
      KittyCoreABI,
      CONTRACT_ADDRESS,
    );

    //Add the contract to the drizzle store

    this.context.drizzle.addContract({
      contractName: CONTRACT_NAME,
      web3Contract: kittyContract,
    });

    kittyContract.methods.totalSupply().call().then((totalSupply) => { this.totalKittySupply = totalSupply; });
  }

  async updateWithKittyData() {
    var id = this.state.id;
    if(isNaN(id) || parseInt(id) < 0 || parseInt(id) > this.totalKittySupply)
    {
      //TODO: display err msg
      return;
    }
    var kittyContract = this.context.drizzle.contractList[0];
    var kitty = await kittyContract.methods.getKitty(id).call();
    //TODO: convert from epoch to desired date format
    this.setState({id: id, genes: kitty.genes, generation: kitty.generation, birthTime: kitty.birthTime});
  }

  update() {
    return (e) => {
      this.setState({id: e.target.value, genes: '', generation: '', birthTime: ''});
    };
  }

  render() {
    return (
      <div className="browser">
        <h1>
          Kitty Browser
        </h1>
        <div>
          <div><strong>Kitty ID:</strong></div>
          <div className="ui input">
            <input type="text" value= {this.state.id} onChange={this.update()} />
          </div>
          <button type="button" className="ui grey button" onClick={this.updateWithKittyData}>FIND KITTY</button>
        </div>

        <div>
          <div><strong>Genes</strong></div>
          <p>{this.state.genes}</p>
        </div>

        <div>
          <div><strong>Generation</strong></div>
          <p>{this.state.generation}</p>
        </div>

        <div>
          <div><strong>Birth Time</strong></div>
          <p>{this.state.birthTime}</p>
        </div>
      </div>
    );
  }
}

Browser.contextTypes = {
  drizzle: object,
};

export default Browser;
