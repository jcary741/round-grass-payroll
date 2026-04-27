import React, {useEffect, useMemo, useRef} from 'react';
import {Col, Row} from 'react-bootstrap';

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
});

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
});

const PayrollSpendTrend = ({weeklySpend}) => {
    const chartRef = useRef(null);
    const totalSpend = useMemo(
        () => weeklySpend?.reduce((sum, week) => sum + week.total, 0) ?? 0,
        [weeklySpend],
    );

    useEffect(() => {
        if (!weeklySpend?.length || typeof window === 'undefined' || !window.echarts || !chartRef.current) {
            return undefined;
        }

        const chart = window.echarts.init(chartRef.current);
        chart.setOption({
            animationDuration: 500,
            color: ['#5b8ff9', '#61dDAa', '#f6bd16', '#7f3dff'],
            tooltip: {
                trigger: 'axis',
                formatter: params => {
                    const rows = params.map(param => `${param.marker} ${param.seriesName}: ${currencyFormatter.format(param.value)}`);
                    return [params[0]?.axisValueLabel, ...rows].join('<br/>');
                },
            },
            legend: {
                top: 8,
            },
            grid: {
                left: 48,
                right: 24,
                top: 56,
                bottom: 40,
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data: weeklySpend.map(week => week.week_ending),
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: value => compactCurrencyFormatter.format(value),
                },
            },
            series: [
                {
                    name: 'Standard',
                    type: 'bar',
                    stack: 'spend',
                    emphasis: {focus: 'series'},
                    data: weeklySpend.map(week => week.standard),
                },
                {
                    name: 'Overtime',
                    type: 'bar',
                    stack: 'spend',
                    emphasis: {focus: 'series'},
                    data: weeklySpend.map(week => week.overtime),
                },
                {
                    name: 'Benefits',
                    type: 'bar',
                    stack: 'spend',
                    emphasis: {focus: 'series'},
                    data: weeklySpend.map(week => week.benefits),
                },
                {
                    name: 'Total',
                    type: 'line',
                    smooth: true,
                    symbolSize: 8,
                    lineStyle: {
                        width: 3,
                    },
                    data: weeklySpend.map(week => week.total),
                },
            ],
        });

        const resizeChart = () => chart.resize();
        window.addEventListener('resize', resizeChart);

        return () => {
            window.removeEventListener('resize', resizeChart);
            chart.dispose();
        };
    }, [weeklySpend]);

    if (!weeklySpend) {
        return <div>Loading...</div>;
    }

    if (!weeklySpend.length) {
        return (
            <Row>
                <Col>
                    <p className="text-muted mb-0">No weekly payroll spend data is available.</p>
                </Col>
            </Row>
        );
    }

    if (typeof window !== 'undefined' && !window.echarts) {
        return (
            <Row>
                <Col>
                    <p className="text-muted mb-0">The payroll spend chart library did not load.</p>
                </Col>
            </Row>
        );
    }

    return (
        <Row className="g-3 payroll-spend-trend">
            <Col xs={12}>
                <div className="payroll-spend-trend__header">
                    <div>
                        <h3 className="h5 mb-1">Payroll Spend Over Time</h3>
                        <p className="text-muted mb-0">
                            Weekly trend for standard, overtime, benefits, and total payroll spend.
                        </p>
                    </div>
                </div>
            </Col>
            <Col xs={12}>
                <div ref={chartRef} className="payroll-spend-trend__chart" style={{width: '90vw',height:'30rem'}} aria-label="Payroll spend over time chart" />
            </Col>
        </Row>
    );
};

export default PayrollSpendTrend;


