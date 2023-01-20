import React from 'react';
import { Binoculars, PencilSquare, PersonAdd } from 'react-bootstrap-icons';


const HomeHeader = ({title}) => {


  return (
    <div>
     <section className="home-header-title">
     <div className='workspace-title-section'><span className='workspace-icon'><Binoculars/></span><span className='workspace-title'><h3>{title}</h3></span></div>
      <button className="btn btn-info"><PersonAdd/>Invite Workspace Member</button>
     </section>
     <hr className="header-hr"></hr>
    </div>
  );
}

export default HomeHeader;
