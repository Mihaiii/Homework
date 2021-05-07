import React, { Component } from 'react';

class KittyInfo extends Component {
  render() {
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
			</div>
    )
  }
}

export default KittyInfo;