import React, { useState, useEffect } from 'react';
import "./home.scss";
import _ from 'lodash';
import { Container, Row, Col, Button, Card, CardBody, CardTitle, Modal, ModalHeader, ModalBody, ModalFooter, Media, Table } from "reactstrap";
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { withRouter, Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

 const Home = (props) => {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title={props.t('Home')} breadcrumbItem={''} />
                    </Container>
                </div>
            </React.Fragment>
        );
    }

export default withRouter(withTranslation()(Home))
