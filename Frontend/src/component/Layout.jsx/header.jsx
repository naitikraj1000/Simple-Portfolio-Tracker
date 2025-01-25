import "./header.css";
import { useNavigate, useLocation } from "react-router-dom";
import Signin from "../signin";
import { StoreContext } from "../Context/storecontext";
import { useContext } from "react";
import { useState, useEffect } from "react";
import { use } from "react";

function Header() {
  const url = useLocation().pathname;
  const navigate = useNavigate();
  const { store, setStore } = useContext(StoreContext);
  const button_txt = url != "/portfolio" ? "PROFILE" : "LOG OUT";

  async function log_out() {
    console.log("Logging out");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
      await fetch(`${backendUrl}/logout`, {
        method: "GET",
        credentials: "include",
      });
      setStore((prev) => ({
        ...prev,
        isauth: false,
      }));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  async function check_authenticate_pre_loading() {
    try {
      let backendUrl = import.meta.env.VITE_BACKEND_URL;

      let res = await fetch(`${backendUrl}/verifyToken`, {
        method: "GET",
        credentials: "include",
      });
      let data = await res.json();
    
      if (data.isauth) {
        setStore((prev) => ({ ...prev, isauth: true,user_email:data.email }));
      } else {
        console.log("Not Authenticated");
        setStore((prev) => ({ ...prev, isauth: false }));
      }

    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    check_authenticate_pre_loading();
  }, []);

  return (
    <>
      <div className="header">
        {url != "/" && (
          <div className="home" onClick={() => navigate("/")}>
            Home
          </div>
        )}
        <div className="search-stock">
          <input
            type="search"
            placeholder="Search Stock"
            onChange={(e) => {
              setStore((prev) => ({
                ...prev,
                search_text: e.target.value,
              }));
            }}
          />
        </div>
        <div
          className="Porfile-details"
          onClick={() => {
            if (url == "/portfolio") {
              // Logout
              log_out();
            } else {
              navigate("/signin");
            }
          }}
        >
          {button_txt}
        </div>
      </div>
    </>
  );
}

export default Header;
