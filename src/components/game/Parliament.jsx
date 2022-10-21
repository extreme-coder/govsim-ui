import React from 'react';
import {useGetEntitiesByFieldQuery, useGetEntityQuery} from '../../services/govsim';
import { VictoryLabel} from 'victory';
import PieChart from '../common/PieChart';


export default function Parliament(props) {
  const { countryId } = props
  const { data: parties } = useGetEntitiesByFieldQuery({ name: 'party', field: 'country', value: countryId, relation: 'id', populate: true })
  console.log(countryId)
  const { data: country } = useGetEntityQuery({ name: 'country', id: countryId })
  const getData = (parties) => {
    let data = {}
    let totalSeats = 0
    parties.data.forEach((party) => {
      data[party.attributes.name] = party.attributes.seats      
      totalSeats += party.attributes.seats 
    })
    return Object.keys(data).map((k) => ({x: k, y: data[k]*100/totalSeats}))
    
  }
  return (    
    <div className="container" style={{maxWidth:"500px"}}>
      {parties && country && (country.election_called) &&
      <PieChart 
        data={getData(parties)} 
        innerRadius={40}
      />
      }
      {country &&
        <div>{!(country.election_called) && <p>No elections have occurred yet</p>}</div>
      }
    </div>
  );
};
