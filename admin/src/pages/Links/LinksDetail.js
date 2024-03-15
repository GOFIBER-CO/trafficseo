import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  CardSubtitle,
  Col,
  Container,
  Row,
} from "reactstrap";
import { Button } from "antd";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import { getFaqById } from '../../store/faqs/actions';

const LinksDetail = () => {

  const { id } = useParams();
  const dispatch = useDispatch();
  const singleFaq = useSelector(state => state.Faqs.singleFaq);

  useEffect(() => {
    dispatch(getFaqById(id));
  }, []);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Question Detail" pageTitle="FAQs" slug='faqs' />
          <Row>
            <Col lg={12}>
              <div className="mb-3">
                <Link to="/faqs">
                  <div className="d-flex align-items-center">
                    <i className="ri-arrow-left-line"></i>
                    <div style={{ "marginLeft": '6px' }}>Back</div>
                  </div>
                </Link>
              </div>
              <Card outline className="border">
                <CardBody>
                  <CardTitle tag="h5">{singleFaq.faq_question}</CardTitle>
                  <CardSubtitle className="mb-2 text-muted" tag="h6">
                    {singleFaq.createdAt}
                  </CardSubtitle>
                  <CardText>
                    {singleFaq.faq_answer}
                  </CardText>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default LinksDetail;
