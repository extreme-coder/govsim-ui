import React, { useState } from 'react';
import { useGetEntitiesByFieldQuery } from '../../services/govsim';
import BillCreator from './BillCreator';
import { Button, Tabs, Tab } from 'react-bootstrap';
import { useAddEntityMutation, useUpdateEntityMutation } from '../../services/govsim';

export default function Platform(props) {
  const { partyId, countryId, isPartyReady } = props
  const { data } = useGetEntitiesByFieldQuery({ name: 'promise', field: 'party', value: partyId, relation: 'id', populate: true })
  const { data: allBills } = useGetEntitiesByFieldQuery({ name: 'promise', field: 'country', value: countryId, relation: 'id', populate: true })

  const [updateEntity] = useUpdateEntityMutation()
  const [addBill, setAddBill] = useState(false)


  const readyForElection = () => {
    updateEntity({ name: 'party', id: partyId, body: { data: { ready_for_election: true } } })
  }
  return (
    <div>
      {!addBill && <div>

        <Tabs
          defaultActiveKey="profile"
          id="uncontrolled-tab-example"
          className="mb-3 nav-bordered"
        >
          <Tab eventKey="home" title="My Platform">
          {data && <MyPlatform data={data.data} countryId={countryId} />}
          </Tab>
          <Tab eventKey="profile" title="Other Bills">
          {allBills && <AllPlatform data={allBills.data.filter((b) => b.attributes.party.data.id !== partyId)} countryId={countryId} />}
          </Tab>          
        </Tabs>
        
        <Button onClick={() => setAddBill(true)}>Add Bill</Button>
        {!isPartyReady && <Button onClick={() => readyForElection()}>Ready for Election</Button>}
      </div>}
      {addBill && <BillCreator partyId={partyId} closeCallback={() => setAddBill(false)} countryId={props.countryId} />}
    </div>
  );
};


function MyPlatform(props) {
  const { data, countryId } = props

  const [addEntity] = useAddEntityMutation()
  const callVote = (billId) => {
    addEntity({ name: 'vote', body: { data: { 'promise': billId, country: countryId } } })
  }

  return (
    <table className="mb-0 table table-sm">
      <thead>
        <tr><th>Bill</th><th>Law</th><th>Actions</th></tr>
      </thead>
      <tbody>
        {data && data.map((bill) =>
          <tr key={bill.id}>
            <td>{bill.attributes.name}</td>
            <td>{bill.attributes.law.data.attributes.name}</td>            
            <td>
              {bill.attributes.status === 'NEW' && props.electionsOccurred && <Button onClick={() => callVote(bill.id)}>Call Vote</Button>}
              {bill.attributes.status === 'NEW' && !props.electionsOccurred && <p>You can call a vote on this bill once you're in parliament</p>}
              {bill.attributes.status === 'IN_VOTE' && <div>Bill is currently in voting</div>}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

function AllPlatform(props) {
  const { data, countryId } = props

  return (
    <table className="mb-0 table table-sm">
      <thead>
        <tr><th>Bill</th><th>Law</th><th>Party</th><th>Actions</th></tr>
      </thead>
      <tbody>
        {data && data.map((bill) =>
          <tr key={bill.id}>
            <td>{bill.attributes.name}</td>
            <td>{bill.attributes.law.data.attributes.name}</td>
            <td>{bill.attributes.party.data.attributes.name}</td>
            <td>

            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}