import { useGetEntitiesQuery, useGetEntitiesByFieldQuery, useAddEntityMutation } from "../../services/govsim";
import { Carousel, Button, Form } from "react-bootstrap";
import { Formik } from 'formik'
import SelectableCardList from "../common/SelectableCardList"
import SelectField from "../common/SelectField";
import TextField from "../common/TextField";
import { useState } from "react";
import { Link } from "react-router-dom";


export default function Laws(props) {
  const { country, partyId } = props
  //get departments 
  const { data: deptt } = useGetEntitiesQuery({ name: 'department' })
  const { data: lawTypes } = useGetEntitiesQuery({ name: 'category', populate: true })
  const { data: cLaws } = useGetEntitiesByFieldQuery({ name: 'country-law', field: 'country', value: country.id, relation: 'id', populate: true })
  //get laws for law type
  const { data: laws } = useGetEntitiesQuery({ name: 'law', populate: true })

  const [showSelector, setShowSelector] = useState(false)
  const [lawType, setLawType] = useState(0)


  const getCountryLawName = (lawType) => {
    const cLaw = cLaws.data.filter((l) => (l.attributes.law_type.data.id === lawType.id))
    if (cLaw.length !== 0) return cLaw[0].attributes.passed_law.data.attributes.name
    return ""
  }
  const getCountryLaw = (lawType) => {
    const cLaw = cLaws.data.filter((l) => (l.attributes.law_type.data.id === lawType))
    if (cLaw.length !== 0) return cLaw[0].id
    return 0
  }

  return (
    <Carousel interval={null} onSlide={(e) => setShowSelector(false)}>
      {deptt && deptt.data.map((d) =>
        <Carousel.Item key={d.id} style={{ height: "270px" }}>
          <h3>{d.attributes.name}</h3>

          {!showSelector && lawTypes && lawTypes.data.filter((lt) => (lt.attributes.department.data.id === d.id)).map((lt) =>
            <div key={lt.id}>
              <h4>{lt.attributes.name}</h4>
              <span>{cLaws && getCountryLawName(lt)}  <Button onClick={(e) => { setShowSelector(true); setLawType(lt.id) }}>Propose Change</Button></span>
            </div>
          )}

          {showSelector && <LawSelector lawType={lawType} laws={laws} partyId={partyId} cLaw={getCountryLaw(lawType)} closeCallback={(e)=> setShowSelector(false)}/>}
        </Carousel.Item>
      )}

    </Carousel>

  );
};


function LawSelector(props) {
  const { laws, lawType, partyId, cLaw, closeCallback } = props
  const [law, setLaw] = useState(0)
  const onLawSelected = (e) => {    
    setLaw(e)
  }
  const [addEntity] = useAddEntityMutation()


  const saveBill = async (vals) => {    
    vals.party = partyId
    vals['law-type'] = lawType
    vals.country_law = cLaw
    console.log(vals)
    const e = await addEntity({ name: 'promise', body: { data: vals}})
    //check if no error 
    if (!e.error) {      
      closeCallback()
    }
  }

  //filter laws by lawtypes
  const fLaws = laws.data.filter((l) => (l.attributes.law_type.data.id === lawType))
  const getLaws = () => {
    return fLaws.map((l) =>  {return { value: l.id, label: l.attributes.name }})
  }

  const handleOnChange = (name, value) => {
    setLaw(value)
  }

  return (
    <Formik onSubmit={saveBill} initialValues={{ name: "", law:""}}>
      {(props) => (
        <Form noValidate onSubmit={props.handleSubmit}>
          <Form.Group controlId="formBasicName">
            <div className="content">
            <SelectField name="law" label="Select New Law" onChange={handleOnChange}>
              {getLaws()}
            </SelectField>

            <TextField style={{zIndex:0}} name="name" label="Bill Name" />
            </div>
            <div className="actions">
              <Button type="submit" > Save </Button>    
              <Button className="m-1" onClick={closeCallback} > Cancel </Button>              
                           
            </div>
          </Form.Group>
        </Form>
      )}
    </Formik>     
  )
}