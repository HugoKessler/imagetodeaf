import React, { useRef, useEffect, useState } from "react";
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
  const screen = useRef(null);
  const audio = new Audio("https://github.com/HugoKessler/imagetodeaf/blob/master/admin/src/assets/audioIntro.mp3?raw=true");
  const [audioReaded, setAudioReaded] = useState(false);

  return (
    <div
      style={{ display: "flex", height: "100%" }}
      onClick={() => {
        if (!audioReaded) {
          audio.play();
          setAudioReaded(true);
        }
      }}
    >
      <Router>
        <div ref={screen} className="main">
          <div className="screen-container">
            <div className="live">
              <div className="content">
                <div className="mode-frame">
                  <Camera screen={screen} />
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
      </Router>
    </div>
  );
};
