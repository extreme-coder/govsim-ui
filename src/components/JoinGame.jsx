import React, { useState } from 'react';
import { useGetEntitiesQuery, useAddEntityMutation, useGetEntitiesByFieldQuery } from '../services/govsim';
import { Button } from 'react-bootstrap';
import { useParams } from "react-router-dom";
import SelectableCardList from './common/SelectableCardList';
import useLocalStorage from '../hooks/useLocalStorage';

export default function JoinGame() {
  const { code } = useParams();
  const [user, setUser] = useLocalStorage("user", "");
  const [selectedPartyType, setSelectedPartyType] = useState(0)
  const { data, error, isLoading } = useGetEntitiesQuery('party-template')
  const { data: country, error: cerror, isLoading : cisLoading } = useGetEntitiesByFieldQuery({name:'country', field: 'join_code', value:code})
  const [ addEntity, { isLoading: isUpdating } ] = useAddEntityMutation()
  const joinGame = (id) => {    
    addEntity({name:'party', body:{data:{country:country.data[0].id, name:'', template: selectedPartyType, user: user.user.id}}})
  }

  const onPartyTypeChanged = (selected) => {
    setSelectedPartyType(selected)
  }
  
  return (
    <div className="container">
      {country && <div>{country.data[0].attributes.name}</div>}
      <div className="row justify-content-center">
        <div className="col-xl-10 col-lg-12 col-md-9">
          {data && 
           <SelectableCardList 
           multiple={false}           
           contents={data.data.map((a) => { return {id: a.id, title: a.attributes.name} } )}
           onChange={(e)=>{onPartyTypeChanged(e)}}
           />
          }
        </div>
        <Button onClick={() => joinGame(country.data[0].id)} >Join Game</Button>      
      </div>
    </div>
  );

};