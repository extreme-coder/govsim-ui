import React from 'react';
import { useGetEntitiesQuery, useAddEntityMutation } from '../services/govsim';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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
                {country.attributes.name}   <Link to={`/joingame/${country.attributes.join_code}`}><Button>Join Game</Button></Link>      
              </div>
          )}
        </div>
      </div>
    </div>
  );

};