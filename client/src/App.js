import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./views/Home";
import Admin from "./views/Admin";
import Wrestler from "./views/Wrestler";
import NotFound from "./views/NotFound";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/admin" component={Admin} />
          <Route path="/wrestler/:name" component={Wrestler} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
