import React from 'react'
//import './Dashboard.css';
import './Personal_details.css';
import { db, auth } from '../firebase';

class PersonalDetails extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            Firstname: null,
            LastName: null,
            Age: null,
            Phone: null,
            Role: null,
            Email: null,
            Payroll: null,
            NI: null
        }
    }

    componentDidMount() {
        console.log("mounted")
        db.collection('users').where("Email", "==", auth.currentUser.email)
        .get()
        .then( snapshot => {
            snapshot.forEach( doc => {
                const data = doc.data()
                this.setState({ Firstname: data.Firstname});
                this.setState({ Lastname: data.Lastname});
                this.setState({ Age: data.Age});
                this.setState({ Phone: data.Phone_Number});
                this.setState({ Role: data.Role});
                this.setState({ Email: data.Email});
                this.setState({ Payroll: data.Payroll});
                this.setState({ NI: data.NI});
                console.log(this.state.Firstname)
            })
            
            
        })
        .catch( error => console.log(error))
    }

    render() {
    return (
        <div className="dashboard">
            <header>
                <div>
                    <div class="container" id="removeMargin"> 
                        <div class="row">
                            <div class="col-md-11">
                                <h1>Personal Details</h1>
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
                        <div class="col-md-6">
                            <div id="pdForm">
                                <p>Firstname: {this.state.Firstname}</p>
                                <p>Lastname: {this.state.Lastname}</p>
                                <p>Age: {this.state.Age}</p>
                                <p>Phone: {this.state.Phone}</p>
                                <p>Role: {this.state.Role}</p>
                                <p>Email: {this.state.Email}</p>
                                <p>Payroll: {this.state.Payroll}</p>
                                <p>National Insurance: {this.state.NI}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
}
export default PersonalDetails;