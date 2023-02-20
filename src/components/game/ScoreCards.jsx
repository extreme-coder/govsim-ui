import {Card, Col, Row} from 'react-bootstrap'
import { useGetEntitiesByFieldQuery } from "../../services/govsim"


export default function ScoreCards(props) {
  const {party} = props
  const {data: cards} = useGetEntitiesByFieldQuery({name: 'socrecard', field : 'party', value: party.id, relation: 'id', populate: true})


  return (
    <div>      
     <Row className="justify-content-center">
      {cards && cards.data.map((card) =>         
          
            <Col className="col-md-12 col-lg-6" key={party.id} >
              <Card className={`shadow-sm-no justify-content-center party_card`}>
                <h3>{card.attributes.score}</h3>

                {card.attributes.description}
                
              </Card>
            </Col>              
          
      )}
     </Row>      
    </div>  
  )
}