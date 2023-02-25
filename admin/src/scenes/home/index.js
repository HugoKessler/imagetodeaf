import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <h1 className="title">You can't read this, but welcome to BlindViewer</h1>

      <h2 className="subtitle">Choose an option below:</h2>

      <ul className="options">
        <li className="option">
          <Link to="/live">Live</Link>
        </li>
        <li className="option">
          <Link to="/video">Upload Video</Link>
        </li>
        <li className="option">
          <Link to="/image">Describe Image</Link>
        </li>
      </ul>
    </div>
  );
}

export default Home;
