import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Container, Row, Col, Badge, Button, Card, CardBody, CardTitle, Modal, ModalHeader, ModalBody, ModalFooter, Media, Table } from "reactstrap";
import { AvForm, AvField, AvGroup, AvInput, AvFeedback, AvRadioGroup, AvRadio, AvCheckboxGroup, AvCheckbox } from 'availity-reactstrap-validation';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { withRouter, Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import stateWrapper from "../../containers/provider";
import instance from '../../helpers/axiosly';
import CONSTANTS from '../../App.constant';
import { configParams } from '../../config';
import "./football.scss";

const Teams = (props) => {
    const [state, setState] = useState({
        imageSrc: null,
        imageFile: null,
        error: 'Enter Valid Team name',
        teams: [],
        teamsCopy: [],
        isSearch: false,
        searchedTeam: ''
    });

    const form = useRef();
    const useImageRef = useRef();
    const callImageInput = () => {
        document.getElementById("imageFile").click();
    }

    const loadUpTeams = async () => {
        if (!(props.footballStore.state.teams.length > 0)) {
            await props.footballStore.getTeams();
        }
        setState({...state, teams: props.footballStore.state.teams});
    }

    useEffect(() => {
        loadUpTeams();
    }, [props.footballStore.state.teams]);

  function  handleValidSubmit(event, values) {
    event.preventDefault();
    let newValues = {
        ...values,
        imageFile: state.imageFile
    }

    if (state.imageSrc == null) {
        alert('Add Team Logo');
        return;
    }

    let formData = new FormData();
    formData.append("name", newValues.teams);
    formData.append("imageFile", newValues.imageFile);
    formData.append("sportId", CONSTANTS.SPORTS.Football);
    instance.post(`admin/controls/create/team/`,formData).then(data => {
        if (data.data.isSuccess) {
            props.footballStore.setTeam(data.data.data)
            return;
        }
    }).catch(e => {
        console.log(e);
    })
  }
  const showPreviewAndSetValue = (e) => {
    if(e.target.files && e.target.files[0]) {
        let imageFile = e.target.files[0];
        console.log(imageFile);
        if (String(imageFile.type).includes("image")) {
            const reader = new FileReader();
            reader.onload = x => {
                setState({
                    ...state,
                    imageFile,
                    imageSrc: x.target.result
                })
            }
            reader.readAsDataURL(imageFile);
        } else {
            setState({
                ...state,
                imageFile: null,
                imageSrc: null
            })
        }
    } else {
        setState({
            ...state,
            imageFile: null,
            imageSrc: null
        })
    }
  }

  const searchForTeam = e => {
      let teamsCopy = state.teams.filter(x => new RegExp(e.target.value).test(x.name));
      setState({...state, teamsCopy, isSearch: true, searchedTeam: e.target.value});
  }

  const cancelSearch = () => {
      setState({...state, teamsCopy: [], isSearch: false, searchedTeam: ''});
  }

  let teams = state.isSearch == true ? state.teamsCopy : state.teams;

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title={props.t('teams')} />
                    <Row>
                        <Col lg={2} sm={4} xs={6}>
                            <Card>
                                <CardBody>
                                    <div align="center" 
                                        style={{height: 150, width: '100%'}}
                                    >
                                        <div 
                                            align="center" 
                                            onClick={callImageInput} 
                                            style={{
                                                backgroundImage: `url(${state.imageSrc != null ? state.imageSrc : null})`,
                                                backgroundSize: 'cover',
                                                backgroundRepeat: 'no-repeat'
                                            }}
                                            className="margin-bottom-20 mini-stat-icon avatar-sm rounded-circle bg-primary align-self-center"
                                        >
                                            <span className="rounded-circle">   
                                                <svg 
                                                                version="1.1" 
                                                                xmlns="http://www.w3.org/2000/svg" 
                                                                x="0px" y="0px"
                                                                viewBox="0 0 512 512" 
                                                                className="avatar-icon"
                                                            >
                                                                <g>
                                                                    <g>
                                                                        <g>
                                                                            <circle cx="256" cy="277.333" r="106.667"/>
                                                                            <path d="M469.333,106.667h-67.656c-8.552,0-16.583-3.333-22.635-9.375l-39-39c-10.073-10.073-23.469-15.625-37.719-15.625
                                                                                h-92.646c-14.25,0-27.646,5.552-37.719,15.625l-39,39c-6.052,6.042-14.083,9.375-22.635,9.375H42.667
                                                                                C19.135,106.667,0,125.802,0,149.333v277.333c0,23.531,19.135,42.667,42.667,42.667h426.667
                                                                                c23.531,0,42.667-19.135,42.667-42.667V149.333C512,125.802,492.865,106.667,469.333,106.667z M256,405.333
                                                                                c-70.583,0-128-57.417-128-128s57.417-128,128-128s128,57.417,128,128S326.583,405.333,256,405.333z M426.667,213.333
                                                                                c-11.76,0-21.333-9.573-21.333-21.333s9.573-21.333,21.333-21.333S448,180.24,448,192S438.427,213.333,426.667,213.333z"/>
                                                                        </g>
                                                                    </g>
                                                                </g>
                                                                <g>
                                                                </g>
                                                                <g>
                                                                </g>
                                                                <g>
                                                                </g>
                                                                <g>
                                                                </g>
                                                                <g>
                                                                </g>
                                                                <g>
                                                                </g>
                                                                <g>
                                                                </g>
                                                                <g>
                                                                </g>
                                                                <g>
                                                                </g>
                                                                <g>
                                                                </g>
                                                                <g>
                                                                </g>
                                                                <g>
                                                                </g>
                                                                <g>
                                                                </g>
                                                                <g>
                                                                </g>
                                                                <g>
                                                                </g>
                                                                </svg>
                                            </span>
                                        </div>
                                        <AvForm 
                                            ref={form} className="form-horizontal" onValidSubmit={(e,v) => { handleValidSubmit(e,v) }}>
                                            <input
                                                ref={useImageRef} 
                                                onChange={showPreviewAndSetValue} 
                                                name="imageFile" 
                                                id="imageFile"
                                                type="file"
                                                accept="image/*"
                                                hidden
                                            />
                                            <AvGroup>
                                                <AvInput
                                                    style={{
                                                        border: 0,
                                                        fontWeight: 'bolder',
                                                        fontSize: 13,
                                                        textAlign: 'center'
                                                    }} 
                                                    name="teams" 
                                                    id="teams" 
                                                    required
                                                    placeholder={"e.g. Barcelona"}
                                                    validate={{
                                                        minLength: { value: 3, errorMessage: state.error}
                                                    }}
                                                />
                                                <AvFeedback><i className="error-field">{state.error}</i></AvFeedback>
                                            </AvGroup>
                                            <div align="right">
                                                <button style={{margin: 0, padding: 0, backgroundColor: 'white', outline: null, border: 0}} type="submit">
                                                    <Badge className={"font-size-12 badge-soft-success"} pill>create</Badge>
                                                </button>
                                            </div>
                                        </AvForm>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg={9} sm={11}>
                            <Card>
                                <CardBody>
                                    <div style={{width: '100%', marginBottom: 10}} align="right">
                                    <AvForm className="form-horizontal" onValidSubmit={(e,v) => { e.preventDefault(); }}>
                                        <AvGroup>
                                            <Media>
                                                <AvInput
                                                    style={{
                                                        border: 0,
                                                        fontWeight: '400',
                                                        fontSize: 13,
                                                        textAlign: 'center'
                                                    }} 
                                                    onChange={searchForTeam}
                                                    name="teams" 
                                                    id="teams"
                                                    value={state.searchedTeam}
                                                    placeholder={"Search for team e.g. Barcelona, Manchester"}
                                                    autoComplete={"off"}
                                                />
                                                <i onClick={cancelSearch} className="bx bx-window-close font-size-20"></i>
                                            </Media>
                                        </AvGroup>
                                    </AvForm>
                                    </div>
                                    {teams.map((team, id) => (
                                        <div  key={id} style={{width: '20%', overflow: 'hidden', display: 'inline-block'}}>
                                            <Link to={`team/${team.name}`}>
                                                <div 
                                                        style={{height: 100, width: '100%'}}
                                                        align="center"
                                                    >
                                                        <div 
                                                            align="center" 
                                                            className="margin-bottom-20 mini-stat-icon avatar-sm align-self-center"
                                                        >
                                                            <span className="rounded-circle">
                                                                <LazyLoadImage
                                                                    alt={team.name}
                                                                    src={team.imageName}
                                                                    width={"89%"}
                                                                    height={"100%"}
                                                                />
                                                            </span>
                                                        </div>
                                                        <div style={{
                                                                border: 0,
                                                                fontWeight: 400,
                                                                fontSize: 12,
                                                                textAlign: 'center',
                                                            }}
                                                        >
                                                            {team.name}
                                                        </div>
                                                    </div>
                                            </Link>
                                        </div>
                                    ))}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default withRouter(withTranslation()(stateWrapper(Teams)))
