/* eslint-disable react/jsx-no-undef */
import React, { useState } from "react";
import "antd/dist/antd.css";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
  Col,
  Container,
  Input,
  InputGroup,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

import { Table, Space, Popconfirm, Pagination, Spin } from "antd";
import { useEffect } from "react";
import { deletePost, createPost, getPostReported } from "../../helpers/helper";

import moment from "moment";
import { useCallback } from "react";
import TextArea from "antd/lib/input/TextArea";
import { DeleteOutlined } from "@ant-design/icons";
import ModalViewPostReported from "./ModalViewPostReported";
import { toast } from "react-toastify";
const { Column } = Table;
function PostReported() {
  const [posts, setPosts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPageSize, setTotalPageSize] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [valueCate, setValueCate] = useState("");
  const [valueStatus, setValueStatus] = useState("");
  const [domains, setDomains] = useState([]);
  const [domainId, setDomainId] = useState("");
  const [postContent, setPostContent] = useState("");
  const [userId, setUserId] = useState("");
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const url = "https://baovietnam.com/";
  const toggle = useCallback(
    () => setOpenCreatePost(!openCreatePost),
    [openCreatePost]
  );

  const getDomains = async () => {};

  const getUsers = async () => {
    // const result = await getAllUsers();
    // if (result) {
    //   setUsers(result);
    // }
  };

  const getPosts = async (searchInput, pageSize, pageIndex) => {
    setIsLoading(true);
    const result = await getPostReported(searchInput, pageSize, pageIndex);
    console.log(result, "result");
    if (result) {
      setIsLoading(false);
      setPosts(result?.data);
      setTotalPageSize(result?.totalDoc);
    }
  };
  const getCateList = async () => {};

  useEffect(() => {
    getPosts(searchInput, pageSize, pageIndex);
  }, [pageIndex, pageSize]);

  const confirm = (post) => {
    if (post) {
      deletePost(post._id)
        .then((res) => {
          toast.success("Xóa bài viết thành công!");

          getPosts(searchInput, pageSize, pageIndex);
        })
        .catch((error) => {
          toast.error("Xóa bài viết thất bại!");
        });
    }
  };
  const convertHtmlText = (htmlText) => {
    if (htmlText && htmlText.length > 0) {
      let strText =
        new DOMParser().parseFromString(htmlText, "text/html").documentElement
          .textContent || "";
      if (strText && strText.length > 50) {
        strText = strText.slice(0, 50) + "...";
      }
      return strText;
    }
    return "";
  };

  const handleChange = useCallback((e) => {
    setPostContent(e.target.value);
  }, []);
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRowKeys);
    },
  };
  const handleSubmit = useCallback(async () => {
    const newPost = await createPost(postContent);
    setPosts([newPost, ...posts]);
    toggle();
    getPosts(searchInput, pageSize, pageIndex);
  }, [postContent, toggle, posts]);
  const searchPost = () => {
    getPosts(searchInput, pageSize, pageIndex);
  };

  return (
    <React.Fragment>
      <Spin spinning={false}>
        <div className="page-content">
          <Container fluid>
            <BreadCrumb
              title="Bài viết cảnh báo"
              pageTitle="Quản lý bài viết"
            />
            <Row className="mb-3">
              <Col className="mt-2" lg="3">
                <div>
                  <InputGroup>
                    <Input
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Tìm kiếm..."
                    />
                  </InputGroup>
                </div>
              </Col>

              <Col className="mt-2 d-flex gap-3" lg="12">
                <div>
                  <Button onClick={() => searchPost()}>Tìm kiếm</Button>
                </div>
              </Col>
            </Row>
            <Modal
              isOpen={openCreatePost}
              toggle={toggle}
              // className={className}
              centered
              backdrop={true}
              // keyboard={keyboard}
            >
              <ModalHeader className={"modal-header"} toggle={toggle}>
                Tạo bài đăng
              </ModalHeader>
              <ModalBody>
                <TextArea
                  className={`w-100 h-100 post-content-input`}
                  rows={8}
                  placeholder={`Điểm nhiều hơn 10k sẽ được ưu tiên hiển thị.
Nhập 3 link dạng: http://domain.com###keywords!!!.
Chú ý  '###' và '!!!' là cấu trúc bắt buộc có của đường link.`}
                  value={postContent}
                  onChange={handleChange}
                ></TextArea>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="secondary"
                  className="w-100"
                  onClick={handleSubmit}
                >
                  Tạo mới
                </Button>
              </ModalFooter>
            </Modal>
            <Row>
              <Col lg={12}>
                <Table
                  rowKey="_id"
                  dataSource={posts}
                  pagination={false}
                  rowSelection={{
                    type: "checkbox",
                    selectedRowKeys: selectedRows,
                    ...rowSelection,
                  }}
                >
                  <Column scope="col" style={{ width: "50px" }} />
                  <Column
                    title="#"
                    render={(val, rec, index) => {
                      return index + 1;
                    }}
                  />

                  <Column
                    title="Nội dung"
                    dataIndex="postId"
                    key="postId"
                    render={(item) => <>{convertHtmlText(item?.content)}</>}
                  />

                  <Column
                    title="Số người báo cáo"
                    dataIndex="details"
                    key="details"
                    render={(_) => _?.length}
                  />

                  <Column
                    title="Thời gian tạo"
                    dataIndex="createdAt"
                    key="createdAt"
                    render={(_) => moment(_).format("HH:MM DD-MM-YYYY")}
                  />
                  <Column
                    title="Hoạt động"
                    key="action"
                    render={(val, record) => (
                      <Space size="middle">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "15px",
                          }}
                        >
                          <ModalViewPostReported
                            record={record}
                            getData={() =>
                              getPosts(
                                pageSize,
                                pageIndex,
                                searchInput,
                                valueCate,
                                valueStatus,
                                domainId,
                                userId
                              )
                            }
                          />

                          <Popconfirm
                            title="Are you sure to delete this post?"
                            onConfirm={() => confirm(val?.postId)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <DeleteOutlined
                              style={{ color: "red", fontSize: "20px" }}
                            />
                          </Popconfirm>
                        </div>
                      </Space>
                    )}
                  />
                </Table>
                <div className="text-right">
                  <Pagination
                    pageSize={pageSize}
                    current={pageIndex}
                    onChange={(page, pageSize) => {
                      setPageIndex(page !== 0 ? page : 1);
                      setPageSize(pageSize);
                    }}
                    showTotal={(total) => `Tổng ${total} bài viết`}
                    total={totalPageSize}
                    showSizeChanger
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </Spin>
    </React.Fragment>
  );
}

export default PostReported;
