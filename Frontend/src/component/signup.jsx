import "./signup.css";
import { useState } from "react";
import Signin from "./signin";
import { useNavigate } from "react-router-dom";

async function handleSubmit(e, navigate) {
  e.preventDefault();
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  let name = e.target.name.value;
  let email = e.target.email.value;
  let password = e.target.password.value;
  let confirmPassword = e.target["confirm-password"].value;
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }
  let data = {
    name: name,
    email: email,
    password: password,
  };

  try {
    let res = await fetch(`${backendUrl}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    let response = await res.json();

    if (res.status === 200) {
      console.log("Signup Successful", response.message);
      navigate("/signin");
    } else {
      console.error(response.error);
      alert(response.error);
    }
  } catch (error) {
    console.error("Signup Error", error);
  }
}

function Signup() {
  const navigate = useNavigate();
  return (
    <>
      <div>
        <div className="signup">
          <h1>Sign Up</h1>

          <form
            onSubmit={(e) => {
              handleSubmit(e, navigate);
            }}
          >
            <div className="signup-name">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="signup-email">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="signup-password">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="signup-confirm-password">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                name="confirm-password"
                placeholder="Confirm your password"
                required
              />
            </div>
            <div className="signup-submit">
              <button type="submit" className="signup-button">
                Sign Up
              </button>
            </div>
          </form>

          <div className="signup-signin">
            <p>Already have an account?</p>
            <button
              type="button"
              className="signin-button"
              onClick={() => {
                navigate("/signin");
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
