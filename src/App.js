import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

	constructor() {
		super();

		this.state = {
			stream: false,
			videoName: ""
		}

		this.canvas = document.createElement('canvas');
		this.canvas.width = 640;
		this.canvas.height = 480;
		this.ctx = this.canvas.getContext('2d');


	}

	componentDidMount() {

		this.video = this.refs.video;
		this.video.setAttribute('data-dashjs-player', '');
		this.video.setAttribute('cors', '');

		// if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		// 	navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
		// 		this.video.src = window.URL.createObjectURL(stream);
		// 		this.video.play();
		// 	})
		// }

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

	setMovie(e) {
		switch (e) {
			case 1:
				this.setState({
					videoName: 1
				});
				break;
			case 2:
				this.setState({
					videoName: 2
				});
				break;
			case 3:
				this.setState({
					videoName: 3
				});
				break;
			case 4:
				this.setState({
					videoName: 4
				});
				break;

			default:
				break;
		}
	}


	stream() {

		if (this.state.stream === true) {

			this.ctx.drawImage(this.video, 0, 0, 640, 480);
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
					<h2>Stream partial movie over HTTP.</h2>
				</div>
				<div className="App-intro">
					<video ref="video" src={`http://127.0.0.1:1337/?movie=${this.state.videoName}`} width="640" height="480" autoPlay controls></video>

					<button onClick={() => this.startStream()}>Strem video</button>
					<button onClick={() => this.stopStream()}>Stop stream</button>
					<button onClick={() => this.closeCamera()}>Close camera</button>
				</div>
				<div className="App-list">
					<ul>
						<li><button onClick={() => this.setMovie(1)}>First Movie</button></li>
						<li><button onClick={() => this.setMovie(2)}>Second Movie</button></li>
						<li><button onClick={() => this.setMovie(3)}>Third Movie</button></li>
						<li><button onClick={() => this.setMovie(4)}>Fth MPD</button></li>
					</ul>
				</div>
			</div>
		);
	}
}

export default App;
