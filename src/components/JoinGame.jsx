import React from 'react';
import { useGetEntitiesQuery, useAddEntityMutation } from '../services/govsim';
import { Button } from 'react-bootstrap';
import { useParams } from "react-router-dom";
import SelectableCardList from './common/SelectableCardList';

export default function Games() {
  const { countryId } = useParams();
  const { data, error, isLoading } = useGetEntitiesQuery('party-template')
  const [ addEntity, { isLoading: isUpdating } ] = useAddEntityMutation()
  const joinGame = (id) => {    
    addEntity({name:'party', body:{data:{country:id, name:'hello'}}})
  }
  
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-xl-10 col-lg-12 col-md-9">
          {data && 
           <SelectableCardList 
           multiple={false}           
           contents={data.data.map((a) => { return {title: a.attributes.name} } )}
           onChange={()=>{}}
           />
          }
        </div>
        <Button onClick={() => joinGame(countryId)} >Join Game</Button>      
      </div>
    </div>
  );

};