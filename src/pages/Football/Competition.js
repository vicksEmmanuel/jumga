import React, { Component } from 'react';
import _ from 'lodash';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback, AvRadioGroup, AvRadio, AvCheckboxGroup, AvCheckbox } from 'availity-reactstrap-validation';
import { Container, Row, Col, Badge, Button, Card, CardBody, CardTitle, Modal, ModalHeader, ModalBody, ModalFooter, Media, Table, UncontrolledTooltip, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { withRouter, Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import stateWrapper from "../../containers/provider";
import svgs from '../../svgs';
import instance from '../../helpers/axiosly';
import "./football.scss";
import CONSTANTS from '../../App.constant';

class Competition extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bgColor: '#162E58',
            color: 'white',
            error: 'Invalid',
            imageSrc: null,
            imageFile: null,
            competition: props.footballStore.state.footBallCompetitions
        }
        console.log(props);
        this.defaultBackground = ['#162E58', '#cc0033', '#00519e', '#000000', '#007541'];
        this.showPreviewAndSetValue = this.showPreviewAndSetValue.bind(this);
    }

    async t() {
        if (!(this.props.footballStore.state.footBallCompetitions.length > 0)) {
            await this.props.footballStore.getCompetition();
            this.setState({
                competition: this.props.footballStore.state.footBallCompetitions
            });
        }
    }
    async componentDidMount() {
        await this.t();
    }

    showPreviewAndSetValue(e) {
        const self = this;
        if(e.target.files && e.target.files[0]) {
            let imageFile = e.target.files[0];
            console.log(imageFile);
            if (String(imageFile.type).includes("image")) {
                const reader = new FileReader();
                reader.onload = x => {
                    self.setState({
                        imageFile,
                        imageSrc: x.target.result
                    });
                }
                reader.readAsDataURL(imageFile);
            } else {
                self.setState({
                    imageFile: null,
                    imageSrc: null
                })
            }
        } else {
            self.setState({
                imageFile: null,
                imageSrc: null
            })
        }
    }

    openFileToSelectImage () {
        document.getElementById("imageFile").click();
    }

    handleValidSubmit(event, values) {
        event.preventDefault();
        let newValues = {
            ...values,
            imageFile: this.state.imageFile,
            color: this.state.color,
            backgroundColor: this.state.bgColor,
            current: false,
        }

        if (this.state.imageSrc == null) {
            alert('Add Competition Image');
            return;
        }

        console.log(newValues);

        let formData = new FormData();
        formData.append("name", newValues.name);
        formData.append("season", newValues.season);
        formData.append("imageFile", newValues.imageFile);
        formData.append("color", newValues?.color);
        formData.append("backgroundColor", newValues?.backgroundColor);
        formData.append("current", newValues?.current);
        formData.append("sportId", CONSTANTS.SPORTS.Football);
        instance.post(`admin/controls/create/competition/`,formData).then(data => {
            if (data.data.isSuccess) {
                this.props.footballStore.addCompetition(data.data.data);
                return;
            }
        }).catch(e => {
            console.log(e);
        })
    }

    changeTheme(e, values) {
        e.preventDefault();
        this.setState({bgColor : values});
    }

    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title={this.props.t('competitions')} />
                        <Row>
                            <Col lg={12} sm={12} xs={12}>
                                <Card style={{backgroundColor: this.state.bgColor}}>
                                    <CardBody>
                                        <AvForm 
                                            ref={e => this.form = e} className="form-horizontal" onValidSubmit={(e,v) => { this.handleValidSubmit(e,v) }}>
                                            <div>
                                                <UncontrolledDropdown>
                                                    <DropdownToggle href="#" className="card-drop" tag="i">
                                                        {
                                                           svgs.threeStars({fill: 'orange', width: 20, height: 20})
                                                        }
                                                    </DropdownToggle>
                                                    <DropdownMenu left>
                                                        <DropdownItem href="#" onClick={e => e.preventDefault()}>
                                                            <Row>
                                                                {this.defaultBackground.map(e => {
                                                                    return (
                                                                        <Col lg={2} sm={2}>
                                                                            <div onClick={v => this.changeTheme(v, e)} style={{width: 20, height: 20, borderRadius: '50%', backgroundColor: e}}></div>
                                                                        </Col>
                                                                    )
                                                                })}
                                                            </Row>
                                                        </DropdownItem>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </div>
                                            <Row>
                                                <Col lg={3} align="center">
                                                    <input
                                                        ref={e => this.useImageRef = e} 
                                                        onChange={this.showPreviewAndSetValue} 
                                                        name="imageFile" 
                                                        id="imageFile"
                                                        type="file"
                                                        accept="image/*"
                                                        hidden
                                                    />
                                                    <div 
                                                        onClick={this.openFileToSelectImage}
                                                        align="center"
                                                    >
                                                        {
                                                            this.state.imageSrc != null ? (
                                                                <div>
                                                                    <img src={this.state.imageSrc} width={70} height = {70} />
                                                                </div>
                                                            ) : (
                                                                <span>
                                                                    <i className="bx bx-football font-size-20" style={{color: this.state.color}}/>
                                                                </span>
                                                            )
                                                        }
                                                    </div>
                                                </Col>
                                                <Col lg={5}>
                                                    <AvGroup>
                                                        <AvInput
                                                            className = "league-field"
                                                            style={{
                                                                color: this.state.color,
                                                                backgroundColor: this.state.bgColor,
                                                                border: 0,
                                                                borderBottomWidth: '1px',
                                                                borderBottomColor: this.state.color
                                                            }}
                                                            autocomplete = "off"
                                                            name="name" 
                                                            id="name" 
                                                            required
                                                            placeholder={"e.g. Champions League"}
                                                            validate={{
                                                                minLength: { value: 5, errorMessage: this.state.error}
                                                            }}
                                                        />
                                                        <AvFeedback><i className="error-field">{this.state.error}</i></AvFeedback>
                                                    </AvGroup>
                                                </Col>
                                                <Col lg={4}>
                                                    <AvGroup>
                                                        <AvInput
                                                            className = "league-field"
                                                            style={{
                                                                color: this.state.color,
                                                                backgroundColor: this.state.bgColor,
                                                                border: 0
                                                            }}
                                                            autocomplete = "off"
                                                            name="season" 
                                                            id="season" 
                                                            required
                                                            placeholder={"e.g. 2020/2021"}
                                                            validate={{
                                                                minLength: { value: 5, errorMessage: this.state.error}
                                                            }}
                                                        />
                                                        <AvFeedback><i className="error-field">{this.state.error}</i></AvFeedback>
                                                    </AvGroup>
                                                </Col>
                                            </Row>
                                            <div align="right">
                                                <button style={{margin: 0, padding: 0, backgroundColor: this.state.bgColor, outline: null, border: 0}} type="submit">
                                                    <Badge className={"font-size-12 badge-soft-success"} pill>create</Badge>
                                                </button>
                                            </div>
                                        </AvForm>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        {
                            //TODO: Add searchable
                        }
                        <div>
                            {this.state.competition.map((competition, id) => (
                                <div  key={id} style={{width: '18%', overflow: 'hidden', display: 'inline-block', marginLeft: 10}}>
                                    <Link to={`/football-competitions/${competition.id}`}>
                                        <div 
                                                style={{height: 130, width: '100%',}}
                                                align="center"
                                            >
                                                <div 
                                                    align="center" 
                                                    className="margin-bottom-20 mini-stat-icon avatar-sm align-self-center"
                                                >
                                                    <span>
                                                        <LazyLoadImage
                                                            alt={competition.name}
                                                            src={competition.imageName}
                                                            width={"100%"}
                                                            height={"120%"}
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
                                                    {competition.name}
                                                </div>
                                                <div style={{
                                                        border: 0,
                                                        fontWeight: 200,
                                                        fontSize: 10,
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {competition.season}
                                                </div>
                                            </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </Container>
                </div>
            </React.Fragment>
        )
    }
}

export default withTranslation()(stateWrapper(Competition))
