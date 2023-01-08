import React from 'react';
import { useGetEntitiesByFieldQuery, useGetEntityQuery } from '../../services/govsim';
import Chart from 'react-apexcharts';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
require('highcharts/modules/item-series')(Highcharts)

export default function Parliament(props) {
  const { countryId } = props
  const { data: parties } = useGetEntitiesByFieldQuery({ name: 'party', field: 'country', value: countryId, relation: 'id', populate: true })
  console.log(countryId)
  const { data: country } = useGetEntityQuery({ name: 'country', id: countryId })
  let options = {
    chart: {
      type: 'item',
      backgroundColor: 'transparent',
    },

    title: {
      text: '            '
  },

    legend: {
        labelFormat: '{name} <span style="opacity: 0.4">{y}</span>'
    },

    series: [{
        name: 'MPs',
        keys: ['name', 'y', 'color', 'label'],
        data: [],
        dataLabels: {
            enabled: true,
            format: '{point.label}',
            style: {
                textOutline: '3px contrast'
            }
        },

        // Circular options
        center: ['50%', '88%'],
        size: '170%',
        startAngle: -100,
        endAngle: 100
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 600
            },
            chartOptions: {
                series: [{
                    dataLabels: {
                        distance: -30
                    }
                }]
            }
        }]
    }
  }
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
      data.push([party.attributes.name, parseInt(party.attributes.seats), `#${party.attributes.template.data.attributes.color}`, party.attributes.name])
    })
    options.series[0].data = data
  }

  return (
    <div className="container" style={{ maxWidth: "500px" }}>
      {parties && country && (country.data.attributes.elections_occurred) &&
        /*<Chart
          options={apexDonutOpts}
          series={data}
          type="donut"
          height={320}
          className="apex-charts"
        />*/
        <HighchartsReact highcharts={Highcharts} options={options} />
      }
      {country &&
        <div>          
          {(country.data.attributes.status === 'ELECTIONS') && <p>Elections are underway, results will be out soon</p>}
        </div>
      }
    </div>
  );
};
