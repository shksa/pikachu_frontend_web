import React, { Component } from 'react'
import './VideoRecognition.css'

class VideoRecognition extends Component {
  constructor(props) {
    super(props)
    this.state = { streaming: false }
    this.videoElem = null
    this.videoStream = null
  }

  startOrStopRecord = () => {
    if (!this.state.streaming) {
      const resolution = { width: { exact: 300 }, height: { exact: 300 } }
      this.startCamera(resolution)
    } else {
      this.stopCamera()
      this.onVideoStopped()
    }
  }

  startCamera = (resolution) => {
    const videoConstraints = { video: resolution, audio: false }
    navigator.mediaDevices.getUserMedia(videoConstraints)
      .then((mediaStream) => {
        this.videoElem.srcObject = mediaStream
        this.videoElem.onloadedmetadata = (e) => {
          this.videoElem.play()
        }
        this.videoStream = mediaStream
      })
      .catch((err) => { console.log(`${err.name}: ${err.message}`); })
  }

  stopCamera = () => {
    this.videoElem.pause()
    this.videoElem.srcObject = null
    this.videoStream.getVideoTracks()[0].stop()
  }

  onVideoStarted = () => {
    console.log('in onVideoStarted')
    this.setState({ streaming: true })
  }

  onVideoStopped = () => {
    console.log('in onVideoStopped')
    this.setState({ streaming: false })
  }

  setVideoEleRef = (videoElem) => {
    this.videoElem = videoElem
  }

  render() {
    return (
      <div className="App-body-video-capture" >
        <button className="capture-video-button" onClick={this.startOrStopRecord}>
          {this.state.streaming ? 'Stop capture' : 'Start capture'}
        </button>
        <video
          className="video-holder"
          ref={this.setVideoEleRef}
          onCanPlay={this.onVideoStarted}
        />
      </div>
    )
  }
}

export default VideoRecognition
