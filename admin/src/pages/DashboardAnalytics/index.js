import React from "react";
import { Col, Container, Row } from "reactstrap";

//import COmponents

import BreadCrumb from "../../Components/Common/BreadCrumb";

import TopPages from "./TopPages";

const DashboardAnalytics = () => {
  document.title = "Analytics | Velzon - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Trang chủ" pageTitle="Dashboards" />
          <Row>
            <Col xxl={12}>
              <TopPages />
            </Col>
            {/* <LiveUsers /> */}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardAnalytics;
