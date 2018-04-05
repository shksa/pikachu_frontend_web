import React, { Component } from 'react'
import defaultImage from './default-image.png'
import { uploadImage } from './controller'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { selectedFile: null, showErrorMsg: false }
  }

  fileChangeHandler = (event) => {
    this.setState({ selectedFile: event.target.files[0], showErrorMsg: false })
  }

  uploadHandler = () => {
    if (this.state.selectedFile) {
      uploadImage(this.state.selectedFile)
    } else {
      this.setState({ showErrorMsg: true })
    }
  }
  render() {
    console.log('in render, state.selectedFile is ', this.state.selectedFile)
    return (
      <div className="App">
        <div className="App-header" >
          Pikachu app
        </div>
        <div className="App-body" >
          <div className="App-body-img-selector" >
            <img
              src={this.state.selectedFile ? window.URL.createObjectURL(this.state.selectedFile) : defaultImage}
              alt="selected img"
              className="image-holder"
            />
            <input className="image-input" type="file" onChange={this.fileChangeHandler} />
            <button className="upload-button" onClick={this.uploadHandler}>Upload!</button>
            <div className="error-msg">{this.state.showErrorMsg ? 'Please select an image and then upload' : ''}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
