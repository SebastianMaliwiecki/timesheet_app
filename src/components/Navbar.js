import React from 'react'
import {Link} from 'react-router-dom';
import logo from './logo.png';
import './Navbar.css';
import fire from '../firebase';

function Navbar() {

    //signs out the current user
    function signOut() {
        fire.auth().signOut();
    }

    var user = fire.auth().currentUser;
    var email;
    if (user != null) {
        email = user.email;
    }

    return (
        <div>
            <nav className="navbar">
                <figure>
                    <img src={logo} alt='FDM powered by iSheet' />
                </figure>
                <div className="navOptions">
                    <ul>
                        {
                            <Link to="/dashboard" id="Link2">
                                <li>
                                    <a id="move">
                                    <i class="fas fa-columns"></i>
                                    Dashboard
                                    </a>
                                </li>
                            </Link>
                        }
                        {
                            <li>
                                <a id="highlight">
                                <i class="far fa-calendar-alt"></i>
                                Timesheets
                                <ul id="subNav">
                                    <Link to="/timesheet" id="Link2">
                                        <li>
                                            <p>
                                            <i class="fas fa-pen"></i>
                                            Submit timesheet
                                            </p>
                                        </li>
                                    </Link>
                                    <Link to="/view" id="Link2" >
                                        <li>
                                            <p id="viewAll">
                                            <i class="far fa-folder-open"></i>
                                            View all
                                            </p>
                                        </li>
                                    </Link>
                                    <Link to="/approved" id="Link2">
                                        <li>
                                            <p>
                                            <i class="far fa-check-circle"></i>
                                            Approved
                                            </p>
                                        </li>
                                    </Link>
                                    <Link to="/rejected" id="Link2">
                                        <li>
                                            <p>
                                            <i class="fas fa-times"></i>
                                            Rejected
                                            </p>
                                        </li>
                                    </Link>
                                    <Link to="/pending" id="Link2">
                                        <li>
                                            <p>
                                            <i class="far fa-hourglass"></i>
                                            Pending
                                            </p>
                                        </li>
                                    </Link>
                                </ul>
                                </a>
                                
                            </li>
                        }
                        {
                            <Link to="/personal_details" id="Link2">
                                <li>
                                    <a id="move">
                                    <i class="far fa-user-circle"></i>
                                    Personal details
                                    </a>
                                </li>
                            </Link>
                        }
                        {
                            <Link to="/" id="Link3" onClick={signOut}>
                                <li>
                                    <a id="move">
                                    <i class="fas fa-sign-out-alt"></i>
                                    Log Out
                                    </a>
                                </li>
                            </Link>
                        }
                        
                    </ul>
                    <p id="curSig">Signed in: {email}</p>
                </div>
            </nav>
        </div>
    )
}

export default Navbar