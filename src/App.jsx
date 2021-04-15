import React, {Component} from 'react';
import './App.css';
import Registration from './assets/Registration.jsx';
import Login from './assets/Login.jsx';
import MainBoard from './mainBoard.jsx';
import fire from './firebase';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';


class App extends Component {
  constructor(props) {
  super(props);

  this.state = {
    user: null,
  }

  this.authListener = this.authListener.bind(this);
}

componentDidMount() {
  this.authListener();
}

authListener() {
  fire.auth().onAuthStateChanged((user) => {
    if (user) {
      this.setState({ user });
    } else {
      this.setState({ user: null });
    }
  })
}
 


 render() {
  return (
    //Check if logged in or not.
    <Router>
      {/*check if user is logged in or not*/}
      {this.state.user ? (
        <Switch> {/*if logged in redirect to mainBoard component*/}        
          <Route path="/mainBoard" component={MainBoard}>
          </Route>
          <Route exact path="/">
              <Redirect to="/mainBoard" />
            </Route>
        </Switch>
      ) : (      
      <Switch> {/*if not logged in display login page*/}
      {/*if not logged in redirect to login component*/}
            <Route exact path="/" component={Login} />
            <Route path="/login" component={Login} /> 
            <Route path="/registration" component={Registration}/>
            <Route exact path="/mainBoard">
              <Redirect to="/" />
            </Route>
      </Switch>
      )}
    </Router>
    
  );
}
}

export default App;
