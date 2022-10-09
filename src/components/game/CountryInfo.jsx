import React from 'react';
import Countdown from 'react-countdown';

const Completionist = () => <span>You are good to go!</span>;

export default function CountryInfo(props) {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-xl-10 col-lg-12 col-md-9">
          Country Info
          {props.country.attributes.name}

          <div>
            <Countdown date={new Date(props.country.attributes.next_election)}>
              <Completionist />
            </Countdown>
          </div>
        </div>
      </div>
    </div>
  );
};