import React, { useState } from 'react';
import { useGetEntitiesByFieldQuery } from '../../services/govsim';
import BillCreator from './BillCreator';
import { Button, Accordion } from 'react-bootstrap';
import { useAddEntityMutation } from '../../services/govsim';


export default function VotesInSession(props) {
  const { countryId, partyId } = props
  const { data } = useGetEntitiesByFieldQuery({ name: 'vote', field: 'country', value: countryId, relation: 'id', populate: 'populate[0]=promise&populate[1]=promise.law&populate[2]=promise.party' })
  const { data: ballots } = useGetEntitiesByFieldQuery({ name: 'ballot', field: 'party', value: partyId, relation: 'id', populate: true })
  const [addEntity] = useAddEntityMutation()


  const addBallot = (voteId, forVote) => {
    addEntity({ name: 'ballot', body: { data: { 'vote': voteId, for: forVote, party: partyId } } })
  }

  const getBallot = (voteId) => {
    for (let i = 0; i < ballots.data.length; ++i) {
      if (ballots.data[i].attributes.vote.data.id == voteId) return ballots.data[i]
    }
    return false
  }

  const voteActions = (vote, bill, ballot) => {
    if (bill.data.attributes.status === 'IN_VOTE') {
      if (bill.data.attributes.party.data.id == partyId) {
        return (<div>Your own vote</div>)
      }
      else if (ballot) {
        return (<div>
          You voted {ballot.attributes.for ? 'Yes' : 'No'}
        </div>)
      } else {
        return (
          <div>
            <Button onClick={() => addBallot(vote.id, true)}>Yes</Button>
            <Button onClick={() => addBallot(vote.id, false)}>No</Button>
          </div>)
      }
    } else {
      return 'Vote finished'
    }
  }


  return (
    <div>
      <div>
        <Accordion defaultActiveKey="0">
          {data && ballots && data.data.map((vote) => {
            const bill = vote.attributes.promise
            const ballot = getBallot(vote.id)
            return (<Accordion.Item key={vote.id}>
              <Accordion.Header>{bill.data.attributes.name} - {bill.data.attributes.law.data.attributes.name}</Accordion.Header>
              <Accordion.Body>
                {voteActions(vote, bill, ballot)}
              </Accordion.Body>
            </Accordion.Item>)
          }
          )}


        </Accordion>
      </div>
    </div>
  );
};


