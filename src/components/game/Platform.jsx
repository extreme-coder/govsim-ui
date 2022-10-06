import React from 'react';
import {useGetEntitiesByFieldQuery} from '../../services/govsim';

export default function Platform(props) {
  const { partyId } = props
  const { data } = useGetEntitiesByFieldQuery({ name: 'promises', field: 'party', value: partyId, relation: 'id', populate: true })

  return (
    <div className="container">
      <div className="col-xl-10 col-lg-12 col-md-9">
          {data && data.data.map((bill) =>
              <div key={bill.id}>
                {bill.attributes.name} - {bill.attributes.law.data.attributes.name} 
              </div>
          )}
        </div>
    </div>
  );
};