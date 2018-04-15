import React, { Component } from 'react'
import ImageRecognition from './components/ImageRecognition'
import VideoProcessing from './components/VideoProcessing'
import OpencvPlayground from './components/OpencvPlayground'
import VideoRecognition from './components/VideoRecognition'
import ObjectDetectionInVideo from './components/ObjectDetectionInVideo'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: '0',
    }
  }

  showTab = (event) => {
    this.setState({ activeTab: event.target.name })
  }

  render() {
    console.log('in render, state is ', this.state)
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
          >Image Recognition
          </button>
          <button
            className={this.state.activeTab === '1' ? 'tab-button active-tab-button' : 'tab-button inactive-tab-button'}
            onClick={this.showTab}
            name="1"
          >Video Processing
          </button>
          <button
            className={this.state.activeTab === '2' ? 'tab-button active-tab-button' : 'tab-button inactive-tab-button'}
            onClick={this.showTab}
            name="2"
          >OpenCV Playground
          </button>
          <button
            className={this.state.activeTab === '3' ? 'tab-button active-tab-button' : 'tab-button inactive-tab-button'}
            onClick={this.showTab}
            name="3"
          >Video Recognition
          </button>
          <button
            className={this.state.activeTab === '4' ? 'tab-button active-tab-button' : 'tab-button inactive-tab-button'}
            onClick={this.showTab}
            name="4"
          >Object Detection InVideo
          </button>
        </div>
        <div className="App-body" >
          {
            this.state.activeTab === '0' ?
              <ImageRecognition />
            :
            this.state.activeTab === '1' ?
              <VideoProcessing />
            :
            this.state.activeTab === '2' ?
              <OpencvPlayground />
            :
            this.state.activeTab === '3' ?
              <VideoRecognition />
            :
              <ObjectDetectionInVideo />
          }
        </div>

      </div>
    );
  }
}

export default App;
