import React from 'react';
import { useGetEntitiesByFieldQuery, useGetEntitiesQuery, useGetMessagesQuery } from '../../services/govsim';
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useState } from 'react';
import { MyPlatform } from './Platform';

export default function PartyLister(props) {
  const { countryId, countryCode, myParty, country } = props
  const { data } = useGetEntitiesByFieldQuery({ name: 'party', field: 'country', value: countryId, relation: 'id', populate: true })
  const { data: messages } = useGetMessagesQuery(countryId)
  const { data: countryLaws } = useGetEntitiesByFieldQuery({ name: 'country-law', field: 'country', value: countryId, relation: 'id', populate: true })
  const { data: promises } = useGetEntitiesQuery({ name: 'promise', populate: true })
  const [partyViewing, setPartyViewing] = useState(-1)

  const getMessageCount = (partyId) => {
    return messages.data.filter((m) => (m.attributes.is_read === false && m.attributes.from_party && m.attributes.from_party.data.id == partyId && m.attributes.to_party.data.id == myParty.id)).length
  }

  return (
    <div className="container">
      <div className="col-xl-10 col-lg-12 col-md-9">
        {partyViewing === -1 && <div><table className="mb-0 table table-sm">
          <thead>
            <tr>
              <th>Party</th><th>Score</th>
              {country.attributes.status === 'CAMPAIGN' && <th>Finished Campaigning</th>}
              {country.attributes.status === 'PARLIAMENT' && <th>Ready for Elections</th>}
              <th />
            </tr>
          </thead>
          <tbody>
            {data && messages && data.data.map((party) =>
              <tr key={party.id}>
                <td>{party.attributes.name} [{party.attributes.template.data.attributes.name}]</td>
                {/*<td>{getMessageCount(party.id)}</td>*/}
                <td>{party.attributes.points}</td>
                {country.attributes.status === 'CAMPAIGN' && <td>{party.attributes.finished_campaign ? 'Yes' : 'No'}</td>}
                {country.attributes.status === 'PARLIAMENT' && <td>{party.attributes.ready_for_election ? 'Yes' : 'No'}</td>}
                <td><Button className="btn btn-primary" onClick={() => setPartyViewing(party.id)}>View Platform</Button></td>
              </tr>
            )}
          </tbody>
        </table>
        <Link to={`/chat/${countryCode}`} ><Button className="btn btn-primary">Open Chat</Button></Link></div>}
        {partyViewing !== -1 && <div>
          <MyPlatform data={promises.data.filter(p => p.attributes.party.data.id === partyViewing)} countryId={countryId} partyId={partyViewing} electionsOccurred={country.attributes.elections_occurred} country={country} cLaws={countryLaws.data} />
          <Button className="btn btn-primary" onClick={() => setPartyViewing(-1)}>Back</Button>
        </div>}
      </div>
    </div>
  );
};

