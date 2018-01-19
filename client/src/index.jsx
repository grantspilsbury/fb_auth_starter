import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogOut = this.handleLogOut.bind(this)
    this.state = {
      isSignedIn: false
    }
  }

  componentDidMount() {
    this.signIn();
  }

  signIn() {
    var that = this;
    $.ajax({
      url: '/checkSession',
      success: function(isSignedIn) {
        that.setState({ isSignedIn: isSignedIn })
      },
      error: function() {
        console.log('check access token error')
      }
    })
  }

  handleLogOut() {
    this.logOut();
  }

  logOut() {
    var that = this;
    $.ajax({
      url: '/logOut',
      success: function(isSignedIn) {
        that.setState({ isSignedIn: isSignedIn })
      },
      error: function() {
        console.log('logout error')
      }
    })
  }

  render () {
    if (this.state.isSignedIn) {
      return (
        <div>
          <p>Welcome</p>
          <a onClick={ this.handleLogOut.bind(this) }> Log out</a>
        </div>
      )
    } else {
      return (
        <div>
        <p>Sign in</p>
          <a href="/login/facebook">Log In with Facebook</a>
        </div>
      )
    }
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
