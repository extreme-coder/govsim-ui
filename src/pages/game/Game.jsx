import React, { useEffect } from 'react';
import { useGetEntitiesByFieldQuery, useGetEntityQuery, useGetPartiesQuery, useGetMessagesQuery } from '../../services/govsim';
import { useParams } from "react-router-dom";
import PlayerInfo from '../../components/game/PlayerInfo';
import useLocalStorage from '../../hooks/useLocalStorage';
import Platform from '../../components/game/Platform';
import PartyLister from '../../components/game/PartyLister';
import CountryInfo from '../../components/game/CountryInfo';
import Demographics from '../../components/game/Demoraphics';
import VotesInSession from '../../components/game/VotesInSession';
import Parliament from '../../components/game/Parliament';
import MessageHandler from '../../components/game/MessageHandler';
import { useDispatch } from 'react-redux';
import { changeGame, changeParty } from '../../redux/actions';

export default function Game() {
  const { code } = useParams();
  const [user, setUser] = useLocalStorage("user", "");
  const { data: country } = useGetEntitiesByFieldQuery({ name: 'country', field: 'join_code', value: code })
  const { data: party } = useGetPartiesQuery({ code, user: user.user.id })
  const dispatch = useDispatch()

  useEffect(() => {
    if (country && country.data) {
      dispatch(changeGame(country.data[0]))
    }
    if (party && party.data[0]) {
      dispatch(changeParty(party.data[0]))
    }
  }, [country, party]);



  return (
    <>

      <div className="container-fluid pt-2">
        <div className="row">
          <div className="col-xl-3 col-lg-3">
            <div className="card shadow-sm">
              <div className="card-body">                
                {party && party.data && party.data[0] && <PlayerInfo name={user.user.username} party={party.data[0]} /> }
                {country && <CountryInfo country={country.data[0]} />}
              </div>
            </div>
          </div>
          <div className="col-xl-5 col-lg-5">
            <div className="card shadow-sm">
              <div className="card-body">
                {country && party && party.data && party.data[0] &&
                  <Platform countryId={country.data[0].id} partyId={party.data[0].id}  electionsOccurred={country.data[0].attributes.elections_occurred} />
                }
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body">
                {country && <Demographics countryId={country.data[0].id} />}
              </div>
            </div>
          </div>

        </div>
        <div className="row">
          <div className="col-xl-3 col-lg-3">
            <div className="card shadow-sm">
              <div className="card-body">
                {country && party && party.data && party.data[0] &&
                  <PartyLister countryId={country.data[0].id} countryCode={code} myParty={party.data[0]} />}
              </div>
            </div>
          </div>
          <div className="col-xl-5 col-lg-5">
            <div className="card shadow-sm">
              <div className="card-body">
                {country && party && party.data && party.data[0] &&
                  <VotesInSession countryId={country.data[0].id} partyId={party.data[0].id} />
                }
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body">
                {country && <Parliament countryId={country.data[0].id} />}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};
