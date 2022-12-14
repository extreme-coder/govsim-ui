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

  const revertReadyForElection = () => {
    updateEntity({ name: 'party', id: party.id, body: { data: { ready_for_election: false } } })
  }

  const readyForParliament = () => {
    updateEntity({ name: 'party', id: party.id, body: { data: { ready_for_parliament: true } } })
  }

  const revertReadyForParliament = () => {
    updateEntity({ name: 'party', id: party.id, body: { data: { ready_for_parliament: false } } })
  }

  const finishedCampaign = () => {
    updateEntity({ name: 'party', id: party.id, body: { data: { finished_campaign: true } } })
  }

  const revertFinishedCampaign = () => {
    updateEntity({ name: 'party', id: party.id, body: { data: { finished_campaign: false } } })
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        
          <div className="col-xl-3 col-lg-3 col-md-3">Party Name: {party.attributes.name}</div>
          <div className="col-xl-3 col-lg-3 col-md-3">Remaining Budget: {party.attributes.budget}</div>
          <div className="col-xl-3 col-lg-3 col-md-3" >Score: {party.attributes.points}</div>
        <div className="col-xl-3 col-lg-3 col-md-3">
          {country.attributes.status === 'PARLIAMENT' && !isPartyReady && <Button onClick={() => readyForElection()}>Ready for Election</Button>}
          {country.attributes.status === 'PARLIAMENT' && isPartyReady && <div>
            <p>You are ready for the next election</p>
            <Button onClick={() => revertReadyForElection()}>Go Back</Button>
          </div>}
          {country.attributes.status === 'CAMPAIGN' && !party.attributes.finished_campaign && <Button onClick={() => finishedCampaign()}>Finish Campaigning</Button>}
          {country.attributes.status === 'CAMPAIGN' && party.attributes.finished_campaign && <div>
            <p>You are finished campaigning</p>
            <Button onClick={() => revertFinishedCampaign()}>Go Back</Button>
          </div>}
          {country.attributes.status === 'COALITIONS' && !party.attributes.ready_for_parliament && <Button onClick={() => readyForParliament()}>Ready for Parliament</Button>}
          {country.attributes.status === 'COALITIONS' && party.attributes.ready_for_parliament && <div>
            <p>You are ready for Parliament Session</p>
            <Button onClick={() => revertReadyForParliament()}>Go Back</Button>
          </div>}
        </div>
      </div>
    </div>
  );
};