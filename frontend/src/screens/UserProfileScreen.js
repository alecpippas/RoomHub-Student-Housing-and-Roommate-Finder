import React, { useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import bg_yellow from "../static/bg_yellow.png";
import { getProfile } from "../actions/userActions";

function UserProfileScreen() {
  // const userLogin = useSelector((state) => state.userLogin);
  // const { userInfo } = userLogin;
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userProfile = useSelector((state) => state.userProfile);
  const { error, loading, profile } = userProfile;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
    dispatch(getProfile(userInfo.username));
  }, [dispatch]);

  console.log(profile);

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
          backgroundImage: "url(" + bg_yellow + ")",
          border: "5px solid black",
          backgroundPosition: "center",
          position: "relative",
          backgroundRepeat: "repeat",
        }}
      >
        <Container className="mt-5 mb-5">
          <Row>
            <Col md={3}></Col>
            <Col md={6}>
              <Card>
                <Card.Header
                  as="h3"
                  className="text-center bg-black text-light"
                >
                  User Profile
                </Card.Header>
                <Card.Body>
                  <p>
                    <strong>Name:</strong> {userInfo.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {userInfo.email}
                  </p>
                  <p>
                    <strong>Bio:</strong> {profile.bio || "Not provided"}
                  </p>
                  <p>
                    <strong>Age:</strong> {profile.age || "Not provided"}
                  </p>
                  <p>
                    <strong>Gender:</strong> {profile.gender || "Not provided"}
                  </p>
                  <p>
                    <strong>School:</strong> {profile.school || "Not provided"}
                  </p>
                  <p>
                    <strong>Pets:</strong> {profile.pets ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Allergies:</strong>{" "}
                    {profile.allergies || "Not provided"}
                  </p>
                  <p>
                    <strong>Budget:</strong> {profile.budget || "Not provided"}
                  </p>
                  <p>
                    <strong>Sleep Schedule:</strong>{" "}
                    {profile.sleepSchedule || "Not provided"}
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}></Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default UserProfileScreen;
