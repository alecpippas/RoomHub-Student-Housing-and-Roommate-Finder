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
import { redirect, useNavigate } from "react-router-dom";
import housebg from "../static/housebg.png";
import queryString from "query-string";

function ListingsScreen() {
  const dispatch = useDispatch();
  const listingsState = useSelector((state) => state.listingsView);
  const { loading, error, listings } = listingsState;
  const navigate = useNavigate(); // Hook for navigation
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  // State for the new listing form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setlocation] = useState("");
  const [availableDate, setavailableDate] = useState("");
  const [duration, setDuration] = useState("");
  const [preferences, setPreferences] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [sqft, setSqft] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [image, setImage] = useState([]); //image URL
  const [amenities, setAmenities] = useState({});
  const [showModal, setShowModal] = useState(false);

  const { search: searchQuery } = queryString.parse(location.search);

  const listingRedirect = (e) => {
    navigate(`${e.target.name}/`);
  };

  const handleAmenities = (e) => {
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
  };

  const handleToggleModal = () => {
    setShowModal(!showModal);
    setTitle("");
    setDescription("");
    setPrice("");
    setlocation("");
    setavailableDate("");
    setDuration("");
    setPreferences("");
    setIsActive(true);
    setSqft("");
    setBeds("");
    setBaths("");
    setImage([]);
    setAmenities({});
  };

  useEffect(() => {
    dispatch(fetchListings());
  }, [dispatch, showModal]);

  const filteredListings = searchQuery
    ? listings.filter((listing) =>
        listing.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      )
    : listings;

  // Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    const jsonAmenities = JSON.stringify(amenities);
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
        is_active: true,
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
    setTimeout(handleToggleModal, 500);
  };

  return (
    <div
      style={{
        backgroundImage: "url(" + housebg + ")",
        border: "5px solid black",
        backgroundPosition: "center",
        position: "relative",
        height: "100vh",
        backgroundRepeat: "repeat",
      }}
    >
      <div>
        <Container>
          <Row>
            <Card
              className="p-4 my-4"
              style={{ borderRadius: "10px", border: "4px solid white" }}
              bg="primary"
            >
              <h1 className="text-center text-light">Available Units</h1>

              {userInfo ? (
                <Button
                  style={{
                    backgroundPosition: "center",
                    display: "block",
                    margin: "auto",
                    borderRadius: "5px",
                  }}
                  onClick={handleToggleModal}
                  className="btn btn-md btn-success"
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
                <Modal.Header
                  closeButton
                  style={{ backgroundColor: "#000000" }}
                >
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
                        value={description}
                        placeholder="(Optional): Enter Any Descriptive Details"
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
                        value={location}
                        placeholder="Building #, Street, Suite, City, State, Zipcode"
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
                        controlId="price"
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
                      <Form.Group
                        className="mb-3"
                        controlId="bed"
                        as={Col}
                        md="4"
                      >
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
                      <Form.Group
                        className="mb-3"
                        controlId="bath"
                        as={Col}
                        md="4"
                      >
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
                        value={preferences}
                        onChange={(e) => setPreferences(e.target.value)}
                      />
                    </Form.Group>
                    <Modal.Footer style={{ backgroundColor: "#fffaf0" }}>
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
                        // onClick={submitHandler}
                        style={{ borderRadius: "5px" }}
                      >
                        Post Listing
                      </Button>
                    </Modal.Footer>
                  </Form>
                </ModalBody>
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
                        // bg="secondary"
                        border="light"
                        style={{
                          color: "black",
                          borderRadius: "10px",
                          backgroundColor: "#f2f1e1",
                        }}
                      >
                        <Card.Body>
                          <Carousel>
                            {listing.image.map((img) => (
                              <Carousel.Item key={img.image}>
                                <img
                                  style={{ borderRadius: "5px" }}
                                  className="d-block w-100"
                                  src={img.image}
                                  width="250"
                                  height="250"
                                ></img>
                              </Carousel.Item>
                            ))}
                          </Carousel>
                          <Card.Title className="mt-3">
                            {listing.title}
                          </Card.Title>
                          <Card.Text>
                            <i className="fa-solid fa-location-dot"></i>
                            &nbsp;{listing.location}
                          </Card.Text>

                          <Card.Text>
                            <i className="fa-solid fa-dollar-sign"></i>
                            &nbsp;{listing.price} per month
                          </Card.Text>
                          <Card.Text className="mt-0">
                            <i className="fa-solid fa-ruler-combined"></i>
                            &nbsp;{listing.sqft} sqft |&nbsp;
                            <i className="fa-solid fa-bed"></i>
                            &nbsp;{listing.bedrooms} beds |&nbsp;
                            <i className="fa-solid fa-shower"></i>
                            &nbsp;{listing.bathrooms} baths
                          </Card.Text>
                          <Button
                            variant="info"
                            style={{
                              backgroundColor: "#9e0b00",
                              borderRadius: "5px",
                              backgroundPosition: "center",
                              display: "block",
                              margin: "auto",
                            }}
                            name={listing.created_at}
                            onClick={listingRedirect}
                          >
                            View
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Card>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default ListingsScreen;
