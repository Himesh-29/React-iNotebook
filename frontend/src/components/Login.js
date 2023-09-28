import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export const Login = (props) => {
  let history = useHistory(); //Using history to help us in redirecting

  const [userCreds, setUserCreds] = useState({ email: "", password: "" }); //Using useState to store user credentials, i.e. email and password

  //Using this onChange to change and read the value from the input fields
  const onChange = (e) => {
    setUserCreds({ ...userCreds, [e.target.name]: e.target.value });
  };

  //This function will help in logging in, first it will stop the page reloading due to form submission, then we will authenticate the user using our backend and granting access to the logged in user
  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = `${process.env.REACT_APP_BACKEND_URL}/auth/login`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userCreds.email,
        password: userCreds.password,
      }),
    });
    const json = await response.json();
    if (response.status === 200) {
      //If json.success===true, then grant access or in the other case show an alert dialogue box
      localStorage.setItem("authToken", json.authToken); //Saving the authentication token in local storage
      toast.success("Account logged in successfully", {
        position: "top-left",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setTimeout(() => {
        history.push("/"); //Redirecting to '/' route
      }, 2000);
    } else {
      if ("error" in json) {
        toast.error(json.error, {
          position: "top-left",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        Array.from(json.errors).forEach(function (err) {
          toast.error(err.msg, {
            position: "top-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        });
      }
    }
  };
  return (
    <div>
      <ToastContainer
        position="top-left"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        theme="light"
      />
      <h2 className="mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
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
            value={userCreds.email}
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
            value={userCreds.password}
            onChange={onChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};
