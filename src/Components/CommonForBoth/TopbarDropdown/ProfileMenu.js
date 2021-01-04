import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import * as _ from 'lodash';
import stateWrapper from "../../../containers/provider";

//i18n
import { withTranslation } from 'react-i18next';
// Redux
import { withRouter, Link } from 'react-router-dom';


// users
import user1 from '../../../assets/images/users/avatar-1.jpg';
import {configParams} from '../../../config';


const ProfileMenu = (props) => {
   // Declare a new state variable, which we'll call "menu"
   const [menu, setMenu] = useState(false);
   const [username, setusername] = useState("Admin");
   const [image, setImage] = useState(user1);

   useEffect(() => {
       let user = props.userStore.getUser();

       if (!_.isEmpty(user)) {
            setusername(user.username);
            if(String(user.imageName).length >0 || user.imageName != null) {
                setImage(`${configParams.appDomain}Images/AdminProfile/${user.imageName}`);
            }
       }
   },[])

   const logOut = (e) => {
        e.preventDefault();
        props.userStore.logOut(props);
   }

  return (
    <React.Fragment>
                <Dropdown isOpen={menu} toggle={() => setMenu(!menu)} className="d-inline-block" >
                    <DropdownToggle className="btn header-item waves-effect" id="page-header-user-dropdown" tag="button">
                        <img className="rounded-circle header-profile-user " src={image} alt="" />
                        <span className="d-none d-xl-inline-block ml-2 mr-1">{username}</span>
                        <i className="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem tag="a"  href="/profile"> <i className="bx bx-user font-size-16 align-middle mr-1"></i>{props.t('Profile')}  </DropdownItem>
                        <DropdownItem tag="a" href="#"><span className="badge badge-success float-right">11</span><i className="mdi mdi-settings font-size-17 align-middle mr-1"></i>{props.t('Settings')}</DropdownItem>
                        <div className="dropdown-divider"></div>
                        <Link to="/logout" onClick={logOut} className="dropdown-item">
                            <i className="bx bx-power-off font-size-16 align-middle mr-1 text-danger"></i>
                            <span>{props.t('Logout')}</span>
                        </Link>
                    </DropdownMenu>
                </Dropdown>
            </React.Fragment>
  );
}

export default withRouter(withTranslation()(stateWrapper(ProfileMenu)));

