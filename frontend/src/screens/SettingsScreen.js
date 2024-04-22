import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
  Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../actions/userActions";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../actions/userActions";
import housebg from "../static/housebg.png";

function SettingsScreen() {
  // const [profilePicture, setProfilePicture] = useState("");
  const [bio, setBio] = useState("");
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState("");
  const [school, setSchool] = useState("");
  const [pets, setPets] = useState(false);
  const [allergies, setAllergies] = useState("");
  const [budget, setBudget] = useState(0);
  const [sleepSchedule, setSleepSchedule] = useState("");
  const [pfp, setPfp] = useState("olalal");
  const [foo, setFoo] = useState(false);
  const userProfile = useSelector((state) => state.userProfile);
  const { error, loading, profile } = userProfile;
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Instantiate the useNavigate hook

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  useEffect(() => {
    if (!localStorage.getItem("userInfo")) {
      navigate("/login");
    }
    dispatch(getProfile(userInfo.username));
    if (profile) {
      setAge(profile.age);
      setAllergies(profile.allergies);
      setBio(profile.bio);
      setBudget(profile.budget);
      setGender(profile.gender);
      setPets(profile.pets);
      setSchool(profile.school);
      setSleepSchedule(profile.sleep_schedule);
      setPfp(profile.profile_picture);
    }
  }, [dispatch]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setFoo(!foo);
    const name = userInfo.name.split(" ");
    const fname = name[0];
    const lname = name[1];
    // Dispatch action to update user profile
    // console.log(pfp);
    await dispatch(
      updateProfile(
        userInfo.username,
        fname,
        lname,
        bio,
        age,
        gender,
        school,
        pets,
        allergies,
        budget,
        sleepSchedule,
        pfp
      )
    );
    console.log(
      // (userInfo.username,
      [
        fname,
        lname,
        bio,
        age,
        gender,
        school,
        pets,
        allergies,
        budget,
        sleepSchedule,
        pfp,
      ]
    );
    setTimeout(navigate(`/profile/${userInfo.username}/`), 2000);
  };

  const profileRedirect = () => {
    navigate("/profile");
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
          backgroundRepeat: "repeat",
        }}
      >
        <Container className="mb-5 mt-5">
          <Row>
            <Col md={3}></Col>
            <Col md={6}>
              <Card>
                <Card.Header
                  as="h3"
                  className="text-center bg-primary text-light"
                >
                  Edit Your Profile
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={submitHandler}>
                    <Form.Group controlId="formFileMultiple" className="mb-3">
                      <Form.Label>
                        <i
                          className="fa-solid fa-calendar-days"
                          style={{ color: "#005eff" }}
                        ></i>
                        &nbsp;Upload Your Profile Picture
                      </Form.Label>
                      <Form.Control
                        type="file"
                        name="image"
                        onChange={(e) => setPfp(e.target.files)}
                        style={{ backgroundColor: "#d9d9d9" }}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-dark">Bio</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Tell us a bit about yourself"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Age</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Your age"
                        value={age}
                        onChange={(e) => setAge(parseInt(e.target.value))}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Gender</Form.Label>
                      <Form.Control
                        as="select"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="">Select...</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                      </Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>School</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Your school name"
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Do You Have Pets?</Form.Label>
                      <Form.Control
                        as="select"
                        value={pets}
                        onChange={(e) => setPets(e.target.value)}
                      >
                        <option value={false}>No</option>
                        <option value={true}>Yes</option>
                      </Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Allergies</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Any allergies?"
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Budget ($)</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Your monthly budget"
                        value={budget}
                        onChange={(e) => setBudget(parseInt(e.target.value))}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Sleep Schedule</Form.Label>
                      <Form.Control
                        as="select"
                        value={sleepSchedule}
                        onChange={(e) => setSleepSchedule(e.target.value)}
                      >
                        <option value="">Select...</option>
                        <option value="daytime">Daytime</option>
                        <option value="afternoon">Afternoon</option>
                        <option value="night">Night</option>
                      </Form.Control>
                    </Form.Group>

                    <Button
                      type="submit"
                      variant="primary"
                      className="btn btn-danger"
                      // onClick={delayedProfileRedirect}
                    >
                      {!foo ? (
                        "Save"
                      ) : (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      )}
                    </Button>
                  </Form>
                  <Button
                    type="button"
                    variant="primary"
                    className="btn btn-info mt-3"
                    onClick={profileRedirect}
                    style={
                      {
                        // : "blue",
                      }
                    }
                  >
                    View Profile
                  </Button>
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

export default SettingsScreen;
