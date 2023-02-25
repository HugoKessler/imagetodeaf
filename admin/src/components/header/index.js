import React from "react";
import styled from "styled-components";
import User from "./user";

export default () => {
  return (
    <Header>
      <User />
    </Header>
  );
};

const Header = styled.div`
  padding: 15px;
  background-color: #284fa2;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: sticky;
  left: 0;
  top: 0;
  z-index: 10;
  width: 100%;
`;
