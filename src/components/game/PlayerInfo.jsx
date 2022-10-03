import React from 'react';

export default function PlayerInfo(props) {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-xl-10 col-lg-12 col-md-9">
          Player Info
          {props.name}
        </div>
      </div>
    </div>
  );
};