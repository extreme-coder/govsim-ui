import React from 'react';
import { useGetEntitiesQuery } from '../services/govsim';


export default function Home() {
  const { data, error, isLoading } = useGetEntitiesQuery({name:'country'})

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-xl-10 col-lg-12 col-md-9">
          {data && data.map(country =>
              <div key={country.id}>
                {country.name}         
              </div>
          )}
        </div>
      </div>
    </div>
  );

};



