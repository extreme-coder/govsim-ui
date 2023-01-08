import React from 'react';
import { useGetEntitiesByFieldQuery, useGetEntitiesQuery, useGetMessagesQuery, useAddEntityMutation } from '../../services/govsim';
import { Button, FormCheck, Popover, OverlayTrigger, Form } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useState } from 'react';
import { MyPlatform } from './Platform';
import TextField from '../common/TextField';
import { Formik } from 'formik';

export default function PartyLister(props) {
  const { countryId, countryCode, myParty, country } = props
  const { data } = useGetEntitiesByFieldQuery({ name: 'party', field: 'country', value: countryId, relation: 'id', populate: true })
  const { data: messages } = useGetMessagesQuery(countryId)
  const { data: countryLaws } = useGetEntitiesByFieldQuery({ name: 'country-law', field: 'country', value: countryId, relation: 'id', populate: true })
  const { data: promises } = useGetEntitiesQuery({ name: 'promise', populate: true })
  const { data: coalitions } = useGetEntitiesByFieldQuery({ name: 'coalition', field: 'country', value: countryId, relation: 'id', populate: true })
  const [partyViewing, setPartyViewing] = useState(-1)
  const [coalition, setCoalition] = useState([myParty.id])
  const [addEntity] = useAddEntityMutation() 

  const getMessageCount = (partyId) => {
    return messages.data.filter((m) => (m.attributes.is_read === false && m.attributes.from_party && m.attributes.from_party.data.id == partyId && m.attributes.to_party.data.id == myParty.id)).length
  }

  const togglePartyToCoalition = (partyId) => {
    if (coalition.includes(partyId)) {
      setCoalition(coalition.filter((p) => p !== partyId))
    } else {
      setCoalition([...coalition, partyId])
    }
  }

  const onCoalitionSubmit = (values) => {
    addEntity({ name: 'coalition', body: { data: { name: values.name, country: countryId, parties: coalition } }})    
    //close the popover
    setCoalition([myParty.id])
    document.body.click()
  }

  const createCoalition = (
    <Popover id="popover-trigger-hover-focus" title="Popover bottom">     
      <Formik enableReinitialize  onSubmit={onCoalitionSubmit} initialValues={{ name: ''}}>
        {(props) => (
          <Form noValidate onSubmit={props.handleSubmit}>
            <Form.Group controlId="formBasicName"> 
            <TextField name="name" label="Name of your Coalition"/>
            <Button type="submit" >Create Coalition</Button>
            </Form.Group>
          </Form>
        )}
        </Formik>    
      
    </Popover>
  );

  return (
    <div className="container">      
      <div className="col-xl-10 col-lg-12 col-md-9">
        {partyViewing === -1 && <div><table className="mb-0 table table-sm">
          <thead>
            <tr>
              <th>Party</th><th>Score</th>
              {country.attributes.status === 'CAMPAIGN' && <th>Finished Campaigning</th>}
              {country.attributes.status === 'PARLIAMENT' && <th>Ready for Elections</th>}
              {country.attributes.status === 'COALITIONS' && <th>Ready for Parliament</th>}
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
                {country.attributes.status === 'COALITIONS' && <td>{party.attributes.ready_for_parliament ? 'Yes' : 'No'}</td>}
                <td>
                  <FormCheck onClick={() => togglePartyToCoalition(party.id)} 
                      {...(coalition.includes(party.id))?{checked: true}:{}} 
                      {...(party.id === myParty.id)?{disabled: true}:{}} 
                      />
                </td>
                <td><Button className="btn btn-primary" onClick={() => setPartyViewing(party.id)}>View Platform</Button></td>
              </tr>
            )}
          </tbody>
        </table>
        <Link to={`/chat/${countryCode}`} ><Button className="btn btn-primary">Open Chat</Button></Link>
        <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={createCoalition}>
          <Button className="m-2">Create Coalition</Button>
        </OverlayTrigger></div>}
        {partyViewing !== -1 && <div>
          <MyPlatform data={promises.data.filter(p => p.attributes.party.data.id === partyViewing)} countryId={countryId} partyId={partyViewing} electionsOccurred={country.attributes.elections_occurred} country={country} cLaws={countryLaws.data} />
          <Button className="btn btn-primary" onClick={() => setPartyViewing(-1)}>Back</Button>
        </div>}
      </div>
      <div className="col-xl-10 col-lg-12 col-md-9">
        <div><table className="mb-0 table table-sm">
          <thead>
            <tr>
              <th>Coalition Name</th><th>Parties</th>                            
            </tr>
          </thead>
          <tbody>
            {coalitions && coalitions.data.map((coalition) =>
              <tr key={coalition.id}>
                <td>{coalition.attributes.name} </td>                
                <td>{coalition.attributes.parties.data.map((p) => p.attributes.name).join(', ')}</td>
              </tr>
            )}
          </tbody>
        </table>        
        </div>
      </div>
    </div>
  );
};

