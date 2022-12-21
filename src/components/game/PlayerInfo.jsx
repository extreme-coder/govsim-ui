import React from 'react';
import { Button } from 'react-bootstrap';
import { useUpdateEntityMutation } from '../../services/govsim';

export default function PlayerInfo(props) {
  const {party, country} = props
  const isPartyReady=party.attributes.ready_for_election
  const [updateEntity] = useUpdateEntityMutation()

  const readyForElection = () => {
    updateEntity({ name: 'party', id: party.id, body: { data: { ready_for_election: true } } })
  }

  const finishedCampaign = () => {
    updateEntity({ name: 'party', id: party.id, body: { data: { finished_campaign: true } } })
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        
          <div className="col-xl-3 col-lg-3 col-md-3">Party Name: {party.attributes.name}</div>
          <div className="col-xl-3 col-lg-3 col-md-3">Remaining Budget: {party.attributes.budget}</div>
          <div className="col-xl-3 col-lg-3 col-md-3" >Score: {party.attributes.points}</div>
        <div className="col-xl-3 col-lg-3 col-md-3">
          {country.attributes.status === 'PARLIAMENT' && !isPartyReady && <Button onClick={() => readyForElection()}>Ready for Election</Button>}
          {country.attributes.status === 'CAMPAIGN' &&  !party.attributes.finished_campaign && <Button onClick={() => finishedCampaign()}>Finish Campaigning</Button>}
        </div>
      </div>
    </div>
  );
};