import React, { Component } from 'react'
import ImageRecognition from './components/ImageRecognition'
import VideoRecognition from './components/VideoRecognition'
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
              <ImageRecognition />
            :
              <VideoRecognition />
          }

        </div>
      </div>
    );
  }
}

export default App;
