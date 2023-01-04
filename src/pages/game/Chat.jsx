
import { useGetMessagesQuery, useGetEntitiesByFieldQuery, useGetPartiesQuery, useAddEntityMutation, useUpdateMessagesReadMutation } from '../../services/govsim';
import { useParams, Link } from "react-router-dom";
import useLocalStorage from '../../hooks/useLocalStorage';
import './Chat.css'
import profileImg from './profile.png'
import { useState, useRef, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { changeGame } from '../../redux/actions';
import { useDispatch } from 'react-redux';

const getAvatar = (party) => {
  if(party.id == -1) {
    return (<img src={profileImg} alt="avatar" />)
  }

  if (party.attributes.template.data.attributes.avatar.data) {
    return (<img src={`${process.env.REACT_APP_API_DOMAIN}${party.attributes.template.data.attributes.avatar.data.attributes.url}`} alt="avatar" />)
  } else {
    return (<img src={profileImg} alt="avatar" />)
  }
}

export default function Chat() {
  const { code } = useParams();
  const [selectedParty, setSelectedParty] = useState(null)
  const [user, setUser] = useLocalStorage("user", "");
  const { data: country } = useGetEntitiesByFieldQuery({ name: 'country', field: 'join_code', value: code })
  const { data: party } = useGetPartiesQuery({ code, user: user.user.id })
  const { data: parties } = useGetEntitiesByFieldQuery({ name: 'party', field: 'country', value: code, relation: 'join_code', populate: false })
  

  const [addMessage] = useAddEntityMutation()
  const [updateMessages] = useUpdateMessagesReadMutation()
  const [messageText, setMessageText] = useState('')
  const [countryId, setCountryId] = useState(null)
  const { data: messages } = useGetMessagesQuery(countryId)

  const sendMessage = () => {
    if( selectedParty.id == -1) {
      //group message- loop thru all parties to send the message
      let first = true
      parties.data.forEach(p => {        
        let is_cc = true
        if(p.id != party.data[0].id) {
          if(first) {
            is_cc = false
            first = false
          }
          addMessage({ name: 'message', body: { data: { country: country.data[0].id, body: messageText, to_party: p.id, from_party: party.data[0].id, is_group:true, is_cc: is_cc } } })
        }
      })
    } else {
      addMessage({ name: 'message', body: { data: { country: country.data[0].id, body: messageText, to_party: selectedParty.id, from_party: party.data[0].id } } })
    }    
    setMessageText('')
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage()
    }
  }

  const dispatch = useDispatch()

  useEffect(() => {
    if (country && country.data) {
      dispatch(changeGame(country.data[0]))
      setCountryId(country.data[0].id)
    }
  }, [country]);

  const onPartyChange = (sparty) => {
    setSelectedParty(sparty)
    //update all messages to be read from this party
    updateMessages({ body: { data: { from_party: sparty.id, to_party: party.data[0].id } } })
  }

  return (
    < div className="container pt-4" >
      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card chat-app">
            {country && party && messages && <PartyList messages={messages} countryId={country.data[0].id} onPartyChange={onPartyChange} myParty={party.data[0]} />}
            <div className="chat">
              <div className="chat-header clearfix">
                <div className="row">
                  <div className="col-lg-6">
                    <a href="" data-toggle="modal" data-target="#view_info">
                      {selectedParty && getAvatar(selectedParty)}
                    </a>
                    <div className="chat-about">
                      <h6 className="m-b-0">{selectedParty && selectedParty.attributes.name}</h6>
                      <small>{selectedParty && selectedParty.attributes.template.data.attributes.name}</small>
                    </div>
                  </div>
                  <div className="col-lg-6 hidden-sm text-right">
                    <Link to={`/game/${code}`}><Button className="btn btn-secondary">Close</Button></Link>
                  </div>
                </div>
              </div>
              <div className="chat-history">
                {selectedParty && party && country && messages && <Messages messages={messages} countryId={country.data[0].id} selectedParty={selectedParty} myParty={party.data[0]} />}
              </div>
              <div className="chat-message clearfix">
                <div className="input-group mb-0">
                  <input type="text" className="form-control" value={messageText} placeholder="Enter text here..." onChange={(e) => { setMessageText(e.target.value) }} onKeyDown={handleKeyDown} />
                  <div className="btn btn-outline-secondary" onClick={sendMessage}>
                    <i className="fa fa-send"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export function Messages(props) {
  const { selectedParty, myParty, countryId, messages } = props
  
  const [updateMessages] = useUpdateMessagesReadMutation()

  const getMessageRender = (message) => {
    if (!message.attributes.from_party) return
    if ((message.attributes.from_party.data.id === selectedParty.id && message.attributes.to_party.data.id === myParty.id && !message.attributes.is_group) ||
      (selectedParty.id == -1 && message.attributes.to_party.data.id === myParty.id && message.attributes.is_group) ) {
      return (
        <li className="clearfix" key={message.id}>
          <div className="message-data">
            <span className="message-data-name">{message.attributes.from_party.data.attributes.name}</span> - 
            <span className="message-data-time">{new Date(message.attributes.createdAt).toLocaleTimeString('en-us', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="message my-message">{message.attributes.body}</div>
        </li>
      )
    }
    if ((message.attributes.from_party.data.id === myParty.id && message.attributes.to_party.data.id === selectedParty.id && !message.attributes.is_group) ||
    (selectedParty.id == -1 && message.attributes.from_party.data.id === myParty.id && message.attributes.is_group && !message.attributes.is_cc)) {
      return (
        <li className="clearfix" key={message.id}>
          <div className="message-data text-right">
            <span className="message-data-time">{new Date(message.attributes.createdAt).toLocaleTimeString('en-us', { hour: '2-digit', minute: '2-digit' })}</span>
            {getAvatar(myParty)}
          </div>
          <div className="message other-message float-right">{message.attributes.body}</div>
        </li>
      )
    }
  }

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
    //messages are read after rendering
    updateMessages({ body: { data: { from_party: selectedParty.id, to_party: myParty.id } } })
  }, [messages]);

  return (
    <>
      <ul className="m-b-0">
        {
          (messages && messages.data.map((message) =>
            getMessageRender(message)
          ))
        }
      </ul>
      <div ref={messagesEndRef} />
    </>
  )
}

export function PartyList(props) {
  const { countryId, onPartyChange, myParty, messages } = props
  const [selectedParty, setSelectedParty] = useState(null)
  const { data: parties } = useGetEntitiesByFieldQuery({ name: 'party', field: 'country', value: countryId, relation: 'id', populate: 'populate[0]=template&populate[1]=template.avatar' })

  const allParty = {
    id:-1, 
    attributes:
    {
      name:'All',
      template: {
        data: {
          attributes: {
            name: 'All',
          }
        }
      }
    }
  }

  const getUnReadCount = (partyId) => {
    if(partyId == -1) {
      //get unread message with isgroup true
      return messages && messages.data.filter((m) => m.attributes.from_party.data.id !== myParty.id && m.attributes.is_group && !m.attributes.is_read).length
    } else {
      //get unread message count from the party
      return  messages && messages.data.filter((m) => m.attributes.from_party.data.id === partyId && !m.attributes.is_group  && !m.attributes.is_read).length
    }    
  }

  useEffect(() => {
    if (parties && parties.data && selectedParty == null) {
      const firstParty = parties.data.filter((p) => p.id !== myParty.id)[0]
      setSelectedParty(firstParty)
      onPartyChange(firstParty)
    }
  }, [parties]);

  return (
    <div id="plist" className="people-list">

      <ul className="list-unstyled chat-list mt-2 mb-0">
        {selectedParty && parties && parties.data.map((party) => {
          if (party.id === myParty.id) return
          return (
            <li key={party.id} className={`clearfix ${(party.id === selectedParty.id) ? 'active' : ''}`} onClick={() => { setSelectedParty(party); onPartyChange(party) }}>
              {getAvatar(party)}
              <div className="about">
                <div className="name">{party.attributes.name} ({getUnReadCount(party.id)}) </div>
              </div>
            </li>
          )
        })}

        {selectedParty && <li key={-1} className={`clearfix ${(-1 === selectedParty.id) ? 'active' : ''}`} onClick={() => { setSelectedParty(allParty); onPartyChange(allParty) }}>          
          <div className="about">
            <div className="name">All Parties ({getUnReadCount(-1)})</div>
          </div>
        </li>
      }
        
      </ul>
    </div>
  )
}