import React, { useState } from 'react';
import { useGetEntitiesByFieldQuery } from '../../services/govsim';
import BillCreator from './BillCreator';
import { Button, Accordion } from 'react-bootstrap';
import { useAddEntityMutation } from '../../services/govsim';


export default function VotesInSession(props) {
  const { countryId, partyId } = props
  const { data } = useGetEntitiesByFieldQuery({ name: 'vote', field: 'country', value: countryId, relation: 'id', populate: 'populate[0]=promise&populate[1]=promise.law&populate[2]=promise.party&populate[3]=promise.country_law' })
  const { data: ballots } = useGetEntitiesByFieldQuery({ name: 'ballot', field: 'party', value: partyId, relation: 'id', populate: true })
  const { data: promises } = useGetEntitiesByFieldQuery({ name: 'promise', field: 'party', value: partyId, relation: 'id', populate: true })
  const [addEntity] = useAddEntityMutation()


  const addBallot = (voteId, forVote) => {
    addEntity({ name: 'ballot', body: { data: { 'vote': voteId, for: forVote, party: partyId, country: countryId } } })
  }

  const getBallot = (voteId) => {
    for (let i = 0; i < ballots.data.length; ++i) {
      if (ballots.data[i].attributes.vote.data.id === voteId) return ballots.data[i]
    }
    return false
  }

  const voteActions = (vote, bill, ballot) => {
    console.log(vote)
    if (bill.data.attributes.status === 'IN_VOTE') {
      if (bill.data.attributes.party.data.id === partyId) {
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
      if (vote.attributes.status === 'PASSED') {
        return 'Bill passed'
      } else if (vote.attributes.status === 'FAILED') {
        return 'Bill failed'
      }
    }
  }

  const voteInfo = (vote, bill, ballot) => {
    console.log(promises)
    console.log(bill)
    if (bill.data.attributes.party.data.id === partyId) {
      return ''
    }
    if (promises && promises.data.map(p => p.attributes.country_law.data.id).indexOf(bill.data.attributes.country_law.data.id) !== -1) {
      console.log('test')
      if (promises.data.map(p => p.attributes.law.data.id).indexOf(bill.data.attributes.law.data.id) !== -1) {
        return 'Supports a law in your campaign'
      }
      return 'Opposed to a law in your campaign'
    }
    return ''
  }


  return (
    <table className="mb-0 table table-sm">
      <thead>
        <tr><th>Bill</th><th>Law</th><th>Party</th><th>Actions</th><th>Info</th></tr>
      </thead>
      <tbody>
        {data && ballots && data.data.map((vote) => {
          const bill = vote.attributes.promise
          const ballot = getBallot(vote.id)
          return (<tr key={vote.id}>
            <td>{bill.data.attributes.name}</td>
            <td>{bill.data.attributes.law.data.attributes.name}</td>
            <td>{bill.data.attributes.party.data.attributes.name}</td>
            <td>{voteActions(vote, bill, ballot)}</td>
            <td>{promises && voteInfo(vote, bill, ballot)}</td>
          </tr>)
        }
        )}
      </tbody>
    </table>
  );
};


