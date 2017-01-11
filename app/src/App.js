import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
      super(props);
      this.state = { 
          twentyfour: true,
          date: new Date().toLocaleTimeString()
      };

      this.switchFormat = this.switchFormat.bind(this);
  }

  switchFormat() {
    
    this.setState(prevState => ({
      twentyfour: !prevState.twentyfour
    }));
    if (this.state.twentyfour) {
      console.log(this.state.twentyfour)
      this.setState({date : new Date().toLocaleTimeString()}) 
    } else{
      console.log(this.state.twentyfour)
      let test = new Date().toLocaleTimeString()
      this.setState({date : test })
    }
  }

  //clock un/mounting
  componentDidMount() {
      this.timerID = setInterval( () => this.tick(), 1000 );
  }

  componentWillUnmount() {
      clearInterval(this.timerID);
  }

  tick() {
     
    if (this.state.twentyfour) {
      this.setState({date : new Date().toLocaleTimeString()}) 
    } else{
      let test = new Date().toLocaleTimeString('en-gb')
      this.setState({date : test })
    }
  }

  //render here
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <h2>It is {this.state.date}.</h2>
        <button onClick={ this.switchFormat } > 
          { this.state.twentyfour ? '12' : '24' }
        </button>
      </div>
    );
  }
}

export default App;
