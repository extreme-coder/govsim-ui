import React from 'react';
import { useGetEntitiesByFieldQuery, useGetEntityQuery, useGetPartiesQuery } from '../services/govsim';
import { useParams } from "react-router-dom";
import PlayerInfo from './game/PlayerInfo';
import useLocalStorage from '../hooks/useLocalStorage';
import Platform from './game/Platform';
import PartyLister from './game/PartyLister';

export default function Game() {
  const { code } = useParams();
  const [user, setUser] = useLocalStorage("user", "");
  const { data: country } = useGetEntitiesByFieldQuery({name: 'country', field: 'join_code', value: code})
  const { data: party } = useGetPartiesQuery({code, user: user.user.id})
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-xl-10 col-lg-12 col-md-9">
          {country && country.data[0].attributes.name}
        </div>
      </div>
      <PlayerInfo name={user.user.username}/>
      {party && 
        <Platform partyId={party.data[0].id} />
      }

      {country && <PartyLister countryId={country.data[0].id} />}
    </div> 
  );
};
