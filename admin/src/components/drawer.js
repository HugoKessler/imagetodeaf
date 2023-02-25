import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

export default () => {
  const [open, setOpen] = useState(true);

  if (open) {
    document.body.classList.add("open-drawer");
  } else {
    document.body.classList.remove("open-drawer");
  }

  return (
    <Sidebar>
      <MenuBtn onClick={() => setOpen(!open)} src={require("../assets/menu.svg")} />
      <Nav open={open}>
        <li>
          <NavLink to="/user" activeClassName="active">
            Users
          </NavLink>
        </li>
      </Nav>
    </Sidebar>
  );
};

const Sidebar = styled.div`
  width: 160px;
`;

const Nav = styled.ul`
  background-color: #2e3444;
  list-style: none;
  padding-top: 30px;
  z-index: 1;
  width: 160px;
  position: fixed;
  top: 65px;
  bottom: 0;
  left: 0;
  a {
    text-decoration: none;
    padding: 15px 20px 10px;
    display: block;
    color: #b9cee9;
    font-size: 16px;
  }
  a.active,
  a:hover {
    background-color: #2b2f3a;
    color: #fff;
  }
  transition: 0.2s;
  transform: ${({ open }) => (open ? "translateX(0)" : "translateX(-100%)")};
`;

const MenuBtn = styled.img`
  height: 30px;
  position: relative;
  z-index: 1;
  margin: 20px;
  position: absolute;
  z-index: 12;
  top: 0;
  left: 0;
  /* display: none;
  @media (max-width: 767px) {
    display: block;
  } */
`;
