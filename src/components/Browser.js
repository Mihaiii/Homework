import React, { Component } from 'react';
import { object } from 'prop-types';
import Web3 from 'web3';
import KittyCoreABI from '../contracts/KittyCoreABI.json';
import { CONTRACT_NAME, CONTRACT_ADDRESS } from '../config';
import KittyInfo from './KittyInfo';
import './Browser.css';

class Browser extends Component {

  constructor(props, context) {
    super(props);
    this.state = {kittyId: '', genes: '', generation: '', birthTime: '', displayInfo: false, errMsg: ""};
    this.updateWithKittyData = this.updateWithKittyData.bind(this);
    this.updateWithRandomKittyData = this.updateWithRandomKittyData.bind(this);
    this.update = this.update.bind(this);
    this.setErrMsg = this.setErrMsg.bind(this);
    this.kittyLimit;
  }

  componentDidMount() {
    if(this.props.drizzle.contractList[0] && this.props.drizzle.contractList[0].contractName == CONTRACT_NAME) {
      return;
    }

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
        if(data?.kitties?.length && data.kitties[0])
        {
          me.kittyLimit = data.kitties[0].id;
        } else {
          this.setErrMsg("Can't fetch kitty limit.").show();
        }
      });
  }

  async updateWithKittyData() {
    if(typeof(this.kittyLimit) === 'undefined' || this.state.errMsg) return;
    var id = parseInt(this.state.kittyId);
    if(isNaN(id) || id < 0 || id > this.kittyLimit || id != this.state.kittyId)
    {
      this.setErrMsg("Wrong input. If your kitty was recently created, consider refreshing the page.").show();
      return;
    }
    await this.update(id);
  }

  async updateWithRandomKittyData() {
    if(typeof(this.kittyLimit) === 'undefined' || this.state.errMsg) return;
    var randomId = Math.floor(Math.random() * (this.kittyLimit + 1));
    await this.update(randomId);
  }

  inputUpdate() {
    return (e) => {
      this.setState({kittyId: e.target.value, genes: '', generation: '', birthTime: '', displayInfo: false, errMsg: ""});
    };
  }

  async update(id) {
    var kittyContract = this.props.drizzle.contractList[0];
    var kitty = await kittyContract.methods.getKitty(id).call();
    if (kitty) {
      this.setState({kittyId: id, genes: kitty.genes, generation: kitty.generation, birthTime: kitty.birthTime, displayInfo: true, errMsg: ""});
    } else {
      this.setErrMsg("Can't get kitty info.").show(); 
    }
  }

  setErrMsg(errMsg) {
    return {
      show: () => {
        this.setState({ errMsg: errMsg });
      }
    };
  }

  render() {
    let errMsgElemenet = (<div></div>);
    if(this.state.errMsg) {
      errMsgElemenet = (<div className="ui negative message">
                          <i className="close icon" onClick={this.setErrMsg("").show}></i>
                          <p>{this.state.errMsg}</p>
                        </div>);
    }
    return (
      <div className="browser">
        <h1>
          Kitty Browser
        </h1>
        <div className="ui labeled input action">
          <label className="ui label" htmlFor="kittyId" >
            Kitty ID:
          </label>
          <input type="text" value= {this.state.kittyId} onChange={this.inputUpdate()} id="kittyId" />
          <button type="button" className={`ui grey button ${this.state.errMsg ? "disabled" : ""}`} onClick={this.updateWithKittyData}>FIND KITTY</button>
          <button type="button" className={`ui olive button ${this.state.errMsg ? "disabled" : ""}`} onClick={this.updateWithRandomKittyData}>Fetch random Kitty</button>
        </div>
        {errMsgElemenet}
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
