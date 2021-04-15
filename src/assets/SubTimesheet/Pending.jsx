import React from 'react'
import './Pending.css';
import firebase from "../../firebase";
import { db, auth } from "../../firebase";

class Pending extends React.Component {
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
      
        console.log('mounted')
      
        //get details of the current user signed in.
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

            //if user is a consultant line manager or admin
            if(this.state.role === "Consultant Line Manager" || this.state.role === "Admin") {
              console.log(this.state.role);
              db.collection('Timesheet') //get from Timesheet collection in firestore
              .get()
              .then( snapshot => {
                const timesheets = [];
                snapshot.forEach( doc => {
                  const data = doc.data()
                    //only gets timesheets where approve status is pending (just submitted)
                  if(data.approve === 'Pending') {
                    timesheets.push(data)
                  }
                  
                })
                this.setState({timesheets: timesheets}) 
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
                  //only gets timesheets where approve status is pending (just submitted)
                  if(data.approve === 'Pending') {
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
        

    approveTimesheet(value) {
      //e.preventDefault()
      var timeSheetId = value;
      console.log(timeSheetId);
      
      db.collection("Timesheet").doc(timeSheetId).update({
        approve: "Accepted",
      }).then(() => {
        console.log("Timesheet successfully approved!");
        alert("Timesheet successfully accepted!");
    }).catch((error) => {
        console.error("Error removing timesheet: ", error);
    });

    this.props.history.push('/timesheet'); 

    }

    rejectTimesheet(value) {
      //e.preventDefault()
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

    this.props.history.push('/timesheet'); 

    }

    //delete timesheet
    deleteTimesheet(value) {
      var timeSheetId = value;
      console.log(timeSheetId);

      //delete timesheet from firestore
      db.collection("Timesheet").doc(timeSheetId).delete().then(() => {
        console.log("Timesheet successfully deleted!");
        alert("Timesheet successfully deleted!");
    }).catch((error) => {
        console.error("Error removing timesheet: ", error);
    })


    this.props.history.push('/timesheet');

    }

    //show buttons approve, reject or delete
    showButtons(timesheet) {
      //show approve, reject or delete Admin or Consultant Line Manager
      if(this.state.role === "Admin" || this.state.role==="Consultant Line Manager") {
        return (
          <div>
            
            <button id="button" type="button"  onClick={this.approveTimesheet.bind(this, timesheet.timesheetId)}>Approve</button>
            <button id="button" class="button" type="button"  onClick={this.rejectTimesheet.bind(this, timesheet.timesheetId)}>Reject</button>
            <button id="button" class="button"  type="button"  onClick={this.deleteTimesheet.bind(this, timesheet.timesheetId)}>Delete</button>
          </div>
        )
      } 

      //show delete button only when Consultant..
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
                            <div class="col-md-12">
                                <h1>Pending</h1>
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
    )
}
}
export default Pending;