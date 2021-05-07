import React, { Component } from 'react';
import { CONTRACT_ADDRESS } from '../config';

class KittyInfo extends Component {
  render() {
		var kittyImgEl = "";
		if(this.props.kittyId || this.props.kittyId === 0)
		{
			let src = `https://img.cryptokitties.co/${CONTRACT_ADDRESS}/${this.props.kittyId}.png`;
			let height = "300px";
			let width = "300px";
			kittyImgEl = ( <img src={src} height={height} width={width} /> );
		}

    return (
			<div>
				<div>
					<div><strong>Genes</strong></div>
					<p>{this.props.genes}</p>
				</div>

				<div>
					<div><strong>Generation</strong></div>
					<p>{this.props.generation}</p>
				</div>

				<div>
					<div><strong>Birth Time</strong></div>
					<p>{this.props.birthTime}</p>
				</div>
				{kittyImgEl}
			</div>
    )
  }
}

export default KittyInfo;