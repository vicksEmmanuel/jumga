import React, {  useEffect } from 'react';

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

//i18n
import { withTranslation } from 'react-i18next';

const SidebarContent = (props) => {
        
    // Use ComponentDidMount and ComponentDidUpdate method symultaniously
     useEffect(() => {

        var pathName = props.location.pathname;

        const initMenu = () => {
            new MetisMenu("#side-menu");
            var matchingMenuItem = null;
            var ul = document.getElementById("side-menu");
            var items = ul.getElementsByTagName("a");
            for (var i = 0; i < items.length; ++i) {
                if (pathName === items[i].pathname) {
                    matchingMenuItem = items[i];
                    break;
                }
            }
            if (matchingMenuItem) {
                activateParentDropdown(matchingMenuItem);
            }
        }
         initMenu();
      }, [props.location.pathname]);

  
    function  activateParentDropdown(item) {
        item.classList.add("active");
        const parent = item.parentElement;

        if (parent) {
            parent.classList.add("mm-active");
            const parent2 = parent.parentElement;

            if (parent2) {
                parent2.classList.add("mm-show");

                const parent3 = parent2.parentElement;

                if (parent3) {
                    parent3.classList.add("mm-active"); // li
                    parent3.childNodes[0].classList.add("mm-active"); //a
                    const parent4 = parent3.parentElement;
                    if (parent4) {
                        parent4.classList.add("mm-active");
                    }
                }
            }
            return false;
        }
        return false;
    };

          return (
           
            <React.Fragment>
                 <div id="sidebar-menu">
                <ul className="metismenu list-unstyled" id="side-menu">
                     <li>
                        <Link to="/home" className="waves-effect">
                            <i className="bx bx-home-circle"></i>
                            <span>{props.t('Home') }</span>
                        </Link>
                     </li>
                     <li>
                         <Link to="/#" className="has-arrow waves-effect">
                            <i className="bx bx-football"></i>
                            <span>{props.t('Football') }</span>
                        </Link>
                        <ul className="sub-menu" aria-expanded="false">
                            <li>
                                <Link to="/football-competitions" className="waves-effect">{props.t('Competitions') }</Link>
                            </li>
                            <li>
                                <Link to="/football-teams" className="waves-effect">{props.t('Teams') }</Link>
                            </li>
                        </ul>
                     </li>                
                </ul>
            </div>
            </React.Fragment>
          );
        }

    export default withRouter(withTranslation()(SidebarContent));


