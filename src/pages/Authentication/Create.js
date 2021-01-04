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
import instance from '../../helpers/axiosly';
import { configParams } from '../../config';

 const Create = (props) => {
    const [state, setState] = useState({
        loading: false,
        error: {
            email: 'Email is required',
            password: 'Password is required',
            username: 'Username is required',
            watch: {
                email: '',
                password: '',
                username: ''
            }
        },
        email: '',
        password: '',
        username: '',
        imageFile: null,
        imageSrc: null,
        userType: 'Admin'
    });

    const form = useRef();
    const useImageRef = useRef();
    const callImageInput = () => {
        document.getElementById("imageFile").click();
    }
  function  handleValidSubmit(event, values) {
    event.preventDefault();
    let newValues = {
        ...values,
        imageFile: state.imageFile,
        userType: state.userType
    }
    console.log(newValues);
    let formData = new FormData();
    formData.append("username", newValues.username);
    formData.append("email", newValues.email);
    formData.append("password", newValues.password);
    formData.append("userType", newValues.userType);
    formData.append("userFile", newValues.userFile);
    instance.post(`admin/auth/`,formData).then(data => {
        if (!data.data.isSuccess) {
            change(data.data);
            return;
        }

        props.history.push("/login");
    }).catch(e => {
        console.log(e);
       change();
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
  const change =(e) => {
      console.log(e);
    setState({
        ...state,
        error: {
            ...state.error,
            watch: {
                email: e? String(e.message).includes("Email") ? e.message : "" : "",
                password: e? e.errors != null ? (e?.errors.length > 0) ? e?.errors[0] : "" : "" : "",
                username: "",
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
                                                            <h5 className="text-primary text-dark">JOIN US!</h5>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <CardBody className="pt-0 border-0">
                                                <div className="p-2">

                                                    <AvForm ref={form} className="form-horizontal" onValidSubmit={(e,v) => { handleValidSubmit(e,v) }}>
                                                        <center  className="avatar-container">
                                                            <div 
                                                                onClick={callImageInput} 
                                                                className="user-avatar"
                                                                style={{
                                                                    backgroundImage: `url(${state.imageSrc != null ? state.imageSrc : stadium})`,
                                                                    backgroundSize: 'cover',
                                                                    backgroundRepeat: 'no-repeat'
                                                                }}
                                                            >
                                                                <svg 
                                                                    version="1.1" 
                                                                    id="Layer_1" 
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

                                                            </div>
                                                        </center>

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
                                                            <Label className="form-label" for="username">USERNAME</Label>
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
                                                                validate={{
                                                                    minLength: { value: 5, errorMessage: "Username must be more than 5 letters"}
                                                                }}
                                                                name="username" 
                                                                id="username" 
                                                                required
                                                            />
                                                            <AvFeedback>
                                                                <i className="error-field">{state.error.username}</i>
                                                            </AvFeedback>
                                                            <i className="error-field">{state.error.watch.username}</i>
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
                                                                pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$"
                                                                name="password" 
                                                                id="password" 
                                                                required 
                                                                type="password"
                                                            />
                                                            <AvFeedback><i className="error-field">{state.error.password}</i></AvFeedback>
                                                            <i className="error-field">{state.error.watch.password}</i>
                                                        </AvGroup>
                                                            
                                                        <input
                                                            ref={useImageRef} 
                                                            onChange={showPreviewAndSetValue} 
                                                            name="imageFile" 
                                                            id="imageFile"
                                                            type="file"
                                                            accept="image/*"
                                                            hidden
                                                        />

                                                        <div className="mt-3">
                                                            <button
                                                                disabled={state.loading} className="btn btn-primary btn-block waves-effect waves-light btn-dark" type="submit">
                                                                Create Admin
                                                            </button>
                                                        </div>
                                                        <div className="mt-4 link-ext">
                                                            Have an account?<Link to="/login" className="text-muted link"><i className="mdi mdi-lock mr-1"></i> Signin</Link>
                                                        </div>
                                                    </AvForm>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Col> 
                                <Col md={6} lg={6} xl={6} sm={12}>
                                    <img className="stadium stadium-create" src={stadium} alt="stadium" />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
     );
    }

export default withRouter(Create)