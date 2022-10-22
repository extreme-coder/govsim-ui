import React from 'react';
import {useGetEntitiesByFieldQuery, useGetMessagesQuery} from '../../services/govsim';
import {Button} from 'react-bootstrap';
import { Link } from "react-router-dom";

export default function PartyLister(props) {
  const { countryId, countryCode, myParty } = props
  const { data } = useGetEntitiesByFieldQuery({ name: 'party', field: 'country', value: countryId, relation: 'id', populate: true })
  const { data: messages } = useGetMessagesQuery(countryId)

  const getMessageCount = (partyId) => {
    return messages.data.filter((m) => (m.attributes.is_read===false && m.attributes.from_party && m.attributes.from_party.data.id == partyId && m.attributes.to_party.data.id == myParty.id)).length
  }

  return (
    <div className="container">
      <div className="col-xl-10 col-lg-12 col-md-9">
          {data && messages && data.data.map((party) =>
              <div key={party.id}>
                {party.attributes.name} [{party.attributes.template.data.attributes.name}]
                {party.attributes.ready_for_election && <div> Party is ready for election</div>}
                {getMessageCount(party.id)}
              </div>
          )}

          <Link to={`/chat/${countryCode}`} ><Button className="btn btn-primary">Open Chat</Button></Link>
        </div>        
    </div>
  );
};

