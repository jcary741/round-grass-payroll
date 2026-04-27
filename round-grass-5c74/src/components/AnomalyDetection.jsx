import React from 'react';
import {Col, Row} from 'react-bootstrap';
import {Spinner} from "./Spinner.jsx";

// TODO: ask production manager/client about anomalies they've seen in the past that we should be checking for. Fake occupations? Projects that don't allow overtime?

const AnomalyDetection = ({messages}) => {
    if (!messages) {
        return <Spinner />
    }

    return (
        <Row className="anomaly-detection g-3">
            <Col xs={12}>
                <h3 className="h5 mb-3">Detected Anomalies</h3>
                <p className="text-muted mb-0">
                    Various anomaly patterns in the payroll data.
                </p>
                {messages.length === 0 ? (
                    <p className="text-muted mb-0">
                        No anomaly patterns were detected in the payroll data!
                    </p>
                ) : (
                    <ul className="list-unstyled mb-0 ps-3">
                        {messages.map((message, index) => (
                            <li key={`${index}-${message}`} className="mb-2">
                                {message}
                            </li>
                        ))}
                    </ul>
                )}
            </Col>
        </Row>
    );
};

export default AnomalyDetection;
