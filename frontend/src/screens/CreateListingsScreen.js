import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchListings, createListing } from '../actions/listingsActions';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

function CreateListingsScreen() {
  const dispatch = useDispatch();
  const listingsState = useSelector((state) => state.listings);
  const { loading, error, listings } = listingsState;

  // State for the new listing form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(''); // Assuming image URL for simplicity

  useEffect(() => {
    dispatch(fetchListings());
  }, [dispatch]);

  // Handle form submission
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createListing({ title, description, price: Number(price), image }));
    // Optionally, clear form fields after submission
    setTitle('');
    setDescription('');
    setPrice('');
    setImage('');
  };

  return (
    <Container>
      <h1>Available Units</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </Form.Group>
        
        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="image">
          <Form.Label>Image URL</Form.Label>
          <Form.Control type="text" value={image} onChange={(e) => setImage(e.target.value)} />
        </Form.Group>
        
        <Button variant="primary" type="submit">
          Create Unit
        </Button>
      </Form>

      {loading ? <div>Loading...</div> : error ? <div>Error: {error}</div> : (
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

export default CreateListingsScreen;