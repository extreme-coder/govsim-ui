import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Formik, Field } from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import TextField from './common/TextField';

import { useAddEntityMutation } from '../services/govsim';
import { useNavigate } from 'react-router-dom'
import SelectableCardList from './common/SelectableCardList';
import { TimePeriodField } from './common/TimePeriodField';

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
        Your Join code is : {joinCode}
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
  return (
    <div className="container">
      <Formik enableReinitialize validationSchema={GameSchema} onSubmit={onSubmit} initialValues={{ name: '', is_public: true, election_period:180 }}>
        {(props) => (
          <Form noValidate onSubmit={props.handleSubmit}>
            <Form.Group controlId="formBasicName">
              <TextField name="name" label="Country Name" placeholder="Name your Country" />             
              <TextField type="hidden" name="is_public" />
              Election Period : <TimePeriodField name="election_period" />
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

