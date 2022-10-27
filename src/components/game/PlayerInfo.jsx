import React from 'react';
import { Button } from 'react-bootstrap';
import { useUpdateEntityMutation } from '../../services/govsim';

export default function PlayerInfo(props) {
  const {party} = props
  const isPartyReady=party.attributes.ready_for_election
  const [updateEntity] = useUpdateEntityMutation()

  const readyForElection = () => {
    updateEntity({ name: 'party', id: party.id, body: { data: { ready_for_election: true } } })
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-xl-10 col-lg-12 col-md-9">
          <p>Party Name: {party.attributes.name}</p>
          <p>Remaining Budget: {party.attributes.budget}</p>
          <p>Score: {party.attributes.score}</p>

          {!isPartyReady && <Button onClick={() => readyForElection()}>Ready for Election</Button>}
        </div>
      </div>
    </div>
  );
};