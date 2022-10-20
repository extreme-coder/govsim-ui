
import { useGetMessagesQuery, useGetEntitiesByFieldQuery, useGetPartiesQuery, useAddEntityMutation } from '../services/govsim';
import { useParams } from "react-router-dom";
import useLocalStorage from '../hooks/useLocalStorage';
import './Chat.css'
import profileImg from './profile.png'
import { useState, useRef, useEffect } from 'react';


const getAvatar = (party) => {
  if (party.attributes.template.data.attributes.avatar.data) {
    return (<img src={`http://localhost:1337${party.attributes.template.data.attributes.avatar.data.attributes.url}`} alt="avatar" />)
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

  const [addMessage] = useAddEntityMutation()
  const [messageText, setMessageText] = useState('')

  const sendMessage = () => {
    addMessage({ name: 'message', body: { data: { country: country.data[0].id, body: messageText, to_party: selectedParty.id, from_party: party.data[0].id } } })
    setMessageText('')
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    < div className="container" >
      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card chat-app">
            {country && <PartyList countryId={country.data[0].id} onPartyChange={(party) => { setSelectedParty(party) }} myParty={party.data[0]} />}
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

                  </div>
                </div>
              </div>
              <div className="chat-history">
                {selectedParty && party && country && <Messages countryId={country.data[0].id} selectedParty={selectedParty} myParty={party.data[0]} />}
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
  const { selectedParty, myParty, countryId } = props
  const { data: messages } = useGetMessagesQuery(countryId)

  const getMessageRender = (message) => {
    if (!message.attributes.from_party) return
    if (message.attributes.from_party.data.id === selectedParty.id && message.attributes.to_party.data.id === myParty.id) {
      return (
        <li className="clearfix" key={message.id}>
          <div className="message-data">
            <span className="message-data-time">10:12 AM, Today</span>
          </div>
          <div className="message my-message">{message.attributes.body}</div>
        </li>
      )
    }
    if (message.attributes.from_party.data.id === myParty.id && message.attributes.to_party.data.id === selectedParty.id) {
      return (
        <li className="clearfix">
          <div className="message-data text-right">
            <span className="message-data-time">10:10 AM, Today</span>
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
  const { countryId, onPartyChange, myParty } = props
  const [selectedParty, setSelectedParty] = useState(null)
  const { data: parties } = useGetEntitiesByFieldQuery({ name: 'party', field: 'country', value: countryId, relation: 'id', populate: 'populate[0]=template&populate[1]=template.avatar' })


  if (parties && parties.data && selectedParty == null) {
    setSelectedParty(parties.data[0])
    onPartyChange(parties.data[0])
  }

  return (
    <div id="plist" className="people-list">

      <ul className="list-unstyled chat-list mt-2 mb-0">
        {selectedParty && parties && parties.data.map((party) => {
          if(party.id === myParty.id) return
          return (
            <li key={party.id} className={`clearfix ${(party.id === selectedParty.id) ? 'active' : ''}`} onClick={() => { setSelectedParty(party); onPartyChange(party) }}>
              {getAvatar(party)}
              <div className="about">
                <div className="name">{party.attributes.name}</div>
              </div>
            </li>
          )
        }
        )}
      </ul>
    </div>
  )
}