import React, { Component } from 'react'
import defaultImage from './images/default-image.png'
import questionMarkImage from './images/DramaticQuestionMark.png'
import { recognizeImage } from './controller'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedFile: null,
      showErrorMsg: false,
      predictions: null,
      activeTab: '0',
      streaming: false,
    }
    this.videoElem = null
    this.videoStream = null
  }

  uploadHandler = () => {
    if (this.state.selectedFile) {
      const predictionsPromise = recognizeImage(this.state.selectedFile)
      predictionsPromise.then(predictions => this.setState({ predictions }))
    } else {
      this.setState({ showErrorMsg: true })
    }
  }

  onVideoStarted = () => {
    console.log('in onVideoStarted')
    this.setState({ streaming: true })
  }

  onVideoStopped = () => {
    console.log('in onVideoStopped')
    this.setState({ streaming: false })
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

  startOrStopRecord = () => {
    if (!this.state.streaming) {
      const resolution = { width: { exact: 500 }, height: { exact: 500 } }
      this.startCamera(resolution)
    } else {
      this.stopCamera()
      this.onVideoStopped()
    }
  }

  fileChangeHandler = (event) => {
    this.setState({ selectedFile: event.target.files[0], showErrorMsg: false, predictions: null })
  }

  showTab = (event) => {
    this.setState({ activeTab: event.target.name })
  }

  setVideoEleRef = (videoElem) => {
    this.videoElem = videoElem
  }

  render() {
    console.log('in render, state is ', this.state, 'videoEle and videoStream is ', this.videoElem, this.videoStream)
    return (
      <div className="App">
        <div className="App-header" >
          Pikachu
        </div>
        <div className="tab-selector">
          <button
            className={this.state.activeTab === '0' ? 'tab-button active-tab-button' : 'tab-button inactive-tab-button'}
            onClick={this.showTab}
            name="0"
          >Image recognition
          </button>
          <button
            className={this.state.activeTab === '1' ? 'tab-button active-tab-button' : 'tab-button inactive-tab-button'}
            onClick={this.showTab}
            name="1"
          >Video recognition
          </button>
        </div>
        <div className="App-body" >
          {
            this.state.activeTab === '0' ?
            (
              <div className="App-body-img-selector" >
                <div className="image-and-result">
                  <img
                    src={this.state.selectedFile ? window.URL.createObjectURL(this.state.selectedFile) : defaultImage}
                    alt="selected img"
                    className="image-holder"
                  />
                  {
                  this.state.selectedFile ?
                  (
                    <div className="is-and-result" >
                      <div className="is-holder" >
                      is
                      </div>
                      <div className="result-holder">
                        {
                          this.state.predictions ?
                          (
                            <ul>
                              {this.state.predictions.map(prediction => <li>{prediction}</li>)}
                            </ul>
                          )
                          :
                            <img className="question-image" src={questionMarkImage} alt="questionmark" />
                        }
                      </div>
                    </div>
                  )
                  :
                  ''
                }

                </div>
                <div className="image-input" >
                  <button className="image-selection-button"> Pick an image </button>
                  <input type="file" onChange={this.fileChangeHandler} />
                </div>

                <button className="upload-button" onClick={this.uploadHandler}>Recognize!</button>
                <div className="error-msg">{this.state.showErrorMsg ? 'Please select an image and then press recognize' : ''}</div>
              </div>
            )
            :
            (
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

        </div>
      </div>
    );
  }
}

export default App;
