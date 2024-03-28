import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';

function UserProfileScreen() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  if (!userInfo) {
    return <div>Please log in to view this page.</div>;
  }

  return (
    <Container className="mt-5">
      <Row>
        <Col md={3}></Col>
        <Col md={6}>
          <Card>
            <Card.Header as="h5">User Profile</Card.Header>
            <Card.Body>
              <p><strong>Name:</strong> {userInfo.name}</p>
              <p><strong>Email:</strong> {userInfo.email}</p>
              <p><strong>Bio:</strong> {userInfo.bio || 'Not provided'}</p>
              <p><strong>Age:</strong> {userInfo.age || 'Not provided'}</p>
              <p><strong>Gender:</strong> {userInfo.gender || 'Not provided'}</p>
              <p><strong>School:</strong> {userInfo.school || 'Not provided'}</p>
              <p><strong>Pets:</strong> {userInfo.pets ? 'Yes' : 'No'}</p>
              <p><strong>Allergies:</strong> {userInfo.allergies || 'Not provided'}</p>
              <p><strong>Budget:</strong> {userInfo.budget || 'Not provided'}</p>
              <p><strong>Sleep Schedule:</strong> {userInfo.sleepSchedule || 'Not provided'}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}></Col>
      </Row>
    </Container>
  );
}

export default UserProfileScreen;