import React, { Component } from 'react'
import './OpencvPlayground.css'

class OpencvPlayground extends Component {
  constructor(props) {
    super(props)
    this.canvasInput = null
    this.canvasOutput = null
  }

  loadImageToCanvasInput = (imgUrl) => {
    const canvasInputCtx = this.canvasInput.getContext('2d')
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      canvasInputCtx.drawImage(img, 0, 0, this.canvasInput.width, this.canvasInput.height)
    }
    img.src = imgUrl
  }

  selectImage = (event) => {
    const imgFile = event.target.files[0]
    const imgUrl = window.URL.createObjectURL(imgFile)
    this.loadImageToCanvasInput(imgUrl)
  }

  setCanvasInputRef = (canvasInputElem) => {
    this.canvasInput = canvasInputElem
  }

  setCanvasOutputRef = (canvasOutputElem) => {
    this.canvasOutput = canvasOutputElem
  }

  render() {
    return (
      // <div className="opencv-playground" >
      //   <div className="canvases-container" >
      //     <canvas ref={this.setCanvasInputRef} className="canvas-img-holder" />
      //     <canvas ref={this.setCanvasOutputRef} className="canvas-img-holder" />
      //   </div>
      //   <div className="image-input" >
      //     <button className="image-selection-button"> Pick an image </button>
      //     <input type="file" onChange={this.selectImage} />
      //   </div>
      //   <button className="turn-grey-button" onClick={this.turnImageGrey}>Turn Image Grey</button>
      // </div>
      <p>lol</p>
    )
  }
}

export default OpencvPlayground
