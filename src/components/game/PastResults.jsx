import React, {useState} from 'react'
import ElectionResults from './ElectionResults'
import { Container, Row, Col } from 'react-bootstrap'
import { useGetEntitiesByFieldQuery } from '../../services/govsim'
import { useParams } from 'react-router-dom';

export default function PastResults(props) {
  const { code } = useParams();
 
  const {data: elections} = useGetEntitiesByFieldQuery({ name: 'election', field: 'country', value: code, relation: 'join_code', populate: true })

  return (
    <Container>
      {elections && elections.data.map((e) => (
        <ElectionResults electionId={e.id}></ElectionResults>
      ))}
    </Container>
  )
}
