import React from 'react';
import {useGetEntitiesByFieldQuery} from '../../services/govsim';
import BillCreator from './BillCreator';
import {Button} from 'react-bootstrap';
import { useAddEntityMutation } from '../../services/govsim';

export default function Platform(props) {
  const { partyId } = props
  const { data } = useGetEntitiesByFieldQuery({ name: 'promise', field: 'party', value: partyId, relation: 'id', populate: true })
  const [ addEntity ]  = useAddEntityMutation()

  const callVote = (billId) => {
    addEntity({name: 'vote', body: {data: {'promise': billId}}})
  }
  return (
    <div className="container">
      <div className="col-xl-10 col-lg-12 col-md-9">
          {data && data.data.map((bill) =>
              <div key={bill.id}>
                {bill.attributes.name} - {bill.attributes.law.data.attributes.name} <Button onClick={()=>callVote(bill.id)}>Call Vote</Button>
              </div>
          )}
        </div>
        <BillCreator partyId={partyId}/>
    </div>
  );
};


