import { useParams, useNavigate } from "react-router-dom";
import { useGetEntitiesByFieldQuery, useUpdateEntityMutation } from "../../services/govsim"
import { Button } from "react-bootstrap";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { changeGame } from "../../redux/game/actions";


export default function StartGame() {
  const { code } = useParams();
  const { data: country, error: cerror, isLoading: cisLoading } = useGetEntitiesByFieldQuery({ name: 'country', field: 'join_code', value: code })
  const { data: parties } = useGetEntitiesByFieldQuery({ name: 'party', field: 'country', relation: 'join_code', value: code })
  const [updateEntity] = useUpdateEntityMutation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const startGame = () => {
    updateEntity({ name: 'country', id: country.data[0].id, body: { data: { status: 'CAMPAIGN' } } })
    navigate(`/game/${code}`)
  }

  useEffect(() => {
    if (country && country.data) {
      dispatch(changeGame(country.data[0]))            
      if(country.data[0].attributes.status !== 'NEW'){
        navigate(`/game/${code}`)
      }
    }   
  }, [country]);

  //render parties as cards
  return (
    <div>
      {country && <div><h2>{country.data[0].attributes.name}</h2></div>}
      <div className="container-fluid pt-2">
        Waiting for others to join the game
        <div className="row">
        {parties && parties.data.map((party) => {
        return (
          <div className="col-xxl-3 col-lg-3 col-md-3 py-2" key={party.id}>
            <div className="card shadow-sm-no  party_card_start">
              <div className="card-body">                           
              {party.attributes.name}
              </div>
            </div>
          </div>          
        )
      })}          
        </div>
        <Button onClick={startGame}>Start Game</Button>
      </div>

      
    </div>
  );  
};