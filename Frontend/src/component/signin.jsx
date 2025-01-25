import "./signin.css";
import { useEffect, useState, useContext } from "react";
import Signup from "./signup";
import Portfolio from "./portfolio";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { StoreContext } from "./Context/storecontext.jsx";
import { use } from "react";

function Signin() {
  const [isauth, setisauth] = useState(false);
  const navigate = useNavigate();
  const { store, setStore } = useContext(StoreContext);

  async function handleSubmit(e) {
    e.preventDefault();
    let backendUrl = import.meta.env.VITE_BACKEND_URL;
    let email = e.target.email.value;
    let password = e.target.password.value;
    let data = {
      email: email,
      password: password,
    };
    console.log(" Data ", data, " Backend URL ", backendUrl);
    try {
      let res = await fetch(`${backendUrl}/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      let response = await res.json();
      console.log(response);
      if (response.error) {
        console.log("Error in Signin");
      } else {
        console.log("Signin Successful");
        setStore((prev) => ({ ...prev, isauth: true }));
        setisauth(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function check_authenticate() {
    try {
      let backendUrl = import.meta.env.VITE_BACKEND_URL;

      let res = await fetch(`${backendUrl}/verifyToken`, {
        method: "GET",
        credentials: "include",
      });
      let data = await res.json();

      if (data.isauth) {
        console.log("Authenticated");
        setisauth(true);
        setStore((prev) => ({ ...prev, isauth: true }));
      } else {
        setisauth(false);
        console.log("Not authenticated");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    check_authenticate();
  }, []);
  useEffect(() => {
    if (isauth) {
      navigate("/portfolio");
    }
  }, [isauth]);
  return (
    <>
      <>
        <div>
          <div className="signin">
            <h1>Sign In</h1>
            <form
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <div className="signin-email">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="signin-password">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div className="signin-button">
                <button type="submit">Sign In</button>
              </div>
            </form>
            <div className="signin-signup">
              <p>Don't have an account?</p>
              <button type="button" onClick={() => navigate("/signup")}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </>
      <ToastContainer />
    </>
  );
}

export default Signin;
