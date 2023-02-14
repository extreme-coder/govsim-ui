import { Row, Col, Card } from 'react-bootstrap';
import { useGetEntitiesByFieldQuery, useAddEntityMutation } from "../../services/govsim"
import React, { useState } from 'react'

import { Button } from 'react-bootstrap';
import FormInput from '../FormInput';


export default function PromoteAction(props) {
  const { country, party, promote } = props
  const { data: bills } = useGetEntitiesByFieldQuery({ name: 'promise', field: 'party', value: party.id, relation: 'id', populate: true })
  const { data: allBills } = useGetEntitiesByFieldQuery({ name: 'promise', field: 'country', value: country.id, relation: 'id', populate: true })

  const [promotionBudget, setPromotionBudget] = useState(0)
  const [selectedBill, setSelectedBill] = useState(null)
  const [showPromoteForm, setShowPromoteForm] = useState(false)

  const [addEntity] = useAddEntityMutation()

  const promoteBill = (billId) => {
    if (promote) {
      addEntity({ name: 'promotion', body: { data: { type: 'POSITIVE', 'promise': billId, party: party.id, budget: promotionBudget } } })
    } else {
      addEntity({ name: 'promotion', body: { data: { type: 'NEGATIVE', 'promise': billId, party: party.id, budget: promotionBudget } } })
    }
    setPromotionBudget(0)
    setShowPromoteForm(false)
  }

  const promoteForm = (bill) => (
    <div>
      <FormInput
        label={promote ? "Budget for Promotion" : "Budget for Negative Promotion"}
        type="text"
        name="budget"
        containerClass={'mb-3'}
        value={promotionBudget}
        disabled
      />
      <input value={promotionBudget} type="range" class="form-range" min="0" max={party.attributes.budget} id="customRange2" onChange={(e) => setPromotionBudget(e.target.value)} />
      <Button className="m-1" onClick={() => promoteBill(bill.id)}>Submit</Button>
      <Button className="m-1" onClick={() => setShowPromoteForm(false)} >Cancel</Button>
    </div>
  )

  const onBillClick = (e, bill) => {
    e.preventDefault()
    setSelectedBill(bill)
    setShowPromoteForm(true)
  }

  return (
    <div>
      
      <Row className="justify-content-center">        
        <Col className="col-md-auto me-3"><h2>{(promote) ? `Choose one of your Bills to Promote` : `Choose a Bill you want to Oppose`}</h2></Col>        
      </Row>
      <Row className="justify-content-center">        
        {promote && bills && bills.data.filter((bill) => bill.attributes.status == 'NEW' || bill.attributes.status == 'PROPOSED').map((bill) =>
          <Col className="col-md-auto me-3"><Card onClick={(e) => onBillClick(e, bill)} className="shadow-sm-no playing_card">{bill.attributes.name}</Card></Col>
        )}
        {!promote && allBills && allBills.data.filter((b) => b.attributes.party.data.id !== party.id).filter((bill) => bill.attributes.status == 'NEW' || bill.attributes.status == 'PROPOSED').map((bill) =>
          <Col className="col-md-auto me-3"><Card onClick={(e) => onBillClick(e, bill)} className="shadow-sm-no playing_card">{bill.attributes.name}</Card></Col>
        )}        
      </Row>
      <Row className="justify-content-center">        
        <Col className="col-md-auto me-3">
        {showPromoteForm && promoteForm(selectedBill)}
        </Col>        
      </Row>
    </div>
  )
}

