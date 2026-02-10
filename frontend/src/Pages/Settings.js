import React from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';

const Settings = () => {
    return (
        <Container className="py-5">
            <h2 className="mb-4">Settings</h2>
            <Row>
                <Col md={4}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item action active>Generic Settings</ListGroup.Item>
                            <ListGroup.Item action>Privacy</ListGroup.Item>
                            <ListGroup.Item action>Notifications</ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card className="p-4">
                        <h4>Generic Settings</h4>
                        <p className="text-muted">Manage your account settings here.</p>
                        {/* Add actual settings forms here later */}
                        <div className="alert alert-info">
                            Settings functionality is coming soon!
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Settings;
