import React, { Component } from 'react'
import io from 'socket.io-client'
import questionMarkImage from '../../images/DramaticQuestionMark.png'
import './SocketPlayground.css'

class VideoRecognition extends Component {
  constructor(props) {
    console.log('constructor of VideoRecognition called')
    super(props)
    this.state = {
      cameraIsStreaming: false,
      videoIsProcessing: false,
      toShowErrorMsg1: false,
      toShowErrorMsg2: false,
      predictions: null,
    }
  }

  toggleCameraStream = () => {
    if (this.state.cameraIsStreaming) {
      if (this.state.videoIsProcessing) {
        this.stopVideoProcessing()
      }
      this.stopCameraStream()
      this.cleanCanvas()
    } else {
      this.startCameraStream()
    }
  }

  startCameraStream = () => {
    const resolution = { width: { exact: 500 }, height: { exact: 500 } }
    this.videoElem.width = 500; this.videoElem.height = 500
    const videoConstraints = { video: resolution, audio: false }
    navigator.mediaDevices.getUserMedia(videoConstraints)
      .then((mediaStream) => {
        this.videoElem.srcObject = mediaStream
        this.videoElem.onloadedmetadata = () => {
          this.videoElem.play()
        }
        this.videoStream = mediaStream
      })
      .catch((err) => { console.log(`${err.name}: ${err.message}`); })
  }

  stopCameraStream = () => {
    this.videoElem.pause()
    this.videoElem.srcObject = null
    this.videoStream.getVideoTracks()[0].stop()
    this.setState({ cameraIsStreaming: false })
  }

  setupConnectionWithServer = () => {
    this.socket = io('http://localhost:7000')
    this.socket.on('helloToClient', msg => console.log(`connected to server and received Ack ${msg}`))
  }

  registerResponseEvent = () => {
    this.socket.on('frameImagePredictions', predictions => this.savePredictions(predictions))
  }

  streamVideoToServer = () => {
    const sendFrameToServer = () => {
      this.socket.emit('recognizeFrame', this.canvasInput.toDataURL('image/webp'))
    }
    this.sendFrameIntId = setInterval(sendFrameToServer, 1000)
  }

  stopSendingFrameToServer = () => {
    clearInterval(this.sendFrameIntId)
  }

  disconnectFromServer = () => {
    this.socket.disconnect()
  }

  startVideoProcessing = () => {
    this.setupConnectionWithServer()
    this.registerResponseEvent()
    this.streamVideoToServer()
    this.setState({ videoIsProcessing: true })
  }

  stopVideoProcessing = () => {
    this.stopSendingFrameToServer()
    this.disconnectFromServer()
    this.setState({ videoIsProcessing: false, predictions: false })
  }

  toggleVideoProcessing = () => {
    if (this.state.videoIsProcessing) {
      this.stopVideoProcessing()
    } else if (this.state.cameraIsStreaming) {
      this.startVideoProcessing()
    } else {
      this.showErrorMsg(1)
    }
  }

  showErrorMsg = (num) => {
    if (num === 1) {
      this.setState({ toShowErrorMsg1: true })
    } else {
      this.setState({ toShowErrorMsg2: true })
    }
  }

  drawVideoToInputCanvas = () => {
    const src = new window.cv.Mat(this.videoElem.videoHeight, this.videoElem.videoWidth, window.cv.CV_8UC4)
    const cap = new window.cv.VideoCapture(this.videoElem);
    const FPS = 30;
    const drawFrameToInputCanvas = () => {
      if (!this.state.cameraIsStreaming) {
        src.delete();
        console.log('src of drawVideoToInputCanvas deleted')
        return;
      }
      const begin = Date.now();
      cap.read(src);
      window.cv.imshow(this.canvasInput, src);
      const delay = (1000 / FPS) - (Date.now() - begin);
      setTimeout(drawFrameToInputCanvas, delay);
    }
    setTimeout(drawFrameToInputCanvas, 0);
  }

  savePredictions = (predictions) => {
    // console.log('predictions from server ', predictions)
    this.setState({ predictions })
  }

  onVideoStarted = () => {
    console.log('in onVideoStarted')
    this.drawVideoToInputCanvas()
    this.setState({ cameraIsStreaming: true })
  }

  cleanCanvas = () => {
    this.canvasInputCtx.clearRect(0, 0, this.canvasInput.width, this.canvasInput.height)
  }

  setVideoEleRef = (videoElem) => {
    this.videoElem = videoElem
  }

  setCanvasVideoInputRef = (canvasInputElem) => {
    if (canvasInputElem) {
      this.canvasInput = canvasInputElem
      this.canvasInputCtx = this.canvasInput.getContext('2d')
    }
  }

  render() {
    console.log('in SocketPlayground render, state is', this.state)
    return (
      <div className="App-body-video-capture" >
        <div className="video-and-result" >
          <video
            className="video-holder"
            ref={this.setVideoEleRef}
            onPlay={this.onVideoStarted}
          />
          <canvas ref={this.setCanvasVideoInputRef} className="canvas-video-holder" />
          <div className="canvas-video-holder result-holder">
            {
              this.state.predictions ?
              (
                <ul>
                  {this.state.predictions.map(prediction => <li key={prediction} >{prediction}</li>)}
                </ul>
              )
              :
                <img className="question-image" src={questionMarkImage} alt="questionmark" />
            }
          </div>
        </div>
        <button className="capture-video-button" onClick={this.toggleCameraStream}>
          {this.state.cameraIsStreaming ? 'Stop capture' : 'Start capture'}
        </button>
        <button className="action-button" onClick={this.toggleVideoProcessing}>
          {this.state.videoIsProcessing ? 'Stop Processing' : 'Process video'}
        </button>
        <div className="error-msg">
          {this.state.toShowErrorMsg1 ? 'Please select capture video and then press process video' : ''}
        </div>
      </div>
    )
  }
}

export default VideoRecognition
