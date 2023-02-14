
import { Row, Col, Card } from 'react-bootstrap';
import BillCreatorAction from './BillCreatorAction';
import { useState } from 'react';
import { useGetEntitiesByFieldQuery, useAddEntityMutation } from "../../services/govsim";
import PromoteAction from './PromoteAction';
import { useEffect } from 'react';
import createBillImg from '../../assets/images/createbill.png'
import promoteBillImg from '../../assets/images/promote.png'
import opposeBillImg from '../../assets/images/oppose.png'
import callVoteImg from '../../assets/images/callvote.png'

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
        <Row className="justify-content-center">         
          <Col className="col-md-auto me-3"><h2>Your Turn</h2> </Col>          
        </Row>
        <Row className="justify-content-center">          
          <Col className="col-md-auto me-3"><h3>Select your action</h3> </Col>          
        </Row>
        
        <Row className="justify-content-center">          
          <Col className="col-md-auto me-3">
            <Card onClick={() => setShowBillCreator(true)} className="playing_card" style={{ backgroundImage: `url(${createBillImg})` }}>              
            </Card>
          </Col>
          {bills && (bills.data.length) > 0 && <Col className="col-md-auto me-3">
            <Card onClick={() => setShowPromoteBill(true)} className="playing_card" style={{ backgroundImage: `url(${promoteBillImg})` }}>              
            </Card>
          </Col>}
          {bills && (bills.data.length) > 0 && <Col className="col-md-auto me-3">
            <Card onClick={() => setShowOpposeBill(true)} className="playing_card" style={{ backgroundImage: `url(${opposeBillImg})` }}>              
            </Card>
          </Col>}          
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
      {bills && bills.data.filter((bill) => bill.attributes.status === 'IN_VOTE').length===0 && <div>
      <Row>
          <Col> </Col>
          <Col className="col-md-auto me-3"><h2>Your Turn</h2> </Col>
          <Col> </Col>
        </Row>
        <Row>
          <Col> </Col>
          <Col className="col-md-auto me-3"><h3>Choose one of your Bills to Call Vote</h3></Col>
          <Col> </Col>
        </Row>
        
        <Row>
          <Col></Col>
          {bills && bills.data.filter((bill) => bill.attributes.status === 'NEW' || bill.attributes.status === 'PROPOSED').map((bill) =>
            <Col className="col-md-auto me-3"><Card onClick={() => callVote(bill.id)} className="shadow-sm-no playing_card">{bill.attributes.name}</Card></Col>
          )}
          <Col></Col>
        </Row>
      </div>}
      {bills && bills.data.filter((bill) => bill.attributes.status === 'IN_VOTE').length>0 && <h2>Vote In Session...</h2>}
    </div>
  )

  return (
    <>
      {party.attributes.is_turn && <div>
       
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