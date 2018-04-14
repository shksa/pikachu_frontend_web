import React, {Component} from 'react'
import io from 'socket.io-client'
import { recognizeImage } from '../../controller'
import questionMarkImage from '../../images/DramaticQuestionMark.png'
import './ObjectDetectionInVideo.css'

class ObjectDetectionInVideo extends Component {
  constructor(props) {
    console.log('constructor of ObjectDetectionInVideo called')
    super(props)
    this.state = { streaming: false, toShowErrorMsg: false, predictions: null }
  }

  showErrorMsg = () => {
    this.setState({ toShowErrorMsg: true })
  }

  startOrStopCapture = () => {
    if (!this.state.streaming) {
      const resolution = { width: { exact: 500 }, height: { exact: 500 } }
      this.videoElem.width = 500 ; this.videoElem.height = 500
      this.startCamera(resolution)
    } else {
      this.stopSendingFrameToServer()
      this.disconnectFromServer()
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

  streamVideoToServer = () => {
    const sendFrameToServer = () =>{
      this.socket.emit('recognizeFrame', this.canvasInput.toDataURL('image/webp'))
    } 
    this.sendFrameIntId = setInterval(sendFrameToServer, 1000)
  }

  setupConnectionWithServer = () => {
    this.socket = io.connect('http://localhost:7000')
  }

  registerResponseEvent = () => {
    this.socket.on('frameImageClass', predictions => this.savePredictions(predictions))
  }

  stopSendingFrameToServer = () => {
    clearInterval(this.sendFrameIntId)
  }

  disconnectFromServer = () => {
    this.socket.disconnect()
  }


  processVideo = () => {
    if(this.state.streaming) {
      this.setupConnectionWithServer()
      this.registerResponseEvent()
      this.streamVideoToServer()
    } else {
      this.showErrorMsg()
    }
    console.log('returning from processVideo func')
  }

  drawVideoToInputCanvas = () => {
    let src = new window.cv.Mat(this.videoElem.videoHeight, this.videoElem.videoWidth, window.cv.CV_8UC4)
    let cap = new window.cv.VideoCapture(this.videoElem);
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

  savePredictions = (predictions) => {
    console.log('predictions from server ', predictions)
    this.setState({ predictions })
  }

  onVideoStarted = () => {
    console.log('in onVideoStarted')
    this.setState({ streaming: true })
    this.drawVideoToInputCanvas()
  }

  onVideoStopped = () => {
    console.log('in onVideoStopped')
    this.setState({ streaming: false })
    this.canvasInputCtx.clearRect(0, 0, this.canvasInput.width, this.canvasInput.height)
  }

  setVideoEleRef = (videoElem) => {
    this.videoElem = videoElem
  }

  setCanvasVideoInputRef = (canvasInputElem) => {
    if(canvasInputElem) {
      this.canvasInput = canvasInputElem
      this.canvasInputCtx = this.canvasInput.getContext('2d')
    }
    
  }

  render() {
    console.log('in SocketPlayground render, state is',this.state )
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
        <button className="capture-video-button" onClick={this.startOrStopCapture}>
          {this.state.streaming ? 'Stop capture' : 'Start capture'}
        </button>
        <button className="action-button" onClick={this.processVideo}>Process Video</button>
        <div className="error-msg">{this.state.toShowErrorMsg ? 'Please select capture video and then press process video' : ''}</div>
      </div>
    )
  }
}

export default ObjectDetectionInVideo


// class SocketPlayground extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       selectedFile: null,
//       toShowErrorMsg: false,
//       predictions: null,
//     }
//     this.socket = io.connect('http://localhost:7000')
//     this.socket.on('imageClass', predictions => this.savePredictions(predictions))
//   }

//   uploadHandler = () => {
//     if (this.state.selectedFile) {
//       this.socket.emit('recognizeImage', this.state.selectedFile)
//     } else {
//       this.showErrorMsg()
//     }
//   }

//   savePredictions = (predictions) => {
//     console.log('predictions from server ', predictions)
//     this.setState({ predictions })
//   }

//   showErrorMsg = () => {
//     this.setState({ toShowErrorMsg: true })
//   }

//   setImageFile = (event) => {
//     this.setState({ selectedFile: event.target.files[0], toShowErrorMsg: false })
//   }

//   render() {
//     return (
//       <div className="App-body-img-selector" >
//         <div className="image-and-result">
//           <img
//             src={this.state.selectedFile ? window.URL.createObjectURL(this.state.selectedFile) : defaultImage}
//             alt="selected img"
//             className={this.state.selectedFile ? 'image-holder' : ''}
//           />
//           {
//             this.state.selectedFile ?
//             (
//               <div className="is-and-result" >
//                 <div className="is-holder" >
//                 is
//                 </div>
//                 <div className="result-holder">
//                   {
//                     this.state.predictions ?
//                     (
//                       <ul>
//                         {this.state.predictions.map(prediction => <li key={prediction} >{prediction}</li>)}
//                       </ul>
//                     )
//                     :
//                       <img className="question-image" src={questionMarkImage} alt="questionmark" />
//                   }
//                 </div>
//               </div>
//             )
//             :
//             ''
//           }

//         </div>
//         <div className="image-input" >
//           <button className="image-selection-button"> Pick an image </button>
//           <input type="file" onChange={this.setImageFile} />
//         </div>

//         <button className="action-button" onClick={this.uploadHandler}>Recognize!</button>
//         <div className="error-msg">{this.state.toShowErrorMsg ? 'Please select an image and then press recognize' : ''}</div>
//       </div>
//     )
//   }
// }

// export default SocketPlayground


// class SocketPlayground extends Component {
//   constructor(props) {
//     super(props)
//     this.socket = io.connect('http://localhost:7000')
//     this.socket.on('timeFromServer', timeStamp => this.setState({timeStamp}))
//     this.state = {timeStamp: 'no time received yet'}
//   }

//   componentWillMount = () => {
//     console.log('in componentWillMount of SocketPlayground')
//   }

//   sendPing = () => {
//     this.socket.emit('getTimeFromServer', 'ping!ping!ping!')
//   }

//   render() {
//     console.log('in render of SocketPlayground, this value is ', this)
//     return (
//       <div>
//         <button onClick={this.sendPing}>Ping server for time</button>
//         <p>{this.state.timeStamp}</p>
//       </div>
//     )
//   }
// }

// export default SocketPlayground