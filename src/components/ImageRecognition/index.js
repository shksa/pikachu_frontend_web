import React, { Component } from 'react'
import { recognizeImage } from '../../controller'
import './ImageRecognition.css'
import defaultImage from '../../images/default-image.png'
import questionMarkImage from '../../images/DramaticQuestionMark.png'

class ImageRecognition extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedFile: null,
      toShowErrorMsg: false,
      predictions: null,
    }
  }

  uploadHandler = () => {
    if (this.state.selectedFile) {
      const predictionsPromise = recognizeImage(this.state.selectedFile)
      predictionsPromise.then(predictions => this.savePredictions(predictions))
    } else {
      this.showErrorMsg()
    }
  }

  savePredictions = (predictions) => {
    this.setState({ predictions })
  }

  showErrorMsg = () => {
    this.setState({ toShowErrorMsg: true })
  }

  setImageFile = (event) => {
    this.setState({ selectedFile: event.target.files[0] })
  }

  render() {
    return (
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
          <input type="file" onChange={this.setImageFile} />
        </div>

        <button className="upload-button" onClick={this.uploadHandler}>Recognize!</button>
        <div className="error-msg">{this.state.toShowErrorMsg ? 'Please select an image and then press recognize' : ''}</div>
      </div>
    )
  }
}

export default ImageRecognition
