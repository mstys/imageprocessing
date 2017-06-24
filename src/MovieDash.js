import React, { Component } from 'react';
import 'dashjs';

class MovieDash extends Component {

    componentDidMount() {

        this.video = this.refs.video;
        this.video.setAttribute('data-dashjs-player', '');
        this.video.setAttribute('cors', '');
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h2>MPEG-DASH Example</h2>
                </div>
                <video ref="video" src="http://dash.edgesuite.net/envivio/EnvivioDash3/manifest.mpd" width="640" height="480" autoPlay controls></video>
            </div>
        )
    }
}

export default MovieDash;