import React, { Component } from 'react'
import defaultImage from './default-image.png'
import questionMarkImage from './DramaticQuestionMark.png'
import { recognizeImage } from './controller'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { selectedFile: null, showErrorMsg: false, predictions: null }
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
  render() {
    console.log('in render, state.selectedFile is ', this.state.selectedFile)
    return (
      <div className="App">
        <div className="App-header" >
          Pikachu
        </div>
        <div className="App-body" >
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
            <input className="image-input" type="file" onChange={this.fileChangeHandler} />
            <button className="upload-button" onClick={this.uploadHandler}>Recognize!</button>
            <div className="error-msg">{this.state.showErrorMsg ? 'Please select an image and then press recognize' : ''}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
