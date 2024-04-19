import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchListings,
  createListing,
  createListingImage,
} from "../actions/listingsActions";
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
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import housebg from "../static/housebg.png";

function ListingsScreen() {
  const dispatch = useDispatch();
  const listingsState = useSelector((state) => state.listingsView);
  const { loading, error, listings } = listingsState;
  const navigate = useNavigate(); // Hook for navigation
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  // State for the new listing form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [location, setlocation] = useState("");
  const [availableDate, setavailableDate] = useState("");
  const [duration, setDuration] = useState("");
  const [preferences, setPreferences] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [sqft, setSqft] = useState(0);
  const [beds, setBeds] = useState(0);
  const [baths, setBaths] = useState(0);
  const [image, setImage] = useState([]); //image URL
  const [amenities, setAmenities] = useState({
    gym: false,
    pool: false,
    sauna: false,
    parking: false,
    air: false,
    inLaundry: false,
    shLaundry: false,
    dishwasher: false,
    doorman: false,
    elevator: false,
    game: false,
  });

  const [showModal, setShowModal] = useState(false);

  const handleAmenities = (e) => {
    console.log(amenities);
    const { name, value } = e.target;
    setAmenities({
      ...amenities,
      [name]: !amenities[name],
    });
  };

  const handleImages = (e) => {
    if (e.target.name == "image") {
      setImage(e.target.files);
    }
    console.log(image);
  };

  const handleToggleModal = () => {
    setShowModal(!showModal);
    setTitle("");
    setDescription("");
    setPrice(0);
    setlocation("");
    setavailableDate("");
    setDuration("");
    setPreferences("");
    setIsActive(true);
    setSqft(0);
    setBeds(0);
    setBaths(0);
    setImage([]);
    setAmenities({
      gym: false,
      pool: false,
      sauna: false,
      parking: false,
      air: false,
      inLaundry: false,
      shLaundry: false,
      dishwasher: false,
      doorman: false,
      elevator: false,
      game: false,
    });
  };

  useEffect(() => {
    dispatch(fetchListings());
  }, [dispatch]);

  // Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    const jsonAmenities = JSON.stringify(amenities);
    // console.log(images);
    await dispatch(
      createListing({
        username: userInfo.username,
        title: title,
        description: description,
        price: price,
        location: location,
        available_from: availableDate,
        duration: duration,
        preferences: preferences,
        sqft: sqft,
        bedrooms: beds,
        bathrooms: baths,
        amenities: jsonAmenities,
        image: image,
      })
    );
    for (let i = 0; i < image.length; i++) {
      await dispatch(
        createListingImage({
          image: image[i],
        })
      );
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url(" + housebg + ")",
        width: "100vw",
        height: "100vh",
      }}
    >
      <div>
        <Container
          style={{
            backgroundColor: "#f7f5e9",
            borderRadius: "10px",
            border: "5px solid black",
            borderColor: "black",
          }}
        >
          <h1 className="text-center">Available Units</h1>

          {userInfo ? (
            <Button
              style={{
                backgroundPosition: "center",
                display: "block",
                margin: "auto",
              }}
              onClick={handleToggleModal}
            >
              Create New Listing
            </Button>
          ) : (
            <></>
          )}
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
                Upload New Listing
              </Modal.Title>
            </Modal.Header>
            <ModalBody style={{ backgroundColor: "#fffaf0" }}>
              <Form onSubmit={submitHandler} style={{ color: "black" }}>
                <Form.Group className="mb-3" controlId="title">
                  <Form.Label>
                    <i
                      class="fa-solid fa-heading"
                      style={{ color: "#005eff" }}
                    ></i>
                    &nbsp;Title
                  </Form.Label>
                  &nbsp;
                  <i
                    class="fa-solid fa-asterisk"
                    style={{ color: "#ff0000" }}
                  ></i>
                  <Form.Control
                    type="text"
                    placeholder="Enter Title of Your Listing"
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
                      class="fa-solid fa-calendar-days"
                      style={{ color: "#005eff" }}
                    ></i>
                    &nbsp;Upload Images of Your Unit
                  </Form.Label>
                  &nbsp;
                  <i
                    class="fa-solid fa-asterisk"
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
                      class="fa-solid fa-align-justify"
                      style={{ color: "#005eff" }}
                    ></i>
                    &nbsp;Description
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    value={description}
                    placeholder="(Optional): Enter Any Descriptive Details"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="price">
                  <Form.Label>
                    <i
                      class="fa-solid fa-location-dot"
                      style={{ color: "#005eff" }}
                    ></i>
                    &nbsp;Location
                  </Form.Label>
                  &nbsp;
                  <i
                    class="fa-solid fa-asterisk"
                    style={{ color: "#ff0000" }}
                  ></i>
                  <Form.Control
                    type="text"
                    name="location"
                    value={location}
                    placeholder="Building #, Street, Suite, City, State, Zipcode"
                    onChange={(e) => setlocation(e.target.value)}
                    required
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
                        class="fa-solid fa-dollar-sign"
                        style={{ color: "#005eff" }}
                      ></i>
                      &nbsp;Rent Price
                    </Form.Label>
                    &nbsp;
                    <i
                      class="fa-solid fa-asterisk"
                      style={{ color: "#ff0000" }}
                    ></i>
                    <Form.Control
                      type="number"
                      placeholder="0"
                      name="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      pattern="[0-9]*"
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
                        class="fa-solid fa-calendar-days"
                        style={{ color: "#005eff" }}
                      ></i>
                      &nbsp;Availability Date
                    </Form.Label>
                    &nbsp;
                    <i
                      class="fa-solid fa-asterisk"
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
                    controlId="price"
                    as={Col}
                    md="4"
                  >
                    <Form.Label>
                      <i
                        class="fa-regular fa-clock"
                        style={{ color: "#005eff" }}
                      ></i>
                      &nbsp;Duration
                    </Form.Label>
                    &nbsp;
                    <i
                      class="fa-solid fa-asterisk"
                      style={{ color: "#ff0000" }}
                    ></i>
                    <Form.Control
                      type="text"
                      value={duration}
                      name="duration"
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="Ex. # of months"
                      required
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group
                    className="mb-3"
                    controlId="price"
                    as={Col}
                    md="4"
                  >
                    <Form.Label>
                      <i
                        class="fa-solid fa-ruler-combined"
                        style={{ color: "#005eff" }}
                      ></i>
                      &nbsp;Square Footage
                    </Form.Label>
                    &nbsp;
                    <i
                      class="fa-solid fa-asterisk"
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
                        class="fa-solid fa-bed"
                        style={{ color: "#005eff" }}
                      ></i>
                      &nbsp;# of Bedrooms
                    </Form.Label>
                    &nbsp;
                    <i
                      class="fa-solid fa-asterisk"
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
                        class="fa-solid fa-shower"
                        style={{ color: "#005eff" }}
                      ></i>
                      &nbsp;# of Bathrooms
                    </Form.Label>
                    &nbsp;
                    <i
                      class="fa-solid fa-asterisk"
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
                      class="fa-solid fa-circle-plus"
                      style={{ color: "#005eff" }}
                    ></i>
                    &nbsp;Amenities
                  </Form.Label>
                  <div key={`inline-checkbox`} className="mb-3">
                    <Form.Check
                      inline
                      label="Gym"
                      name="gym"
                      type="checkbox"
                      onChange={handleAmenities}
                      id="inline-checkbox-1"
                    />
                    <Form.Check
                      inline
                      label="Pool"
                      name="pool"
                      type="checkbox"
                      onChange={handleAmenities}
                      id="inline-checkbox-2"
                    />
                    <Form.Check
                      inline
                      label="Sauna"
                      name="sauna"
                      type="checkbox"
                      onChange={handleAmenities}
                      id="inline-checkbox-2"
                    />
                    <Form.Check
                      inline
                      label="Parking Lot"
                      name="parking"
                      type="checkbox"
                      onChange={handleAmenities}
                      id="inline-checkbox-2"
                    />
                    <Form.Check
                      inline
                      label="Air Conditioning"
                      name="air"
                      type="checkbox"
                      onChange={handleAmenities}
                      id="inline-checkbox-2"
                    />
                    <Form.Check
                      inline
                      label="In-Unit Laundry"
                      name="inLaundry"
                      type="checkbox"
                      onChange={handleAmenities}
                      id="inline-checkbox-2"
                    />
                    <Form.Check
                      inline
                      label="Shared Laundry"
                      name="shLaundry"
                      type="checkbox"
                      onChange={handleAmenities}
                      id="inline-checkbox-2"
                    />
                    <Form.Check
                      inline
                      label="Dishwasher"
                      name="dishwasher"
                      type="checkbox"
                      onChange={handleAmenities}
                      id="inline-checkbox-2"
                    />
                    <Form.Check
                      inline
                      label="Doorman"
                      name="doorman"
                      type="checkbox"
                      onChange={handleAmenities}
                      id="inline-checkbox-2"
                    />
                    <Form.Check
                      inline
                      label="Elevator"
                      name="elevator"
                      type="checkbox"
                      onChange={handleAmenities}
                      id="inline-checkbox-2"
                    />
                    <Form.Check
                      inline
                      label="Game Room"
                      name="game"
                      type="checkbox"
                      onChange={handleAmenities}
                      id="inline-checkbox-2"
                    />
                  </div>
                </Row>
                <Form.Group className="mb-3" controlId="title">
                  <Form.Label>
                    <i
                      class="fa-solid fa-user-group"
                      style={{ color: "#005eff" }}
                    ></i>
                    &nbsp;Roommate Preferences
                  </Form.Label>
                  <Form.Control
                    name="preferences"
                    type="text"
                    placeholder="Enter criteria..."
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </ModalBody>
            <Modal.Footer style={{ backgroundColor: "#fffaf0" }}>
              <Button variant="danger" onClick={handleToggleModal}>
                Cancel
              </Button>
              <Button type="submit" variant="info" onClick={submitHandler}>
                Post Listing
              </Button>
            </Modal.Footer>
          </Modal>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : (
            <Row>
              {listings.map((listing) => (
                <Col key={listing.id} sm={12} md={6} lg={4} xl={4}>
                  <Card
                    className="my-4"
                    bg="primary"
                    border="info"
                    style={{
                      color: "white",
                      borderRadius: "10px",
                    }}
                  >
                    <Card.Body>
                      <Carousel interval={null}>
                        {listing.image.map((img) => (
                          <Carousel.Item>
                            <img
                              className="d-block w-100"
                              src={img.image}
                              width="250"
                              height="250"
                            ></img>
                          </Carousel.Item>
                        ))}
                      </Carousel>
                      <Card.Title className="mt-3">{listing.title}</Card.Title>
                      <Card.Text>
                        <i class="fa-solid fa-location-dot"></i>
                        &nbsp;{listing.location}
                      </Card.Text>

                      <Card.Text>
                        <i class="fa-solid fa-dollar-sign"></i>
                        &nbsp;{listing.price} per month
                      </Card.Text>
                      <Card.Text className="mt-0">
                        <i class="fa-solid fa-ruler-combined"></i>
                        &nbsp;{listing.sqft} sqft |&nbsp;
                        <i class="fa-solid fa-bed"></i>
                        &nbsp;{listing.bedrooms} beds |&nbsp;
                        <i class="fa-solid fa-shower"></i>
                        &nbsp;{listing.bathrooms} baths
                      </Card.Text>
                      <Button
                        style={{
                          backgroundColor: "#94403b",
                          backgroundPosition: "center",
                          display: "block",
                          margin: "auto",
                        }}
                      >
                        View
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </div>
    </div>
  );
}

export default ListingsScreen;
