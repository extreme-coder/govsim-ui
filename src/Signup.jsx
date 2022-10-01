import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import TextField from './components/common/TextField';
import * as actions from './actions/auth';


const SignupSchema = Yup.object().shape({
  password: Yup.string()
    .min(5, 'Too Short!')
    .required('Required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
});

class Signup extends React.Component {
  addUser = (values) => {
    values.username = values.email
    this.props.addUser(values)
  }

  render() {
    return (
      <div className="container">

        <div className="row justify-content-center">

          <div className="col-xl-10 col-lg-12 col-md-9">

            <div className="card o-hidden border-0 shadow-lg my-5">
              <div className="card-body p-0">
                <div className="row">
                  <div className="col-lg-6 d-none d-lg-block bg-login-image" />
                  <div className="col-lg-6">
                    <div className="p-5">
                      <div className="text-center">
                        <h1 className="h4 text-gray-900 mb-4">Sign Up</h1>
                      </div>
                      <div>
                        <Formik enableReinitialize validationSchema={SignupSchema} onSubmit={this.addUser} initialValues={{ email: '', password: '' }}>
                          {(props) => (
                            <Form noValidate onSubmit={props.handleSubmit}>
                              <Form.Group controlId="formBasicName">

                                <TextField name="email" label="Email" placeholder="Email" />

                                <TextField name="password" type="password" label="Password" placeholder="Password" />

                                <Button variant="primary" type="submit">
                                  Sign Up
                                </Button>
                              </Form.Group>
                            </Form>
                          )}
                        </Formik>
                      </div>
                      <hr />
                      <div className="text-center">
                        <Link className="small" to="/login">Already have an account? Login!</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    );
  }
}

export default Signup = connect(
  null, actions
)(Signup);
