import { useField, useFormikContext } from 'formik';
import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateField = ({ ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);
  return (
    <Form.Group as={props.as} md={props.md} controlId={props.controlId}>
      <Form.Label>{props.label}</Form.Label>
      <InputGroup>
        {props.inputGroupPrepend}
        <DatePicker
          {...field}
          {...props}
          selected={(field.value && new Date(field.value)) || null}
          onChange={(val) => {
            setFieldValue(field.name, val);
          }}
        />
      </InputGroup>
    </Form.Group>
  );
};


export default DateField;