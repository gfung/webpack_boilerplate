import React, { Component } from 'react';

function FormattedDate(props) {
  return <h2>It is {props.date.toLocaleTimeString()}.</h2>;
}

class Clock extends Component {
    constructor(props) {
        super(props);
        console.log(this)
        this.state = { 
            twentyfour: true,
            date: new Date()
        };
    }

    //method for this class
    switchFormat() {
        this.setState(waht => ({
            twentyfour: !waht.twentyfour
        }));
    }

    componentDidMount() {
        this.timerID = setInterval( () => this.tick(), 1000 );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            date: new Date()
        });
    }

    //render
    render() {
        return ( 
            <button onClick={ this.handleClick } > 
                { this.state.isToggleOn ? '12' : '24' }
            </button>
            <FormattedDate date={this.state.date} />
        )
    }
}