import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';
import * as Yup from 'yup';
import TextField from './common/TextField';
import { useGetEntityQuery, useGetEntitiesQuery } from '../services/govsim';

const LoginSchema = Yup.object().shape({
  password: Yup.string()
    .required('Required'),
  identifier: Yup.string()
    .email('Invalid email')
    .required('Required'),
});

export default function Home() {
  const { data, error, isLoading } = useGetEntitiesQuery('country')

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-xl-10 col-lg-12 col-md-9">
          {data && data.map(country =>
              <div key={country.id}>
                {country.name}         
              </div>
          )}
        </div>
      </div>
    </div>
  );

};



