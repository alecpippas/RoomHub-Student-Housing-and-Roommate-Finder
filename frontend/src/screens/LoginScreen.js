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

function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setpass] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState("fa fa-eye-slash");

  const submitHandler = (e) => {
    e.preventDefault();
  };

  const showPassword = () => {
    var pword = document.getElementById("pass");
    if (pword.type == "password") {
      pword.type = "text";
      setShow("fa fa-eye");
    } else {
      pword.type = "password";
      setShow("fa fa-eye-slash");
    }
  };

  return (
    <>
      <Container className="mt-5">
        <Row>
          <Col md={4}></Col>
          <Col md={4}>
            <Card>
              <Card.Header as="h3" className="text-center bg-black text-light">
                Log In
              </Card.Header>
              <Card.Body>
                {error && <Message variant="danger">{error}</Message>}
                <Form onSubmit={submitHandler}>
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
                        value={pass}
                        onChange={(e) => setpass(e.target.value)}
                        id="pass"
                      />
                    </InputGroup>
                  </Form.Group>
                  <br />
                  <div className="d-grid gap-2">
                    <Button className="btn btn-md btn-success" type="submit">
                      Submit
                    </Button>
                  </div>
                </Form>
                <Row className="py-3">
                  <Col>
                    Not a User?&nbsp;
                    <Link to="/signup">Register Now</Link>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}></Col>
        </Row>
      </Container>
    </>
  );
}

export default LoginScreen;
