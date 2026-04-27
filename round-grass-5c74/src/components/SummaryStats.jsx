import React from 'react';
import {Card, Col, Row} from 'react-bootstrap';
import {Spinner} from "./spinner.jsx";

const SummaryStats = ({stats}) => {
    if (!stats) {
        return <Spinner />
    }

    return (
        <Row className="summary-stats-row g-3 mt-2">
            <Col>
                <Card className="summary-stat-card h-100">
                    <Card.Body className="summary-stat-card__body">
                        <Card.Title className="summary-stat-card__label">Total Unique Employees</Card.Title>
                        <Card.Text className="summary-stat-card__value">{stats.total_unique_employees}</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col>
                <Card className="summary-stat-card h-100">
                    <Card.Body className="summary-stat-card__body">
                        <Card.Title className="summary-stat-card__label">Avg. Standard Rate</Card.Title>
                        <Card.Text
                            className="summary-stat-card__value">${stats.avg_standard_rate.toFixed(2)}</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col>
                <Card className="summary-stat-card h-100">
                    <Card.Body className="summary-stat-card__body">
                        <Card.Title className="summary-stat-card__label">Avg. Overtime Rate</Card.Title>
                        <Card.Text
                            className="summary-stat-card__value">${stats.avg_overtime_rate.toFixed(2)}</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col>
                <Card className="summary-stat-card h-100">
                    <Card.Body className="summary-stat-card__body">
                        <Card.Title className="summary-stat-card__label">Avg. Benefits Rate</Card.Title>
                        <Card.Text
                            className="summary-stat-card__value">${stats.avg_benefits_rate.toFixed(2)}</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col>
                <Card className="summary-stat-card h-100">
                    <Card.Body className="summary-stat-card__body">
                        <Card.Title className="summary-stat-card__label">Cumulative Payroll Spend</Card.Title>
                        <Card.Text
                            className="summary-stat-card__value">${stats.cumulative_payroll_spend.toLocaleString()}</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col>
                <Card className="summary-stat-card h-100">
                    <Card.Body className="summary-stat-card__body">
                        <Card.Title className="summary-stat-card__label">Apprentice Hours %</Card.Title>
                        <Card.Text
                            className="summary-stat-card__value">{stats.apprentice_hours_percentage.toFixed(2)}%</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default SummaryStats;

