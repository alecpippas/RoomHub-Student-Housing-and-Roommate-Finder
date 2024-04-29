import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import {
  fetchListing,
  updateListing,
  createListingImage,
  deleteListing,
  getComments,
} from "../actions/listingsActions";
import { postComment, checkFav, addFav, delFav } from "../actions/userActions";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
  ModalBody,
  Carousel,
  CarouselItem,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import housebg from "../static/housebg.png";

function ViewListingScreen({ params }) {
  const { id } = useParams();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const listingState = useSelector((state) => state.listingView);
  const { loading, error, listing } = listingState;

  const listingComments = useSelector((state) => state.listingComments);
  const { errorComments, loadingComments, comments } = listingComments;
  let commentHistory = null;
  if (comments) {
    commentHistory = comments.data;
  }
  const userCheckFav = useSelector((state) => state.userCheckFav);
  const { errorFav, loadingFav, isFav } = userCheckFav;

  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [flag, setFlag] = useState(false);
  const [favFlag, setFavFlag] = useState(false);

  const [title, setTitle] = useState(listing ? listing.title : "");
  const [description, setDescription] = useState(
    listing ? listing.description : ""
  );
  const [price, setPrice] = useState(listing ? listing.price : "");
  const [location, setlocation] = useState(listing ? listing.location : "");
  const [availableDate, setavailableDate] = useState(
    listing ? listing.available_from : ""
  );
  const [duration, setDuration] = useState(listing ? listing.duration : "");
  const [preferences, setPreferences] = useState(
    listing ? listing.Preferences : ""
  );
  const [isActive, setIsActive] = useState(listing ? listing.is_active : true);
  const [sqft, setSqft] = useState(listing ? listing.sqft : "");
  const [beds, setBeds] = useState(listing ? listing.bedrooms : "");
  const [baths, setBaths] = useState(listing ? listing.bathrooms : "");
  const [image, setImage] = useState(listing ? listing.image : []); //image URL
  const [amenities, setAmenities] = useState(listing ? listing.amenities : {});
  const [comment, setComment] = useState("");

  useEffect(() => {
    dispatch(fetchListing(id));
    if (listing) {
      setTitle(listing.title);
      setDescription(listing.description);
      setPrice(listing.price);
      setlocation(listing.location);
      setavailableDate(listing.available_from);
      setDuration(listing.duration);
      setPreferences(listing.preferences);
      setIsActive(listing.is_active);
      setSqft(listing.sqft);
      setBeds(listing.bedrooms);
      setBaths(listing.bathrooms);
      setImage(listing.image);
      setAmenities(listing.amenities);
    }
    if (userInfo) {
      dispatch(checkFav(userInfo.username, id));
    }
    dispatch(getComments(id));
  }, [dispatch, showModal, listing.username_id, flag, favFlag]);

  const handleToggleModal = () => {
    setShowModal(!showModal);
  };

  const handleToggleAlert = () => {
    setShowAlert(!showAlert);
  };

  const handleFavorite = () => {
    dispatch(addFav(userInfo.username, id, listing.title));
    setFavFlag(!favFlag);
  };

  const handleUnfavorite = () => {
    dispatch(delFav(userInfo.username, id));
    setFavFlag(!favFlag);
  };

  const handleDelete = () => {
    dispatch(deleteListing(id));
    setShowAlert(!showAlert);
    setTimeout(navigate("/listings"), 500);
  };

  const handleImages = (e) => {
    if (e.target.name == "image") {
      setImage(e.target.files);
    }
  };

  const handleAmenities = (e) => {
    const { name, value } = e.target;
    setAmenities({
      ...amenities,
      [name]: !amenities[name],
    });
  };

  const profileRedirect = (e) => {
    navigate(`/profile/${listing.username_id}/`);
  };

  const submitComment = () => {
    dispatch(postComment(userInfo.username, id, comment));
    setFlag(!flag);
    setComment("");
  };

  console.log(isFav);

  const submitHandler = (e) => {
    e.preventDefault();
    const jsonAmenities = JSON.stringify(amenities);
    dispatch(
      updateListing(
        {
          username: listing.username_id,
          title: title,
          description: description,
          price: price,
          location: location,
          available_from: availableDate,
          duration: duration,
          preferences: preferences,
          sqft: sqft,
          is_active: isActive,
          bedrooms: beds,
          bathrooms: baths,
          amenities: jsonAmenities,
          image: image,
        },
        id
      )
    );
    for (let i = 0; i < image.length; i++) {
      dispatch(
        createListingImage({
          image: image[i],
        })
      );
    }
    setTimeout(handleToggleModal, 500);
  };

  return (
    <div
      style={{
        backgroundImage: "url(" + housebg + ")",
        border: "5px solid black",
        backgroundPosition: "center",
        position: "relative",
        backgroundRepeat: "repeat",
      }}
    >
      <div>
        <Container>
          <Row>
            {loading && <Loader />}
            <Col key={listing.id} md={{ span: 6, offset: 2 }} xl={8}>
              <Card
                className="my-4"
                bg="primary"
                style={{
                  color: "white",
                  borderRadius: "10px",
                  border: "4px solid white",
                }}
              >
                <Card.Body>
                  {userInfo && listing.username_id === userInfo.username ? (
                    <Row>
                      <Col xl={3}>
                        <Button
                          variant="info"
                          className="text-center"
                          onClick={handleToggleModal}
                          style={{
                            borderRadius: "5px",
                            height: "40px",
                            width: "140px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          Edit Listing
                        </Button>
                      </Col>
                      <Col md={{ span: 6 }}>
                        <Card.Text
                          className="text-center mb-2"
                          style={{ fontSize: "200%", fontWeight: "bold" }}
                        >
                          {listing.title}
                        </Card.Text>
                      </Col>
                    </Row>
                  ) : userInfo && (!isFav || !isFav.data) ? (
                    <Row>
                      <Col xl={3}>
                        <Button
                          variant="light"
                          className="text-center"
                          onClick={handleFavorite}
                          style={{
                            borderRadius: "5px",
                            height: "40px",
                            width: "140px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          Favorite&nbsp;&nbsp;
                          <i
                            className="fa-regular fa-heart fa-2xl"
                            style={{ color: "#ff0000" }}
                          ></i>
                        </Button>
                      </Col>
                      <Col md={{ span: 6 }}>
                        <Card.Text
                          className="text-center mb-2"
                          style={{ fontSize: "200%", fontWeight: "bold" }}
                        >
                          {listing.title}
                        </Card.Text>
                      </Col>
                    </Row>
                  ) : userInfo && isFav && isFav.data ? (
                    <Row>
                      <Col xl={3}>
                        <Button
                          variant="light"
                          className="text-center"
                          onClick={handleUnfavorite}
                          style={{
                            borderRadius: "5px",
                            height: "40px",
                            width: "165px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          Unfavorite&nbsp;&nbsp;
                          <i
                            className="fa-solid fa-heart fa-2xl"
                            style={{ color: "#ff0000" }}
                          ></i>
                        </Button>
                      </Col>
                      <Col md={{ span: 6 }}>
                        <Card.Text
                          className="text-center mb-2"
                          style={{ fontSize: "200%", fontWeight: "bold" }}
                        >
                          {listing.title}
                        </Card.Text>
                      </Col>
                    </Row>
                  ) : (
                    <Card.Text
                      className="text-center mb-2"
                      style={{ fontSize: "200%", fontWeight: "bold" }}
                    >
                      {listing.title}
                    </Card.Text>
                  )}
                  {listing.image ? (
                    <Carousel>
                      {listing.image.map((img) => (
                        <Carousel.Item>
                          <img
                            style={{ borderRadius: "5px" }}
                            className="d-block w-100"
                            src={`/media/${img.image}`}
                            width="500"
                            height="500"
                          ></img>
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  ) : (
                    <></>
                  )}
                  <Card.Text
                    className="mt-3 text-center"
                    style={{ fontSize: "150%" }}
                  >
                    <i className="fa-solid fa-location-dot fa-xl"></i>
                    &nbsp;&nbsp;
                    <span style={{ color: "#ffbfbf", fontWeight: "bold" }}>
                      Address:
                    </span>{" "}
                    {listing.location}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Card
            style={{ borderRadius: "8px", border: "4px solid white" }}
            bg="primary"
          >
            <Row>
              <Col sm={12} md={6} lg={4} xl={7} className="p-2">
                <Card.Text className="ms-3" style={{ color: "white" }}>
                  <i
                    className="fa-solid fa-file-lines"
                    style={{ color: "#0091ff" }}
                  ></i>
                  &nbsp;
                  <span style={{ color: "#ffbfbf", fontWeight: "bold" }}>
                    Description:
                  </span>{" "}
                  {listing.description}
                </Card.Text>
                <Card.Text className="ms-3" style={{ color: "white" }}>
                  <i
                    className="fa-solid fa-dollar-sign"
                    style={{ color: "#0091ff" }}
                  ></i>
                  &nbsp;{listing.price} per month |{" "}
                  <i
                    className="fa-solid fa-ruler-combined"
                    style={{ color: "#0091ff" }}
                  ></i>
                  &nbsp;{listing.sqft} sqft |{" "}
                  <i
                    className="fa-solid fa-bed"
                    style={{ color: "#0091ff" }}
                  ></i>
                  &nbsp;{listing.bedrooms} bedroom(s) |&nbsp;{" "}
                  <i
                    className="fa-solid fa-shower"
                    style={{ color: "#0091ff" }}
                  ></i>
                  &nbsp;{listing.bathrooms} bathroom(s)
                </Card.Text>
                <Card.Text className="ms-3" style={{ color: "white" }}>
                  <i
                    className="fa-solid fa-circle-plus"
                    style={{ color: "#0091ff" }}
                  ></i>
                  &nbsp;
                  <span style={{ color: "#ffbfbf", fontWeight: "bold" }}>
                    Amenities:
                  </span>
                  {listing.amenities &&
                    Object.keys(listing.amenities).map((a) =>
                      listing.amenities[a] ? " " + a + " |" : <></>
                    )}
                </Card.Text>
                <Card.Text className="ms-3" style={{ color: "white" }}>
                  <i
                    className="fa-solid fa-users-line"
                    style={{ color: "#0091ff" }}
                  ></i>
                  &nbsp;
                  <span style={{ color: "#ffbfbf", fontWeight: "bold" }}>
                    Roommate Preferences:
                  </span>{" "}
                  {listing.preferences}
                </Card.Text>
                <Card.Text className="ms-3" style={{ color: "white" }}>
                  <i
                    className="fa-regular fa-clock"
                    style={{ color: "#0091ff" }}
                  ></i>
                  &nbsp;
                  <span style={{ color: "#ffbfbf", fontWeight: "bold" }}>
                    Duration:
                  </span>{" "}
                  {listing.duration}
                </Card.Text>
                <Card.Text className="ms-3" style={{ color: "white" }}>
                  <i
                    className="fa-regular fa-calendar-days"
                    style={{ color: "#0091ff" }}
                  ></i>
                  &nbsp;
                  <span style={{ color: "#ffbfbf", fontWeight: "bold" }}>
                    Available Move-In Date:
                  </span>{" "}
                  {listing.available_from}
                </Card.Text>
              </Col>
              <Col sm={12} md={6} lg={4} xl={5}>
                <Card.Text className="mt-4">&nbsp;</Card.Text>
                <Card.Text className="ms-3 mt-5" style={{ color: "white" }}>
                  <Button
                    variant="light"
                    style={{
                      borderRadius: "5px",
                      height: "30px",
                    }}
                    name={listing.username_id}
                    onClick={profileRedirect}
                  >
                    <i
                      className="fa-solid fa-user fa-xl"
                      style={{
                        color: "#0091ff",
                        display: "block",
                        margin: "0 auto",
                      }}
                    ></i>
                  </Button>
                  &nbsp;{" "}
                  <span style={{ color: "#ffbfbf", fontWeight: "bold" }}>
                    Uploaded by:
                  </span>{" "}
                  {listing.username_id}
                </Card.Text>
              </Col>
            </Row>
          </Card>
          <Card
            className="my-4"
            bg="primary"
            style={{
              color: "white",
              borderRadius: "10px",
              border: "4px solid white",
            }}
          >
            <Card.Body>
              <Card.Text style={{ fontSize: "150%", fontWeight: "bold" }}>
                Comment History
              </Card.Text>
              <Row>
                {userInfo && (
                  <Form>
                    <Form.Group className="mb-3" controlId="lname">
                      <Form.Label>Post Comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        type="text"
                        placeholder="Enter a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Button
                      variant="info"
                      style={{ fontSize: "75%", borderRadius: "7px" }}
                      onClick={submitComment}
                    >
                      Upload Comment
                    </Button>
                  </Form>
                )}
              </Row>
              <Row className="mt-3">
                {commentHistory &&
                  commentHistory.map((comment) => (
                    <Card.Text>
                      <span style={{ fontWeight: "bold", color: "#e3b3ff" }}>
                        {comment[2]}:
                      </span>{" "}
                      {comment[3]}
                    </Card.Text>
                  ))}
              </Row>
            </Card.Body>
          </Card>
        </Container>
        {listing && (
          <Modal
            centered={true}
            size="lg"
            show={showModal}
            backdrop={true}
            keyboard="true"
            onHide={handleToggleModal}
            scrollable={true}
          >
            <Modal.Header closeButton style={{ backgroundColor: "#000000" }}>
              <Modal.Title
                style={{
                  font: "caption",
                  fontFamily: "revert-layer",
                }}
                className="text-light"
              >
                Edit Listing
              </Modal.Title>
            </Modal.Header>
            <ModalBody style={{ backgroundColor: "#fffaf0" }}>
              <Form onSubmit={submitHandler} style={{ color: "black" }}>
                <Form.Group className="mb-3" controlId="title">
                  <Form.Label>
                    <i
                      className="fa-solid fa-heading"
                      style={{ color: "#005eff" }}
                    ></i>
                    &nbsp;Title
                  </Form.Label>
                  &nbsp;
                  <i
                    className="fa-solid fa-asterisk"
                    style={{ color: "#ff0000" }}
                  ></i>
                  <Form.Control
                    type="text"
                    // placeholder="Enter Title of Your Listing"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    autoFocus
                  />
                </Form.Group>
                <Form.Group controlId="formFileMultiple" className="mb-3">
                  <Form.Label>
                    <i
                      className="fa-solid fa-calendar-days"
                      style={{ color: "#005eff" }}
                    ></i>
                    &nbsp;Upload Images of Your Unit
                  </Form.Label>
                  &nbsp;
                  <i
                    className="fa-solid fa-asterisk"
                    style={{ color: "#ff0000" }}
                  ></i>
                  <Form.Control
                    type="file"
                    multiple
                    name="image"
                    onChange={handleImages}
                    required
                    style={{ backgroundColor: "#d9d9d9" }}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="description">
                  <Form.Label>
                    <i
                      className="fa-solid fa-align-justify"
                      style={{ color: "#005eff" }}
                    ></i>
                    &nbsp;Description
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    placeholder="(Optional): Enter Any Descriptive Details"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="location">
                  <Form.Label>
                    <i
                      className="fa-solid fa-location-dot"
                      style={{ color: "#005eff" }}
                    ></i>
                    &nbsp;Location
                  </Form.Label>
                  &nbsp;
                  <i
                    className="fa-solid fa-asterisk"
                    style={{ color: "#ff0000" }}
                  ></i>
                  <Form.Control
                    required
                    type="text"
                    name="location"
                    placeholder="Building #, Street, Suite, City, State, Zipcode"
                    value={location}
                    onChange={(e) => setlocation(e.target.value)}
                  />
                </Form.Group>
                <Row className="mt-3 mb-5">
                  <Form.Group
                    className="mb-3"
                    controlId="price"
                    as={Col}
                    md="4"
                  >
                    <Form.Label>
                      <i
                        className="fa-solid fa-dollar-sign"
                        style={{ color: "#005eff" }}
                      ></i>
                      &nbsp;Rent Price
                    </Form.Label>
                    &nbsp;
                    <i
                      className="fa-solid fa-asterisk"
                      style={{ color: "#ff0000" }}
                    ></i>
                    <Form.Control
                      type="number"
                      placeholder="0"
                      name="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="price"
                    as={Col}
                    md="4"
                  >
                    <Form.Label>
                      <i
                        className="fa-solid fa-calendar-days"
                        style={{ color: "#005eff" }}
                      ></i>
                      &nbsp;Availability Date
                    </Form.Label>
                    &nbsp;
                    <i
                      className="fa-solid fa-asterisk"
                      style={{ color: "#ff0000" }}
                    ></i>
                    <Form.Control
                      type="date"
                      placeholder=""
                      name="availableDate"
                      value={availableDate}
                      onChange={(e) => setavailableDate(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="duration"
                    as={Col}
                    md="4"
                  >
                    <Form.Label>
                      <i
                        className="fa-regular fa-clock"
                        style={{ color: "#005eff" }}
                      ></i>
                      &nbsp;Duration
                    </Form.Label>
                    &nbsp;
                    <i
                      className="fa-solid fa-asterisk"
                      style={{ color: "#ff0000" }}
                    ></i>
                    <Form.Control
                      type="text"
                      name="duration"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="Ex. # of months"
                      required
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group className="mb-3" controlId="sqft" as={Col} md="4">
                    <Form.Label>
                      <i
                        className="fa-solid fa-ruler-combined"
                        style={{ color: "#005eff" }}
                      ></i>
                      &nbsp;Square Footage
                    </Form.Label>
                    &nbsp;
                    <i
                      className="fa-solid fa-asterisk"
                      style={{ color: "#ff0000" }}
                    ></i>
                    <Form.Control
                      type="number"
                      placeholder="0"
                      name="sqft"
                      value={sqft}
                      onChange={(e) => setSqft(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="bed" as={Col} md="4">
                    <Form.Label>
                      <i
                        className="fa-solid fa-bed"
                        style={{ color: "#005eff" }}
                      ></i>
                      &nbsp;# of Bedrooms
                    </Form.Label>
                    &nbsp;
                    <i
                      className="fa-solid fa-asterisk"
                      style={{ color: "#ff0000" }}
                    ></i>
                    <Form.Control
                      type="number"
                      placeholder="0"
                      name="beds"
                      value={beds}
                      onChange={(e) => setBeds(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="bath" as={Col} md="4">
                    <Form.Label>
                      <i
                        className="fa-solid fa-shower"
                        style={{ color: "#005eff" }}
                      ></i>
                      &nbsp;# of Bathrooms
                    </Form.Label>
                    &nbsp;
                    <i
                      className="fa-solid fa-asterisk"
                      style={{ color: "#ff0000" }}
                    ></i>
                    <Form.Control
                      type="number"
                      placeholder="0"
                      name="baths"
                      value={baths}
                      onChange={(e) => setBaths(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Row>
                <Row className="mt-5">
                  <Form.Label>
                    <i
                      className="fa-solid fa-circle-plus"
                      style={{ color: "#005eff" }}
                    ></i>
                    &nbsp;Amenities
                  </Form.Label>
                  <div key={`inline-checkbox`} className="mb-3">
                    <Form.Check
                      inline
                      label="Gym"
                      name="Gym"
                      type="checkbox"
                      onChange={handleAmenities}
                      id="inline-checkbox-1"
                    />
                    <Form.Check
                      inline
                      label="Pool"
                      name="Pool"
                      type="checkbox"
                      onChange={handleAmenities}
                      id="inline-checkbox-2"
                    />
                    <Form.Check
                      inline
                      label="Sauna"
                      name="Sauna"
                      type="checkbox"
                      onChange={handleAmenities}
                      id="inline-checkbox-2"
                    />
                    <Form.Check
                      inline
                      label="Parking Lot"
                      name="Parking Lot"
                      type="checkbox"
                      onChange={handleAmenities}
                      id="inline-checkbox-2"
                    />
                    <Form.Check
                      inline
                      label="Air Conditioning"
                      name="Air-Conditioning"
                      type="checkbox"
                      onChange={handleAmenities}
                      id="inline-checkbox-2"
                    />
                    <Form.Check
                      inline
                      label="In-Unit Laundry"
                      name="In-Unit Laundry"
                      type="checkbox"
                      onChange={handleAmenities}
                      id="inline-checkbox-2"
                    />
                    <Form.Check
                      inline
                      label="Shared Laundry"
                      name="Shared Laundry"
                      type="checkbox"
                      onChange={handleAmenities}
                      id="inline-checkbox-2"
                    />
                    <Form.Check
                      inline
                      label="Dishwasher"
                      name="Dishwasher"
                      type="checkbox"
                      onChange={handleAmenities}
                      id="inline-checkbox-2"
                    />
                    <Form.Check
                      inline
                      label="Doorman"
                      name="Doorman"
                      type="checkbox"
                      onChange={handleAmenities}
                      id="inline-checkbox-2"
                    />
                    <Form.Check
                      inline
                      label="Elevator"
                      name="Elevator"
                      type="checkbox"
                      onChange={handleAmenities}
                      id="inline-checkbox-2"
                    />
                    <Form.Check
                      inline
                      label="Game Room"
                      name="Game Room"
                      type="checkbox"
                      onChange={handleAmenities}
                      id="inline-checkbox-2"
                    />
                  </div>
                </Row>
                <Form.Group className="mb-3" controlId="title">
                  <Form.Label>
                    <i
                      className="fa-solid fa-user-group"
                      style={{ color: "#005eff" }}
                    ></i>
                    &nbsp;Roommate Preferences
                  </Form.Label>
                  <Form.Control
                    name="preferences"
                    type="text"
                    placeholder="Enter criteria..."
                    value={listing.preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                  />
                </Form.Group>
                <Modal.Footer style={{ backgroundColor: "#fffaf0" }}>
                  <Button
                    variant="danger"
                    style={{
                      borderRadius: "5px",
                      display: "flex",
                      marginRight: "auto",
                    }}
                    onClick={handleToggleAlert}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleToggleModal}
                    style={{ borderRadius: "5px" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="btn btn-md btn-success"
                    variant="info"
                    style={{ borderRadius: "5px" }}
                  >
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Form>
            </ModalBody>
          </Modal>
        )}
        <Modal
          show={showAlert}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop={true}
          keyboard={true}
          onHide={handleToggleAlert}
        >
          <Modal.Header closeButton>
            <Modal.Title>ALERT</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>Are you sure you want to delete your listing?</p>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="primary"
              style={{ borderRadius: "5px" }}
              onClick={handleToggleAlert}
            >
              No
            </Button>
            <Button
              variant="info"
              style={{ borderRadius: "5px" }}
              onClick={handleDelete}
            >
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default ViewListingScreen;
