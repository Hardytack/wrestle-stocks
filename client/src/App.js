import React, { useState } from "react";
import "./App.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./views/Home";
import Admin from "./views/Admin";
import Wrestler from "./views/Wrestler";
import NotFound from "./views/NotFound";
import Login from "./views/Login";
import MyProfile from "./views/MyProfile";
import AllWrestlers from "./views/AllWrestlers";

import WithAuth from "./components/WithAuth";

function App() {
  const [username, setUsername] = useState(
    localStorage.getItem("username") ? localStorage.getItem("username") : ""
  );
  return (
    <Router>
      <div className="App">
        <Navbar username={username} />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/wrestlers" component={AllWrestlers} />
          <Route path="/admin" component={(props) => WithAuth(props, Admin)} />
          <Route
            path="/my-profile"
            component={(props) =>
              WithAuth({ ...props, username: username }, MyProfile)
            }
          />
          <Route path="/wrestler/:name" component={Wrestler} />
          <Route path="/login">
            <Login setUsername={setUsername} />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
