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
import { Divider } from "antd";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { getPostById, getPostBySlug } from "../../helpers/helper";
import { URL_IMAGE_BUNNY } from "../../helpers/url_helper";
function PostDetail(params) {
  const [post, setPost] = useState({});
  const { id } = useParams();
  console.log(params);
  useEffect(() => {
    if (id) {
      getPostBySlug(id).then((res) => {
        setPost(res.docs);
        console.log(res);
      });
    }
  }, [id]);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Chi tiết bài viết"
            pageTitle="Quản lý bài viết"
            slug="posts"
          />
          <div>
            <Row className="mb-3">
              <Col lg={4}>
                <img
                  className="rounded"
                  src={post.thumb}
                  alt={post.thumb}
                  style={{ width: "100%" }}
                />
              </Col>

              <Col lg={8}>
                <h4>{post.title}</h4>
                <p>{post.description}</p>
                <Divider />
                <div className="row">
                  <div className="col">
                    <div className="flex">
                      <div>Lượt xem:</div>
                      <div className="font-medium text-grey ml-2">
                        {post.post_views}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="flex">
                      <div>Tác giả:</div>
                      <div className="font-medium text-grey ml-2">
                        {post.post_userid?.username}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="flex">
                      <div>Trạng thái:</div>
                      <div className="font-medium text-grey ml-2">
                        {post.post_status}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col">
                    <div className="flex">
                      <div>Slug:</div>
                      <div className="font-medium text-grey ml-2">
                        {post.post_slug}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Divider style={{ margin: "2rem 0px" }}>
              <h3 className="mb-0">Nội dung</h3>
            </Divider>
            <Row style={{ margin: "0rem" }}>
              <Card outline className="border">
                <CardBody>
                  <CardText>
                    <div
                      dangerouslySetInnerHTML={{ __html: post.post_content }}
                    ></div>
                  </CardText>
                </CardBody>
              </Card>
            </Row>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default PostDetail;
