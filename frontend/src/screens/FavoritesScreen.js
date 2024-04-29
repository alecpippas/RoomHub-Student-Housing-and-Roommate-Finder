import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Image,
  Button,
  Modal,
  ModalBody,
  Form,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getFavs } from "../actions/userActions";
import housebg from "../static/housebg.png";

function FavoritesScreen() {
  // const userLogin = useSelector((state) => state.userLogin);
  // const { userInfo } = userLogin;
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const userGetFavs = useSelector((state) => state.userGetFavs);
  const { error, loading, favs } = userGetFavs;
  let favListings = null;
  if (favs.data) {
    favListings = favs.data;
  }
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log(favListings);

  const handleViewUnit = (created_at) => {
    navigate(`/listings/${created_at}`);
  };

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      dispatch(getFavs(userInfo.username));
    }
  }, [dispatch]);

  return (
    <div>
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
        <Container className="mt-5 mb-5">
          <Row>
            <Col md={3}></Col>
            <Col md={6}>
              <Card>
                <Card.Header
                  as="h3"
                  className="text-center bg-black text-light"
                  style={{ borderRadius: "5px" }}
                >
                  Your Favorite Listings
                </Card.Header>
                <Row className="my-2 ms-3">
                  <Col
                    md={4}
                    style={{
                      fontWeight: "bold",
                      textDecorationLine: "underline",
                    }}
                  >
                    Listing Title
                  </Col>
                  <Col md={4}>
                    <Card.Text
                      style={{
                        fontWeight: "bold",
                        textDecorationLine: "underline",
                      }}
                    >
                      Uploader
                    </Card.Text>
                  </Col>
                </Row>
                {favListings &&
                  favListings.map((fav) => (
                    <Row className="my-2 ms-3">
                      <Col md={2}>
                        <Card.Text style={{ textAlign: "center" }}>
                          {fav["title"]}
                        </Card.Text>
                      </Col>
                      <Col md={6}>
                        {" "}
                        <Card.Text style={{ textAlign: "center" }}>
                          {fav["username_id"]}
                        </Card.Text>
                      </Col>
                      <Col md={4}>
                        <Button
                          style={{
                            borderRadius: "5px",
                            backgroundColor: "#4CAF50", // Green color for details button
                            color: "white",
                            fontSize: "60%",
                            height: "25px",
                            width: "98px",
                            display: "flex",
                            alignItems: "center",
                          }}
                          onClick={() => handleViewUnit(fav["created_at_id"])}
                        >
                          View Unit
                        </Button>
                      </Col>
                    </Row>
                  ))}
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default FavoritesScreen;
