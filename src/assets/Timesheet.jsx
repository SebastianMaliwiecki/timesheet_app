import React from 'react'
import './Dashboard.css';
import { db, auth } from "../firebase";
import "./Timesheet.css";

//function to submit timesheet
function addTimesheet(sstart, ttime, eend, ttime2, ddescription, uunpaid, email, approve) {
    
  //add timesheet to firebase firestore database 'Timesheet' with the following fields.
    db.collection("Timesheet").add({
      timesheetId: "",
      startDate: sstart,
      startTime: ttime,
      endDate: eend,
      endTime: ttime2,
      description: ddescription,
      unpaidHours: uunpaid,
      email: email,
      approve: approve
    })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);

      //update the id with the auto_id generated for by firebase
      docRef.set({
        timesheetId: docRef.id,
        startDate: sstart,
        startTime: ttime,
        endDate: eend,
        endTime: ttime2,
        description: ddescription,
        unpaidHours: uunpaid,
        email: email,
        approve: "Pending"
      })
  })
  .catch((error) => {
    console.error("Error adding document: ", error);
});
  }

  
  class Timesheet extends React.Component {
    constructor() {
      super();
      this.state = {
        timesheetId: "",
        start: "",
        time: "",
        end: "",
        time2: "",
        description: "",
        unpaid:""
      };
    }
    setStart = (val) => {
      this.setState({ start: val });
    };
    setTime = (val) => {
      this.setState({ time: val });
    };
    setEnd = (val) => {
      this.setState({ end: val });
    };
    setTime2 = (val) => {
      this.setState({ time2: val });
    };
    setDescription = (val) => {
      this.setState({ description: val });
    };
    setunpaid = (val) => {
      this.setState({ unpaid: val });
    };
  
    handleSubmit = (e) => {
      e.preventDefault();
      if(this.submitForm() == true) {
        addTimesheet(
          this.state.start,
          this.state.time,
          this.state.end,
          this.state.time2,
          this.state.description,
          this.state.unpaid,
          auth.currentUser.email, //add email of current user logged in
          "Pending"
        );
        alert("Timesheet submitted");
        this.setState({
          timeSheetId: '',
          start: '',
          time: '',
          end: '',
          time2: '',
          description: '',
          unpaid:'',
          email: ''
        });
      }
      else {
        alert("Warning! All fields must not be empty!")
      }
    };

    state = {
      timesheets: null,
      email: null
    }

    componentDidMount() {
      console.log('mounted')
      db.collection('Timesheet')
        .get()
        .then( snapshot => {
          const timesheets = [];
          snapshot.forEach( doc => {
            const data = doc.data()
            timesheets.push(data)
          })
          this.setState({ timesheets: timesheets})
        })
        .catch( error => console.log(error))

    }

    submitForm() { /*method to prevent submission of form if any fields are left blank*/
      var t = document.getElementById("startDate").value;
      var u = document.getElementById("startTime").value;
      var v = document.getElementById("endDate").value;
      var x = document.getElementById("endTime").value;
      var y = document.getElementById("unpaid").value;
      var z = document.getElementById("description").value;
      if(t==='' || u===''  || v===''  || x ==='' || y === ''  || z === '' )  
      {   
          console.log(t)
          console.log(v)
          return false;  //stop form submission
      }
      else {
        return true;
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
                              <h1>Submit timesheet</h1>
                          </div>
                      </div>
                  </div>
              </div>
          </header>
          <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                          <div className="">
                          </div> 
                          {/*submit timesheet form*/}
                            <div className="submit">
                              <h3>Date & Time Worked</h3>
                              <div className="start">
                                <label className="timesheet"> Start Date & Time: </label>
                                <input
                                className="timesheet"
                                  type="date"
                                  value={this.state.start}
                                  onChange={(e) => this.setStart(e.target.value)}
                                  id ="startDate"
                                />
                                <input
                                className="timesheet"
                                  type="time"
                                  value={this.state.time}
                                  onChange={(e) => this.setTime(e.target.value)}
                                  id = "startTime"
                                />
                              </div>
                            </div>
                            <div className="end">
                              <label className="timesheet"> End Date & Time: </label>
                              <input
                                className="timesheet"
                                type="date"
                                value={this.state.end}
                                onChange={(e) => this.setEnd(e.target.value)}
                                id = "endDate"
                              />
                              <input
                                className="timesheet"
                                type="time"
                                value={this.state.time2}
                                onChange={(e) => this.setTime2(e.target.value)}
                                id = "endTime"
                              />
                            </div>
                            <div className="unpaid">
                              <label className="timesheet">Unpaid/Break Time</label>
                              <input
                              className="timesheet"
                                type="time"
                                value={this.state.unpaid}
                                onChange={(e) => this.setunpaid(e.target.value)}
                                id ="unpaid"
                              />
                            </div>
                            <div className="description">
                              <label className="timesheet"> Description </label>
                              <textarea
                                placeholder="Description"
                                value={this.state.description}
                                onChange={(e) => this.setDescription(e.target.value)}
                                id = "description"
                              ></textarea>
                            </div>
                            <div onClick={this.handleSubmit} id="btn">
                            <span class="noselect">Submit</span>
                          </div>
                        </div>
                    </div>    
          
          <div id="circle"></div>
        </div>
      </div>
      );
    }
  }
  export default Timesheet;