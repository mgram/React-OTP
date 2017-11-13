import React, {Component} from 'react'
import Paper from 'material-ui/Paper';

import './App.css'

class Success extends Component{
  render(){
    return(
      <div>
      <div className='carddiv'>
      <Paper zDepth={1} className='numbercard'>
      <img alt='awesome' src='https://s3.amazonaws.com/plivo_blog_uploads/static_assets/images/press/plivo-color-icon-dark1-large.png' className='logo'/>
      <p> Sign up successful</p>
      </Paper>
      </div>
      </div>
    )
  }
}

export default Success;
