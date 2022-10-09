import React from 'react';
import {useGetEntitiesByFieldQuery} from '../../services/govsim';
import { VictoryLabel} from 'victory';
import PieChart from '../common/PieChart';


export default function Demographics(props) {
  const { countryId } = props
  const { data: blocks } = useGetEntitiesByFieldQuery({ name: 'block', field: 'country', value: countryId, relation: 'id', populate: true })
  const getData = (blocks) => {
    let data = {}
    blocks.data.forEach((block) => {
      const demoName = block.attributes.demographic.data.attributes.name
      if(data[demoName]) {
        data[demoName]++
      } else {
        data[demoName] = 1
      }
    })
    return Object.keys(data).map((k) => ({x: k, y: data[k]}))
    
  }
  return (    
    <div className="container" style={{maxWidth:"500px"}}>
      {blocks && 
      <PieChart 
        data={getData(blocks)} 
        innerRadius={40}
      />
      }
    </div>
  );
};
