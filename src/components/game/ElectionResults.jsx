import React, {useState} from 'react'
import { useGetResultsQuery } from '../../services/govsim';
import { Container, Row, Col } from 'react-bootstrap'
import Chart from 'react-apexcharts';

export default function ElectionResults(props) {
  const { data: results } = useGetResultsQuery(props.electionId)
  
  const getCharts = (demo) => {
    const apexDonutOpts = {
      chart: {
        height: 320,
        type: 'pie',
      },    
      colors: ['#727cf5', '#6c757d', '#0acf97', '#fa5c7c', '#e3eaef'],
      legend: {
        show: true,
        position: 'right',
        horizontalAlign: 'center',
        verticalAlign: 'middle',
        floating: false,
        fontSize: '14px',
        offsetX: 0,
        offsetY: -10,
      },
      responsive: [
        {
          breakpoint: 600,
          options: {
            chart: {
              height: 240,
            },
            legend: {
              show: false,
            },
          },
        },
      ],
      labels: demo.labels,
    };
    return (
      <Col>
        <div className="container" style={{ maxWidth: "500px" }}>
          <Chart
            options={apexDonutOpts}
            series={demo.data}
            type="donut"
            height={320}
            className="apex-charts"
          />
        </div>
      </Col>
    )
  }

  return (<Row>
    {results && results.map((d) => (
      getCharts(d)
    ))}
  </Row>)
}