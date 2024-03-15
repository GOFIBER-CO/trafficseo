import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Container,
  Row,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { getTaxonomy } from "../../helpers/helper";

function TaxonomyDetail() {
  const [taxonomy, setTaxonomy] = useState({});
  const { id } = useParams();

  useEffect(() => {
    if (id && id !=='new') {
      getTaxonomy(id).then((res) => {
        setTaxonomy(res);
      });
    }
  }, [id]);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Taxnonomy Detail"
            pageTitle="Taxonomy Management"
            slug="taxonomy"
          />
          <Row>
            <Col lg={12}>
              <div className="mb-3">
                <Link to="/taxonomy">
                  <div className="d-flex align-items-center">
                    <i className="ri-arrow-left-line"></i>
                    <div style={{ marginLeft: "6px" }}>Quay lại</div>
                  </div>
                </Link>
              </div>
            </Col>

            <Col lg={12}>
                <Card outline className="border">
                  <CardBody>
                    <CardTitle className="mb-3">
                      <h3>{taxonomy.tax_name}</h3>
                    </CardTitle>
                    <CardSubtitle className="mb-2 text-muted">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: taxonomy.tax_description,
                        }}
                      ></span>
                    </CardSubtitle>
                    <CardText>
                      <div className="row gy-3">
                        <div className="col-6">
                          <div className="row">
                            <div className="col-3">
                              <span className="font-medium text-grey">
                                Đường dẫn tĩnh:
                              </span>
                            </div>
                            <div className="col-3">
                              {taxonomy.tax_slug ?? "---"}
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="row">
                            <div className="col-3">
                              <span className="font-medium text-grey">
                                Loại:
                              </span>
                            </div>
                            <div className="col-3">
                              {taxonomy.tax_type ?? "---"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardText>
                  </CardBody>
                </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default TaxonomyDetail;
