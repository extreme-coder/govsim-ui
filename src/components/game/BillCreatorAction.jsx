import MinistryLaws from "./MinistryLaw";
import { useGetEntitiesQuery } from "../../services/govsim"
import {Row, Col, Card} from 'react-bootstrap';
import { useState } from 'react';
import defaultCard from '../../assets/images/default_card.png'

export default function BillCreatorAction(props) {
  const { data: departments } = useGetEntitiesQuery({ name: 'department', populate: true })
  const [deptt, setDeptt] = useState(null)

  const { country, party } = props

  const getCardImage = (deptt) => {
    if(deptt.attributes.card_image && deptt.attributes.card_image.data) {
      return `url(${process.env.REACT_APP_API_DOMAIN}${deptt.attributes.card_image.data.attributes.url})`
    } else {
      return `url(${defaultCard})`
    }
  }

  

  return (
    <div>     
      <h2>Select a Ministry</h2>
      <Row>
      {departments && departments.data.map((deptt) =>         
          <Col>
            <Card onClick={()=>setDeptt(deptt)} className="shadow-sm-no playing_card" style={{backgroundImage:getCardImage(deptt)}}>
              <div >
              {deptt.attributes.name}
              </div>
            </Card>
          </Col>                  
      )}
      </Row>

      {deptt && <MinistryLaws deptt={deptt} country={country} party={party} partyId={party.id} />}
    </div>
  )
}