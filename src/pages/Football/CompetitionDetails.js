import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import DateTimePicker from 'react-datetime-picker';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Container, Row, Col, Badge, Button, Card, CardBody, TabPane, TabContent, NavItem, NavLink, DropdownToggle, DropdownMenu, DropdownItem, Nav, UncontrolledDropdown, Modal, ModalHeader, ModalBody, ModalFooter, Media, Table } from "reactstrap";
import { AvForm, AvField, AvGroup, AvInput, AvFeedback, AvRadioGroup, AvRadio, AvCheckboxGroup, AvCheckbox } from 'availity-reactstrap-validation';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import svgs from '../../svgs';
import { withRouter, Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import stateWrapper from "../../containers/provider";
import instance from '../../helpers/axiosly';
import CONSTANTS from '../../App.constant';
import Page404 from '../Utility/pages-404';
import { configParams } from '../../config';
import "../../styles/sticky.scss";
import "./football.scss";

import avatar2 from "../../assets/images/users/avatar-2.jpg";
import avatar3 from "../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../assets/images/users/avatar-4.jpg";
import avatar6 from "../../assets/images/users/avatar-6.jpg";

const CompetitionDetails = (props) => {
    const [isSticky, setSticky] = useState(false);
    const ref = useRef(null);
    const form = useRef(null);
    const teamSearch = useRef(null);
    const handleValidSubmit = (event, values) => {
        event.preventDefault();
        let newValues = {
            ...values
        }

        console.log(newValues);
    }

    const handleScroll = () => {
        if (ref.current) {
        setSticky(ref.current.getBoundingClientRect().top <= 0);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
        window.removeEventListener('scroll', () => handleScroll);
        };
    }, []);

    const [state, setState] = useState({
        createdFixtures: [],
        fixtures: [],
        errorPage: false,
        activeTab: '1',
        aggrgegates: 1,
        isAggregate: false,
        dateTime: new Date(),
        fixtureLabel: '',
        teams: [],
        searchedTeams: [],
        team1: null,
        team2: null,
        searchBar: '',
        groups: [
            { id: 1, image: "G", name: "General" },
            { id: 1, image: "R", name: "Reporting" },
            { id: 1, image: "M", name: "Meeting" },
            { id: 1, image: "A", name: "Project A" },
            { id: 1, image: "B", name: "Project B" },
        ],
        contacts: [
            {
                category: "A",
                child: [
                    { id: 1, name: "Adam Miller" },
                    { id: 2, name: "Alfonso Fisher" },
                ]
            },
            {
                category: "B",
                child: [
                    { id: 1, name: "Bonnie Harney" },
                ]
            },
            {
                category: "C",
                child: [
                    { id: 1, name: "Charles Brown" },
                    { id: 2, name: "Carmella Jones" },
                    { id: 3, name: "Carrie Williams" },
                ]
            },
            {
                category: "D",
                child: [
                    { id: 4, name: "Dolores Minter" },
                ]
            },
        ]
    });

    const [competition, setCompetition] = useState({
        name: '',
        season: ''
    });

    const loadCompetition = async() => {
        try {
            let t = await props.footballStore.getCompetitionById(props.match?.params?.id);
            if (t == null) {
                setState({
                    errorPage: true
                })
                return;
            }

            console.log(t);

            setCompetition({...competition, ...t});
            console.log(competition)
        } catch(e) { console.log(e) }
    }
    const loadUpTeams = async () => {
        if (!(props.footballStore.state.teams.length > 0)) {
            await props.footballStore.getTeams();
        }
        setState({...state, teams: props.footballStore.state.teams});
    }

    const addFixtureToList = e => {
        e.preventDefault();

        const fixture = {
            // label: state.fixtureLabel,
            eventTime: state.dateTime.toJSON(),
            competitionId: competition?.id,
            agreegate: false,
            team1: state.team1,
            team2: state.team2,
        }

        // if (state.isAggregate) {
        //     fixture.meetingCount = state.aggrgegates;
        //     fixture.agreegate = true;
        // }

        // if(String(fixture.label).length < 3) {
        //     alert('Add a Fixture Label');
        // }

        if (!(_.isNumber(fixture.team1?.id) && _.isNumber(fixture.team2?.id))) {
            alert('Add teams');
            return;
        }

        let newFixture = state.createdFixtures;
        newFixture.push(fixture);

        setState({...state, createdFixtures: newFixture});

        console.log(state.createdFixtures);

    }

    const displayTeam = (team, id, width = '20%', call = selectTeam) => (
        <div  
            onClick={e => call(team)}
            key={id} style={{width , overflow: 'hidden', display: 'inline-block'}}>
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
        </div>
    );
    
    const teamAgainst = (team, obj = 'team1') => {
        let teamX = {...state};
        teamX[obj] = null;
        return _.isNull(team) ? 
                <Col lg={2} sm={2} xs={2}>
                    <i className='bx bx-football d-none d-sm-block' style={{fontSize: 50}}></i>
                    <i className='bx bx-football d-sm-none' style={{fontSize: 20}}></i>
                </Col>
                : <Col lg={4} sm={4} xs={4}>
                    {displayTeam(team, 0, '100%', () => {setState({...teamX})})}
                </Col>   
    }

    const previewFixtureToCreate = (team) => (
        <Col lg={4} sm={4} xs={4}>
            {displayTeam(team, 0, '100%', () => {})}
        </Col>
    )

    const selectTeam = (team) => {
        if (_.isNull(state.team1) && _.isNull(state.team2)) {
            setState({...state, team1: team, searchBar: '', searchedTeams: []});
            return;
        }

        if (_.isNull(state.team1) && !_.isNull(state.team2)) {
            if (state.team2 == team) return;
            setState({...state, team1: team, searchBar: '', searchedTeams: []});
            return;
        }

        if (_.isNull(state.team2) && !_.isNull(state.team1)) {
            if (state.team1 == team) return;
            setState({...state, team2: team, searchBar: '', searchedTeams: []})
            return;
        }

    }
    const searchForTeam = e => {
        if (String(e.target.value).length == 0) {
            setState({...state, searchedTeams: [], searchBar: ''});
            return;
        }
        let searchedTeams = state.teams.filter(x => new RegExp(String(e.target.value).toLowerCase()).test(String(x.name).toLowerCase()));
        setState({...state, searchedTeams, searchBar: e.target.value});
    }

    const formChildrenELements = () => (
        <Row>
            <Col lg={12} sm={12}>
                <Row>
                    <Col lg={7} sm={6}>
                        <AvGroup>
                            <AvInput
                                className = "league-field"
                                style={{
                                    border: 0,
                                    fontWeight: 'bolder'
                                }}
                                autocomplete = "off"
                                name="stage" 
                                id="stage" 
                                required
                                value={state.fixtureLabel}
                                onChange={e => setState({...state, fixtureLabel: e.target.value})}
                                placeholder={"e.g. Group Stage - Matchday 5 of 6"}
                                validate={{
                                    minLength: { value: 3, errorMessage: state.error}
                                }}
                            />
                            <AvFeedback><i className="error-field">{state.error}</i></AvFeedback>
                        </AvGroup>
                    </Col>
                    <Col lg={2} sm={2}>
                        <button 
                            onClick={e =>{
                                e.preventDefault();
                                setState({...state, isAggregate: !state.isAggregate});
                            }}
                            style={{outline: null, border: 0, backgroundColor: 'inherit'}}>
                            <Badge className={`font-size-12 badge-soft-${state.isAggregate? 'success' :'danger'}`} pill>AGG</Badge>
                        </button>
                    </Col>
                    {state.isAggregate? (
                        <Col lg={2} sm={2}>
                            <div>
                                <UncontrolledDropdown>
                                    <DropdownToggle href="#" className="card-drop" tag="i">
                                        <Row>
                                            <Col lg={2} sm={2} xs={2}>
                                                <i className="bx bx-football font-size-5"></i>
                                            </Col>
                                            <Col lg={6} sm={6} xs={6}>
                                                <Badge style={{fontSize: 8}} className={"badge-soft-success"} pill>
                                                    {aggregates.filter(x => x.value == state.aggrgegates)[0].name}
                                                </Badge>
                                            </Col>
                                        </Row>
                                    </DropdownToggle>
                                    <DropdownMenu left>
                                        <DropdownItem href="#" onClick={e => e.preventDefault()}>
                                            <Row>
                                                {aggregates.map(e => {
                                                    return (
                                                        <Col lg={12} onClick={v => setState({...state, aggrgegates: e.value})}>{e.name}</Col>
                                                    )
                                                })}
                                            </Row>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </div>
                        </Col>
                    ) : null}
                </Row>
                <Card>
                    <CardBody>
                        <div align="right">
                            <DateTimePicker
                                onChange={e => setState({...state, dateTime: e})}
                                value={state.dateTime}
                            />
                        </div>
                        <div style={{margin: 20}}>
                            <Row>
                                {teamAgainst(state.team1, 'team1')}
                                <Col lg={2} sm={2} xs={2}>
                                    <div className="d-none d-sm-block" style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>VS</div>
                                    <div className ="d-sm-none" style={{fontSize: 10, fontWeight: 'bold', textAlign: 'center'}}>-</div>
                                </Col>
                                {teamAgainst(state.team2, 'team2')}
                            </Row>
                        </div>
                        <div>
                            <div>
                                <AvGroup>
                                    <AvInput
                                        className = ""
                                        style={{
                                            border: 0,
                                            fontWeight: 'bolder',
                                            backgroundColor: 'inherit'
                                        }}
                                        onChange={searchForTeam}
                                        value={state.searchBar}
                                        autocomplete = "off"
                                        name="name" 
                                        id="name" 
                                        disabled={!_.isNull(state.team1) && !_.isNull(state.team2)}
                                        placeholder={"e.g. Barcelona"}
                                        ref={teamSearch}
                                    />
                                </AvGroup>
                            </div>
                            <div>
                                {state.searchedTeams.map((team, id) => displayTeam(team, id))}
                            </div>
                        </div>
                        <div align="right">
                            <button 
                                onClick = {addFixtureToList}
                                style={{outline: null, border: 0, backgroundColor: 'inherit'}}>
                                <Badge className="font-size-12 badge-soft-warning" pill>add fixture</Badge>
                            </button>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );

    const bigScreenForm = ({children}) => {
        return (
            <div style={{width: '50%', display: 'inline-block', float: 'left'}} className='d-none d-md-inline-block'>
                {children}
            </div> 
        );
    }
    
    const smallScreenForm = ({children}) => (
        <div style={{width: '100%', display: 'inline-block', float: 'left'}} className='d-md-none'>
            {children}
        </div> 
    );

    useEffect(() => {
        loadUpTeams();
    }, [props.footballStore.state.teams]);

    const [aggregates, setAggregate] = useState([{name: 'First Leg', value: 1}, {name: 'Second Leg', value: 2}])

    useEffect(async() => {
        loadCompetition();
    }, []);

    const toggleTab = (tab, e) =>{
        e.preventDefault();
        if (state.activeTab !== tab) {
            setState({
                ...state,
                activeTab: tab
            });
        }
    }


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    {state.errorPage == false ? (
                        <>
                            <Row>
                                <Col lg={12} sm={12} xs={12}>
                                    <Card 
                                    className="fall"
                                    style={{backgroundColor: competition?.backgroundColor}}>
                                        <CardBody>
                                            <Row style={{marginBottom: 20, color: 'white'}}>
                                                <Col>
                                                    <div onClick={() => props.userStore.goBack(props)}>
                                                        <i className="bx bx-arrow-back font-size-20"></i>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row style={{marginBottom: 20}}>
                                                <Col lg={1}>
                                                    <img src={competition?.imageName} alt={competition.name} width={80} height={110}/>
                                                </Col>
                                                <Col lg={5}>
                                                   <div align="left" style={{color: competition?.color, margin: 20}}>
                                                        <div className="font-size-16 mb-3" style={{fontWeight: 'bolder'}}> {competition.name}</div>
                                                        <div className="font-size-9 mb-3" style={{fontWeight: 'lighter', position: 'relative', top: -10, opacity: 0.8}}>season {competition.season}</div>
                                                   </div>
                                                </Col>
                                            </Row>
                                            <div
                                            className={`sticky-wrapper${isSticky ? ' sticky' : ''}`} ref={ref}
                                            >
                                                <Nav 
                                                className="sticky-inner"
                                                style={{backgroundColor: competition?.backgroundColor}}
                                                pills justified>
                                                    <NavItem>
                                                        <NavLink
                                                            className={classnames({ active: state.activeTab === '1' })}
                                                            onClick={(e) => { toggleTab('1', e); }}
                                                            style={{color: competition?.color}}
                                                        >
                                                            <i className="bx bx-chat font-size-20 d-sm-none"></i>
                                                            <span className="d-none d-sm-block" >FIXTURES</span>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink
                                                            className={classnames({ active: state.activeTab === '2' })}
                                                            onClick={(e) => { toggleTab('2', e); }}
                                                            style={{color: competition?.color}}
                                                        >
                                                            <i className="bx bx-group font-size-20 d-sm-none"></i>
                                                            <span className="d-none d-sm-block">STANDING</span>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink
                                                            className={classnames({ active: state.activeTab === '3' })}
                                                            onClick={(e) => { toggleTab('3', e); }}
                                                            style={{color: competition?.color}}
                                                        >
                                                            <i className="bx bx-book-content font-size-20 d-sm-none"></i>
                                                            <span className="d-none d-sm-block">STATS</span>
                                                        </NavLink>
                                                    </NavItem>
                                                </Nav>
                                            </div>
                                        </CardBody>
                                    </Card>
                                    <div
                                        style={{height: '100%'}}
                                    >
                                        <Card >
                                            <CardBody>
                                                <TabContent
                                                    activeTab={state.activeTab} className="py-4">
                                                    <TabPane 
                                                        tabId="1">
                                                        <Card>
                                                            <CardBody>
                                                                <AvForm 
                                                                    ref={form} className="form-horizontal" onValidSubmit={(e,v) => { handleValidSubmit(e,v) }}
                                                                >
                                                                    {bigScreenForm({children: formChildrenELements()})}
                                                                    {smallScreenForm({children: formChildrenELements()})}
                                                                    {state.createdFixtures.map((item, id) => {
                                                                        let preview = (
                                                                            <Row>
                                                                            <Col lg={12} sm={12}>
                                                                                <Card>
                                                                                    <CardBody>
                                                                                        <div align="right">
                                                                                            <DateTimePicker
                                                                                                // onChange={e => setState({...state, dateTime: e})}
                                                                                                value={item?.eventTime}
                                                                                            />
                                                                                        </div>
                                                                                        <div style={{margin: 20}}>
                                                                                            <Row>
                                                                                                {previewFixtureToCreate(item?.team1)}
                                                                                                <Col lg={2} sm={2} xs={2}>
                                                                                                    <div className="d-none d-sm-block" style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>VS</div>
                                                                                                    <div className ="d-sm-none" style={{fontSize: 10, fontWeight: 'bold', textAlign: 'center'}}>-</div>
                                                                                                </Col>
                                                                                                {previewFixtureToCreate(item?.team2)}
                                                                                            </Row>
                                                                                        </div>
                                                                                    </CardBody>
                                                                                </Card>
                                                                            </Col>
                                                                        </Row>
                                                                        )
                                                                        if (id == 0) {
                                                                            let submitButton = (
                                                                                <button 
                                                                                    type='submit'
                                                                                    style={{outline: null, border: 0, backgroundColor: 'inherit'}}>
                                                                                    <Badge className={`font-size-12 badge-soft-success`} pill>Create</Badge>
                                                                                </button>
                                                                            );
                                                                            let smallScreenSubmitButton = (
                                                                                <div align='left' className='d-md-none'>
                                                                                    {submitButton}
                                                                                </div> 
                                                                            );

                                                                            let bigScreenSubmitButton = (
                                                                                <div align='right' className='d-none d-md-block'>
                                                                                    {submitButton}
                                                                                </div> 
                                                                            );
                                                                            return (
                                                                                <div style={{width: '50%', display: 'inline-block',}}>
                                                                                    {bigScreenSubmitButton}
                                                                                    {smallScreenSubmitButton}
                                                                                    <div style={{width:'100%', marginTop: 25}}>
                                                                                        {preview}
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        }
                                                                        return (
                                                                            <div style={{width: '50%', display: 'inline-block'}}>
                                                                                {preview}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </AvForm>
                                                            </CardBody>
                                                        </Card>
                                                    </TabPane>

                                                    <TabPane tabId="2">
                                                        <h5 className="font-size-14 mb-3">Group</h5>
                                                        <ul className="list-unstyled chat-list">
                                                            <PerfectScrollbar style={{ height: "410px" }}>
                                                                {
                                                                    state.groups.map((group) =>
                                                                        <li key={"test" + group.image}>
                                                                            <Link to="#" onClick={() => {}}>
                                                                                <Media className="align-items-center">
                                                                                    <div className="avatar-xs mr-3">
                                                                                        <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                            {group.image}
                                                                                        </span>
                                                                                    </div>

                                                                                    <Media body>
                                                                                        <h5 className="font-size-14 mb-0">{group.name}</h5>
                                                                                    </Media>
                                                                                </Media>
                                                                            </Link>
                                                                        </li>
                                                                    )
                                                                }
                                                            </PerfectScrollbar>
                                                        </ul>
                                                    </TabPane>

                                                    <TabPane tabId="3">
                                                        <h5 className="font-size-14 mb-3">Contact</h5>

                                                        <div>
                                                            <PerfectScrollbar style={{ height: "410px" }}>
                                                                {
                                                                    state.contacts.map((contact) =>
                                                                        <div key={"test_" + contact.category} className={contact.category === "A" ? "" : "mt-4"}>
                                                                            <div className="avatar-xs mb-3">
                                                                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                    {contact.category}
                                                                                </span>
                                                                            </div>

                                                                            <ul className="list-unstyled chat-list">
                                                                                {
                                                                                    contact.child.map((array) =>
                                                                                        <li key={"test" + array.id}>
                                                                                            <Link to="#" onClick={() => { }}>
                                                                                                <h5 className="font-size-14 mb-0">{array.name}</h5>
                                                                                            </Link>
                                                                                        </li>
                                                                                    )
                                                                                }
                                                                            </ul>
                                                                        </div>
                                                                    )
                                                                }
                                                            </PerfectScrollbar>
                                                        </div>

                                                    </TabPane>
                                                </TabContent>
                                            </CardBody>
                                        </Card>
                                    </div>
                                </Col>
                            </Row>
                        </>
                        ) : 
                        (
                            <Page404 />
                        )
                    }
                </Container>
            </div>
        </React.Fragment>
    )
}

export default withRouter(withTranslation()(stateWrapper(CompetitionDetails)))
