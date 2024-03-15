import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardBody, CardSubtitle, CardText, CardTitle, Col, Container, Row } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { getSchema } from "../../helpers/helper";

function SchemaDetail() {
  const [schema, setSchema] = useState({});
  const {id} = useParams();

  useEffect(() => {
    getSchema(id).then(res => {
      setSchema(res);
    })
  }, [])
  
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Schemas Detail" pageTitle="Schemas Management"  slug='schemas' />
          <Row className="mb-3">
            <Col lg={12}>
              <div className="mb-3">
                <Link to="/schemas">
                  <div className="d-flex align-items-center">
                    <i className="ri-arrow-left-line"></i>
                    <div style={{ marginLeft: "6px" }}>Quay lại</div>
                  </div>
                </Link>
              </div>
              <Card outline className="border">
                <CardBody>
                  {/* <CardTitle tag="h5">{schema.schema_type}</CardTitle> */}
                  {/* <CardSubtitle className="mb-2 text-muted" tag="h6">
                    
                  </CardSubtitle> */}
                  <CardText>
                  <div className="row">
                      <div className="col-4">
                        <div className="flex">
                          <div className="font-medium">Tên: </div>
                          <div className="ml-2">{schema.schema_type ?? '---'}</div>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="flex">
                          <div className="font-medium">Đoạn mã: </div>
                          <div className="ml-2">{schema.schema_script ?? '---'}</div>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="flex">
                          <div className="font-medium">Bài viết: </div>
                          <div className="ml-2">
                          {schema.post_id?.length ? (
                            <ul>
                              {schema.post_id.map((item, index) => {
                                return <li key={index}>{item.post_title}</li>
                              })}
                            </ul>
                          ) : '---'}
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="flex">
                          <div className="font-medium">Trang: </div>
                          <div className="ml-2">
                          {schema.page_id?.length ? (
                            <ul>
                              {schema.page_id.map((item, index) => {
                                return <li key={index}>{item.page_title}</li>
                              })}
                            </ul>
                          ) : '---'}
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

export default SchemaDetail;
