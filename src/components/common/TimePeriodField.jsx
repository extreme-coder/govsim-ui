import { useField, useFormikContext } from 'formik';
import React, {useState} from 'react';
import { Form, InputGroup } from 'react-bootstrap';


export const TimePeriodField = ({ ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);
  const [hours, setHours] = useState(2)
  const [min, setMin] = useState(0)

  const updateHours = (val) => {    
    let h = parseInt(val.currentTarget.value)
    if (isNaN(h)) h = 0    
    setHours(h)
    setFieldValue(field.name, h*60 + min)
    
    
  }
  const updateMins = (val) => {
    let m = parseInt(val.currentTarget.value)
    if (isNaN(m)) m = 0
    setMin(m)
    setFieldValue(field.name, hours*60 + m)
    
  }

  return (
    <Form.Group as={props.as} md={props.md} controlId={props.controlId}>
      <Form.Label>{props.label}</Form.Label>
      <InputGroup>
        {props.inputGroupPrepend}
        <Form.Control type="text" name={`${field.name}_hrs`} value={hours} onChange={(val)=>{updateHours(val)}} />
        <Form.Control type="text" name={`${field.name}_min`} value={min} onChange={(val)=>{updateMins(val)}} />
      </InputGroup>
    </Form.Group>
  );
};

