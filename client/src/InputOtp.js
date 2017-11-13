import React, {Component} from 'react'
import TextField from 'material-ui/TextField'
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import {withRouter} from 'react-router-dom'
import './App.css';

class NumberCard extends Component{
  constructor(props){
    super(props);
    this.state = {number:''}
    this.sendMessage = this.sendMessage.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(evt){
    let newval;
    if(evt.target.value === '' || evt.target.value === ' '){
      newval = ''
      this.props.updateState(newval)
    }
    else{
      newval = parseInt(evt.target.value)
      console.log('#' + evt.target.value +'#')
      if(!isNaN(newval)){
      this.props.updateState(newval)
      }
    }
  }
  checkStatus(response){
    console.log(response.status_code)
  }
  sendMessage(){
    let data ={
      number:this.props.number.toString()
    }
    fetch('http://8ed6584d.ngrok.io/numbers/',
          {
            method:'post',
            body:JSON.stringify(data),
            mode:'cors',
            headers:{'Content-Type':'application/json'}
          }).then(this.checkStatus)
    this.props.history.push('/validate')
  }
  render(){
    return(
      <div>
      <div className='carddiv'>
      <Paper zDepth={1} className='numbercard'>
      <img alt='awesome' src='https://s3.amazonaws.com/plivo_blog_uploads/static_assets/images/press/plivo-color-icon-dark1-large.png' className='logo'/>
      <p> Please enter your phone number </p>
      <TextField name='1' maxLength="15" hintText='91xxxxxxxxxx' className='rbutton' style={{'width':'120px'}} onChange={this.handleChange} value={this.props.number}/>
      <div className='rbutton'>
      <RaisedButton label='CONTINUE' secondary={true} onClick={this.sendMessage}/>
      </div>
      </Paper>
      </div>
      </div>
    )
  }
}

export default withRouter(NumberCard);
