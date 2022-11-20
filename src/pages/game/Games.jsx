import React from 'react';
import { useGetEntitiesByFieldQuery, useAddEntityMutation } from '../../services/govsim';
import { Link } from 'react-router-dom';
import TextField from '../../components/common/TextField';
import { Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup';

export default function Games() {
  const JoinSchema = Yup.object().shape({
    join_code: Yup.string()
      .required('Required'),
  });

  const { data, error, isLoading } = useGetEntitiesByFieldQuery({ name: 'country', field: 'is_template', value: 'false' })
  const [addEntity, { isLoading: isUpdating }] = useAddEntityMutation()
  const navigate = useNavigate()
  const joinGame = (values) => {
    navigate(`/joingame/${values.join_code}`)
  }
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-xl-10 col-lg-12 col-md-9 tableFixHead">
          <table className="mb-0 table table-sm ">
            <thead>
              <tr><th>Game</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {data && data.data.filter((c) => c.attributes.is_public === true).map(country =>
                <tr key={country.id}>
                  <td>{country.attributes.name}</td>
                  <td><Link to={`/joingame/${country.attributes.join_code}`}><Button>Join Game</Button></Link> </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div>
          Join a Private Game with code :
          <Formik enableReinitialize validationSchema={JoinSchema} onSubmit={joinGame} initialValues={{ join_code: '' }}>
            {(props) => (
              <Form noValidate onSubmit={props.handleSubmit}>
                <Form.Group controlId="formBasicName">
                  <TextField name="join_code" label="Join Code" placeholder="six letter join code" />
                  <Button variant="primary" type="submit">
                    Join Game
                  </Button>
                </Form.Group>
              </Form>
            )}
          </Formik>
        </div>
        <Link to="/newgame" ><Button>Create New Game</Button></Link>
      </div>
    </div>
  );

};