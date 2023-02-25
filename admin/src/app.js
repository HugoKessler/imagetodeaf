import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import User from "./scenes/user";

import api from "./services/api";

import { SENTRY_URL } from "./config";

import "./index.less";

export default () => {
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Router>
        <div className="main">
          <div className="screen-container">
            <Switch>
              <Route path="/" component={User} />
            </Switch>
          </div>
        </div>
      </Router>
    </div>
  );
};
