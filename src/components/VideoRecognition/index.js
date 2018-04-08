import React, { Component } from 'react'
import { recognizeImage } from '../../controller'
import './VideoRecognition.css'

class VideoRecognition extends Component {
  constructor(props) {
    super(props)
    this.state = { streaming: false }
    this.videoElem = null
    this.videoStream = null
    this.canvasOutput = null
  }

  startOrStopRecord = () => {
    if (!this.state.streaming) {
      const resolution = { width: { exact: 400 }, height: { exact: 400 } }
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

  processVideo = () => {
    let src = new window.cv.Mat(this.videoElem.height, this.videoElem.width, window.cv.CV_8UC4);
    let dst = new window.cv.Mat(this.videoElem.height, this.videoElem.width, window.cv.CV_8UC1);
    let cap = new window.cv.VideoCapture(this.videoElem);
    console.log(cap)
    const FPS = 30;
    function processFrames() {
      if (!this.state.streaming) {
        // clean and stop.
        src.delete();
        dst.delete();
        return;
      }
      let begin = Date.now();
      cap.read(src);
      window.cv.cvtColor(src, dst, window.cv.COLOR_RGBA2GRAY);
      window.cv.imshow(this.canvasOutput, dst);
      let delay = 1000/FPS - (Date.now() - begin);
      setTimeout(processFrames.bind(this), delay);
    }
    console.log('after processFrames func definition')
    setTimeout(processFrames.bind(this), 0);
  }

  onVideoStarted = () => {
    console.log('in onVideoStarted')
    this.videoElem.height = this.videoElem.videoHeight
    this.videoElem.width = this.videoElem.videoWidth
    this.canvasOutputCtx = this.canvasOutput.getContext('2d')
    this.setState({ streaming: true })
  }

  onVideoStopped = () => {
    console.log('in onVideoStopped')
    this.setState({ streaming: false })
    this.canvasOutputCtx.clearRect(0, 0, this.canvasOutput.width, this.canvasOutput.height)
  }

  setVideoEleRef = (videoElem) => {
    this.videoElem = videoElem
  }

  setCanvasVideoOutputRef = (canvasOutputElem) => {
    this.canvasOutput = canvasOutputElem
  }

  render() {
    return (
      <div className="App-body-video-capture" >
        <div className="video-and-result" >
          <video
            className="video-holder"
            ref={this.setVideoEleRef}
            onCanPlay={this.onVideoStarted}
          />
          <canvas ref={this.setCanvasVideoOutputRef} className="canvas-video-holder" />
        </div>
        <button className="capture-video-button" onClick={this.startOrStopRecord}>
          {this.state.streaming ? 'Stop capture' : 'Start capture'}
        </button>
        <button className="action-button" onClick={this.processVideo}>Process Video</button>
        <div className="error-msg">{this.state.toShowErrorMsg ? 'Please select an image and then press turn to Grey' : ''}</div>
      </div>
    )
  }
}

export default VideoRecognition
