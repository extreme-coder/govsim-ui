import React from 'react';
import { useGetEntitiesQuery, useAddEntityMutation } from '../services/govsim';
import { Button } from 'react-bootstrap';

export default function Games() {
  const { data, error, isLoading } = useGetEntitiesQuery('country')
  const [ addEntity, { isLoading: isUpdating } ] = useAddEntityMutation()
  const joinGame = (id) => {    
    addEntity({name:'party', body:{data:{country:id, name:'hello'}}})
  }
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-xl-10 col-lg-12 col-md-9">
          {data && data.data.map(country =>
              <div key={country.id}>
                {country.attributes.name}   <Button onClick={() => joinGame(country.id)} >Join Game</Button>      
              </div>
          )}
        </div>
      </div>
    </div>
  );

};