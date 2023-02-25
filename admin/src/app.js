import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ReactComponent as UploadSVG } from "./assets/upload.svg";

import Home from "./scenes/home";
import Video from "./scenes/video";
import Camera from "./scenes/camera";
import ModeTitle from "./components/title";
import Transcript from "./components/transcript";
import Image from "./scenes/image";

import "./index.less";

export default () => {
  // const [audio] = useState(new Audio("localhost:8082/admin/src/assets/1677335270.mp3"));

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Router>
        <div className="main">
          <div className="screen-container">
            <div className="live">
              <div className="content">
                <div className="mode-frame">
                  <Camera />
                </div>
              </div>
              <ModeTitle className="live" text="LIVE"></ModeTitle>
            </div>
            <div className="video">
              <div className="content">
                <div className="mode-frame">
                  <Video />
                </div>
              </div>
              <ModeTitle className="upload" text="UPLOAD"></ModeTitle>
            </div>
          </div>
        </div>
        {/* <button onClick={() => audio.play()}>Play</button> */}
      </Router>
    </div>
  );
};
