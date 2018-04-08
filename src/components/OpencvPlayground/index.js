import React, { Component } from 'react'
import './OpencvPlayground.css'

class OpencvPlayground extends Component {
  constructor(props) {
    super(props)
    this.state = { toShowErrorMsg: false, selectedFile: null }
    this.canvasInput = null
    this.canvasOutput = null
  }

  loadImageToCanvasInput = (imgFile) => {
    console.log('in loadImageToCanvasInput, state is', this.state)
    const imgUrl = window.URL.createObjectURL(imgFile)
    const canvasInputCtx = this.canvasInput.getContext('2d')
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      canvasInputCtx.drawImage(img, 0, 0, this.canvasInput.width, this.canvasInput.height)
    }
    img.src = imgUrl
  }

  turnImageGrey = () => {
    if (this.state.selectedFile) {
      const src = window.cv.imread(this.canvasInput)
      const dst = new window.cv.Mat();
      window.cv.cvtColor(src, dst, window.cv.COLOR_RGBA2BGRA);
      window.cv.imshow(this.canvasOutput, dst);
      src.delete();
      dst.delete();
    } else {
      this.setState({ toShowErrorMsg: true })
    }
  }

  selectImage = (event) => {
    const imgFile = event.target.files[0]
    this.setState({ selectedFile: imgFile, toShowErrorMsg: false })
    this.loadImageToCanvasInput(imgFile)
    this.emptyOutputCanvas()
  }

  emptyOutputCanvas = () => {
    const canvasOutputCtx = this.canvasOutput.getContext('2d')
    canvasOutputCtx.fillStyle = '#FFFFFF'
    canvasOutputCtx.clearRect(0, 0, this.canvasInput.width, this.canvasInput.height)
  }

  setCanvasInputRef = (canvasInputElem) => {
    this.canvasInput = canvasInputElem
  }

  setCanvasOutputRef = (canvasOutputElem) => {
    this.canvasOutput = canvasOutputElem
  }

  render() {
    console.log('in render, state is ', this.state)
    return (
      <div className="opencv-playground" >
        <div className="canvases-container" >
          <canvas ref={this.setCanvasInputRef} className="canvas-img-holder" />
          <canvas ref={this.setCanvasOutputRef} className="canvas-img-holder" />
        </div>
        <div className="image-input" >
          <button className="image-selection-button"> Pick an image </button>
          <input type="file" onChange={this.selectImage} />
        </div>
        <button className="action-button" onClick={this.turnImageGrey}>Turn Image Grey</button>
        <div className="error-msg">{this.state.toShowErrorMsg ? 'Please select an image and then press turn to Grey' : ''}</div>
      </div>
    )
  }
}

export default OpencvPlayground
