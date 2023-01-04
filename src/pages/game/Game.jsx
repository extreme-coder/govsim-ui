import React, { useEffect, useState } from 'react';
import { useGetEntitiesByFieldQuery, useGetEntityQuery, useGetPartiesQuery, useGetMessagesQuery, useAddEntityMutation } from '../../services/govsim';
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
import Laws from '../../components/game/Laws';
import { useDispatch } from 'react-redux';
import { changeGame, changeParty } from '../../redux/actions';
import { useSelector } from 'react-redux';
import SweetAlert2 from 'react-sweetalert2';
import spinner from '../../assets/images/spinner.gif';
import Image from 'react-bootstrap/Image';
import { showAlert } from '../../redux/actions';
import Joyride from 'react-joyride';
import Approvals from '../../components/game/Approvals';
import Stories from '../../components/game/Stories';


export default function Game() {  
  const { code } = useParams();
  const [user, setUser] = useLocalStorage("user", "");
  const { data: country } = useGetEntitiesByFieldQuery({ name: 'country', field: 'join_code', value: code })
  const { data: party } = useGetPartiesQuery({ code, user: user.user.id })
  const [addEntity] = useAddEntityMutation()
  const dispatch = useDispatch()
  const [runJoyride, setRunJoyride] = useState(false);
  let joyRide = {}
  if (country && country.data) {
    joyRide = {
      steps: [
        {
          target: '.demographics',
          content: "Welcome to NationBuildr! Let's learn how to play.",     
          placement: 'center',  
        },
        {
          target: '.demographics',
          content: `You are an up-and-coming politician in the country of ${country.data[0].attributes.name}. Over here, you can see your country's population, and what groups they belong to. This info will be important for your campaign!`, 
          disableBeacon: true,  
        },
        {
          target: '.currentLaws',
          content: `Over here, you can see the laws which are active right now in ${country.data[0].attributes.name}.`,        
        },
        {
          target: '.platform',
          content: `Over here, you can see your platform. Your platform is how you attract votes; it's made out of 'promises' to change or keep laws. It's pretty empty right now, but you can add your first promises with the 'Add Bill' button.`,   
        }
      ]
    };
  }


  useEffect(() => {
    if (country && country.data) {
      dispatch(changeGame(country.data[0]))
    }
    if (party && party.data[0]) {
      dispatch(changeParty(party.data[0]))
    }    
    //get from local storage
    if(!localStorage.getItem("joyride1")) {
      setRunJoyride(true);
      localStorage.setItem("joyride1", true);
    }
  }, [country, party]);

  const { message } = useSelector((state) => ({
    message: state.theme.Game.message,
  }));

  return (
    <>
      <Joyride steps={joyRide.steps} 
        continuous={true}
        showProgress={true}
        run={runJoyride}
        scrollToFirstStep={true}
      />
      <SweetAlert2 {...message} 
      onResolve={result => {
        console.log(result);
        if(message.msgBody && message.msgBody.promise) {
          const voteId = message.msgBody.voteId;
          const partyId = party.data[0].id;
          const countryId = message.msgBody.country;
          if(result.isConfirmed) {     
            addEntity({ name: 'ballot', body: { data: { 'vote': voteId, for: true, party: partyId, country: countryId } } })                         
          } else {
            addEntity({ name: 'ballot', body: { data: { 'vote': voteId, for: false, party: partyId, country: countryId } } })                              
          }
        }        

        dispatch(showAlert({
          show:false,               
        }));   
      }}     
      >
        {message.message}
        {message.showSpinner && <div><Image src={spinner}  /></div>}
      </SweetAlert2>
      <div className="container-fluid pt-2">
        <div className="row">
          <div className="col-xxl-12 col-lg-12 col-md-12 py-2">
            <div className="card shadow-sm h-100 ">
              <div className="card-body">                           
                {country && <CountryInfo country={country.data[0]} /> }              
              </div>
            </div>
          </div>

          <div className="col-xxl-12 col-lg-12 col-md-12 py-2">
            <div className="card shadow-sm h-100 ">
              <div className="card-body">                      
                {party && party.data && party.data[0] && country && <PlayerInfo name={user.user.username} party={party.data[0]} country={country.data[0]} /> }              
              </div>
            </div>
          </div>


          {country && country.data[0].attributes.status === 'PARLIAMENT' && <div className="col-xxl-6 col-lg-6 col-md-6 py-2">
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
          </div>}

          {country && (country.data[0].attributes.status === 'PARLIAMENT' || country.data[0].attributes.status === 'COALITIONS' ) && <div className="col-xxl-6 col-lg-6 col-md-6 py-2">
            <div className="card shadow-sm h-100 ">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h4 class="header-title">Parliament</h4>
                </div> 
                {country && <Parliament countryId={country.data[0].id} />}
              </div>
            </div>
          </div>}

          <div className="col-xxl-6 col-lg-6 col-md-6 py-2">
            <div className="card shadow-sm h-100 ">
              <div className="card-body demographics">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h4 class="header-title">Demographics</h4>
                </div>    
                {country && <Demographics countryId={country.data[0].id} />}
              </div>
            </div>
          </div>

          <div className="col-xxl-6 col-lg-6 col-md-6 py-2">
            <div className="card shadow-sm h-100 ">
              <div className="card-body currentLaws">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h4 class="header-title">Current Laws</h4>
                </div>    
                {country && party && party.data && party.data[0] && <Laws country={country.data[0]} partyId={party.data[0].id} />}
              </div>
            </div>
          </div>

          <div className="col-xxl-6 col-lg-6 col-md-6 py-2">
            <div className="card shadow-sm h-100 ">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h4 class="header-title">Parties</h4>
                </div> 
                {country && party && party.data && party.data[0] &&
                  <PartyLister countryId={country.data[0].id} countryCode={code} myParty={party.data[0]} country={country.data[0]} />}
              </div>
            </div>
          </div>


          <div className="col-xxl-6 col-lg-6 col-md-6 py-2">
            <div className="card shadow-sm h-100 ">
              <div className="card-body platform">
                {country && party && party.data && party.data[0] &&
                  <Platform country={country.data[0]} countryId={country.data[0].id} partyId={party.data[0].id}  electionsOccurred={country.data[0].attributes.elections_occurred} />
                }
              </div>
            </div>
          </div>

          <div className="col-xxl-6 col-lg-6 col-md-6 py-2">
            <div className="card shadow-sm h-100 ">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h4 class="header-title">Approval Ratings</h4>
                </div> 
                {country && party && party.data && party.data[0] &&
                  <Approvals countryId={country.data[0].id} partyId={party.data[0].id} />
                }
              </div>
            </div>
          </div>


          <div className="col-xxl-6 col-lg-6 col-md-6 py-2">
            <div className="card shadow-sm h-100 ">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h4 class="header-title">Latest News</h4>
                </div> 
                {country  &&
                  <Stories country={country.data[0]} />
                }
              </div>
            </div>
          </div>


          

       
          
          

        </div>
      </div>
    </>
  );
};
