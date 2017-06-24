import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Stream extends Component {

	constructor() {
		super();

		this.state = {
			stream: false,
		}

		this.canvas = document.createElement('canvas');
		this.canvas.width = 640;
		this.canvas.height = 480;
		this.ctx = this.canvas.getContext('2d');


	}

	componentDidMount() {

		this.video = this.refs.video;

		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
				this.video.src = window.URL.createObjectURL(stream);	// co to jest ten stream (co przekazuje kamera do js'a)
				this.video.play();										// jaki format, czy zakodowany, czy mozna go zakodować
			})
		}

		// fetch('http://127.0.0.1:1337/', {
		// 	mode: 'no-cors',
		// 	headers: {
		// 		'Content-length': 100000,
		// 		'Content-type':'video/mp4'
		// 	}
		// })
		// .then((response)=>{
		// 	console.log('Fetch respo ',  response);
		// 	return response.blob();
		// })
		// .then((response)=>{
		// 	console.log(response);
		// })
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


	stream() {

		if (this.state.stream === true) {

			this.ctx.drawImage(this.video, 300, 300, 0, 0, 640, 480);
			this.canvas.toDataURL();

			console.log("Stream");
			setTimeout(() => this.stream());
		}
	}


	render() {
		return (
			<div className="App">
				<div className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h2>Capture video.</h2>
				</div>
				<div className="App-intro">
					<div className="App-camera-live">
						<video ref="video" width="640" height="480" autoPlay></video>

						<div className="mask">
							<div className="mask-rect-big"></div>
							<div className="mask-rect-small"></div>
						</div>
						<button onClick={() => this.startStream()}>Strem video</button>
						<button onClick={() => this.stopStream()}>Stop stream</button>
						{/*<button onClick={() => this.closeCamera()}>Close camera</	button>*/}
					</div>
					<div className="App-camera-tutorial">
						<video src="./tutorial.mp4" width="320" height="240" autoPlay loop></video>
						<div className="mask">
							<div className="mask-rect-big"></div>
							<div className="mask-rect-small"></div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Stream;
