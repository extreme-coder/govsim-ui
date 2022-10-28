import React, { useState } from 'react';
import { useGetEntitiesByFieldQuery } from '../../services/govsim';
import BillCreator from './BillCreator';
import { Button, Tabs, Tab, Popover, OverlayTrigger } from 'react-bootstrap';
import { useAddEntityMutation } from '../../services/govsim';
import FormInput from '../FormInput';
import { useSelector } from 'react-redux';


export default function Platform(props) {
  const { partyId, countryId, electionsOccurred } = props
  const { data } = useGetEntitiesByFieldQuery({ name: 'promise', field: 'party', value: partyId, relation: 'id', populate: true })
  const { data: allBills } = useGetEntitiesByFieldQuery({ name: 'promise', field: 'country', value: countryId, relation: 'id', populate: true })


  const [addBill, setAddBill] = useState(false)


 
  let otherBills=[]
  if(allBills) {
    otherBills = allBills.data.filter((b) => b.attributes.party.data.id !== partyId)
  }
  return (
    <div>
      {!addBill && <div>

        <Tabs
          defaultActiveKey="my_platform"
          id="uncontrolled-tab-example"
          className="mb-3 nav-bordered "
        >
          <Tab eventKey="my_platform" title="My Platform" className="tableFixHead">
            {data && <MyPlatform data={data.data} countryId={countryId} partyId={partyId} electionsOccurred={electionsOccurred}/>}
          </Tab>

          {allBills && 
            <Tab eventKey="other_bills" title={`Other Bills (${otherBills.length})`} className="tableFixHead">   
              <AllPlatform data={otherBills} countryId={countryId} />
            </Tab>
          }

        </Tabs>

        <Button onClick={() => setAddBill(true)}>Add Bill</Button>
        
      </div>}
      {addBill && <BillCreator partyId={partyId} closeCallback={() => setAddBill(false)} countryId={props.countryId} />}
    </div>
  );
};


function MyPlatform(props) {
  const { data, countryId, partyId } = props

  const [promotionBudget, setPromotionBudget] = useState(0)

  const { party } = useSelector((state) => ({
    party: state.theme.Game.party,
  }));

  const [addEntity] = useAddEntityMutation()

  const callVote = (billId) => {
    addEntity({ name: 'vote', body: { data: { 'promise': billId, country: countryId } } })
  }
  const promoteBill = (billId) => {
    addEntity({ name: 'promotion', body: { data: { type: 'POSITIVE', 'promise': billId, party: partyId, budget: promotionBudget } } })
    setPromotionBudget(0)
    document.body.click()
  }

  const popover = (bill) => (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Promote Bill: {bill.attributes.name}</Popover.Header>
      <Popover.Body>
        <FormInput
          label="Budget for Promotion"
          type="text"
          name="budget"
          containerClass={'mb-3'}
          value={promotionBudget}
          disabled
        />
        <input value={promotionBudget} type="range" class="form-range" min="0" max={party.attributes.budget} id="customRange2" onChange={(e) => setPromotionBudget(e.target.value)} />
        <Button className="m-1" onClick={() => promoteBill(bill.id)}>Submit</Button>
        <Button className="m-1" onClick={() => document.body.click()} >Cancel</Button>
      </Popover.Body>
    </Popover>
  );

  return (
    <table className="mb-0 table table-sm ">
      <thead>
        <tr><th>Bill</th><th>Law</th><th>Actions</th><th></th></tr>
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
            <td>
              <OverlayTrigger trigger="click" placement="auto" overlay={popover(bill)} rootClose>
                <Button variant="success">Promote</Button>
              </OverlayTrigger>

            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

function AllPlatform(props) {
  const { data, countryId } = props
  const [addEntity] = useAddEntityMutation()
  const [promotionBudget, setPromotionBudget] = useState(200)

  const { party } = useSelector((state) => ({
    party: state.theme.Game.party,
  }));

  const promoteBill = (billId) => {
    addEntity({ name: 'promotion', body: { data: { type: 'NEGATIVE', 'promise': billId, party: party.id, budget: promotionBudget } } })
    document.body.click()
    setPromotionBudget(0)
  }

  const popover = (bill) => (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Oppose Bill: {bill.attributes.name}</Popover.Header>
      <Popover.Body>
        <FormInput
          label="Budget for Negative Promotion"
          type="text"
          name="budget"
          containerClass={'mb-3'}
          value={promotionBudget}
          disabled
        />
        <input value={promotionBudget} type="range" class="form-range" min="0" max={party.attributes.budget} id="customRange2" onChange={(e) => setPromotionBudget(e.target.value)} />
        <Button className="m-1" onClick={() => promoteBill(bill.id)}>Submit</Button>
        <Button className="m-1" onClick={() => document.body.click()} >Cancel</Button>
      </Popover.Body>
    </Popover>
  );
  return (
    <table className="mb-0 table table-sm ">
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
              <OverlayTrigger trigger="click" placement="auto" overlay={popover(bill)} rootClose>
                <Button variant="success">Oppose</Button>
              </OverlayTrigger>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}