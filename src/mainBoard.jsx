import React from 'react';
import Navbar from './components/Navbar';
import './App.css';

import Dashboard from './assets/Dashboard.jsx';
import Timesheet from './assets/Timesheet.jsx';
import PersonalDetails from './assets/Personal_details.jsx';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import View from './assets/SubTimesheet/View_all.jsx';
import Approved from './assets/SubTimesheet/Approved.jsx';
import Pending from './assets/SubTimesheet/Pending.jsx';
import Rejected from './assets/SubTimesheet/Rejected.jsx';

class mainBoard extends React.Component {
  

render() {
  return (


    <Router>
         <div>      
         <Navbar />  
         <main>
           <Switch>  {/*switch to these paths using navigation*/}
             <Route path="/mainBoard" exact component={Dashboard} />  {/*where user goes when first logging in*/}
             <Route path="/dashboard" component={Dashboard} /> {/*React component for dashboard page*/}
             <Route path="/timesheet" component={Timesheet} /> {/*Reactcomponent for submitting timesheet*/ }
             <Route path="/personal_details" component={PersonalDetails} />  {/*Reactcomponent for user's personal details*/ }
             <Route path="/view" component={View}/> {/*Reactcomponent for viewing all timesheets*/ }
             <Route path="/approved" component={Approved}/> {/*Reactcomponent for approved timesheets*/ }
             <Route path="/rejected" component={Rejected}/> {/*Reactcomponent for rejecting timesheets*/ }
             <Route path="/pending" component={Pending}/> {/*Reactcomponent for pending (submitted) timesheets*/ }
           </Switch>
         </main>
       </div>
    </Router>

  );
}
}

export default mainBoard;

