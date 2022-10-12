import React, { useState } from 'react';
import { useGetEntitiesByFieldQuery } from '../../services/govsim';
import BillCreator from './BillCreator';
import { Button, Accordion } from 'react-bootstrap';
import { useAddEntityMutation } from '../../services/govsim';

export default function Platform(props) {
  const { partyId } = props
  const { data } = useGetEntitiesByFieldQuery({ name: 'promise', field: 'party', value: partyId, relation: 'id', populate: true })
  const [addEntity] = useAddEntityMutation()
  const [addBill, setAddBill] = useState(false)

  const callVote = (billId) => {
    addEntity({ name: 'vote', body: { data: { 'promise': billId } } })
  }
  return (
    <div>
      {!addBill && <div>

        <Accordion defaultActiveKey="0">
          {data && data.data.map((bill) =>
            <Accordion.Item eventKey={bill.id}>
              <Accordion.Header>{bill.attributes.name} - {bill.attributes.law.data.attributes.name}</Accordion.Header>
              <Accordion.Body>                
                {bill.attributes.status === 'NEW' && <Button onClick={() => callVote(bill.id)}>Call Vote</Button>}
              </Accordion.Body>
            </Accordion.Item>

          )}


        </Accordion>


        <Button onClick={() => setAddBill(true)}>Add Bill</Button>
      </div>}

      {addBill && <BillCreator partyId={partyId} closeCallback={() => setAddBill(false)} />}
    </div>
  );
};


