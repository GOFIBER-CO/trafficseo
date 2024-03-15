import React, { useEffect, useState } from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
  Button,
  Col,
  Container,
  Input,
  InputGroup,
  InputGroupText,
  Row,
} from "reactstrap";
import { Space, Table, Select, Popconfirm, notification } from "antd";
import { Link } from "react-router-dom";
import { error, success } from "../../Components/Common/message";
import { deleteAllChildTaxonomy, deleteTaxonomy, getAllTaxonomies, getTaxonomy, searchTaxonomy } from "../../helpers/helper";
const { Column } = Table;
const { Option } = Select;
function TaxonomyList() {
  const [taxonomies, setTaxonomies] = useState([]);
  const [searchText, setSearchText] = useState('');

  const getTaxonomies = () => {
    getAllTaxonomies().then((res) => {
      // console.log('res: ', res);
      setTaxonomies(res);
    });
  }

  useEffect(() => {
    getTaxonomies();
  }, []);

  const removeTaxonomy = (val) => {
    //console.log('val: ', val);
    if (val) {
      // const api = val.tax_type === 'category' ? deleteAllChildTaxonomy(val.tax_slug) : deleteTaxonomy(val.tax_slug)
      deleteTaxonomy(val._id).then(res => {
         getTaxonomies();
        success();

      }).catch(er => {
        error()
      })
    }
  };

  const onInputChange = (e) => {
    setSearchText(e.target.value);
    searchTaxonomy(e.target.value)
      .then((res) => {
        const formatRes = res.map((tax) => ({
          ...tax,
          key: tax._id,
        }));
        setTaxonomies(formatRes);
      })
      .catch((error) => {
        notification["error"]({
          message: "System error",
          description: error,
        });
      });
  }
  const onSearch = () => {
    if(!searchText){
      getTaxonomies();
    }
    searchTaxonomy(searchText)
      .then((res) => {
        const formatRes = res.map((tax) => ({
          ...tax,
          key: tax._id,
        }));
        setTaxonomies(formatRes);
      })
      .catch((error) => {
        notification["error"]({
          message: "System error",
          description: error,
        });
      });
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Danh mục và thẻ" pageTitle="Chuyên mục" />
          <Row className="mb-3">
            <Col lg="5">
              <div>
                <InputGroup>
                  <Input
                    value={searchText}
                    onChange={(e) => {
                      onInputChange(e);
                    }}
                    placeholder="Tìm kiếm..."
                  />
                  <InputGroupText>
                    <i className="ri-search-line" onClick={onSearch}></i>
                  </InputGroupText>
                </InputGroup>
              </div>
            </Col>

            <Col lg="7">
              <div className="text-right">
                <Link to="/taxonomy/add/new">
                  <Button>Thêm mới</Button>
                </Link>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Table rowKey='_id' dataSource={taxonomies}>
                <Column
                  title="#"
                  render={(val, rec, index) => {
                    return index + 1;
                  }}
                />
                <Column
                  title="Tên"
                  dataIndex="tax_name"
                  key="tax_name"
                />
                <Column
                  title="Mô tả"
                  dataIndex="tax_description"
                  key="tax_description"
                  render={(val) => {
                    return (
                      <div>
                        <span dangerouslySetInnerHTML={{ __html: val }}></span>
                      </div>
                    )
                  }}
                />
                <Column
                  title="Loại"
                  dataIndex="tax_type"
                  key="tax_type"
                />
                <Column
                  title="Đường dẫn tĩnh"
                  dataIndex="tax_slug"
                  key="tax_slug"
                />
                <Column
                  title="Hoạt động"
                  key="action"
                  render={(val, record) => (
                    <Space size="middle">
                      {/* <Link to={{ pathname: "/taxonomy/" + val.tax_slug }}>View</Link> */}
                      <Link to={{ pathname: "/taxonomy/" + val.tax_slug }}><i className="ri-eye-line action-icon"></i></Link>

                      {/* <Link to={{ pathname: "/taxonomy/add/" + val.tax_slug}}>Edit</Link> */}
                      <Link to={{ pathname: "/taxonomy/add/" + val.tax_slug }}><i className="ri-pencil-line action-icon"></i></Link>

                      <Popconfirm
                        title="Are you sure to delete this user?"
                        onConfirm={() => removeTaxonomy(val)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <i className="ri-delete-bin-line action-icon"></i>
                      </Popconfirm>
                    </Space>
                  )}
                />
              </Table>
            </Col>
          </Row>
        </Container>
      </div>

      {/* <Modal
        title="Add Taxonomy"
        okText="Save"
        visible={isModalAddTaxonomyVisible}
        onOk={addNewTaxonomy}
        onCancel={() => setIsModalVisible(false)}
        width="680px"
      >
        <div>
          <Form>
            <Row>
              <Col lg={6}>
                <FormGroup>
                  <Label className="mb-1" for="Taxonomy_type">
                    Taxonomy type
                  </Label>
                  <Input
                    id="Taxonomy_type"
                    name="Taxonomy_type"
                    placeholder="Taxonomy type"
                    type="text"
                    value={formVal.Taxonomy_type}
                    onChange={onInputChange}
                  />
                </FormGroup>
              </Col>
              <Col lg={6}>
                <FormGroup>
                  <Label className="mb-1" for="Taxonomy_script">
                    Taxonomy script
                  </Label>
                  <Input
                    id="Taxonomy_script"
                    name="Taxonomy_script"
                    placeholder="Taxonomy script"
                    type="text"
                    value={formVal.Taxonomy_script}
                    onChange={onInputChange}
                  />
                </FormGroup>
              </Col>
              <Col lg={12}>
                <FormGroup>
                  <Label className="mb-1" for="post_id">
                    Posts
                  </Label>
                  <Select
                    mode="multiple"
                    size="large"
                    name="post_id"
                    id="post_id"
                    value={formVal.post_id}
                    onChange={onPostChange}
                    placeholder="Posts"
                    style={{ width: "100%" }}
                  >
                    {posts.map((post) => {
                      return (
                        <Option key={post._id} value={post._id}>{post.post_title}</Option>
                      );
                    })}
                  </Select>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal> */}
    </React.Fragment>
  );
}

export default TaxonomyList;
