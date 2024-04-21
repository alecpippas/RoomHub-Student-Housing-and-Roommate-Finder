import React from "react";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userActions";
import { redirect, useNavigate, useParams } from "react-router-dom";

function Header() {
  const userLogin = useSelector((state) => state.userLogin);
  let { userInfo } = userLogin;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfoCache = JSON.parse(localStorage.getItem("userInfo"));
  if (!userInfo && userInfoCache) {
    userInfo = userInfoCache;
  }

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      <Navbar
        className="navbar navbar-expand-lg bg-primary"
        data-bs-theme="dark"
      >
        <div className="container-fluid">
          <LinkContainer to="/">
            <Nav.Link className="navbar-brand">RoomHub</Nav.Link>
          </LinkContainer>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarColor01"
            aria-controls="navbarColor01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarColor01">
            <ul className="navbar-nav me-auto">
              {/* <li className="nav-item">
                <LinkContainer to="/profile">
                  <Nav.Link className="nav-link active">Profile</Nav.Link>
                </LinkContainer>
              </li>
              <li className="nav-item">
                <LinkContainer to="/home">
                  <Nav.Link className="nav-link">Home</Nav.Link>
                </LinkContainer>
              </li> */}
              <li className="nav-item">
                <LinkContainer to="/listings">
                  <Nav.Link className="nav-link">Listings</Nav.Link>
                </LinkContainer>
              </li>
              {/* <li className="nav-item">
                <LinkContainer to="/about">
                  <Nav.Link className="nav-link">About </Nav.Link>
                </LinkContainer>
              </li> */}
              {userInfo ? (
                <li className="nav-item dropdown">
                  <LinkContainer to="/">
                    <Nav.Link
                      className="nav-link dropdown-toggle"
                      data-bs-toggle="dropdown"
                      role="button"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <span>
                        <i className="fa-solid fa-user"></i>
                      </span>
                      &nbsp; {userInfo.name || userInfoCache.username}
                    </Nav.Link>
                  </LinkContainer>
                  <div className="dropdown-menu">
                    <LinkContainer to="/profile">
                      <Nav.Link className="dropdown-item">Profile</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/settings">
                      <Nav.Link className="dropdown-item">Settings</Nav.Link>
                    </LinkContainer>
                    <div className="dropdown-divider"></div>
                    <Nav.Link className="dropdown-item" onClick={logoutHandler}>
                      Log Out
                    </Nav.Link>
                  </div>
                </li>
              ) : (
                <li className="nav-item dropdown">
                  <LinkContainer to="/account">
                    <Nav.Link
                      className="nav-link dropdown-toggle"
                      data-bs-toggle="dropdown"
                      role="button"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      Account
                    </Nav.Link>
                  </LinkContainer>
                  <div className="dropdown-menu">
                    <LinkContainer to="/login">
                      <Nav.Link className="dropdown-item">Log In</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/signup">
                      <Nav.Link className="dropdown-item">Sign Up</Nav.Link>
                    </LinkContainer>
                  </div>
                </li>
              )}
            </ul>
            {/* <form className="d-flex">
              <input
                className="form-control me-sm-2"
                type="search"
                placeholder="Search"
              />
              <button className="btn btn-secondary my-2 my-sm-0" type="submit">
                Search
              </button>
            </form> */}
          </div>
        </div>
      </Navbar>
    </>
  );
}

export default Header;
