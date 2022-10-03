import React from 'react';
import { useGetEntityQuery } from '../services/govsim';
import { useParams } from "react-router-dom";
import PlayerInfo from './game/PlayerInfo'
import useLocalStorage from '../hooks/useLocalStorage';

export default function Game() {
  const { id } = useParams();
  const [user, setUser] = useLocalStorage("user", "");
  const { data, error, isLoading } = useGetEntityQuery({name: 'country', id})  
  
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-xl-10 col-lg-12 col-md-9">
          {data && data.data.attributes.name}
        </div>
      </div>
      <PlayerInfo name={user.user.username}/>
    </div>
  );
};
