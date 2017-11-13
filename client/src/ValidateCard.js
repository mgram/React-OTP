import React, {Component} from 'react';
import TextField from 'material-ui/TextField'
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton'
import {withRouter} from 'react-router-dom'
import Snackbar from 'material-ui/Snackbar'
import './App.css';

class ValidateCard extends Component{
  constructor(props){
    super(props);
    this.makeCall = this.makeCall.bind(this)
    this.validateOTP = this.validateOTP.bind(this)
    this.compareOTP = this.compareOTP.bind(this)
    this.state = {baropen:false, validationerror:''}
    this.code = ''
  }
  compareOTP(resp){
    console.log(resp)
    if (resp['verified'] === 'true'){
      this.props.history.push('/success')
    }
    else{
      this.setState({validationerror:'Not valid', baropen:false})
    }
  }

  validateOTP(evt){
    evt.preventDefault();
    let uri = 'http://8ed6584d.ngrok.io/numbers/' + this.props.number.toString()
    let data ={otp:this.code.input.value.toString()}
    console.log(uri)
    console.log(data['otp'])
    fetch(uri,{method:'post', body:JSON.stringify(data), mode:'cors', headers:{'Content-Type':'application/json'}}).then(function(response){ return response.json()}).then(this.compareOTP).catch(err => alert(err))
  }
  makeCall(){
    let data ={
      number:this.props.number.toString(),
      type:'voice'
    }
    let uri = 'http://8ed6584d.ngrok.io/numbers/'
    fetch(uri,{method:'post', body:JSON.stringify(data), mode:'cors', headers:{'Content-Type':'application/json'}}).then(function(response){ return response.json()}).catch(err => alert(err))
    this.setState({baropen:true})
  }
  render(){
    return(
      <div>
      <div className='carddiv'>
      <Paper zDepth={1} className='validatecard'>
      <img alt='awesome' src='https://s3.amazonaws.com/plivo_blog_uploads/static_assets/images/press/plivo-color-icon-dark1-large.png' className='logo'/>
      <p> Please enter the code received </p>
      <TextField maxLength="6" className='rbutton' style={{'width':'60px', 'text-align':'center'}} ref={(code) => this.code=code} errorText={this.state.validationerror}/>
      <div className='rbutton'>
      <RaisedButton label='VALIDATE' secondary={true} onClick={this.validateOTP} />
      </div>
      <div className='rbutton'>
      <FlatButton label='CALL ME WITH THE CODE' primary={true} onClick={this.makeCall}/>
      </div>
      </Paper>
      </div>
      <Snackbar autoHideDuration={2000} open={this.state.baropen} message='We have made a call to your number with the code' style={{'text-align':'center'}} />
      </div>

    )
  }
}

export default withRouter(ValidateCard);
