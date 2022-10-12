import { useField, useFormikContext } from 'formik';
import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import Select from 'react-select';

const customStyles = {
  container: (provided) => ({
    ...provided,
    width: '100%'
  })
};


const SelectField = ({ ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);
  let selected = null;
  if (field.value) {
    selected = props.children.filter((obj) => (obj.value === field.value))[0];
  }

  return (
    <Form.Group as={props.as} md={props.md} controlId={props.controlId}>
      <Form.Label>{props.label}</Form.Label>
      <InputGroup>
        {props.inputGroupPrepend}
        <Select
          {...field}
          {...props}
          styles={customStyles}
          options={props.children}
          value={selected}
          onChange={(val) => {
            setFieldValue(field.name, val.value);
            if (props.onChange) props.onChange(field.name, val.value)
          }}
        />
      </InputGroup>
    </Form.Group>
  );
};


SelectField.defaultProps = {
  type: 'select',
  inputGroupPrepend: null
};

export default SelectField;
