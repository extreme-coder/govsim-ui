import React from 'react';
import { useGetEntitiesByFieldQuery, useGetEntityQuery, useGetPartiesQuery } from '../services/govsim';
import { useParams } from "react-router-dom";
import PlayerInfo from './game/PlayerInfo';
import useLocalStorage from '../hooks/useLocalStorage';
import Platform from './game/Platform';
import PartyLister from './game/PartyLister';
import CountryInfo from './game/CountryInfo';
import Demographics from './game/Demoraphics';
import VotesInSession from './game/VotesInSession';

export default function Game() {
  const { code } = useParams();
  const [user, setUser] = useLocalStorage("user", "");
  const { data: country } = useGetEntitiesByFieldQuery({ name: 'country', field: 'join_code', value: code })
  const { data: party } = useGetPartiesQuery({ code, user: user.user.id })
  return (
    <div className="album py-5 bg-light">
      <div className="container">

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
          <div className="col">
            <div className="card shadow-sm">
              <div className="card-body">
                {country && country.data[0].attributes.name}
                <PlayerInfo name={user.user.username} />
                {country && <CountryInfo country={country.data[0]} />}
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card shadow-sm">
              <div className="card-body">
                {country && party &&
                  <Platform countryId={country.data[0].id} partyId={party.data[0].id} />
                }
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card shadow-sm">
              <div className="card-body">
                {country && party &&
                  <VotesInSession countryId={country.data[0].id} partyId={party.data[0].id} />
                }
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card shadow-sm">
              <div className="card-body">
                {country && <PartyLister countryId={country.data[0].id} />}
              </div>
            </div>
          </div>

          <div className="col">
            <div className="card shadow-sm">
              <div className="card-body">
                {country && <Demographics countryId={country.data[0].id} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
