import React, { useEffect, useState } from 'react';
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
    Col,
    Container,
    Input,
    InputGroup,
    InputGroupText,
    Row,
    Button,
    Form,
    FormGroup,
    Label,
} from "reactstrap";
import { getPageById, getAllFaqs } from '../../helpers/helper';
import { useParams } from 'react-router-dom';
import { Space, Table, notification, Popconfirm, Spin } from "antd";

function PageDetail() {
    const [currentItem, setCurrentItem] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [faqList, setFaqList] = useState([]);
    const [itemFaqIds, setItemFaqIds] = useState([]);
    const [faqListDetai, setFaqListDetail] = useState([]);
    const { id } = useParams();
    useEffect(() => {
        if (id) {
            setIsLoading(true);
            getPageById(id).then(res => {
                setCurrentItem(res);
                setItemFaqIds(res?.faq_id);
                setIsLoading(false);
                return getAllFaqs();
            })
                .then(res => {
                    const formatRes = res.map(item => ({
                        ...item,
                        key: item._id,
                    }))
                    setFaqList(formatRes);

                    setIsLoading(false);
                })
                .catch(error => {
                    notification['error']({
                        message: 'System error',
                        description:
                            error,
                    });
                });
        }
    }, []);

    useEffect(() => {
        if (itemFaqIds.length > 0 && faqList.length > 0) {
            const faqs = faqList.filter(item => itemFaqIds.includes(item._id));
            setFaqListDetail(faqs)
        }
    }, [itemFaqIds, faqList]);
    const convertHtmlText = (htmlText) => {
        if (htmlText && htmlText.length > 0) {
            let strText = new DOMParser().parseFromString(htmlText, 'text/html').documentElement.textContent || '';
            return strText;
        }
        return '';
    };
    return (
        <>
            <Spin spinning={isLoading}>
                <div className="page-content">
                    <Container fluid>
                        <BreadCrumb title="Pages Detail" pageTitle="Pages Management" slug='pages-management'  />
                        <Row className="mb-2">
                            <Col lg="12">
                                <p><b>Title: </b>{currentItem?.page_title}</p>
                                <p><b>Slug: </b>{currentItem?.page_category_slug}</p>
                                <p><b>Category name: </b>{currentItem?.page_category_name}</p>
                                <p><b>Description: </b> <br />{convertHtmlText(currentItem?.page_description)}</p>
                                <p><b>Content: </b> <br /> {convertHtmlText(currentItem?.page_content)}</p>
                                <p><b>FAQs - Câu hỏi thường gặp: </b> <br /></p>
                                <ul>
                                    {
                                        faqListDetai.map(item => (
                                            <li key={item._id}>{item.faq_name}</li>
                                        ))
                                    }
                                </ul>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </Spin>
        </>
    );
}

export default PageDetail;