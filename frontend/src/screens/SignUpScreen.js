import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
  InputGroup,
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { validEmail, validPassword } from "./Regex";
import { signup } from "../actions/userActions";
import housebg from "../static/housebg.png";

function SignUpScreen() {
  const navigate = useNavigate();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [message, setMessage] = useState("");
  const [show, setShow] = useState("fa fa-eye-slash");
  const dispatch = useDispatch();
  const location = useLocation();
  const redirect = location.search ? location.search.split("=")[1] : "/";

  const userSignup = useSelector((state) => state.userSignup);
  const { error, loading, userInfo } = userSignup;
 
  useEffect(() => {
    if (userInfo) {
      // navigate("/");
    }
    // setMessage("")
  }, [userInfo, error, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (error) {
      console.log(error)
      setMessage(error)
      // err = ""
      dispatch(signup(fname, lname, email, pass1))
    }
    else if (pass1 !== pass2) {
      setMessage("Passwords do not match");
      // navigate("/signup");
    } else if (!validEmail.test(email)) {
      setMessage("Invalid Email. Make sure it is a .edu domain");
    } else if (!validPassword.test(pass1)) {
      setMessage("Password does not fit criteria");
    } else {
      dispatch(signup(fname, lname, email, pass1));
      setMessage("Check Email to Verify Account");
      // navigate("/login");
    }
  };

  const showPassword = () => {
    var originalPass = document.getElementById("pass1");
    var confirmedPass = document.getElementById("pass2");
    if (originalPass.type === "password" && confirmedPass.type === "password") {
      originalPass.type = "text";
      confirmedPass.type = "text";
      setShow("fa fa-eye");
    } else {
      originalPass.type = "password";
      confirmedPass.type = "password";
      setShow("fa fa-eye-slash");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#F6F2D8",
        width: "100vw",
        height: "100vh",
      }}
    >
      <div
        style={{
          backgroundImage: "url(" + housebg + ")",
          border: "5px solid black",
          backgroundPosition: "center",
          position: "relative",
          // top: "45%",
          // left: "50%",
          // transform: "translate(-50%, -50%)",
          // width: "75vw",
          // height: "80vh",
          // borderRadius: "20px",
          backgroundRepeat: "repeat",
        }}
      >
        <Container
          className="mb-5 mt-5"
          style={
            {
              // top: "100%",
              // left: "50%",
              // transform: "scale(1,1)",
              // backgroundPosition: "center",
              // position: "relative",
              // minWidth: "100vw",
              // minHeight: "25vh",
            }
          }
        >
          <Row>
            <Col md={4}></Col>
            <Col md={4}>
              <Card>
                <Card.Header
                  as="h3"
                  className="text-center bg-black text-light"
                >
                  Sign Up
                </Card.Header>
                <Card.Body>
                  {message === "Check Email to Verify Account" ? <Message variant="success">{message}</Message>: <></>}
                  {message && message !== "Check Email to Verify Account" && <Message variant="danger">{message}</Message>}
                  {/* {setMessage("")} */}
                  {loading && <Loader />}
                  <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="fname">
                      <Form.Label>
                        <span>
                          <i className="fa fa-user"></i>
                        </span>
                        &nbsp;First Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Your First Name"
                        value={fname}
                        onChange={(e) => setFname(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="lname">
                      <Form.Label>
                        <span>
                          <i className="fa fa-user"></i>
                        </span>
                        &nbsp;Last Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Your Last Name"
                        value={lname}
                        onChange={(e) => setLname(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>
                        <span>
                          <i className="fa-solid fa-envelope"></i>
                        </span>
                        &nbsp;Email
                      </Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        {" "}
                        <span>
                          <i className={show}></i>
                        </span>{" "}
                        &nbsp;Password
                      </Form.Label>
                      <InputGroup className="mb-3">
                        <InputGroup.Checkbox onClick={showPassword} />{" "}
                        <Form.Control
                          placeholder="Enter Your Password"
                          required
                          type="password"
                          value={pass1}
                          onChange={(e) => setPass1(e.target.value)}
                          id="pass1"
                        />
                      </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        {" "}
                        <span>
                          <i className={show}></i>
                        </span>{" "}
                        Confirm Password
                      </Form.Label>
                      <InputGroup className="mb-3">
                        <InputGroup.Checkbox onClick={showPassword} />{" "}
                        <Form.Control
                          placeholder="Confirm Your Password"
                          required
                          type="password"
                          value={pass2}
                          onChange={(e) => setPass2(e.target.value)}
                          id="pass2"
                        />
                      </InputGroup>
                      <small>
                        Password must include [1-9][a-z][A-Z][_$@*!.] & be at
                        least 8 characters long
                      </small>
                    </Form.Group>
                    <br />
                    <div className="d-grid gap-2">
                      <Button className="btn btn-md btn-success" type="submit">
                        Register
                      </Button>
                    </div>
                  </Form>
                  <Row className="py-3">
                    <Col>
                      Already A User?&nbsp;
                      <Link to="/login">Log In Here</Link>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}></Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default SignUpScreen;
