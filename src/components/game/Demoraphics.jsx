import React from 'react';
import { useGetBlockGroupsQuery } from '../../services/govsim';
import Chart from 'react-apexcharts';

export default function Demographics(props) {
  const { countryId } = props
  const { data: blocks } = useGetBlockGroupsQuery(countryId)

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
  };

  if(blocks) {
    apexDonutOpts.labels = blocks.labels
  }

  return (
    <div className="container" style={{ maxWidth: "500px" }}>
      {blocks &&
        <Chart
          options={apexDonutOpts}
          series={blocks.data}
          type="donut"
          height={320}
          className="apex-charts"
        />
      }
    </div>
  );
};




