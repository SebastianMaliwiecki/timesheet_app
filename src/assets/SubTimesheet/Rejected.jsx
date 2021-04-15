import React from 'react'
//import './Dashboard.css';
import './Rejected.css';
import firebase from "../../firebase";
import { db, auth } from "../../firebase";

class Rejected extends React.Component {
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

    componentDidMount() {
      
        console.log('mounted')
      
        
        //var docRef = db.collection('users').doc().where("email", "==", auth.currentUser.email);
      
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

            
            if(this.state.role === "Consultant Line Manager" || this.state.role === "Admin") {
              console.log(this.state.role);
              db.collection('Timesheet')//.where("email", "==", auth.currentUser.email)
              .get()
              .then( snapshot => {
                const timesheets = [];
                snapshot.forEach( doc => {
                  const data = doc.data()
                  if(data.approve === 'Rejected') {
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
                  if(data.approve === 'Rejected') {
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


        //this.state.users &&
        //this.state.users.map(user => {

        //})

       
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

    this.props.history.push('/approved');

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

    this.props.history.push('/rejected');

    }

    deleteTimesheet(value) {
      //e.preventDefault()
      var timeSheetId = value;
      console.log(timeSheetId);

      db.collection("Timesheet").doc(timeSheetId).delete().then(() => {
        console.log("Timesheet successfully deleted!");
        alert("Timesheet successfully deleted!");
    }).catch((error) => {
        console.error("Error removing timesheet: ", error);
    })


    this.props.history.push('/view');

    }

    /*
    handleChange(event) {
      this.setState({
        timeSheetId: event.target.value,
      })
    }*/

    showButtons(timesheet) {
      if(this.state.role === "Admin" || this.state.role==="Consultant Line Manager") {
        return (
          <div>
            
            <button id="button" type="button"  onClick={this.approveTimesheet.bind(this, timesheet.timesheetId)}>Approve</button>
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
                                <h1>Rejected</h1>
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
export default Rejected;