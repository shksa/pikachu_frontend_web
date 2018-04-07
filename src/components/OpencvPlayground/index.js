import React, {Component} from 'react'
import './OpencvPlayground.css'

class OpencvPlayground extends Component {

  constructor(props) {
    super(props)
    this.state = {selectedFile: null}
  }

  render() {
    return (
      <div className="opencv-playground" >
        <div className="canvases-container" >
          <canvas className="canvas-img-holder"></canvas>
          <canvas className="canvas-img-holder"></canvas>
        </div>
        <div className="image-input" >
          <button className="image-selection-button"> Pick an image </button>
          <input type="file" onChange={this.setImageFile} />
        </div>
      </div>
    ) 
  }
}

export default OpencvPlayground