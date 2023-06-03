import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Profile.css";
import useLocalStorageStatus from "../hooks/useLocalStorageStatus";
import EditPopUp from "../components/EditPopUp";
import DeleteProfileButton from "../components/DeleteProfileButton";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(null);
  const isLoggedIn = useLocalStorageStatus("token");
  const navigate = useNavigate();
  const [showPopUpFirstName, setShowPopUpFirstName] = useState(false);
  const [showPopUpLastName, setShowPopUpLastName] = useState(false);

  useEffect(() => {
    const getData = () => {
      if (!isLoggedIn) {
        const params = new URLSearchParams(window.location.search);
        const query = params.get("token");
        if (query) {
          params.delete("token");
          localStorage.setItem("token", query);
          setToken(query);
          navigate("/users/profile");
        }
      }

      if (isLoggedIn) {
        axios
          .get(`https://fcfootball.azurewebsites.net/api/v1/users/me`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            setProfile(res.data);
          })
          .catch((err) => console.log(err));
      }
    };
    getData();
  }, [token, isLoggedIn,navigate]);

  const logOut = () => {
    localStorage.removeItem("roles");
    localStorage.removeItem("token");
    setProfile(null);
    window.location.reload();
  };

  return (
    <div className="wrap-profile">
      {profile ? (
        <>
          <div className="left-panel">
            <div className="photo-panel"></div>
            <div></div>
          </div>
          <div className="right-panel">
            <h1 className="profile-h1">Profile information and settings</h1>
            <div className="profile-it">
              <span className="profile-it-txt">Email</span>
              <span id="email-field" className="profile-it-txt">
                {profile.email}
              </span>
            </div>
            <div className="profile-it">
              <span className="profile-it-txt">First Name</span>
              {showPopUpFirstName ? (
                <EditPopUp
                  setShow={setShowPopUpFirstName}
                  dataToEdit="firstName"
                  email={profile.email}
                  dataValue={profile.firstName}
                />
              ) : (
                <>
                  <span id="firstName-field" className="profile-it-txt">
                    {profile.firstName}
                  </span>
                  <button
                    className="btn-edit"
                    onClick={() => {
                      setShowPopUpFirstName(true);
                    }}
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                </>
              )}
            </div>
            <div className="profile-it">
              <span className="profile-it-txt">Last Name</span>
              {showPopUpLastName ? (
                <EditPopUp
                  setShow={setShowPopUpLastName}
                  dataToEdit="lastName"
                  email={profile.email}
                  dataValue={profile.lastName}
                />
              ) : (
                <>
                  <span id="lastName-field" className="profile-it-txt">
                    {profile.lastName}
                  </span>
                  <button
                    className="btn-edit"
                    onClick={() => {
                      setShowPopUpLastName(true);
                    }}
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                </>
              )}
            </div>
            <div className="btns-profile">
              <button className="btn-log-out" onClick={logOut}>
                Log out
              </button>
              <DeleteProfileButton email={profile.email} />
            </div>
          </div>
        </>
      ) : (
        <div className="log-out-wrap">
          <span className="profile-span">You've been logged out or you don't have sufficient permission to view this tab, sign in again or sign up for free!</span>
          <div className="btns-profile">
            <Link className="btn-log-out" to="/SignIn">
              Sign in
            </Link>
            <Link className="btn-log-out" to="/SignUp">
              Sign up
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
