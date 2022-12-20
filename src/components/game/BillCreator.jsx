import React, {useState} from 'react'

import { Form, Button } from 'react-bootstrap';
import { Formik } from 'formik'
import TextField from '../common/TextField';
import SelectField from '../common/SelectField';
import { useGetEntitiesQuery, useAddEntityMutation } from '../../services/govsim';


export default function BillCreator (props) {
  const { partyId, closeCallback } = props
  const [ltField, setLtField] = useState(false)
  const [lawField, setLawField] = useState(false)
  const [nameField, setNameField] = useState(false)
  const [deptt, setDeptt] = useState(0)
  const [lawType, setLawType] = useState(0)
  const [saveDisabled, setSaveDisabled] = useState(true)
  
  const { data: departments } = useGetEntitiesQuery({name:'department'})
  const { data: lawTypes } = useGetEntitiesQuery({name:'category', populate: true})
  const { data: laws } = useGetEntitiesQuery({ name: 'law', populate: true })
  const { data: cLaws} = useGetEntitiesQuery({ name: 'country-law', populate: true })
  const [addEntity] = useAddEntityMutation() 

  const saveBill = async (vals) => {  
    vals.party = partyId
    const e = await addEntity({ name: 'promise', body: { data: { ...vals, country_law: cLaws.data.filter((c) => (getLaws(vals['law-type']).map(a=>a.value).indexOf(c.attributes.passed_law.data.id) !== -1))[0].id } }})
    //check if no error 
    if (!e.error) {      
      closeCallback()
    }
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
      return laws.data.filter((law) => (lawType === law.attributes.law_type.data.id)).map((law) => {
        if (cLaws.data.filter((c) => (c.attributes.passed_law.data.id === law.id && c.attributes.country.data.id === props.countryId)).length > 0) {
          return { value: law.id, label: `${law.attributes.name} - Current Law` }
        }
        return { value: law.id, label: law.attributes.name }
      })      
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
        setSaveDisabled(false)
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
      return (<TextField name="name" label="Finally, give your campaign promise a catchy name; something that will stick in your voters' minds." />)
    }
  }

  
  return (
    <Formik onSubmit={saveBill} initialValues={{ name: "", law:"", "law-type":"", department:""}}>
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
              <Button type="submit" disabled={saveDisabled}> Save </Button>              
              <Button onClick={closeCallback}> Cancel </Button>              
            </div>
          </Form.Group>
        </Form>
      )}
    </Formik>
  )  
}

