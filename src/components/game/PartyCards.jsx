import {Card, Col, Row} from 'react-bootstrap'
import { useGetEntitiesByFieldQuery } from "../../services/govsim"


export default function PartyCards(props) {
  const {country} = props
  const {data: parties} = useGetEntitiesByFieldQuery({name: 'party', field : 'country', value: country.id, relation: 'id', populate: true})


  return (
    <div>      
      <Row>
        <Col></Col>
      {parties && parties.data.map((party) =>         
          <Col className="col-md-auto me-3" key={party.id} ><Card className={`shadow-sm-no party_card ${(party.attributes.is_turn)?'active':''}`}>{party.attributes.name}</Card></Col>                  
      )}
        <Col></Col>
      </Row>
    </div>  
  )
}