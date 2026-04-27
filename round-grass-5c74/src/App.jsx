import { useState, useEffect } from 'react';
import { Badge, Container, Navbar, Tab, Tabs } from 'react-bootstrap';
import SummaryStats from './components/SummaryStats';
import EmployeeStats from './components/EmployeeStats';
import AnomalyDetection from './components/AnomalyDetection';
import FullDataTable from './components/FullDataTable';
import { getSummaryStatistics, getEmployeeMetrics, getAnomalyMessages, getPayrollData } from './payroll';
import './App.css';

function App() {
  const [summaryStats, setSummaryStats] = useState(null);
  const [employeeMetrics, setEmployeeMetrics] = useState(null);
  const [anomalyMessages, setAnomalyMessages] = useState(null);
  const [fullData, setFullData] = useState(null);
  const anomalyCount = Array.isArray(anomalyMessages) ? anomalyMessages.length : null;

  useEffect(() => {
    getSummaryStatistics().then(setSummaryStats);
    getEmployeeMetrics().then(setEmployeeMetrics);
    getAnomalyMessages().then(setAnomalyMessages);
    // This is not ideal, we are re-fetching data that is already in memory.
    // This is a good candidate for refactoring.
    getPayrollData().then(setFullData)
  }, []);

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container fluid>
          <Navbar.Brand href="#home">Payroll Analytics Dashboard</Navbar.Brand>
        </Container>
      </Navbar>
      <Container fluid>
        <SummaryStats stats={summaryStats}  />

        <Tabs defaultActiveKey="employee-stats" id="data-tabs" className="mb-3 mt-3">
          <Tab eventKey="employee-stats" title="Employee Metrics">
            <EmployeeStats metrics={employeeMetrics} />
          </Tab>
          <Tab
            eventKey="anomaly-detection"
            title={(
              <span className="d-inline-flex align-items-center gap-2">
                <span>Anomaly Detection</span>
                {anomalyCount !== null && (
                  <Badge bg={anomalyCount ? 'warning' : 'success'} pill>
                    {anomalyCount}
                  </Badge>
                )}
              </span>
            )}
          >
            <AnomalyDetection messages={anomalyMessages} />
          </Tab>
          <Tab eventKey="full-data" title="Full Data">
            <FullDataTable data={fullData} />
          </Tab>
        </Tabs>
      </Container>
    </>
  );
}

export default App;
