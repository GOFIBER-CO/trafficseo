import React, { useEffect } from "react";

//import Scss
import "./assets/scss/themes.scss";

//imoprt Route
import Route from "./Routes";

// Import Firebase Configuration file
// import { initFirebaseBackend } from "./helpers/firebase_helper";
import { Redirect } from "react-router-dom";
// Fake Backend
import fakeBackend from "./helpers/AuthType/fakeBackend";

import "./App.css";
import { checkAuth } from "./helpers/helper";

// Activating fake backend

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_APIKEY,
//   authDomain: process.env.REACT_APP_AUTHDOMAIN,
//   databaseURL: process.env.REACT_APP_DATABASEURL,
//   projectId: process.env.REACT_APP_PROJECTID,
//   storageBucket: process.env.REACT_APP_STORAGEBUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
//   appId: process.env.REACT_APP_APPID,
//   measurementId: process.env.REACT_APP_MEASUREMENTID,
// };

// init firebase backend
// initFirebaseBackend(firebaseConfig);

function App() {
  const infoUser = async () => {
    try {
      const user = await checkAuth();
      const dataLocal = sessionStorage.getItem("authUser");
      if (!user && !dataLocal) {
        sessionStorage.clear();
        return <Redirect to={{ pathname: "/login" }} />;
      }
      if (user) {
        sessionStorage.setItem("authUser", JSON.stringify(user));
        sessionStorage.setItem("permission", JSON.stringify(user?.permission));
        sessionStorage.setItem(
          "isEnable2FaAuthenticate",
          JSON.stringify(user?.isEnable2FaAuthenticate)
        );
        sessionStorage.setItem("verify", JSON.stringify(user?.verify2Fa));
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    infoUser();
  }, []);
  return (
    <React.Fragment>
      <Route />
    </React.Fragment>
  );
}

export default App;
