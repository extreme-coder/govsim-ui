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
import TurnAction from '../../components/game/TurnAction';
import PartyCards from '../../components/game/PartyCards';


export default function Game() {  
  const { code } = useParams();
  const [user, setUser] = useLocalStorage("user", "");
  const { data: country } = useGetEntitiesByFieldQuery({ name: 'country', field: 'join_code', value: code })
  const { data: party } = useGetPartiesQuery({ code, user: user.user.id })
  const [addEntity] = useAddEntityMutation()
  const dispatch = useDispatch()
  const [runJoyride, setRunJoyride] = useState(false);
  const [runCoalitionJoyride, setRunCoalitionJoyride] = useState(false);
  const [runParliamentJoyride, setRunParliamentJoyride] = useState(false);

  let joyRide = {}
  if (country && country.data) {
    joyRide = {
      steps: [
        {
          target: 'body',
          content: "Welcome to NationBuildr! Let's learn how to play.",     
          placement: 'center',  
        },
        {
          target: '.demographics',
          content: `You are an up-and-coming politician in the country of ${country.data[0].attributes.name}. Over here, you can see your country's population, and what groups they belong to. This info will be important for your campaign!`, 
          disableBeacon: true,  
          placement: 'bottom'
        },
        {
          target: '.currentLaws',
          content: `Over here, you can see the laws which are active right now in ${country.data[0].attributes.name}.`,        
        },
        {
          target: '.carousel-control-next-icon',
          content: 'Click here to see the laws of next Ministry.',          
        },
        {
          target: '.uil-question-circle',
          content: 'Click here to learn more about the law and different options and its effect on the country.',          
          
        },
        {
          target: '.billsTable',
          content: `Over here, you can see your platform. Your platform is how you attract votes; it's made out of 'promises' to change or keep laws. It's pretty empty right now, but you can add your first promises with the 'Add Bill' button.`,   
        }
      ],
      
      coalitionSteps: [
        {
          target: '.parliament',
          content: `Over here, you can see the parliament of ${country.data[0].attributes.name}.`,          
          disableBeacon: true,  
        },
        {
          target: '.partyList',
          content: 'To make coalition, select other parties from the list and click on the "Create Coalition" button.',         
        },
        {
          target: '.open_chat',
          content: 'You can chat with other parties or have a group chat with your coalition members.',
        }
      ],

      parliamentSteps: [
        {
          target: '.billsTable',
          content: 'You can call your bills for a vote here. If your bill is voted into law, you will get 400 points while everyboy who voted for it will get 100 points.',
        }
      ]

    };
  }


  useEffect(() => {
    if (country && country.data) {
      dispatch(changeGame(country.data[0]))
      if(country.data[0].attributes.status === 'COALITIONS' && !localStorage.getItem("coalitionJoyride")) {
        setRunCoalitionJoyride(true);
        localStorage.setItem("coalitionJoyride", true);
      }
      if(country.data[0].attributes.status === 'PARLIAMENT' && !localStorage.getItem("parliamentJoyride")) {
        setRunParliamentJoyride(true);
        localStorage.setItem("parliamentJoyride", true);
      }
      
    }
    if (party && party.data[0]) {
      dispatch(changeParty(party.data[0]))
    }    
    //get from local storage
    if(!localStorage.getItem("joyride2")) {
      setRunJoyride(true);
      localStorage.setItem("joyride2", true);
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
        scrollOffset={150}
      />
      <Joyride steps={joyRide.coalitionSteps} 
        continuous={true}
        showProgress={true}
        run={runCoalitionJoyride}
        scrollToFirstStep={true}
        scrollOffset={150}
      />
      <Joyride steps={joyRide.parliamentSteps} 
        continuous={true}
        showProgress={true}
        run={runParliamentJoyride}
        scrollToFirstStep={true}
        scrollOffset={150}
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
          
          {country && country.data[0].attributes.status === 'COALITIONS' &&  <div className="col-xxl-12 col-lg-12 col-md-12 py-2">
            <div className="card shadow-sm h-100 ">
              <div className="card-body">                           
                {country && <CountryInfo country={country.data[0]} /> }              
              </div>
            </div>
          </div>}

          <div className="col-xxl-12 col-lg-12 col-md-12 py-2">
            <div className="card shadow-sm h-100 ">
              <div className="card-body">                      
                {party && party.data && party.data[0] && country && <PlayerInfo name={user.user.username} party={party.data[0]} country={country.data[0]} /> }              
              </div>
            </div>
          </div>

          {country && (country.data[0].attributes.status === 'PARLIAMENT' || country.data[0].attributes.status === 'CAMPAIGN' ) && <div className="col-xxl-12 col-lg-12 col-md-12 py-2">
            <div className="card shadow-sm h-100 ">
              <div className="card-body">                      
                {party && party.data && party.data[0] && country && <PartyCards party={party.data[0]} country={country.data[0]} /> }              
              </div>
            </div>
          </div>}

          {country && (country.data[0].attributes.status === 'PARLIAMENT' || country.data[0].attributes.status === 'CAMPAIGN' ) && <div className="col-xxl-12 col-lg-12 col-md-12 py-2">
            <div className="card shadow-sm h-100 ">
              <div className="card-body">          
                {party && party.data && party.data[0] && <TurnAction country={country.data[0]} party={party.data[0]} />}                
              </div>
            </div>
          </div>}

          


          {country && country.data[0].attributes.status === 'PARLIAMENT' && <div className="col-xxl-6 col-lg-6 col-md-6 py-2">
            <div className="card shadow-sm h-100 ">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h4 className="header-title">Votes In Session</h4>
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
                  <h4 className="header-title parliament">Parliament</h4>
                </div> 
                {country && <Parliament countryId={country.data[0].id} />}
              </div>
            </div>
          </div>}

          {country && (country.data[0].attributes.status === 'PARLIAMENT' || country.data[0].attributes.status === 'COALITIONS' ) && <div className="col-xxl-6 col-lg-6 col-md-6 py-2">
            <div className="card shadow-sm h-100 ">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h4 className="header-title">Parties</h4>
                </div> 
                {country && party && party.data && party.data[0] &&
                  <PartyLister countryId={country.data[0].id} countryCode={code} myParty={party.data[0]} country={country.data[0]} />}
              </div>
            </div>
          </div>}

          <div className="col-xxl-6 col-lg-6 col-md-6 py-2">
            <div className="card shadow-sm h-100 ">
              <div className="card-body ">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h4 className="header-title demographics">Demographics</h4>
                </div>    
                {country && <Demographics countryId={country.data[0].id} />}
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
                  <h4 className="header-title">Approval Ratings</h4>
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
                  <h4 className="header-title">Latest News</h4>
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
