import React, { Component } from 'react'
import { recognizeImage } from '../../controller'
import './VideoRecognition.css'

class VideoRecognition extends Component {
  constructor(props) {
    super(props)
    this.state = { streaming: false, toShowErrorMsg: false }
    this.videoElem = null
    this.videoStream = null
    this.canvasOutput = null
    this.canvasInput = null
  }

  showErrorMsg = () => {
    this.setState({ toShowErrorMsg: true })
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

  processVideo = () => {
    if(this.state.streaming) {
      let src = new window.cv.Mat(this.videoElem.videoHeight, this.videoElem.videoWidth, window.cv.CV_8UC4)
      let dst = new window.cv.Mat(this.videoElem.videoHeight, this.videoElem.videoWidth, window.cv.CV_8UC1)
      let cap = new window.cv.VideoCapture(this.videoElem)
      console.log(cap)
      const FPS = 30;
      const processFrames = () => {
        if (!this.state.streaming) {
          src.delete()
          dst.delete()
          return
        }
        let begin = Date.now()
        cap.read(src)
        console.log()
        window.cv.cvtColor(src, dst, window.cv.COLOR_RGBA2GRAY)
        window.cv.imshow(this.canvasOutput, dst)
        let delay = 1000/FPS - (Date.now() - begin)
        setTimeout(processFrames, delay)
      }
      setTimeout(processFrames, 0)
    } else {
      this.showErrorMsg()
    }
    
  }

  drawVideoToInputCanvas = () => {
    let src = new window.cv.Mat(this.videoElem.videoHeight, this.videoElem.videoWidth, window.cv.CV_8UC4)
    let cap = new window.cv.VideoCapture(this.videoElem);
    console.log(cap, src)
    const FPS = 30;
    const drawFrameToInputCanvas = () => {
      if (!this.state.streaming) {
        src.delete();
        console.log('src of drawVideoToInputCanvas deleted')
        return;
      }
      let begin = Date.now();
      cap.read(src);
      window.cv.imshow(this.canvasInput, src);
      let delay = 1000/FPS - (Date.now() - begin);
      setTimeout(drawFrameToInputCanvas, delay);
    }
    setTimeout(drawFrameToInputCanvas, 0);
  }

  onVideoStarted = () => {
    console.log('in onVideoStarted')
    this.setState({ streaming: true })
    this.videoElem.height = this.videoElem.videoHeight
    this.videoElem.width = this.videoElem.videoWidth
    this.canvasInputCtx = this.canvasInput.getContext('2d')
    this.canvasOutputCtx = this.canvasOutput.getContext('2d')
    this.drawVideoToInputCanvas()
  }

  onVideoStopped = () => {
    console.log('in onVideoStopped')
    this.setState({ streaming: false })
    this.canvasOutputCtx.clearRect(0, 0, this.canvasOutput.width, this.canvasOutput.height)
    this.canvasInputCtx.clearRect(0, 0, this.canvasOutput.width, this.canvasOutput.height)
  }

  setVideoEleRef = (videoElem) => {
    this.videoElem = videoElem
  }

  setCanvasVideoOutputRef = (canvasOutputElem) => {
    this.canvasOutput = canvasOutputElem
  }

  setCanvasVideoInputRef = (canvasInputElem) => {
    this.canvasInput = canvasInputElem
  }

  toShowErrorMsg

  render() {
    return (
      <div className="App-body-video-capture" >
        <div className="video-and-result" >
          <video
            className="video-holder"
            ref={this.setVideoEleRef}
            onCanPlay={this.onVideoStarted}
          />
          <canvas ref={this.setCanvasVideoInputRef} className="canvas-video-holder" />
          <canvas ref={this.setCanvasVideoOutputRef} className="canvas-video-holder" />
        </div>
        <button className="capture-video-button" onClick={this.startOrStopRecord}>
          {this.state.streaming ? 'Stop capture' : 'Start capture'}
        </button>
        <button className="action-button" onClick={this.processVideo}>Process Video</button>
        <div className="error-msg">{this.state.toShowErrorMsg ? 'Please select capture video and then press process video' : ''}</div>
      </div>
    )
  }
}

export default VideoRecognition
