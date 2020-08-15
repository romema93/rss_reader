import React from 'react';
import './App.css';
import {BrowserRouter, Route, Redirect} from "react-router-dom";
import Signin from "./components/Signin/Signin";
import SignUp from "./components/Signup/Signup";
import Main from "./components/Main/Main";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Route exact path="/" component={Signin}/>
                <Route exact path="/signup" component={SignUp}/>
                <Route path="/main" component={Main}/>
                <Route path="*">
                    <Redirect to="/main"/>
                </Route>
            </BrowserRouter>
        </div>
    );
}

export default App;
