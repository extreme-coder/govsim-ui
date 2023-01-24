
import { Row, Col, Card } from 'react-bootstrap';
import BillCreatorAction from './BillCreatorAction';
import { useState } from 'react';
import { useGetEntitiesByFieldQuery, useAddEntityMutation } from "../../services/govsim";
import PromoteAction from './PromoteAction';
import { useEffect } from 'react';


export default function TurnAction(props) {
  const { country, party } = props
  const [addEntity] = useAddEntityMutation()
  const [showBillCreator, setShowBillCreator] = useState(false)
  const [showPromoteBill, setShowPromoteBill] = useState(false)
  const [showOpposeBill, setShowOpposeBill] = useState(false)
  const { data: bills } = useGetEntitiesByFieldQuery({ name: 'promise', field: 'party', value: party.id, relation: 'id', populate: true })
  const { data: parties } = useGetEntitiesByFieldQuery({ name: 'party', field: 'country', value: country.id, relation: 'id', populate: true })


  useEffect(() => {
    setShowBillCreator(false)
    setShowPromoteBill(false)
    setShowOpposeBill(false)
  }, [party]);

  const capaignActions = (
    <div>
      {!showBillCreator && !showPromoteBill && <div>
        <h2>Select your action</h2>
        <Row>
          <Col><Card onClick={() => setShowBillCreator(true)} className="playing_card">Create a Bill</Card></Col>
          <Col><Card onClick={() => setShowPromoteBill(true)} className="playing_card">Promote your Bill</Card></Col>
          <Col><Card onClick={() => setShowOpposeBill(true)} className="playing_card">Oppose a Bill</Card></Col>
        </Row>
      </div>}
      {showBillCreator && <BillCreatorAction country={country} party={party} />}
      {showPromoteBill && bills && (bills.data.length) > 0 && <PromoteAction country={country} party={party} promote={true} />}
      {showOpposeBill && bills && (bills.data.length) > 0 && <PromoteAction country={country} party={party} promote={false} />}
    </div>
  )

  const callVote = (billId) => {
    addEntity({ name: 'vote', body: { data: { 'promise': billId, country: country.id } } })
  }

  const parliamentActions = (
    <div>
      <h2>Choose one of your Bills to Call Vote</h2>
      <Row>
        {bills && bills.data.filter((bill) => bill.attributes.status == 'NEW' || bill.attributes.status == 'PROPOSED').map((bill) =>
          <Col><Card onClick={() => callVote(bill.id)} className="shadow-sm-no playing_card">{bill.attributes.name}</Card></Col>
        )}
      </Row>
    </div>
  )

  return (
    <>
      {party.attributes.is_turn && <div>
        <h3>Your Turn</h3>
        {country.attributes.status === 'CAMPAIGN' && capaignActions}
        {country.attributes.status === 'PARLIAMENT' && parliamentActions}
      </div>
      }
      {!party.attributes.is_turn && <div>
        <h3>Waiting for {parties && parties.data.filter((p) => p.attributes.is_turn)[0].attributes.name} to Complete their turn</h3>
      </div>
      }
    </>
  )
}