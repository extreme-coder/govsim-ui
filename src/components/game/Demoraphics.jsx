import React from 'react';
import {useGetBlockGroupsQuery} from '../../services/govsim';
import { VictoryLabel} from 'victory';
import PieChart from '../common/PieChart';


export default function Demographics(props) {
  const { countryId } = props
  const { data: blocks } = useGetBlockGroupsQuery(countryId)
  
  return (    
    <div className="container" style={{maxWidth:"500px"}}>
      {blocks && 
      <PieChart 
        data={blocks} 
        innerRadius={40}
      />
      }
    </div>
  );
};
