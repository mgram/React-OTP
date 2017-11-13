import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import NumberCard from './InputOtp'
import ValidateCard from './ValidateCard'
import './App.css';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {green600, green400, green300, pink500, pink300, pink100} from 'material-ui/styles/colors';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Success from './Success'

const muiTheme = getMuiTheme({
  palette:{
    primary1Color: green600,
    primary2Color: green400,
    primary3Color: green300,
    accent1Color: pink500,
    accent2Color: pink300,
    accent3Color: pink100
  }
});

class App extends Component {
  constructor(props){
    super(props)
    this.state = {number:''}
    this.updateState = this.updateState.bind(this)
  }
  updateState(value){
    this.setState({number:value})
  }
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
      <BrowserRouter>
      <Switch>
        <Route exact path='/' render={()=><NumberCard updateState={this.updateState} number={this.state.number}/>} />
        <Route path='/validate' render={()=><ValidateCard number= {this.state.number} />} />
        <Route path='/success' render={()=><Success />} />
      </Switch>
      </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}

export default App;
