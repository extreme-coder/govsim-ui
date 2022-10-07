import React, { useState } from 'react';
import { useGetEntitiesQuery, useAddEntityMutation, useGetEntitiesByFieldQuery,  useGetPartiesQuery} from '../services/govsim';
import { Button, Form } from 'react-bootstrap';
import { Link, useParams, Navigate } from "react-router-dom";
import SelectableCardList from './common/SelectableCardList';
import useLocalStorage from '../hooks/useLocalStorage';
import { Formik } from 'formik'
import TextField from './common/TextField';

export default function JoinGame() {
  const { code } = useParams();
  const [user, setUser] = useLocalStorage("user", "");
  const [selectedPartyType, setSelectedPartyType] = useState(0)
  const { data, error, isLoading } = useGetEntitiesQuery({name:'party-template'})
  const { data: country, error: cerror, isLoading: cisLoading } = useGetEntitiesByFieldQuery({ name: 'country', field: 'join_code', value: code })
  const [addEntity, { isLoading: isUpdating }] = useAddEntityMutation()
  const { data: party } = useGetPartiesQuery({ code: code, user: user.user.id })
  
  const joinGame = (vals) => {    
    addEntity({name:'party', body:{data:{country: country.data[0].id, name: vals.name, template: selectedPartyType, user: user.user.id}}})
  }

  const onPartyTypeChanged = (selected) => {
    setSelectedPartyType(selected)
  }
  console.log(party)
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
    return (<Navigate to={"/game/" + code} />)
  }
  else {
    return (
      <div className="container">
        {country && <div>{country.data[0].attributes.name}</div>}
        <div className="row justify-content-center">
          <Formik enableReinitialize onSubmit={joinGame} initialValues={{ name: '', is_public: true }}>
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