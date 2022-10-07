import React, {useState} from 'react'

import { Form, Button } from 'react-bootstrap';
import { Formik } from 'formik'
import TextField from '../common/TextField';
import SelectField from '../common/SelectField';
import { useGetEntitiesQuery, useAddEntityMutation } from '../../services/govsim';


export default function BillCreator (props) {
  const { partyId } = props
  const [ltField, setLtField] = useState(false)
  const [lawField, setLawField] = useState(false)
  const [nameField, setNameField] = useState(false)
  const [deptt, setDeptt] = useState(0)
  const [lawType, setLawType] = useState(0)
  
  const { data: departments } = useGetEntitiesQuery({name:'department'})
  const { data: lawTypes } = useGetEntitiesQuery({name:'category', populate: true})
  const { data: laws } = useGetEntitiesQuery({name:'law', populate: true}) 
  const [addEntity] = useAddEntityMutation() 

  const saveBill = (vals) => {  
    vals.party = partyId
    addEntity({name:'promise', body:{data:vals}})
  }

  const getDepartments = () => {    
    if(departments) {
      return departments.data.map((dp) => ({ value: dp.id, label: dp.attributes.name }))    
    } else {
      return []
    }
  }

  const getLawTypes = (dept) => {
    if (lawTypes) {
      return lawTypes.data.filter((lt) => (deptt === lt.attributes.department.data.id)).map((lt) => ({ value: lt.id, label: lt.attributes.name }))
    }
    return []
  }

  const getLaws = (lt) => {
    if (laws) {
      return laws.data.filter((law) => (lawType === law.attributes.law_type.data.id)).map((law) => ({ value: law.id, label: law.attributes.name }))      
    }
    return []
  }

  const handleOnChange = (name, value) => {
    switch (name) {
      case 'department':
        setDeptt(value)
        setLtField(true)
        break;
      case 'law-type':
        setLawType(value)
        setLawField(true)
        break;
      case 'law':
        setNameField(true)
        break;
      default:
    }
  }

  const ltRender = () => {
    if (ltField) {
      return (
        <SelectField name="law-type" label="Then, choose which type of law you want to change." onChange={handleOnChange}>
          {getLawTypes()}
        </SelectField>
      )
    }
  }

  const lawRender = () => {
    if (lawField) {
      return (
        <SelectField name="law" label="Now pick the new law which your party will support. If you want to keep things the way they are, pick the current law." onChange={handleOnChange}>
          {getLaws()}
        </SelectField>
      )
    }
  }

  const nameRender = () => {
    if (nameField) {
      return (<TextField name="name" label="Finally, give your campaign promise a catchy name; something that will stick in your voters' minds." onChange={handleOnChange} />)
    }
  }

  
  return (
    <Formik onSubmit={saveBill} initialValues={{ }}>
      {(props) => (
        <Form noValidate onSubmit={props.handleSubmit}>
          <Form.Group controlId="formBasicName">
            <div className="content">
              <SelectField name="department" label="First,  figure out which department your proposed policy will fall under." onChange={handleOnChange}>
                {getDepartments()}
              </SelectField>
              {ltRender()}
              {lawRender()}
              {nameRender()}
            </div>
            <div className="actions">
              <Button type="submit"> Save </Button>              
            </div>
          </Form.Group>
        </Form>
      )}
    </Formik>
  )  
}

