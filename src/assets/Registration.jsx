import React from 'react'
import './Login.css';
import {Link, withRouter} from 'react-router-dom';
import logo from './logo.png';
import { db, auth} from '../firebase';

//Password Component which can be shown or hidden. Allows user to change password visibility.
class PasswordShowHide extends React.Component {

  constructor(props) {
      super(props);
  
//states hidden and password
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

//sets password state from true to false or from false to true.
toggleShow() {
  this.setState({ hidden: !this.state.hidden });
}

//sets state of password as empty when first opening login page.
componentDidMount() {
  if (this.props.password) {
    this.setState({ password: this.props.password });
  }
}

render() {
  return (
    <div>
         {/*Password Field*/}
      <input
        className="loginInput passwordClass"
        id="pwd"
        className="textfield passwordClass"
        name="password"
        type={this.state.hidden ? 'password' : 'text'}
        value={this.state.password} 
        onChange={this.handlePasswordChange} //when click on Show Password change password visibility.
        //pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" 
      /><br></br>
      {/*}An element to toggle between password visibility*/}
      <input className ="pass-visible" type="checkbox" onChange={this.toggleShow}></input><span class="loginLabel pass-visible" style={{marginLeft: "10pt"}}>Show Password</span><br></br>
    </div>
  );
}

}

class Registration extends React.Component {   

  submitForm() { /*method to prevent submission of form if any fields are left blank*/
    //store each of the values in a variable
    var t = document.getElementById("firstName").value; 
    var u = document.getElementById("lastName").value;
    var v = document.getElementById("age").value;
    var x = document.getElementById("phone").value;
    var y = document.getElementById("newEmail").value;
    var z = document.getElementById("pwd").value;
    var a = document.getElementById("payroll").value;
    var b =  document.getElementById("NI").value;
    //check if at least one of the variable are empty
    if(t==='' || u==='' || v==='' || x ==='' || y === '' || z === '' || a ==='' || b === '')  
    {         
      window.alert("Warning! All fields must not be empty!");
        return false;  //stop form submission
    }
    else if(!(y.endsWith("@fdm.net"))) { //check that email ends with fdm.net
      window.alert("Warning! Email must be a valid fdm.net email. Ends with @fdm.net");  
      return false; //stop form submission if does not end with fdm.net
    }
    else {
      return true; //form accepted
    }
}

signUp = (e) => {
  e.preventDefault(); 
  
  const email = document.querySelector("#newEmail").value;
  const password = document.querySelector("#pwd").value;
  const firstName = document.querySelector("#firstName").value;
  const lastName = document.querySelector("#lastName").value;
  const age = document.querySelector("#age").value;
  const phone = document.querySelector("#phone").value;
  const role = document.querySelector("#role").value;
  const payroll = document.querySelector("#payroll").value;
  const NI = document.querySelector("#NI").value;

  if(this.submitForm() === true) {
  //create email and password authentication.
  auth.createUserWithEmailAndPassword(email, password).then((u) => {
    //add new user account to database.
      console.log("Successfuly registered");      
      db.collection('users')
    .add({
      Firstname: firstName,
      Lastname: lastName,
      Age: age,
      Phone_Number: phone,
      Role: role,
      Email: email,
      Password: password,
      Payroll: payroll,
      NI: NI
      
  })
  this.props.history.push('/mainBoard'); //login after redirecting to login page.
    })
    .catch((err) => {
      console.log("Error: " + err.toString());
      alert("Email address already registered")
    })
  }


}


render() {
    return (
      
        <div>
          <header className="loginHead">
          {/*Display logo for FDM*/}
        <div id="logo-base">
        <img id="logo" src={logo} alt='FDM powered by iSheet' />
        </div>
    </header>
    <body>
        <h2 id="Register">Create New Account</h2><br></br> 
        {/*Form to create new account*/}
        <form id="registrationForm">     
            <div id = "registrationDiv">       
           
            <label className="loginLabel" htmlFor="firstName">First Name</label><br></br> 
            <input type="text" className="textfield" id="firstName" name="firstName" required></input><br></br>    
           
            <label className="loginLabel" htmlFor="lastName">Last Name</label><br></br>         
            <input type="text" className="textfield" id="lastName" name="lastName" required></input><br></br>  
           
            <label className="loginLabel" htmlFor="age">Age</label><br></br>         
            <input type="number" className="textfield" id="age" name="age" required></input><br></br>  
            
            <label className="loginLabel" htmlFor="phone" >Phone Number</label><br></br>         
            <input type="tel" className="textfield" id="phone" name="phone" required></input><br></br>  
            
            <label className="loginLabel" htmlFor="role">Role</label><br></br>   
            <select id="role" name="role">
                  <option value="Consultant">Consultant </option>
                  <option value="Consultant Line Manager">Consultant Line Manager</option>
                  <option value="Admin">Admin</option>
            </select>     <br></br> 
            
            <label className="loginLabel" htmlFor="payroll" >Payroll</label><br></br>         
            <input type="text" className="textfield" id="payroll" name="payroll" required></input><br></br>
           
            <label className="loginLabel" htmlFor="NI" >NI (National Insurance) Number</label><br></br>         
            <input type="text" className="textfield" id="NI" name="NI" required></input><br></br>  
           
            <label className="loginLabel" htmlFor="newEmail" >Email</label><br></br>         
            <input  type="email" className="textfield" id="newEmail" name="newEmail" required></input><br></br> 
          
            <label className="loginLabel" htmlFor="psw">Password</label><br></br> 
            <PasswordShowHide />            
             {/*Password Field*/} 
            
            {/*button to sign up and submit details to firebase*/}
            <input id="registerButton" type="submit" className="submitLogin" value="Register" onClick={this.signUp}></input><br></br>
            <Link to={{pathname: "/"}} className="loginLinks">Log In to Existing Account</Link>
        </div> 
        </form>
        
    </body>
    </div>
    )
}
}
export default withRouter(Registration);
