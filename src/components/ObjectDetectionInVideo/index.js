import React, { Component } from 'react'
import io from 'socket.io-client'
import './ObjectDetectionInVideo.css'

class ObjectDetectionInVideo extends Component {
  constructor(props) {
    console.log('constructor of ObjectDetectionInVideo called')
    super(props)
    this.state = {
      cameraIsStreaming: false,
      videoIsProcessing: false,
      toShowErrorMsg1: false,
    }
    this.predictions = null
  }

  toggleCameraStream = () => {
    if (this.state.cameraIsStreaming) {
      if (this.state.videoIsProcessing) {
        this.stopVideoProcessing()
      }
      this.stopCameraStream()
      this.cleanCanvas(this.canvasInputCtx, this.canvasInput)
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
    this.stopDrawingToInput()
    this.deleteMats()
    this.videoElem.pause()
    this.videoElem.srcObject = null
    this.videoStream.getVideoTracks()[0].stop()
    this.setState({ cameraIsStreaming: false })
  }

  stopDrawingToInput = () => clearTimeout(this.drawFrameId)

  setupConnectionWithServer = () => {
    this.socket = io('http://localhost:7000')
    this.socket.on('helloToClient', msg => console.log(`connected to server and received Ack "${msg}" from server`))
  }

  streamVideoToServer = () => {
    const sendFrameToServer = () => {
      const start = Date.now();
      const base64EncodedFrame = this.canvasInput.toDataURL('image/webp')
      this.socket.emit('detectObjectsInFrame', base64EncodedFrame, (predictions) => {
        this.predictions = predictions
        this.sendFrameId = setTimeout(sendFrameToServer, Date.now() - start)
      })
    }
    setTimeout(sendFrameToServer, 0)
  }

  stopSendingFrameToServer = () => {
    clearTimeout(this.sendFrameId)
  }

  disconnectFromServer = () => {
    this.socket.disconnect()
  }

  startVideoProcessing = () => {
    this.setupConnectionWithServer()
    this.streamVideoToServer()
    this.setState({ videoIsProcessing: true })
  }

  stopVideoProcessing = () => {
    this.stopSendingFrameToServer()
    this.disconnectFromServer()
    this.predictions = null
    this.cleanCanvas(this.canvasOutputCtx, this.canvasOutput)
    this.setState({ videoIsProcessing: false })
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

  drawBoundingBoxesForObjects = (predictions) => {
    predictions.forEach((pred) => {
      window.cv.rectangle(this.dst, pred.bottomLeft, pred.topRight, [255, 0, 0, 255])
    })
    window.cv.imshow(this.canvasOutput, this.dst)
  }

  drawVideoToInputCanvas = () => {
    const src = new window.cv.Mat(this.videoElem.videoHeight, this.videoElem.videoWidth, window.cv.CV_8UC4)
    this.dst = new window.cv.Mat(this.videoElem.videoHeight, this.videoElem.videoWidth, window.cv.CV_8UC4)
    const cap = new window.cv.VideoCapture(this.videoElem)
    const FPS = 30
    this.deleteMats = () => {
      src.delete()
      this.dst.delete()
    }
    const drawFrameToInputCanvas = () => {
      const begin = Date.now()
      cap.read(src)
      src.copyTo(this.dst)
      window.cv.imshow(this.canvasInput, src)
      if (this.predictions) {
        this.drawBoundingBoxesForObjects(this.predictions)
      }
      const delay = (1000 / FPS) - (Date.now() - begin)
      this.drawFrameId = setTimeout(drawFrameToInputCanvas, delay)
    }
    setTimeout(drawFrameToInputCanvas, 0)
  }

  onVideoStarted = () => {
    console.log('in onVideoStarted')
    this.drawVideoToInputCanvas()
    this.setState({ cameraIsStreaming: true })
  }

  cleanCanvas = (canvasCtx, canvasElem) => {
    canvasCtx.clearRect(0, 0, canvasElem.width, canvasElem.height)
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

  setCanvasOutputRef = (canvasOutputElem) => {
    if (canvasOutputElem) {
      this.canvasOutput = canvasOutputElem
      this.canvasOutputCtx = this.canvasOutput.getContext('2d')
    }
  }

  render() {
    // console.log('in SocketPlayground render, state is', this.state)
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
            <canvas ref={this.setCanvasOutputRef} className="canvas-out" />
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

export default ObjectDetectionInVideo
