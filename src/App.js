import React, { Component } from 'react';
import Websocket from 'react-websocket';
import logo from './logo.svg';
import './App.css';

class App extends Component {

	constructor() {
		super();

		this.state = {
			stream: false,
			videoName: "",
			path: null
		}

		this.handleData = this.handleData.bind(this);
		this.renderPhoto = this.renderPhoto.bind(this);

	}

	componentDidMount() {


	}


	startStream() {
		// console.log("Start stream");

		this.setState({
			stream: true
		}, () => this.stream());



	}

	stopStream() {
		// console.log("Stop stream");
		this.setState({
			stream: false
		})
	}

	handleData(data) {
		console.log(JSON.parse(data));
		let result = JSON.parse(data);
		this.setState({ path: result.path });
		console.log(this.state);
	}

	renderPhoto() {
		return this.state.path.map(img => { console.log(img); return (<li><img src={`http://127.0.0.1:1337/uploads/screens?${img}`} /></li>) });
	}




	render() {
		return (
			<div className="App">
				<div className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h2>Stream partial movie over HTTP.</h2>
				</div>
				<div className="App-intro">

				</div>
				<div className="App-list">
					<div>
						<Websocket url='ws://127.0.0.1:1337'
							onMessage={this.handleData.bind(this)} />
					</div>
					<div>
						{this.state.path &&
							<ul>
								{this.renderPhoto()}
							</ul>
						}

					</div>
				</div>
			</div>
		);
	}
}

export default App;
