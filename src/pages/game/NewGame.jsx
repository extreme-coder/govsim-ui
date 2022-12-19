import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Formik, Field } from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import TextField from '../../components/common/TextField';

import { useAddEntityMutation, useGetEntitiesByFieldQuery } from '../../services/govsim';
import { useNavigate } from 'react-router-dom'
import SelectableCardList from '../../components/common/SelectableCardList';
import { TimePeriodField } from '../../components/common/TimePeriodField';
import SelectField from '../../components/common/SelectField';

const GameSchema = Yup.object().shape({
  name: Yup.string()
    .required('Required'),  
});

export default function NewGame() {
  const [joinCode, setJoinCode] = useState('');
  

  const navigate = useNavigate()
  const [
    addEntity, 
    { isLoading: isUpdating, error }
  ] = useAddEntityMutation()
  

  let newGame = async (values) => {       
    let response = await addEntity({name: 'country', body:{data: values}})         
    if(!response.error) {
      setJoinCode(response.data.data.attributes.join_code)
    }
  }
  if(joinCode==='') {
    return (      
      <NewGameForm onSubmit={newGame}/>      
    );
  } else {
    return (
      <div className="container">
        <div className="row">
          Your Join code is : {joinCode}
        </div>
        <div className="row">
          <Button onClick={() => {navigator.clipboard.writeText(`${process.env.REACT_APP_DOMAIN}/joingame/${joinCode}`)}}>
            Copy join link
          </Button>
        </div>
        <div className="row">
          <Link to={`/joingame/${joinCode}`}>
            <Button>
              Join the game
            </Button>
          </Link>
          <Link to={`/games`}>
            <Button type="secondary">
              Back to games
            </Button>
          </Link>
        </div>
      </div>
    )
  }
};

function NewGameForm({onSubmit}) {
  
  const onPublicChange = (selected, setFieldValue) => {
    if(selected === 2) {
      setFieldValue('is_public', false)
    } else {
      setFieldValue('is_public', true)
    }    
  }

  const {data: templates} = useGetEntitiesByFieldQuery({name: 'country', field:'is_template', value:true})

  return (
    <div className="container">
      <Formik enableReinitialize validationSchema={GameSchema} onSubmit={onSubmit} initialValues={{ name: '', is_public: true, election_period:120, campaign_period:30 }}>
        {(props) => (
          <Form noValidate onSubmit={props.handleSubmit}>
            <Form.Group controlId="formBasicName">
              <SelectField name="template" label="Country Template">
                {templates && templates.data.map((t) => {return {label: t.attributes.name, value:t.id}})}
              </SelectField>
              <TextField name="name" label="Country Name" placeholder="Name your Country" />             
              <TextField type="hidden" name="is_public" />
              Election Period : <TimePeriodField name="election_period" />
              Campaign Period : <TimePeriodField name="campaign_period" />
              <SelectableCardList 
                multiple={false}           
                contents={[{id: 1, title:'Public'}, {id:2 , title:'Private'}]}
                onChange={(e)=>{onPublicChange(e, props.setFieldValue)}}
                selected={1}
              />   
              <Button variant="primary" type="submit">
                Start Game
              </Button>
            </Form.Group>
          </Form>
        )}
      </Formik>                 
    </div>
  );
}

