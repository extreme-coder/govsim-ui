import { useGetEntitiesQuery, useGetEntitiesByFieldQuery, useAddEntityMutation } from "../../services/govsim";
import { Carousel, Button, Form, Row, Col, Card } from "react-bootstrap";
import { Formik } from 'formik'
import SelectField from "../common/SelectField";
import TextField from "../common/TextField";
import { useState } from "react";
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import { useEffect } from "react";

export default function MinistryLaws(props) {

  const getSteps = (laws, lawType) => {
    let steps = []
    steps.push({
      target: `body`,
      title: lawType.attributes.name,
      content: lawType.attributes.description,
      placement: 'center'
    })
    //loop thru laws and create steps
    laws.data.forEach((law, index) => {
      if (law.attributes.law_type.data.id === lawType.id) {
        steps.push({
          target: `body`,
          title: law.attributes.name,
          content: law.attributes.description,
          placement: 'center'
        })
      }
    })
    return steps
  };

  const { country, partyId, deptt } = props
  //get departments   
  const { data: lawTypes } = useGetEntitiesQuery({ name: 'category', populate: true })
  const { data: cLaws } = useGetEntitiesByFieldQuery({ name: 'country-law', field: 'country', value: country.id, relation: 'id', populate: true })
  //get laws for law type
  const { data: laws } = useGetEntitiesQuery({ name: 'law', populate: true })

  const [showSelector, setShowSelector] = useState(false)
  const [lawType, setLawType] = useState(0)
  const [showTips, setShowTips] = useState({})
  const [joyRideReady, setJoyRideReady] = useState(false)


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

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status) || data.action == 'close') {
      setShowTips(lawTypes.data.reduce((acc, lt) => ({ ...acc, [lt.id]: false }), {}))
    }
  };

  useEffect(() => {
    lawTypes && setShowTips(lawTypes.data.reduce((acc, lt) => ({ ...acc, [lt.id]: false }), {}))
    lawTypes && setJoyRideReady(true)
  }, [lawTypes])


  useEffect(() => {
    setShowSelector(false)
  }, [deptt])

  const showLawTypeTips = (e, lt) => {
    e.preventDefault()    
    setShowTips({ ...showTips, [lt.id]: true })
    return false
  }

  const clickOnCard = (e, lt) => {
    if(e.defaultPrevented) return
    setShowSelector(true)
    setLawType(lt.id)
  }


  return (
    <div>
      <h3 className="tt">{deptt.attributes.name}</h3>
      <h4>Select a Law to Change</h4>
      <Row>
      {!showSelector && lawTypes && lawTypes.data.filter((lt) => (lt.attributes.department.data.id === deptt.id)).map((lt) =>      
        <Col key={lt.id}>
          <Card className="playing_card" onClick={(e) => { return clickOnCard(e, lt) }}>
          <div className="row">           
              <h4>
                {lt.attributes.name}
              </h4>                       
          </div>

          {joyRideReady && laws && <Joyride steps={getSteps(laws, lt)} run={showTips[lt.id]}
            showProgress
            continuous
            callback={handleJoyrideCallback}
          />}
          <Row>
            <h5>Current Law: </h5>
          </Row>          
          <Row>
            <h5>{cLaws && getCountryLawName(lt)} </h5>
          </Row>
            <div style={{fontSize:'2em'}}>
                <i style={{cursor:'pointer'}} className="uil-question-circle" onClick={(e) => {showLawTypeTips(e, lt) }} />
            </div>
          </Card>
        </Col>
      )}
      </Row>

      {showSelector && <LawSelector lawType={lawType} laws={laws} partyId={partyId} cLaw={getCountryLaw(lawType)} closeCallback={(e) => setShowSelector(false)} />}             

    </div>

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
    const e = await addEntity({ name: 'promise', body: { data: vals } })
    //check if no error 
    if (!e.error) {
      closeCallback()
    }
  }

  //filter laws by lawtypes
  const fLaws = laws.data.filter((l) => (l.attributes.law_type.data.id === lawType))
  const getLaws = () => {
    return fLaws.map((l) => { return { value: l.id, label: l.attributes.name } })
  }

  const handleOnChange = (name, value) => {
    setLaw(value)
  }

  return (
    <Formik onSubmit={saveBill} initialValues={{ name: "", law: "" }}>
      {(props) => (
        <Form noValidate onSubmit={props.handleSubmit}>
          <Form.Group controlId="formBasicName">
            <div className="content">
              <SelectField name="law" label="Select New Law" onChange={handleOnChange}>
                {getLaws()}
              </SelectField>

              <TextField style={{ zIndex: 0 }} name="name" label="Bill Name" />
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