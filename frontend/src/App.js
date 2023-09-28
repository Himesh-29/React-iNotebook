import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Navbar } from "./components/Navbar";
import { Home } from "./components/Home";
import { About } from "./components/About";
import NoteState from "./context/Notes/noteState";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";

import "react-toastify/dist/ReactToastify.css";

function App() {
  
  return (
    <>
      <NoteState>
        <Router>
          <Navbar />
          <div className="container my-3">
            <Switch>
              <Route exact path="/about">
                <About />
              </Route>
              <Route exact path="/">
                <Home />
              </Route>
              <Route exact path="/login">
                <Login />
              </Route>
              <Route exact path="/signup">
                <Signup />
              </Route>
            </Switch>
          </div>
        </Router>
      </NoteState>
    </>
  );
}

export default App;
