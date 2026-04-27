import React from 'react';
import {Table} from 'react-bootstrap';
import {Spinner} from "./Spinner";

// TODO Add table filtering & sorting.
// TODO Move table into a scroll container
// TODO Add table csv download

const EmployeeStats = ({metrics}) => {
    if (!metrics) {
        return <Spinner />
    }

    return (
        <Table striped bordered hover responsive>
            <thead>
            <tr>
                <th>Name</th>
                <th>ID</th>
                <th>Max Hours/Day</th>
                <th>Min Hours/Day</th>
                <th>Avg Hours/Day</th>
                <th>Max Standard Rate</th>
                <th>Min Standard Rate</th>
                <th>Avg Standard Rate</th>
                <th>Max Overtime Rate</th>
                <th>Min Overtime Rate</th>
                <th>Avg Overtime Rate</th>
                <th>Max Benefits Rate</th>
                <th>Min Benefits Rate</th>
                <th>Avg Benefits Rate</th>
                <th>Last Pay Date</th>
            </tr>
            </thead>
            <tbody>
            {metrics.map(emp => (
                <tr key={emp.id}>
                    <td>{emp.name}</td>
                    <td>{emp.id}</td>
                    <td>{emp.max_hours_per_day.toFixed(2)}</td>
                    <td>{emp.min_hours_per_day.toFixed(2)}</td>
                    <td>{emp.avg_hours_per_day.toFixed(2)}</td>
                    <td>${emp.max_standard_rate.toFixed(2)}</td>
                    <td>${emp.min_standard_rate.toFixed(2)}</td>
                    <td>${emp.avg_standard_rate.toFixed(2)}</td>
                    <td>${emp.max_overtime_rate.toFixed(2)}</td>
                    <td>${emp.min_overtime_rate.toFixed(2)}</td>
                    <td>${emp.avg_overtime_rate.toFixed(2)}</td>
                    <td>${emp.max_benefits_rate.toFixed(2)}</td>
                    <td>${emp.min_benefits_rate.toFixed(2)}</td>
                    <td>${emp.avg_benefits_rate.toFixed(2)}</td>
                    <td>{emp.last_pay_date}</td>
                </tr>
            ))}
            </tbody>
        </Table>
    );
};

export default EmployeeStats;

