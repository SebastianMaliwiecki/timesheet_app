import React from 'react'
import './Dashboard.css';
import firebase from "../firebase";
import { db, auth } from "../firebase";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        var user = firebase.auth().currentUser;
        var email;
        if (user != null) {
            email = user.email;
    }
    this.state = {
      timesheets: null,
      email: null,
      firstName: null,
      lastName: null,
      role: null,
    }  
   
    }

    

   
    //initial render
    componentDidMount() {
      
        console.log('mounted')
      
        //get details of current user signed in.
        db.collection('users').where("Email", "==", auth.currentUser.email)
          .get()
          .then( snapshot => {
            var role2 = null;
            snapshot.forEach( doc => {
              console.log(doc.id);
              console.log("Doc.data(): " + doc.data())
              console.log(doc.data().Role)
              const data = doc.data();
              role2 = data.Role;
              console.log("Role2: " + role2)
              //set role, firstname, lastname with details from firstore.
              this.setState({ role: data.Role})
              this.setState({ firstName: data.Firstname})
              this.setState({ lastName: data.Lastname})
            })
            console.log("current Role: " + this.state.role)

            //if current user is Consultant Line Mananger or Admin then show Pending Timesheets in dashboard.
            if(this.state.role === "Consultant Line Manager" || this.state.role === "Admin") {
              console.log(this.state.role);
              db.collection('Timesheet')
              .get()
              .then( snapshot => {
                const timesheets = [];
                snapshot.forEach( doc => {
                  const data = doc.data()
                  //get pending timesheets
                  if(data.approve ==='Pending') {
                    timesheets.push(data)
                  }
                 
                })
                this.setState({timesheets: timesheets}) 

              })
              .catch( error => console.log(error))
            }
            else { //if current user is Consultant it will show accepted timesheets in dashboard
              console.log("Role is: " + this.state.role);
              //get timesheets of current user
              db.collection('Timesheet').where("email", "==", auth.currentUser.email)
              .get()
              .then( snapshot => {
                const timesheets = [];
                snapshot.forEach( doc => {
                  const data = doc.data()
                  //get accepted timesheets of current user
                  if(data.approve ==='Accepted') {
                    timesheets.push(data)
                  }
                })
                this.setState({timesheets: timesheets}) 
                //this.state.timesheets = timesheets;
              })
              .catch( error => console.log(error))
            }
          })
          .catch( error => console.log(error))

       
        }
        
        //approve timesheets
    approveTimesheet(value) {
      var timeSheetId = value;
      console.log(timeSheetId);
      
      //change status of approve field to accepted
      db.collection("Timesheet").doc(timeSheetId).update({
        approve: "Accepted",
      }).then(() => {
        console.log("Timesheet successfully approved!");
        alert("Timesheet successfully accepted!");
    }).catch((error) => {
        console.error("Error removing timesheet: ", error);
    });

    this.props.history.push('/approved');

    }

    //reject timesheets
    rejectTimesheet(value) {
      var timeSheetId = value;
      console.log(timeSheetId);

      //change approve status to "rejected"
      db.collection("Timesheet").doc(timeSheetId).update({
        approve: "Rejected",
      })
      .then(() => {
        console.log("Timesheet successfully rejected!");
        alert("Timesheet successfully rejected!");
    }).catch((error) => {
        console.error("Error removing timesheet: ", error);
    });

    this.props.history.push('/rejected');

    }

    //delete timesheets
    deleteTimesheet(value) {
      //e.preventDefault()
      var timeSheetId = value;
      console.log(timeSheetId);

      //delete timesheet document in firestore
      db.collection("Timesheet").doc(timeSheetId).delete().then(() => {
        console.log("Timesheet successfully deleted!");
        alert("Timesheet successfully deleted!");
    }).catch((error) => {
        console.error("Error removing timesheet: ", error);
    })


    this.props.history.push('/view'); //redirect to view all timesheets

    }

    //show buttons approve, reject, delete
    showButtons(timesheet) {
      //if current user is Admin or Consultant Line Manager then show all buttons
      if(this.state.role === "Admin" || this.state.role==="Consultant Line Manager") {
        return (
          <div>
            
            <button id="button" type="button"  onClick={this.approveTimesheet.bind(this, timesheet.timesheetId)}>Approve</button>
            <button id="button" class="button" type="button"  onClick={this.rejectTimesheet.bind(this, timesheet.timesheetId)}>Reject</button>
            <button id="button" class="button"  type="button"  onClick={this.deleteTimesheet.bind(this, timesheet.timesheetId)}>Delete</button>
          </div>
        )
      } 

      else { //if current user is Consultant only show Delete button.
        return (
          <div>
            <button id="button" class="button"  type="button"  onClick={this.deleteTimesheet.bind(this, timesheet.timesheetId)}>Delete</button>
          </div>
        )
      }
    }

    
    displayMessage() {
      //show recently submitted message if current user is Admin or Consultant Line Manager
      if(this.state.role === "Admin" || this.state.role==="Consultant Line Manager") {
        return (
          <h1>Recently Submitted Timesheets:</h1>
        )
      }
      else { //If current user is Consultant show Recently Approved Timesheets message.
        return (
          <h1>Recently Approved Timesheets:</h1>
        )
      }
    }

    render() {
    return (
        <div>
        <div className="dashboard">            
            <header>
              <div class="container">
                <h1>Dashboard</h1>
              </div>
            </header>
            <div className="dashContent">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                          <div className="timesheets">
                            {/*Welcome message*/}
                            <h1>Hello {this.state.firstName} {this.state.lastName}! </h1>
                            <p>Todays date is {new Date().toLocaleDateString()} and current time {new Date().toLocaleTimeString()}</p>
                            <hr></hr>
                            {this.displayMessage()}
                            <br></br>
                            {//view timesheets
                              this.state.timesheets &&
                              this.state.timesheets.map(timesheet => {
                                return (
                                  <form className='Sheet'>
                                    ID:<input id="sheetId" type="text" value={timesheet.timesheetId} readOnly/>                                  
                                    <p className='Email' >Email: {timesheet.email}</p>
                                    {/*<p className='Id' id="sheetId2" >Timesheet Id: {timesheet.timesheetId}</p>*/}
                                    <p className='Description' >Description: {timesheet.description}</p>
                                    <p className='StartTime' >Start time: {timesheet.startTime}</p>
                                    <p className='EndTime' >End time: {timesheet.endTime}</p>
                                    <p className='StartDate' >Start Date: {timesheet.startDate}</p>
                                    <p className='EndDate' >End Date: {timesheet.endDate}</p>
                                    <p className='Unpaid' >Unpaid Hours: {timesheet.unpaidHours}</p>
                                    <p className='Approved'>Approved: {timesheet.approve}</p>
                                    <hr></hr>
                                    <div id="centerBtn">
                                      {this.showButtons(timesheet)}
                                    </div>
                                  </form>
                                )
                              })
                            }
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        </div>
    )
}
}
export default Dashboard;