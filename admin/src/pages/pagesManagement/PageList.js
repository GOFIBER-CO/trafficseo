import React, { useEffect, useState } from 'react'
//import Components
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
    Col,
    Container,
    Input,
    InputGroup,
    InputGroupText,
    Row,
    Button,
} from "reactstrap";
import { Space, Table, notification, Popconfirm, Spin } from "antd";
import { Link, useHistory } from "react-router-dom";
import { getAllPages, searchPages, deletePage } from '../../helpers/helper';


const confirmDeleteText = 'Are you sure to delete this page';
const { Column } = Table;
function PageList() {
    const [pageList, setPageList] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const history = useHistory();

    const [formVal, setFormVal] = useState({
        username: '',
        firstName: '',
        lastName: '',
        password: '',
        role: '',
    });

    const getPages = () => {
        setIsLoading(true);
        getAllPages().then(res => {
            const formatRes = res.map(item => ({
                ...item,
                key: item.id || item._id,
                // faq_id: item.faq_id[0].faq_name || 'N/A'
            }));
            // console.log('res: ', res);
            setPageList(formatRes);
            setIsLoading(false);
        }).catch(error => {
            setIsLoading(false);
            notification['error']({
                message: 'System error',
                description:
                    error,
            });
        });
    }
    useEffect(() => {
        getPages();
    }, []);

    const addPage = () => {
        history.push('/pages-management/create');
    }
    const onDelete = (record) => {
        deletePage(record._id).then(res => {
            notification['success']({
                message: 'Notification',
                description:
                    'Delete page successfully!',
            });
            getPages();
        }).catch(error => {
            notification['error']({
                message: 'System error',
                description:
                    error,
            });
        })
    }

    const convertHtmlText = (htmlText) => {
        if (htmlText && htmlText.length > 0) {
            let strText = new DOMParser().parseFromString(htmlText, 'text/html').documentElement.textContent || '';
            if (strText && strText.length > 20) {
                strText = strText.slice(0, 20) + '...';
            }
            return strText;
        }
        return '';
    }
    const formatString = (str) => {
        if (str && str.length > 20) {
            str = str.slice(0, 20) + '...';
        }
        return str || '';
    }

    const formatArrayToString = (array) => {
        var str = ''
        if (array && array.length > 0) {
            array.map((item) => {
                str = formatString(item.faq_name);
            })
        }
        return str;
    }

    const onSearch = () => {
        setIsLoading(true);
        searchPages({ q: searchText }).then(res => {
            const formatRes = res.map(page => ({
                ...page,
                key: page.id,
            }))
            setPageList(formatRes);
            setIsLoading(false);
        }).catch(error => {
            notification['error']({
                message: 'System error',
                description:
                    error,
            });
            setIsLoading(false);
        })
    };
    const onInputChange = (e) => {
        setSearchText(e.target.value);
        searchPages({ q: searchText }).then(res => {
            const formatRes = res.map(page => ({
                ...page,
                key: page.id,
            }))
            setPageList(formatRes);
        }).catch(error => {
            notification['error']({
                message: 'System error',
                description:
                    error,
            });
        })
    }
    return (
        <React.Fragment>
            <Spin spinning={isLoading}>
                <div className="page-content">
                    <Container fluid>
                        <BreadCrumb title="Trang" pageTitle="Quản lý trang" />
                        <Row className="mb-2">
                            <Col lg="5">
                                <div>
                                    <InputGroup>
                                        <Input
                                            value={searchText}
                                            onChange={(e) => { onInputChange(e) }}
                                            placeholder="Tìm kiếm..."
                                        />
                                        <InputGroupText onClick={onSearch}>
                                            <i className="ri-search-line"></i>
                                        </InputGroupText>
                                    </InputGroup>
                                </div>
                            </Col>

                            <Col lg="7">
                                <div className="text-right">
                                    <Button onClick={addPage}>Thêm mới</Button>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12}>
                                <Table dataSource={pageList} scroll={{ x: 'max-content' }}>
                                    <Column
                                        title="#"
                                        render={(val, rec, index) => {
                                            return index + 1;
                                        }}
                                    />
                                    <Column
                                        title="Tiêu đề"
                                        dataIndex="page_title"
                                        key="page_title"
                                        render={(item) => (
                                            <>{formatString(item)}</>
                                        )}
                                    />
                                    <Column title="Đường dẫn tĩnh" dataIndex="page_category_slug" key="page_category_slug" />
                                    <Column title="Mô tả" dataIndex="page_description" key="page_description"
                                        render={(item) => (
                                            <>{convertHtmlText(item)}</>
                                        )}
                                    />
                                    <Column title="Tên danh mục" dataIndex="page_category_name" key="page_category_name"
                                        render={(item) => (
                                            <>{formatString(item)}</>
                                        )}
                                    />
                                    {/* <Column title="Nội dung" dataIndex="page_content" key="page_content"
                                        render={(item) => (
                                            <>{convertHtmlText(item)}</>
                                        )}
                                    /> */}
                                    <Column title="FAQs" dataIndex="faq_id" key="faq_id" render={val => {
                                        return <div>{val && val?.length ? (
                                            <ul>
                                                {val.map((item, index) => {
                                                    return <li key={index}>{item.faq_name}</li>
                                                })}
                                            </ul>
                                        ) : '---'}
                                        </div>
                                    }} />
                                    <Column
                                        title="Hoạt động"
                                        key="action"
                                        render={(val, record) => (
                                            <Space size="middle">
                                                <Link to={{ pathname: "/pages-management/" + val._id }}><i className="ri-eye-line action-icon"></i></Link>
                                                <Link to={{ pathname: "/pages-management/edit/" + val._id }}><i className="ri-pencil-line action-icon"></i></Link>
                                                <Popconfirm placement="topLeft" title={confirmDeleteText} onConfirm={() => onDelete(record)} okText="Yes" cancelText="No">
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
            </Spin>
        </React.Fragment>
    )
}

export default PageList;