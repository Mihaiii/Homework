import React, { Component } from 'react';
import { CONTRACT_ADDRESS } from '../config';

class KittyInfo extends Component {
  render() {
		var kittyImgEl = "";
		if(this.props.displayInfo) {
			let src = `https://img.cryptokitties.co/${CONTRACT_ADDRESS}/${this.props.kittyId}.png`;
			let height = "300px";
			let width = "300px";
			kittyImgEl = ( <img src={src} height={height} width={width} /> );
			var d = new Date(0);
			d.setUTCSeconds(this.props.birthTime);
			let birthDate = d.toLocaleDateString("ro-Ro");
	    return (
	    	<div className="ui list">
				  <div className="item">
				    Genes: {this.props.genes}
				  </div>
				  <div className="item">
				    Generation: {this.props.generation}
				  </div>
				  <div className="item">
				    Birth Time: {birthDate}
				  </div>
				  <div className="item">
				    {kittyImgEl}
				  </div>
				</div>
    	)
  	}
  	return (<div></div>)
  }
}

export default KittyInfo;