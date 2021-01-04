import React, { Component } from "react";

import { withRouter } from "react-router-dom";
import stateWrapper from "../../containers/provider";

// Layout Related Components
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Header from "./Header";

class Layout extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.layoutProps = props.layoutStore;
    this.state = {
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    };
  }

  capitalizeFirstLetter = string => {
    return string.charAt(1).toUpperCase() + string.slice(2);
  };

  componentDidMount() {

    if (this.layoutProps.state.isPreloader === true) {
      document.getElementById('preloader').style.display = "block";
      document.getElementById('status').style.display = "block";

      setTimeout(function () {

        document.getElementById('preloader').style.display = "none";
        document.getElementById('status').style.display = "none";

      }, 2500);
    }
    else {
      document.getElementById('preloader').style.display = "none";
      document.getElementById('status').style.display = "none";
    }

    // Scroll Top to 0
    window.scrollTo(0, 0);
    let currentage = this.capitalizeFirstLetter(this.props.location.pathname);

    document.title =
      currentage + " | Stadium";

      if (this.layoutProps.state.leftSideBarTheme) {
        this.layoutProps._changeSidebarTheme(this.layoutProps.state.leftSideBarTheme);
      }
  
      if (this.layoutProps.state.layoutWidth) {
        this.layoutProps._changeLayoutWidth(this.layoutProps.state.layoutWidth);
      }
  
      if (this.layoutProps.state.leftSideBarType) {
        this.layoutProps._changeSidebarType(this.layoutProps.state.leftSideBarType);
      }
      if (this.layoutProps.state.topbarTheme) {
        this.layoutProps._changeTopbarTheme(this.layoutProps.state.topbarTheme);
      }

      if(this.state.isMobile)
        this.toogleMenuCallback();
      
      window.addEventListener("resize", () => {
        this.setState({
          isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
        });
        this.toogleMenuCallback();
      });
  }


  toogleMenuCallback = () => {
    this.layoutProps._toggleLeftmenu(!this.layoutProps.state.leftMenu);
    if (this.state.isMobile != true) {
      this.layoutProps.changeLeftSidebarType({ payload: { sidebarType: "default", isMobile: this.layoutProps.state.leftMenu}});
      this.layoutProps._changeSidebarType("default", this.layoutProps.state.leftMenu);
    } else {
      this.layoutProps._changeSidebarType("condensed", this.layoutProps.state.leftMenu);
      this.layoutProps.changeLeftSidebarType({ payload: { sidebarType: "condensed", isMobile: this.layoutProps.state.leftMenu}});
      if (document.body) {
        document.body.classList.add('sidebar-enable');
        document.body.classList.add('vertical-collpsed');
      } 
    } 
  }

  render() {
    
    return (
      <React.Fragment>
        <div id="preloader">
          <div id="status">
            <div className="spinner-chase">
              <div className="chase-dot"></div>
              <div className="chase-dot"></div>
              <div className="chase-dot"></div>
              <div className="chase-dot"></div>
              <div className="chase-dot"></div>
              <div className="chase-dot"></div>
            </div>
          </div>
        </div>

        <div id="layout-wrapper">
          <Header/>
          <Sidebar theme={this.layoutProps.state.leftSideBarTheme}
            type={this.layoutProps.state.leftSideBarType}
            isMobile={this.state.isMobile} />
          <div className="main-content">
            {this.props.children}
          </div>
          <Footer />
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(stateWrapper(Layout));
