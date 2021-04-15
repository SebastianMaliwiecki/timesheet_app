import React from 'react'
import './Login.css';
import {Link } from 'react-router-dom';
import logo from './logo.png';
import { auth } from '../firebase';


//Password Component which can be shown or hidden. Allows use to change password visibility.
class PasswordShowHide extends React.Component {

    constructor(props) {
        super(props);
    

    this.state = {
        hidden: true,
        password: '',
    };

    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.toggleShow = this.toggleShow.bind(this);
}
handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }
  toggleShow() {
    this.setState({ hidden: !this.state.hidden });
  }
  componentDidMount() {
    if (this.props.password) {
      this.setState({ password: this.props.password });
    }
  }

  clearHighlightPassword() {
    document.getElementById("password").style.boxShadow = "none";
}

  render() {
    return (
      <div>
           {/*Password Field*/}
        
        <input
          className="loginInput passwordClass"
          id="password"
          name="password"
          type={this.state.hidden ? 'password' : 'text'}
          value={this.state.password}
          onChange={this.handlePasswordChange}
          onFocus={this.clearHighlightPassword}
        /><br></br>
        {/*}An element to toggle between password visibility*/}
        <input className ="pass-visible" type="checkbox" onChange={this.toggleShow}></input><span class="loginLabel pass-visible" style={{marginLeft: "10pt"}}>Show Password</span><br></br>
      </div>
    );
  }

}

class Login extends React.Component {

  submitForm() { /*method to prevent submission of form if fields email or password are left blank*/
    var x = document.getElementById("email");
    var y = document.getElementById("password");
    if(x.value==='' && y.value==='')  
    {
        alert("Warning! Email and password field must not be empty!");
        document.getElementById("email").style.boxShadow = "0 0 10px red";
        document.getElementById("password").style.boxShadow = "0 0 10px red";        
        return false;  //stop form submission
    }
    else if(x.value==='')
    {
      alert("Warning! Email field must not be empty!");
        document.getElementById("email").style.boxShadow = "0 0 10px red";        
        return false;     //stop form submission
    }
    else if(y.value==='')
    {
      alert("Warning! Password field must not be empty!");
        document.getElementById("password").style.boxShadow = "0 0 10px red";                
        return false;  //stop form submission
    }  
    return true;
    }

/*functions to clear highlight from text fields when user focuses on them*/
clearHighlightEmail() {
    document.getElementById("email").style.boxShadow = "none";
}

  signIn = (e) => {
    e.preventDefault()
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    if(this.submitForm() === true) { //if all fields entered
      auth.signInWithEmailAndPassword(email, password) //signs in with email and password
      .then((u) => {
        console.log("Successfuly logged in:" + auth.currentUser.email);
      })
      .catch((err) => { //if email and password entered is invalid
        console.log("Error: " + err.toString());
        alert("Wrong email or password. Please try again")
      })
      }
    }
    

    render() {
    return (
        
        <div>
          <header className="loginHead">
        <div id="logo-base">
          <figure>
                <img id="logo" src={logo} alt='FDM powered by iSheet' />
                </figure>
        </div>
    </header>
    <h2>Welcome to the Timesheets Application</h2>
    <form id="login">
      {/*form to enter email and password to sign in*/}
        <div id="loginForm">
        <label className="loginLabel" for="email">Email</label><br></br>
        <input className="loginInput" type="email" id="email" name="email" onFocus={this.clearHighlightEmail}></input><br></br>
        
        <label className="loginLabel"  for="password">Password</label><br></br>
        <PasswordShowHide />
        {/*button to sign in*/}
        <input className="submitLogin" type="button" value="Log In" onClick={this.signIn} ></input><br></br>
        
        {/*Link to Registration component to create new account*/}
        <Link to="/Registration" class="loginLinks">Create New Account</Link>
        {/*If user doesn't remember password. Currently, not */}
        <Link to="#" className="loginLinks">Forgotten Password?</Link>
        </div>
    </form>
    </div>
    )
}
}
export default Login;