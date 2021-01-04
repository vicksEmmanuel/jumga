import React, { useState, useRef, useEffect } from 'react';
import _ from 'lodash';
import { withRouter, Link } from 'react-router-dom';
import { Row, Col, CardBody, Card, Alert,Container, Label } from "reactstrap";
import { AvForm, AvField, AvGroup, AvInput, AvFeedback, AvRadioGroup, AvRadio, AvCheckboxGroup, AvCheckbox } from 'availity-reactstrap-validation';
import "../../styles/Login.scss";
import logo from "../../assets/images/stadium logo neon.png";
import team1 from "../../assets/images/team1.png";
import team2 from "../../assets/images/team2.png";
import team3 from "../../assets/images/team3.png";
import team4 from "../../assets/images/team4.png";
import team5 from "../../assets/images/team5.png";
import stadium from "../../assets/images/stadium.png";
import stateWrapper from '../../containers/provider';

 const Login = (props) => {
    const [state, setState] = useState({
        loading: false,
        error: {
            email: 'Email is required',
            password: 'Password is required',
            watch: {
                email: '',
                password: ''
            }
        },
        email: '',
        password: ''
    });

    const form = useRef();
    // handleValidSubmit
  function  handleValidSubmit(event, values) {
    event.preventDefault();
    props.userStore.signIn(values, change, props);
  }

  const change =() => {
    setState({
        ...state,
        error: {
            ...state.error,
            watch: {
                email: "Provide an admin email",
                password: "Provide an admin password"
            }
        }
    });
  }
    return (
        <React.Fragment>            
            <div>
                <Link to="/">
                    <img className="logo" src={logo} alt="logo" />
                </Link>
            </div>
            <div className="account-pages my-5 pt-sm-5">
                <Container>
                    <div>
                        <img className="avatar  team1" src={team1} alt="team1" />
                        <img className="avatar team2" src={team2} alt="team2" />
                        <img className="avatar team3" src={team3} alt="team3" />
                        <img className="avatar team4" src={team4} alt="team4" />
                        <img className="avatar team5" src={team5} alt="team5" />
                    </div>
                    <Row className="justify-content-center overflow-hidden">
                        <Col className="box" style={{padding:0}} lg={9} md={12} sm={12}>
                            <Row>
                                <Col style={{padding: 30}} md={6} lg={4} xl={6} sm={12}>
                                        <Card className="overflow-hidden border-0">
                                            <div>
                                                <Row>
                                                    <Col className="col-12">
                                                        <div className="text-primary text-center text-dark">
                                                            <h5 className="text-primary text-dark">Welcome back !</h5>
                                                            <p>We're so excited to see you again!</p>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <CardBody className="pt-0 border-0">
                                                <div className="p-2">

                                                    <AvForm ref={form} className="form-horizontal" onValidSubmit={(e,v) => { handleValidSubmit(e,v) }}>
                                                        <AvGroup>
                                                            <Label className="form-label" for="email">EMAIL</Label>
                                                            <AvInput 
                                                                onChange={e =>
                                                                    setState({
                                                                    ...state, 
                                                                    email: e.target.value,
                                                                    error: {
                                                                        ...state.error,
                                                                        watch: {
                                                                            ...state.error.watch,
                                                                            email: ''
                                                                        }
                                                                    }
                                                                })} 
                                                                name="email" 
                                                                id="email" 
                                                                required 
                                                                type="email"
                                                            />
                                                            <AvFeedback><i className="error-field">{state.error.email}</i></AvFeedback>
                                                            <i className="error-field">{state.error.watch.email}</i>
                                                        </AvGroup>

                                                        <AvGroup>
                                                            <Label className="form-label" for="password">PASSWORD</Label>
                                                            <AvInput 
                                                                onChange={e => 
                                                                    setState({
                                                                        ...state, 
                                                                        password: e.target.value,
                                                                        error: {
                                                                            ...state.error,
                                                                            watch: {
                                                                                ...state.error.watch,
                                                                                password: ''
                                                                            }
                                                                        }
                                                                    })
                                                                } 
                                                                name="password" 
                                                                id="password" 
                                                                required 
                                                                type="password"
                                                            />
                                                            <AvFeedback><i className="error-field">{state.error.password}</i></AvFeedback>
                                                            <i className="error-field">{state.error.watch.password}</i>
                                                        </AvGroup>

                                                        <div className="mt-4">
                                                            <Link to="/forgot-password" className="text-muted text-primary link"><i className="mdi mdi-lock mr-1"></i> Forgot your password?</Link>
                                                        </div>
                                                        <div className="mt-3">
                                                            <button
                                                                disabled={state.loading} className="btn btn-primary btn-block waves-effect waves-light btn-dark" type="submit">
                                                                Login
                                                            </button>
                                                        </div>
                                                        <div className="mt-4 link-ext">
                                                            Need an account?<Link to="/register" className="text-muted link"><i className="mdi mdi-lock mr-1"></i> Register</Link>
                                                        </div>
                                                    </AvForm>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Col> 
                                <Col md={6} lg={6} xl={6} sm={12}>
                                    <img className="stadium" src={stadium} alt="stadium" />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
     );
    }

export default withRouter(stateWrapper(Login))