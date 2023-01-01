import React, { useState } from 'react';
import { useGetEntitiesByFieldQuery, useGetEntitiesQuery } from '../../services/govsim';
import BillCreator from './BillCreator';
import { Button, Accordion } from 'react-bootstrap';
import { useAddEntityMutation } from '../../services/govsim';


export default function VotesInSession(props) {
  const { countryId, partyId } = props
  const { data } = useGetEntitiesByFieldQuery({ name: 'vote', field: 'country', value: countryId, relation: 'id', populate: 'populate[0]=promise&populate[1]=promise.law&populate[2]=promise.party&populate[3]=promise.country_law', sort: 'desc' })
  const { data: ballots } = useGetEntitiesByFieldQuery({ name: 'ballot', field: 'party', value: partyId, relation: 'id', populate: true })
  const { data: promises } = useGetEntitiesByFieldQuery({ name: 'promise', field: 'party', value: partyId, relation: 'id', populate: true })
  const { data: yourBlocks } = useGetEntitiesByFieldQuery({ name: 'block', field: 'preferred_party', value: partyId, relation: 'id', populate: true })
  const { data: laws } = useGetEntitiesQuery({ name: 'law', populate: true })
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
    if (bill.data.attributes.party.data.id === partyId) {
      return ''
    }
    if (promises && promises.data.map(p => p.attributes.country_law.data.id).indexOf(bill.data.attributes.country_law.data.id) !== -1) {
      if (promises.data.map(p => p.attributes.law.data.id).indexOf(bill.data.attributes.law.data.id) !== -1) {
        return 'Supports a law in your campaign'
      }
      return 'Opposed to a law in your campaign'
    }
    let supportTotal = 0
    let num = 0
    let againstTotal = 0
    const law = laws.data[laws.data.map(l => l.id).indexOf(bill.data.attributes.law.data.id)]
    yourBlocks.data.map(b => {
      if (law.attributes.groups_support.data.map(g => g.id).indexOf(b.attributes.demographic.data.id) !== -1) {
        supportTotal++
      }
      if (law.attributes.groups_against.data.map(g => g.id).indexOf(b.attributes.demographic.data.id) !== -1) {
        againstTotal++
      }
      num++
    })
    if (num > 0) {
      const support = supportTotal / num
      const against = againstTotal / num
      if (support > against) {
        return `${support*100+Math.ceil(Math.random*5)}% of your supporters like this bill`
      }
      return `${against*100+Math.ceil(Math.random*5)}% of your supporters oppose this bill`
    }
    return ''
  }


  return (
    <table className="mb-0 table table-sm">
      <thead>
        <tr><th>Bill</th><th>Law</th><th>Party</th><th>Actions</th><th>Info</th></tr>
      </thead>
      <tbody>
        {data && ballots && yourBlocks && laws && data.data.map((vote) => {
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


