import React, { Component } from 'react';
import { object } from 'prop-types';
import Web3 from 'web3';
import KittyCoreABI from '../contracts/KittyCoreABI.json';
import { CONTRACT_NAME, CONTRACT_ADDRESS } from '../config';
import KittyInfo from './KittyInfo';

class Browser extends Component {

  constructor() {
    super();
    this.state = {id: '', genes: '', generation: '', birthTime: ''};
    this.updateWithKittyData = this.updateWithKittyData.bind(this);
    this.updateWithRandomKittyData = this.updateWithRandomKittyData.bind(this);
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

    var me = this;
    fetch("https://api.cryptokitties.co/kitties?orderBy=kitties.id&orderDirection=desc&limit=1")
      .then(response => response.json())
      .then(data => me.kittyLimit = data.kitties[0].id);

    if(!this.kittyLimit)
    {
      //TODO
    }
  }

  async updateWithKittyData() {
    var id = this.state.id;
    if(isNaN(id) || parseInt(id) < 0 || parseInt(id) > this.kittyLimit)
    {
      //TODO: display err msg
      //Wrong input. If your kitty was recently created, consider refreshing the page.
      return;
    }
    var kittyContract = this.context.drizzle.contractList[0];
    var kitty = await kittyContract.methods.getKitty(id).call();
    //TODO: convert from epoch to desired date format
    if (kitty) {
      this.setState({id: id, genes: kitty.genes, generation: kitty.generation, birthTime: kitty.birthTime});
    } else {
      //TODO: display err msg 
    }
  }

  async updateWithRandomKittyData() {
    var randomId = Math.floor(Math.random() * (this.kittyLimit + 1));
    var kittyContract = this.context.drizzle.contractList[0];
    var kitty = await kittyContract.methods.getKitty(randomId).call();
    //TODO: convert from epoch to desired date format
    if (kitty) {
      this.setState({id: randomId, genes: kitty.genes, generation: kitty.generation, birthTime: kitty.birthTime});
    } else {
      //TODO: display err msg 
    }
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
          <button type="button" className="ui purple button" onClick={this.updateWithRandomKittyData}>Fetch random Kitty</button>
        </div>

        <KittyInfo genes={this.state.genes} generation={this.state.generation} birthTime={this.state.birthTime}></KittyInfo>
      </div>
    );
  }
}

Browser.contextTypes = {
  drizzle: object,
};

export default Browser;
