import React, { useState } from 'react';
import { useGetEntitiesByFieldQuery } from '../../services/govsim';
import BillCreator from './BillCreator';
import { Button, Accordion } from 'react-bootstrap';
import { useAddEntityMutation, useUpdateEntityMutation } from '../../services/govsim';

export default function Platform(props) {
  const { partyId, countryId, isPartyReady } = props
  const { data } = useGetEntitiesByFieldQuery({ name: 'promise', field: 'party', value: partyId, relation: 'id', populate: true })
  const [addEntity] = useAddEntityMutation()
  const [updateEntity] = useUpdateEntityMutation()
  const [addBill, setAddBill] = useState(false)

  const callVote = (billId) => {
    addEntity({ name: 'vote', body: { data: { 'promise': billId, country: countryId } } })
  }
  const readyForElection = () => {
    updateEntity({name: 'party', id: partyId , body: {data: {ready_for_election:true}}})
  }
  return (
    <div>
      {!addBill && <div>
        <Accordion defaultActiveKey="0">
          {data && data.data.map((bill) =>
            <Accordion.Item key={bill.id}>
              <Accordion.Header>{bill.attributes.name} - {bill.attributes.law.data.attributes.name}</Accordion.Header>
              <Accordion.Body>                
                {bill.attributes.status === 'NEW' && <Button onClick={() => callVote(bill.id)}>Call Vote</Button>}
                {bill.attributes.status === 'IN_VOTE' && <div>Bill is currently in voting</div>}
              </Accordion.Body>
            </Accordion.Item>
          )}
        </Accordion>
        <Button onClick={() => setAddBill(true)}>Add Bill</Button>
        {!isPartyReady && <Button onClick={() => readyForElection()}>Ready for Election</Button> }
      </div>}
      {addBill && <BillCreator partyId={partyId} closeCallback={() => setAddBill(false)} />}
    </div>
  );
};


