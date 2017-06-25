import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Stream extends Component {

	constructor() {
		super();

		this.state = {
			stream: false,
			chunks: []
		}

		this.canvas = document.createElement('canvas');
		this.canvas.width = 640;
		this.canvas.height = 480;
		this.ctx = this.canvas.getContext('2d');

		this.recordedChunks = [];
		this.mediaRecorder = null;

		this.handleDataAvailable = this.handleDataAvailable.bind(this);
		this.startStream = this.startStream.bind(this);
		this.stopStream = this.stopStream.bind(this);
		this.stream = this.stream.bind(this);
		this.playRecorded = this.playRecorded.bind(this);
		this.uploadVideo = this.uploadVideo.bind(this);
	}

	componentDidMount() {

		this.video = this.refs.video;

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

	uploadVideo() {
		let type = 'video/webm';

		let chunks = this.state.chunks;

		let uploadBody = new Blob(chunks, { type });

		let file = new File(this.state.chunks, "sample.webm", {
			type: 'video/webm'
		});

		let request = new XMLHttpRequest();
		request.open('POST', 'http://127.0.0.1:1337/upload');

		let formData = new FormData();
		formData.append('file', file);

		request.send(formData);


		// TO DO Make same think as upper!

		// fetch('http://127.0.0.1:1337/upload', {
		// 	method: 'POST',
		// 	headers: { 'Content-Type': 'multipart/form-data' },
		// 	body: file // my blob
		// }).then(
		// 	response => response.json()
		// 	).then(
		// 	success => console.log(success)
		// 	).catch(
		// 	error => console.log(error) // Handle the error response object
		// 	);
	}


	handleDataAvailable(event) {
		if (event.data.size > 0) {

			let chunk = this.state.chunks;

			chunk.push(event.data);

			this.setState({
				chunks: chunk
			})

			console.log("Chunks", this.state.chunks);
			this.playRecorded();

		}
	}

	startStream() {
		// console.log("Start stream");

		this.setState({
			stream: true
		}, () => this.stream());



	}

	stopStream() {
		this.mediaRecorder.stop();
	}

	playRecorded() {
		let superBuffer = new Blob(this.state.chunks, { type: 'video/webm' });

		// var url = URL.createObjectURL(superBuffer);
		// var a = document.createElement('a');
		// document.body.appendChild(a);
		// a.style = 'display: none';
		// a.href = url;
		// a.download = 'test.webm';
		// a.click();
		// window.URL.revokeObjectURL(url);

		this.video.src = window.URL.createObjectURL(superBuffer);
	}

	stream() {

		if (this.state.stream === true) {
			if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
				navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
					this.video.src = window.URL.createObjectURL(stream);	// co to jest ten stream (co przekazuje kamera do js'a)
					this.video.play();										// jaki format, czy zakodowany, czy mozna go zakodować

					let options;

					if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
						options = { mimeType: 'video/webm; codecs=vp9' };
					} else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
						options = { mimeType: 'video/webm; codecs=vp8' };
					}

					let mediaRecorder = new MediaRecorder(stream, options);
					this.mediaRecorder = mediaRecorder;
					this.mediaRecorder.ondataavailable = this.handleDataAvailable;
					this.mediaRecorder.start();

					console.log("Status mediaRecorder: ", this.mediaRecorder);
				})


			}
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
						<button onClick={this.uploadVideo}>Upload stream</button>
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
