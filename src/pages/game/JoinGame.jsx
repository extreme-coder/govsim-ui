import React, { useState } from 'react';
import { useGetEntitiesQuery, useAddEntityMutation, useGetEntitiesByFieldQuery,  useGetPartiesQuery} from '../../services/govsim';
import { Button, Form } from 'react-bootstrap';
import { Link, useParams, useNavigate, Navigate } from "react-router-dom";
import SelectableCardList from '../../components/common/SelectableCardList';
import useLocalStorage from '../../hooks/useLocalStorage';
import { Formik } from 'formik'
import TextField from '../../components/common/TextField';
import * as Yup from 'yup';

export default function JoinGame() {
  const { code } = useParams();
  const [user, setUser] = useLocalStorage("user", "");
  const [selectedPartyType, setSelectedPartyType] = useState(0)
  const { data, error, isLoading } = useGetEntitiesQuery({name:'party-template'})
  const { data: country, error: cerror, isLoading: cisLoading } = useGetEntitiesByFieldQuery({ name: 'country', field: 'join_code', value: code })
  const [addEntity, { isLoading: isUpdating }] = useAddEntityMutation()
  const { data: party } = useGetPartiesQuery({ code: code, user: user.user.id })
  const navigate = useNavigate()
  const { data: allParties } = useGetPartiesQuery({ code: code })
  
  const joinGame = async (vals) => {    
    const e = await addEntity({ name: 'party', body: { data: { country: country.data[0].id, name: vals.name, template: selectedPartyType, user: user.user.id } } })
    localStorage.setItem("partyId", e.data.id)
    //check if any error came    
    if (!e.error) {
      navigate(`/startgame/${code}`)
    }    
  }

  const onPartyTypeChanged = (selected) => {
    setSelectedPartyType(selected)
  }

  const LoginSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
  });

  if (country && country.data.length === 0) {
    return (
      <div>
        Wrong join code
        <Link to="/games">
          <Button>
            Return to games
          </Button>
        </Link>
      </div>
    )
  } else if (party && party.data.length > 0) {
    //save party id in local storage
    localStorage.setItem("partyId", party.data[0].id)
    return (<Navigate to={"/game/" + code} />)
  }
  else {
    console.log(allParties)
    return (
      <div className="container">
        {country && <div>{country.data[0].attributes.name}</div>}
        <div className="row justify-content-center">
          <Formik enableReinitialize onSubmit={joinGame} initialValues={{ name: '', is_public: true }} validationSchema={LoginSchema}>
            {(props) => (
              <Form noValidate onSubmit={props.handleSubmit}>
                <Form.Group controlId="formBasicName">
                  <div className="col-xl-10 col-lg-12 col-md-9">
                    <TextField name="name" label="Choose a name for your party:" placeholder="Enter Name" />
                    Pick a template for your party to get started:
                    {data && 
                    <SelectableCardList 
                    multiple={false}           
                    contents={data.data.map((a) => { return {id: a.id, title: a.attributes.name} } )}
                    onChange={(e)=>{onPartyTypeChanged(e)}}
                    />
                    }
                  </div>
                  <div className="container">
                    <div className="col-xl-10 col-lg-12 col-md-9">
                      {allParties && allParties.data.map((party) => (
                        <div key={party.id}>
                          {party.attributes.name} [{party.attributes.template.data.attributes.name}]
                          {party.attributes.ready_for_election && <div> Party is ready for election</div>}
                        </div>)
                      )}
                    </div>        
                  </div>
                  <Button type="submit" >Join Game</Button>
                </Form.Group>
              </Form>
            )}
          </Formik>  
        </div>
      </div>
    );
  }

};