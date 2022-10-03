import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import TextField from './common/TextField';

import { useAddEntityMutation } from '../services/govsim';
import { useNavigate } from 'react-router-dom'

const GameSchema = Yup.object().shape({
  name: Yup.string()
    .required('Required'),  
});

export default function NewGame() {
  const [joinCode, setJoinCode] = useState('');

  const navigate = useNavigate()
  const [
    addEntity, 
    { isLoading: isUpdating }
  ] = useAddEntityMutation()

  let newGame = async (values) => {    
    let response = await addEntity({name: 'country', body:{data: values}})     
    console.log(response)   
    setJoinCode(response.data.data.attributes.join_code)
  }
  if(joinCode==='') {
    return (<NewGameForm onSubmit={newGame}/>);
  } else {
    return (
      <div className="container">
        Your Join code is : {joinCode}
      </div>
    )
  }
};

function NewGameForm({onSubmit}) {
  return (
    <div className="container">
      <Formik enableReinitialize validationSchema={GameSchema} onSubmit={onSubmit} initialValues={{ name: ''}}>
        {(props) => (
          <Form noValidate onSubmit={props.handleSubmit}>
            <Form.Group controlId="formBasicName">
              <TextField name="name" label="Country Name" placeholder="Name your Country" />                
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

