import React from 'react'
//import './Dashboard.css';
import './View_all.css';
import firebase from "../../firebase";
import { db, auth } from "../../firebase";

class View_all extends React.Component {

  constructor(props) {
    super(props);

    var user = firebase.auth().currentUser;
    var email;
    if (user != null) {
        email = user.email;

       

        //this.handleChange = this.handleChange.bind(this);
}
this.state = {
  timesheets: null,
  email: null,
  role: null,
}  

}
    //initial render of component
    componentDidMount() {
      //check who is current user signed in
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

          //check if current user is Consultant Line Manager or Admin.
          if(this.state.role === "Consultant Line Manager" || this.state.role === "Admin") {
            console.log(this.state.role);
            db.collection('Timesheet') //get all timesheets for all users.
            .get()
            .then( snapshot => {
              const timesheets = [];
              snapshot.forEach( doc => {
                const data = doc.data()
                //get all timesheets for all users
                timesheets.push(data)
              })
              this.setState({timesheets: timesheets}) 
            })
            .catch( error => console.log(error))
    
          }
          else {
            console.log("Role is: " + this.state.role);
            //get timesheets for only current user signed in from firestore collection Timesheet.
            db.collection('Timesheet').where("email", "==", auth.currentUser.email)
            .get()
            .then( snapshot => {
              const timesheets = [];
              snapshot.forEach( doc => {
                const data = doc.data()
                
                timesheets.push(data)
              })
              this.setState({timesheets: timesheets}) 
            })
            .catch( error => console.log(error))
          }
        })
        .catch( error => console.log(error))

        
    }

    //approve timesheet
    approveTimesheet(value) {
        var timeSheetId = value;
        console.log(timeSheetId);
        
        //update field approve to "Accepted"
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
  
      //Reject Timesheet
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
  
      //Delete timesheet
      deleteTimesheet(value) {
        var timeSheetId = value;
        console.log(timeSheetId);
  
        db.collection("Timesheet").doc(timeSheetId).delete().then(() => {
          console.log("Timesheet successfully deleted!");
          alert("Timesheet successfully deleted!");
      }).catch((error) => {
          console.error("Error removing timesheet: ", error);
      })
  
  
      this.props.history.push('/dashboard');
  
      }

      //show buttons approve, reject or delete.
      showButtons(timesheet) {
        //check current user is Admin or Consultant Line Manager. If yes show all buttons.
        if(this.state.role === "Admin" || this.state.role==="Consultant Line Manager") {
          return (
            <div>
              
              <button id="button" type="button"  onClick={this.approveTimesheet.bind(this, timesheet.timesheetId)}>Approve</button>
              <button id="button" class="button" type="button"  onClick={this.rejectTimesheet.bind(this, timesheet.timesheetId)}>Reject</button>
              <button id="button" class="button"  type="button"  onClick={this.deleteTimesheet.bind(this, timesheet.timesheetId)}>Delete</button>
            </div>
          )
        } 
        //only show delete button when current user is Consultant
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
                                <h1>View all</h1>
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
                                    {/*show unique id of timesheet created by firebase*/}
                                    ID:<input id="sheetId" type="text" value={timesheet.timesheetId} readOnly/>                                  
                                    <p className='Email' >Email: {timesheet.email}</p>
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
export default View_all;