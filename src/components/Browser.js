import React, { Component } from 'react';
import { object } from 'prop-types';
import Web3 from 'web3';
import KittyCoreABI from '../contracts/KittyCoreABI.json';
import { CONTRACT_NAME, CONTRACT_ADDRESS } from '../config';
import KittyInfo from './KittyInfo';

class Browser extends Component {

  //TODO: add labels, update css (display block, font-weight bold, add name on input for both labels and the test so it won't rely on placeholder)
  constructor(props, context) {
    super(props);
    this.state = {kittyId: '', genes: '', generation: '', birthTime: '', displayInfo: false};
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

    this.props.drizzle.addContract({
      contractName: CONTRACT_NAME,
      web3Contract: kittyContract,
    });

    var me = this;
    fetch("https://api.cryptokitties.co/kitties?orderBy=kitties.id&orderDirection=desc&limit=1")
      .then(response => response.json())
      .then(data => {
        if(!this.kittyLimit)
        {
          //TODO
        }
        me.kittyLimit = data.kitties[0].id
      });
  }

  async updateWithKittyData() {
    var id = this.state.kittyId;
    if(isNaN(id) || parseInt(id) < 0 || parseInt(id) > this.kittyLimit)
    {
      //TODO: display err msg
      //Wrong input. If your kitty was recently created, consider refreshing the page.
      return;
    }
    var kittyContract = this.props.drizzle.contractList[0];
    var kitty = await kittyContract.methods.getKitty(id).call();
    //TODO: convert from epoch to desired date format
    if (kitty) {
      this.setState({kittyId: id, genes: kitty.genes, generation: kitty.generation, birthTime: kitty.birthTime, displayInfo: true});
    } else {
      //TODO: display err msg 
    }
  }

  async updateWithRandomKittyData() {
    var randomId = Math.floor(Math.random() * (this.kittyLimit + 1));
    var kittyContract = this.props.drizzle.contractList[0];
    var kitty = await kittyContract.methods.getKitty(randomId).call();
    //TODO: convert from epoch to desired date format
    if (kitty) {
      this.setState({kittyId: randomId, genes: kitty.genes, generation: kitty.generation, birthTime: kitty.birthTime, displayInfo: true});
    } else {
      //TODO: display err msg 
    }
  }

  update() {
    return (e) => {
      this.setState({kittyId: e.target.value, genes: '', generation: '', birthTime: '', displayInfo: false});
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
            <input type="text" value= {this.state.kittyId} onChange={this.update()} placeholder="123123" />
          </div>
          <button type="button" className="ui grey button" onClick={this.updateWithKittyData}>FIND KITTY</button>
          <button type="button" className="ui purple button" onClick={this.updateWithRandomKittyData}>Fetch random Kitty</button>
        </div>

        <KittyInfo genes={this.state.genes} 
                   generation={this.state.generation} 
                   birthTime={this.state.birthTime} 
                   kittyId={this.state.kittyId}
                   displayInfo={this.state.displayInfo} />
      </div>
    );
  }
}

export default Browser;
