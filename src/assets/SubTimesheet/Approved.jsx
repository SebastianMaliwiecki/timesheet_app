import React from 'react'
//import './Dashboard.css';
import './Approved.css';
import firebase from "../../firebase";
import { db, auth } from "../../firebase";

class Approved extends React.Component {
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
        role: null,
      }  
   
    }

    componentDidMount() {
      //get details of current user from firebase database
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
            this.setState({ role: data.Role})
            
          })
          console.log("current Role: " + this.state.role)
          //this.state.timesheets = timesheets;

          //check if role of user is Consultant Line Manager of Admin
          if(this.state.role === "Consultant Line Manager" || this.state.role === "Admin") {
            console.log(this.state.role);
            db.collection('Timesheet')
            .get()
            .then( snapshot => {
              const timesheets = [];
              snapshot.forEach( doc => {
                const data = doc.data()
                
                //gets all the accepted timesheets
                if(data.approve === 'Accepted') {
                    timesheets.push(data)
                }                
              })
              this.setState({timesheets: timesheets}) 
              //this.state.timesheets = timesheets;
            })
            .catch( error => console.log(error))
    
          }
          else {
            console.log("Role is: " + this.state.role);
            db.collection('Timesheet').where("email", "==", auth.currentUser.email)
            .get()
            .then( snapshot => {
              const timesheets = [];
              snapshot.forEach( doc => {
                const data = doc.data()
                 //gets all the accepted timesheets
                if(data.approve === 'Accepted') {
                    timesheets.push(data)
                }     
              })
              this.setState({timesheets: timesheets}) 
            })
            .catch( error => console.log(error))
          }
        })
        .catch( error => console.log(error))

        
    }

    
  
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
  
      this.props.history.push('/rejected'); //redirect to rejected page
  
      }
  
      deleteTimesheet(value) { //delete timesheet

        var timeSheetId = value;
        console.log(timeSheetId);
  
        db.collection("Timesheet").doc(timeSheetId).delete().then(() => {
          console.log("Timesheet successfully deleted!");
          alert("Timesheet successfully deleted!");
      }).catch((error) => {
          console.error("Error removing timesheet: ", error);
      })
  
  
      this.props.history.push('/view'); //redirect to view all timesheets
  
      }

    //show buttons approve, reject or delete timesheet
    showButtons(timesheet) {
      //if user is Admin or Consultant Line Manager show approve, reject and delete buttons.
        if(this.state.role === "Admin" || this.state.role==="Consultant Line Manager") {
          return (
            <div>
            
              <button id="button" class="button" type="button"  onClick={this.rejectTimesheet.bind(this, timesheet.timesheetId)}>Reject</button>
              <button id="button" class="button"  type="button"  onClick={this.deleteTimesheet.bind(this, timesheet.timesheetId)}>Delete</button>
            </div>
          )
        } 
  
        //if user a consultant. Only show delete button
        else {
          return (
            <div>
              <button id="button" class="button"  type="button"  onClick={this.deleteTimesheet.bind(this, timesheet.timesheetId)}>Delete</button>
            </div>
          )
        }
      }

    render() {
    return (
        <div className="dashboard">
            <header>
                <div>
                    <div class="container" id="removeMargin"> 
                        <div class="row">
                            <div class="col-md-11">
                                <h1>Approved</h1>
                            </div>
                            <div class="col-md-1">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div className="dashContent">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                        <div className="timesheets">
                            {//show timesheets that have been accepted.
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
                                    <div id="centerBtn"> {/*Show buttons*/}
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
    )
}
}
export default Approved;