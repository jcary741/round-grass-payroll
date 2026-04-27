import React from 'react';
import { Table } from 'react-bootstrap';

// TODO Add table filtering & sorting.
// TODO Move table into a scroll container
// TODO Add table csv download

const FullDataTable = ({ data }) => {
    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <Table striped bordered hover responsive className="full-data-table">
            <thead>
                <tr>
                    <th>Employee Name</th>
                    <th>Employee ID</th>
                    <th>Level</th>
                    <th>Occupation</th>
                    <th>Week Ending</th>
                    <th>Standard Hours</th>
                    <th>Overtime Hours</th>
                    <th>Standard Rate</th>
                    <th>Overtime Rate</th>
                    <th>Benefits Rate</th>
                </tr>
            </thead>
            <tbody>
                {data.map((row, i) => (
                    <tr key={i}>
                        <td>{row.employee_name}</td>
                        <td>{row.employee_id}</td>
                        <td>{row.level}</td>
                        <td>{row.occupation}</td>
                        <td title={row.week_ending}>{new Date(row.week_ending).toLocaleDateString()}</td>
                        <td>{Object.values(row.daily_hours).reduce((sum, h) => sum + h.standard, 0).toFixed(2)}</td>
                        <td>{Object.values(row.daily_hours).reduce((sum, h) => sum + h.overtime, 0).toFixed(2)}</td>
                        <td>${row.rates.standard.toFixed(2)}</td>
                        <td>${row.rates.overtime.toFixed(2)}</td>
                        <td>${row.rates.benefits.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default FullDataTable;

