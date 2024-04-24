import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchListings, createListing } from '../actions/listingsActions';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

function ListingsScreen() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { search: searchQuery } = queryString.parse(location.search);
  const listingsState = useSelector((state) => state.listings);
  const { loading, error, listings } = listingsState;

  useEffect(() => {
    dispatch(fetchListings());
  }, [dispatch]);

  const filteredListings = searchQuery 
    ? listings.filter(listing => 
        listing.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      ) : listings;

  return (
    <Container>
      <h1>Available Units</h1> 
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <Row>
          {filteredListings.map((listing) => (
            <Col key={listing.id} sm={12} md={6} lg={4} xl={3}>
              <Card className="my-3 p-3">
                <Card.Img variant="top" src={listing.image} />
                <Card.Body>
                  <Card.Title>{listing.title}</Card.Title>
                  <Card.Text>{listing.description}</Card.Text>
                  <Card.Text>${listing.price}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default ListingsScreen;