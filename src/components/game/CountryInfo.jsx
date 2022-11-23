import React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Countdown from 'react-countdown';
import { showAlert } from '../../redux/actions';

const Completionist = () => <span></span>;

// Renderer callback with condition
const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <Completionist />;
  } else {
    // Render a countdown
    return <span>{hours} hours, {minutes} min, {seconds} secs </span>;
  }
};

export default function CountryInfo(props) {
  const country = props.country;
  const dispatch = useDispatch();

  useEffect(() => {
    //if status is ELECTIONS then show alert
    if (country.attributes.status === 'ELECTIONS') {
      dispatch(showAlert({
        show: true,
        title: 'Elections',
        showSpinner: true,
        message: 'Elections are underway',
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false
      }));
    }
  }, [country])


  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-xl-10 col-lg-12 col-md-9">
          {(country.attributes.status === 'NEW' || country.attributes.status === 'CAMPAIGN') &&
            <h4>Build your platform and campaign, elections will start in <Countdown date={new Date(props.country.attributes.next_election)} renderer={renderer} />
              or when all parties finish campaigning</h4>
          }
          {country.attributes.status === 'PARLIAMENT' &&
            <h4>Parliament is in session, Campaigning for next elections will be in <Countdown date={new Date(props.country.attributes.next_campaign)} renderer={renderer} />
              or when all parties are ready for elections</h4>
          }
        </div>
      </div>
    </div>
  );
};