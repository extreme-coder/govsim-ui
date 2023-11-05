import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="mb-4 text-center">Welcome to NationBuildr</h1>
          <h2 className="h4 mb-4 text-center">Take the Reins of Power and Lead Your Party to Victory!</h2>

          <p className="mb-4 text-center">
            Embark on a journey through the challenging and thrilling world of parliamentary politics with NationBuildr. Assume the role of a political party leader, campaign for the hearts and minds of the electorate, form strategic coalitions, and pass legislation that will shape the future of your virtual country. Are you ready to navigate the twists and turns of political life and emerge victorious?
          </p>

          <div className="mb-4 d-flex justify-content-center">
            <div className="text-start">
              <ul className="list-unstyled">
                <li className="mb-2"><strong>Campaign</strong>: Craft a platform that resonates with the electorate's diverse demographics and interests.</li>
                <li className="mb-2"><strong>Strategize</strong>: Allocate resources wisely to promote your party's agenda and oppose your rivals.</li>
                <li className="mb-2"><strong>Elections</strong>: Secure seats in a dynamic parliamentary landscape using proportional representation.</li>
                <li className="mb-2"><strong>Coalitions</strong>: Forge alliances to bolster your legislative strength and pass key bills.</li>
                <li className="mb-2"><strong>Parliament</strong>: Debate and vote on crucial bills that will determine your score and political legacy.</li>
              </ul>
            </div>
          </div>

          <div className="mb-4 text-center">
            <Link to="/learn" className="btn btn-primary mx-2">Learn More</Link>
            <Link to="/account/register" className="btn btn-primary mx-2">Signup to Play</Link>
            <Link to="/games" className="btn btn-success mx-2">Start Playing</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
