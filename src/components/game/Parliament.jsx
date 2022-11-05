import React from 'react';
import { useGetEntitiesByFieldQuery, useGetEntityQuery } from '../../services/govsim';
import Chart from 'react-apexcharts';



export default function Parliament(props) {
  const { countryId } = props
  const { data: parties } = useGetEntitiesByFieldQuery({ name: 'party', field: 'country', value: countryId, relation: 'id', populate: true })
  console.log(countryId)
  const { data: country } = useGetEntityQuery({ name: 'country', id: countryId })
  const apexDonutOpts = {
    chart: {
      height: 320,
      type: 'pie',
    },
    colors: ['#727cf5', '#6c757d', '#0acf97', '#fa5c7c', '#e3eaef'],
    labels: [],
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

  let data = []
  
  if (parties) {    
    parties.data.forEach((party) => {
      data.push(party.attributes.seats)
      apexDonutOpts.labels.push(party.attributes.name)
    })
  }

  return (
    <div className="container" style={{ maxWidth: "500px" }}>
      {parties && country && (country.data.attributes.elections_occurred) &&
        <Chart
          options={apexDonutOpts}
          series={data}
          type="donut"
          height={320}
          className="apex-charts"
        />
      }
      {country &&
        <div>
          {!(country.data.attributes.elections_occurred) && <p>No elections have occurred yet</p>}
          {(country.data.attributes.status === 'ELECTIONS') && <p>Elections are underway, results will be out soon</p>}
        </div>
      }
    </div>
  );
};
