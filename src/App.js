import React, { Component } from 'react'
import defaultImage from './images/default-image.png'
import questionMarkImage from './images/DramaticQuestionMark.png'
import { recognizeImage } from './controller'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedFile: null, showErrorMsg: false, predictions: null, activeTab: '0',
    }
    this.videoElem = null;
  }

  fileChangeHandler = (event) => {
    this.setState({ selectedFile: event.target.files[0], showErrorMsg: false, predictions: null })
  }

  uploadHandler = () => {
    if (this.state.selectedFile) {
      const predictionsPromise = recognizeImage(this.state.selectedFile)
      predictionsPromise.then(predictions => this.setState({ predictions }))
    } else {
      this.setState({ showErrorMsg: true })
    }
  }

  showTab = (event) => {
    this.setState({ activeTab: event.target.name })
  }

  startRecording = () => {
    const constraints = { audio: false, video: { width: 500, height: 500 } }

    navigator.mediaDevices.getUserMedia(constraints)
      .then((mediaStream) => {
        this.videoElem.srcObject = mediaStream
        this.videoElem.onloadedmetadata = (e) => {
          this.videoElem.play()
        }
        console.log('inside then method of getUserMedia')
      })
      .catch((err) => { console.log(`${err.name}: ${err.message}`); })
  }

  render() {
    console.log('in render, state.selectedFile is ', this.state.selectedFile)
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
                <button className="capture-video-button" onClick={this.startRecording}>Capture video</button>
                <video width="60%" height="60%" ref={(vid) => { this.videoElem = vid }} controls />
              </div>
            )
          }

        </div>
      </div>
    );
  }
}

export default App;
