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
import { useSelector } from 'react-redux';
import SweetAlert2 from 'react-sweetalert2';

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

  const { message } = useSelector((state) => ({
    message: state.theme.Game.message,
  }));

  return (
    <>
      <SweetAlert2 {...message} >
        {message.message}
      </SweetAlert2>
      <div className="container-fluid pt-2">
        <div className="row">
          <div className="col-xxl-3 col-lg-6 col-md-6 py-2">
            <div className="card shadow-sm h-100 ">
              <div className="card-body">      
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h4 class="header-title">Party Info</h4>
                </div>          
                {party && party.data && party.data[0] && <PlayerInfo name={user.user.username} party={party.data[0]} /> }              
              </div>
            </div>
          </div>
          <div className="col-xxl-5 col-lg-6 col-md-6 py-2">
            <div className="card shadow-sm h-100 ">
              <div className="card-body">
                {country && party && party.data && party.data[0] &&
                  <Platform countryId={country.data[0].id} partyId={party.data[0].id}  electionsOccurred={country.data[0].attributes.elections_occurred} />
                }
              </div>
            </div>
          </div>
          <div className="col-xxl-4 col-lg-6 col-md-6 py-2">
            <div className="card shadow-sm h-100 ">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h4 class="header-title">Demographics</h4>
                </div>    
                {country && <Demographics countryId={country.data[0].id} />}
              </div>
            </div>
          </div>

       
          <div className="col-xxl-3 col-lg-6 col-md-6 py-2">
            <div className="card shadow-sm h-100 ">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h4 class="header-title">Parties</h4>
                </div> 
                {country && party && party.data && party.data[0] &&
                  <PartyLister countryId={country.data[0].id} countryCode={code} myParty={party.data[0]} />}
              </div>
            </div>
          </div>
          <div className="col-xxl-5 col-lg-6 col-md-6 py-2">
            <div className="card shadow-sm h-100 ">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h4 class="header-title">Votes In Session</h4>
                </div> 
                {country && party && party.data && party.data[0] &&
                  <VotesInSession countryId={country.data[0].id} partyId={party.data[0].id} />
                }
              </div>
            </div>
          </div>
          <div className="col-xxl-4 col-lg-6 col-md-6 py-2">
            <div className="card shadow-sm h-100 ">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h4 class="header-title">Parliament</h4>
                </div> 
                {country && <Parliament countryId={country.data[0].id} />}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};
