import React from "react";

function ModeTitle(props) {
  const { text, className } = props;

  return <div className={`title ${className}`}>{text}</div>;
}

export default ModeTitle;
