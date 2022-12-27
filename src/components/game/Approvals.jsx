import React from 'react';
import { useGetEntitiesByFieldQuery } from '../../services/govsim';
import Chart from 'react-apexcharts';

export default function Approvals(props) {
  const { countryId, partyId } = props
  const { data: supports } = useGetEntitiesByFieldQuery({ name: 'party-support', field: 'party', value: partyId, relation: 'id', populate: true })
  const { data: blocks } = useGetEntitiesByFieldQuery({ name: 'block', field: 'country', value: countryId, relation: 'id', populate: true })

  const options = {
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    fill: {
      opacity: 1
    },
    yaxis: {
      floating: true,
      axisTicks: {
        show: false
      },
      axisBorder: {
        show: false
      },
      labels: {
        show: false
      },
    }
  }

  const getData = (s,b) => {
    let data = []
    supports.data.map((s) => {
      const bID = s.attributes.block.data.id
      const block = blocks.data[blocks.data.map(b => b.id).indexOf(bID)]
      const i = data.map(a => a.demo).indexOf(block.attributes.demographic.data.attributes.name)
      if (i === -1) {
        data.push({
          demo: block.attributes.demographic.data.attributes.name,
          total: parseInt(s.attributes.support),
          n: 1
        })
      } else {
        const d = data[i]
        data[i] = {
          demo: d.demo,
          total: d.total + parseInt(s.attributes.support),
          n: d.n + 1
        }
      }
    })
    return data
  }

  if (supports && blocks) {
    options.xaxis = {categories: getData(supports, blocks).map(d => d.demo)}
  }

  return (
    <div className="container" style={{ maxWidth: "500px" }}>
      {supports && blocks &&
        <Chart
          options={options}
          series={[{name: 'Support', data: getData(supports, blocks).map(d => d.total/d.n)}]}
          type="bar"
          height={320}
          className="apex-charts"
        />
      }
    </div>
  );
};




