import React, { useEffect, useState } from "react";
import {
  Col,
  Container,
  Row,
  Input,
  InputGroup,
  Form,
  FormGroup,
  Label,
  Button,
} from "reactstrap";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Space, Modal, Table, message, Popconfirm, notification } from "antd";
import { AudioOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { faqGetAll, deleteFaq, searchFaq } from "../../store/faqs/actions";
import { addFaq, updateFaq, searchFAQ, getAllFaqs } from "../../helpers/helper";
import { success, error } from "../../Components/Common/message";
import {
    uploadFileToBunny,
    getListImageBunny,
    deleteImageBunny
  } from "../../helpers/api_bunny";
  import {
    URL_IMAGE_BUNNY
  } from "../../helpers/url_helper";

const { Column } = Table;
// import type { MenuProps } from "antd";
// const { Search } = Input;

// const handleMenuClick: MenuProps["onClick"] = (e) => {
//   message.info("Click on menu item.");
//   console.log("click", e);
// };

const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: "#1890ff",
    }}
  />
);

const MediaList = () => {
  document.title = "Media Management";
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [isAddFaqModalVisible, setAddFaqModalVisible] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState({});
  const [searchText, setSearchText] = useState("");
  const [mediaList, setMediaList] = useState([]);
  const [mediaSelected, setMediaSelected] = useState(null);
  
  const dispatch = useDispatch();
  //const faqList = useSelector((state) => state.Faqs.faqList);
  useEffect(() => {
    getListMedia();
  }, []);
  const getListMedia =() => {
    getListImageBunny()
    .then((res) => {
        const formatRes = res.map((item) => ({
            ...item,
            key: item.Guid
          }));
          setMediaList(formatRes)
    })
    .catch((error) => {
        notification["error"]({
            message: "System error",
            description: error,
          });
    });
  }
  const bytesToMB = (bytes) => {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if(bytes === 0) return 'O Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  }


  const removeImage = (fileName) => {
    if(fileName){
      deleteImageBunny(fileName).then((res) => {
          getListMedia();
      })
      //getListFaqs();
    }
  }

  const onSearchChange = (e) => {
    setSearchText(e.target.value);
    const listData = [];
    mediaList.map((obj) => {
        if(obj.ObjectName === e.target.value) {
            listData.push(obj);
        }
    })
    if(listData){
        const formatRes = listData.map((item) => ({
            ...item,
            key: item.Guid
        }));
        setMediaList(formatRes)
    }
  };

  const onSearch = () => {
    if(!searchText){
      dispatch(faqGetAll());
    }else{
      searchFAQ(searchText)
        .then((res) => {
          const formatRes = res.map((faq) => ({
            ...faq,
            key: faq._id
          }));
          setMediaList(formatRes);
        })
        .catch((error) => {
          notification["error"]({
            message: "System error",
            description: error,
          });
        });
    }
    
  };

  const convertImage = (fileName) => { 
    if(fileName){
        let item = fileName.split('.')[1];
        if(item === 'mp4'){
            return (
                <>
                    <img
                        src={`http://localhost:8001/logo192.png`}
                        alt={fileName}
                        style={{ width: "20%" }}
                    />
                 </>
            )
        }else{
            return (
                <>
                <img
                    src={'agency88.b-cdn.net/' + fileName}
                    alt={fileName}
                    style={{ width: "90%" }}
                />
            </>
            )
           
        }
    }else{
        return (
            <>
                <img
                    src={ window.location.href+ `/logo192.png`}
                    alt={fileName}
                    style={{ width: "20%" }}
                />
            </>
        )
    }
    
  }
  const uploadImage = (e) => {
    let file = e.target.files ? e.target.files[0] : null;
    if(file){
        uploadFileToBunny(file).then((res) => {
            getListMedia();
        })
       
    }
  }
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Media" pageTitle="Media" />
          <Row className="mb-3">
            <Col lg="5">
              <div>
                {/* <InputGroup>
                  <Input
                    placeholder="Search file name..."
                    value={searchText}
                    onChange={(e) => {
                      onSearchChange(e)
                    }}
                  />

                  <Button color="primary" onClick={onSearch}>
                    <i className="ri-search-line"></i>
                  </Button>
                </InputGroup> */}
              </div>
            </Col>

            <Col lg="7">
              <div className="text-right">
                <form>
                    <label className="custom-file-upload">
                        <Input type="file" onChange={uploadImage}/>
                        <i className="ri-upload-cloud-line"></i> Thêm file
                    </label>
                </form>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <div className="text-right" style={{ width: "40%" }}>
                {/* <Search
                  placeholder="input search text"
                  allowClear
                  size="large"
                  onSearch={onSearch}
                /> */}
              </div>
              <div className="table-responsive mt-4 mt-xl-0">
                <Table rowKey='Guid' dataSource={mediaList}>
                  <Column
                    title="#"
                    render={(val, rec, index) => {
                      return index + 1;
                    }}
                  />
                  <Column 
                    width="30%"
                    title="Hình ảnh" 
                    dataIndex="ObjectName" 
                    key="ObjectName" 
                    render={(image) => (<>{convertImage(image)}</>)}
                  />
                  <Column
                    width="20%"
                    title="Tên File"
                    dataIndex="ObjectName"
                    key="ObjectName"
                  />
                  <Column
                    width="10%"
                    title="Kích thước"
                    dataIndex="Length"
                    key="Length"
                    render={(item) => (<>{bytesToMB(item)}</>)}
                  />
                  <Column
                    title="Ngày thay đổi"
                    dataIndex="LastChanged"
                    key="LastChanged"
                    render={(item) => (<>{new Date(item).toLocaleDateString()}</>)}
                  />
                  {/* <Column
                    title="Date Created"
                    dataIndex="DateCreated"
                    key="DateCreated"
                    render={(item) => (<>{new Date(item).toLocaleDateString()}</>)}
                  /> */}
                  <Column
                    title="Hoạt động"
                    key="action"
                    render={(val, record) => (
                      <Space size="middle">
                        <Popconfirm
                          title="Are you sure to delete this file?"
                          onConfirm={() => removeImage(record.ObjectName)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <i className="ri-delete-bin-line action-icon"></i>
                        </Popconfirm>
                      </Space>
                    )}
                  />
                </Table>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

    </React.Fragment>
  );
};

export default MediaList;
