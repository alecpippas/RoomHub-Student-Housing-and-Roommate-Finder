import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchListings, createListing } from '../actions/listingsActions';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CreateListingsScreen from './CreateListingsScreen';

function ListingsScreen() {
  const dispatch = useDispatch();
  const listingsState = useSelector((state) => state.listings);
  const { loading, error, listings } = listingsState;
  const navigate = useNavigate(); // Hook for navigation

  // State for the new listing form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(''); //image URL

  useEffect(() => {
    dispatch(fetchListings());
  }, [dispatch]);

   // Handle form submission
   const submitHandler = (e) => {
    e.preventDefault();
    // Dispatch the action to create a listing
    // Convert price to a number if necessary, and ensure image handling as needed
    dispatch(createListing({ title, description, price: Number(price), image }));
    setTitle('');
    setDescription('');
    setPrice('');
    setImage('');
  };

  return (
    <Container>
      <h1>Available Units</h1>

      <Button onClick={() => navigate('/create_listings')}>Create New Listing</Button> 

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <Row>
          {listings.map((listing) => (
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