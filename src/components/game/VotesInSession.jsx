import React, { useState } from 'react';
import { useGetEntitiesByFieldQuery } from '../../services/govsim';
import BillCreator from './BillCreator';
import { Button, Accordion } from 'react-bootstrap';
import { useAddEntityMutation } from '../../services/govsim';


export default function VotesInSession(props) {
  const { countryId, partyId } = props
  const { data } = useGetEntitiesByFieldQuery({ name: 'vote', field: 'country', value: countryId, relation: 'id', populate: 'populate[promise][populate][0]=law' })
  const [addEntity] = useAddEntityMutation()


  const addBallot = (voteId, forVote) => {
    addEntity({ name: 'ballot', body: { data: { 'vote': voteId, for: true, party: partyId } } })
  }

  return (
    <div>
      <div>
        <Accordion defaultActiveKey="0">
          {data && data.data.map((vote) => {
            const bill = vote.attributes.promise
            return (<Accordion.Item eventKey={vote.id}>
              <Accordion.Header>{bill.data.attributes.name} - {bill.data.attributes.law.data.attributes.name}</Accordion.Header>
              <Accordion.Body>
                {bill.data.attributes.status === 'NEW' && 
                  <div>
                    <Button onClick={() => addBallot(vote.id, true)}>Yes</Button>
                    <Button onClick={() => addBallot(vote.id, false)}>No</Button>
                  </div>
                }
              </Accordion.Body>
            </Accordion.Item>)
          }
          )}


        </Accordion>
      </div>
    </div>
  );
};


