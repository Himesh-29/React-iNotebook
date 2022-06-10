import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export const Signup = (props) => {
  let history = useHistory();

  const [userCreds, setUserCreds] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  }); //Using useState to store user credentials, i.e. email and password

  //Using this onChange to change and read the value from the input fields
  const onChange = (e) => {
    setUserCreds({ ...userCreds, [e.target.name]: e.target.value });
  };

  //This function will help in signing up, first it will stop the page reloading due to form submission, then we will authenticate the user using our backend and create a new user
  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = `${process.env.REACT_APP_BACKEND_URL}/auth/createnewuser`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userCreds.name,
        email: userCreds.email,
        password: userCreds.password,
      }),
    });
    const json = await response.json();
    if (json.success) {
      //If json.success===true, then grant access or in the other case show an alert dialogue box
      localStorage.setItem("authtoken", json.authToken); //Saving the authentication token in local storage
      history.push("/"); //Redirecting to '/' route
      props.showAlert("Account created successfully", "success");
    } else {
      props.showAlert("Invalid credentials", "danger");
    }
  };

  return (
    <div>
      <h2 className="mb-4">Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            aria-describedby="emailHelp"
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">
            Confirm password
          </label>
          <input
            type="password"
            className="form-control"
            id="cpassword"
            name="cpassword"
            onChange={onChange}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={
            userCreds.password.length < 6 ||
            userCreds.name.length < 3 ||
            userCreds.password !== userCreds.cpassword
          }
        >
          Submit
        </button>
      </form>
    </div>
  );
};
