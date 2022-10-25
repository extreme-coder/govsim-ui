// @flow
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Button, Alert, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRegisterMutation } from '../../services/govsim';


// components
import { VerticalForm, FormInput } from '../../components/';

import AccountLayout from './AccountLayout';

/* bottom link */
const BottomLink = () => {
  const { t } = useTranslation();

  return (
    <Row className="mt-3">
      <Col className="text-center">
        <p className="text-muted">
          {t('Already have account?')}{' '}
          <Link to={'/account/login'} className="text-muted ms-1">
            <b>{t('Log In')}</b>
          </Link>
        </p>
      </Col>
    </Row>
  );
};

const Register = (): React$Element<React$FragmentType> => {

  const [
    authRegister,
    { isLoading, error }
  ] = useRegisterMutation()

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const navigate = useNavigate();



  /*
   * form validation schema
   */
  const schemaResolver = yupResolver(
    yup.object().shape({
      name: yup.string().required(t('Please enter Fullname')),
      email: yup.string().required('Please enter Email').email('Please enter valid Email'),
      password: yup.string().required(t('Please enter Password')),
    })
  );

  /*
   * handle form submission
   */
  const onSubmit = async (values) => {
    values.username = values.email
    let response = await authRegister(values)
    if (!response.error) {
      localStorage.setItem('user', JSON.stringify(response.data));
      navigate(`/games`)
    }
  };

  return (
    <>      
      <AccountLayout bottomLinks={<BottomLink />}>
        <div className="text-center w-75 m-auto">
          <h4 className="text-dark-50 text-center mt-0 fw-bold">{t('Free Sign Up')}</h4>
          <p className="text-muted mb-4">
            {t("Don't have an account? Create your account, it takes less than a minute.")}
          </p>
        </div>

        {error && (
          <Alert variant="danger" className="my-2">
            {error.data.error.message}
          </Alert>
        )}

        <VerticalForm onSubmit={onSubmit} resolver={schemaResolver} defaultValues={{}}>
          <FormInput
            label={t('Name')}
            type="text"
            name="name"
            placeholder={t('Enter your name')}
            containerClass={'mb-3'}
          />
          <FormInput
            label={t('Email address')}
            type="email"
            name="email"
            placeholder={t('Enter your email')}
            containerClass={'mb-3'}
          />
          <FormInput
            label={t('Password')}
            type="password"
            name="password"
            placeholder={t('Enter your password')}
            containerClass={'mb-3'}
          />
          <FormInput
            label={t('I accept Terms and Conditions')}
            type="checkbox"
            name="checkboxsignup"
            containerClass={'mb-3 text-muted'}
          />

          <div className="mb-3 mb-0 text-center">
            <Button variant="primary" type="submit" disabled={isLoading}>
              {t('Sign Up')}
            </Button>
          </div>
        </VerticalForm>
      </AccountLayout>
    </>
  );
};

export default Register;
