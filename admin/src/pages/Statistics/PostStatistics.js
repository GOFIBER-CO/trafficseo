/* eslint-disable react/jsx-no-undef */
import React, { useState } from "react";
import 'antd/dist/antd.css';
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
  Col,
  Container,
  Input,
  InputGroup,
  InputGroupText,
  Row,
  Card, 
  CardBody
} from "reactstrap";
import CountUp from "react-countup";
import moment from 'moment';
import { Table, Space, Popconfirm, notification, Pagination, PaginationProps, Spin, Select, DatePicker } from "antd";
import { useEffect } from "react";
import { getAllPosts, searchPost, getByType, getAllByTaxDate, getMaxPosts, getMinPosts, getAllByDate } from "../../helpers/helper";
import {
  URL_IMAGE_BUNNY
} from "../../helpers/url_helper";

//Import Icons
import FeatherIcon from "feather-icons-react";

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const { Column } = Table;

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

const dateNowString = formatDate(new Date())

function PostStatistics() {
  const [posts, setPosts] = useState([]);
  const [searchInput, setSearchInput] = useState(undefined);
  const [current, setCurrent] = useState(0);
  const [res, setRes] = useState({});
  const [pageSize, setPageSize] = React.useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [postSearch, setPostSearch] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [maximum, setMaximum] = useState([50, dateNowString]);
  const [minimum, setMinimum] = useState([0, dateNowString]);
  const [numPostsByDate, setNumPostsByDate] = useState(0);
  const [dateRange, setDateRange] = useState([dateNowString, dateNowString]);

  const getPosts = async (limit, skip) => {
    setIsLoading(true);
    if(typeof limit !== 'undefined' && typeof skip !== 'undefined'){
      await getAllPosts(limit, skip).then((res) => {
        res.datas && res.datas.map((item, i) => {
          let image = item.post_image.toString().split('\\');
          if (item.post_image && image[1] === 'fakepath') {
            item.post_image = URL_IMAGE_BUNNY + item.post_image.substr(12)
          }
        })
        setRes(res);
        setPosts(res.datas);
        setIsLoading(false);
      });
    }
    else{
      await getAllPosts(pageSize, current).then((res) => {
        res.datas && res.datas.map((item, i) => {
          let image = item.post_image.toString().split('\\');
          if (item.post_image && image[1] === 'fakepath') {
            item.post_image = URL_IMAGE_BUNNY + item.post_image.substr(12)
          }
        })
        setRes(res);
        setPosts(res.datas);
        setIsLoading(false);
      });
    }
  };

  const getListCategory = () => {
    getByType("category").then((res) => {
      if(res){
        setCategories(res);
      }
    })
  }

  const getMaxVal = () => {
    getMaxPosts().then((res) => {
      if(res){
        setMaximum([res.max, res.date]);
      }
    })
  }

  const getAllPostsByDate = async (start, end) => {
    setIsLoading(true);
    await getAllByDate(start, end).then((res) => {
      res.datas && res.datas.map((item, i) => {
        let image = item.post_image.toString().split('\\');
        if (item.post_image && image[1] === 'fakepath') {
          item.post_image = URL_IMAGE_BUNNY + item.post_image.substr(12)
        }
      })
      setRes(res);
      setPosts(res.datas);
      setNumPostsByDate(res.pageSize);
      setIsLoading(false);
    })
  }

  const getAllPostsByTaxDate = async (category, start, end) => {
    setIsLoading(true);
    await getAllByTaxDate(category, start, end).then((res) => {
      res.datas && res.datas.map((item, i) => {
        let image = item.post_image.toString().split('\\');
        if (item.post_image && image[1] === 'fakepath') {
          item.post_image = URL_IMAGE_BUNNY + item.post_image.substr(12)
        }
      })
      setRes(res);
      setPosts(res.datas);
      setNumPostsByDate(res.pageSize);
      setIsLoading(false);
    })
  }

  const getMinVal = () => {
    getMinPosts().then((res) => {
      if(res){
        setMinimum([res.min, res.date]);
      }
    })
  }

  useEffect(() => {
    getAllPostsByDate(dateNowString, dateNowString);
    getListCategory();
    getMaxVal();
    getMinVal();
  }, []);

  const convertHtmlText = (htmlText) => {
    if (htmlText && htmlText.length > 0) {
      let strText = new DOMParser().parseFromString(htmlText, 'text/html').documentElement.textContent || '';
      if (strText && strText.length > 50) {
        strText = strText.slice(0, 50) + '...';
      }
      return strText;
    }
    return '';
  }

  const onSearchPost = (e) => {
    setSearchInput(e.target.value);
    setIsLoading(true);
    if(e.target.value === ""){
      setPostSearch([]);
      getPosts();
    }else{
      searchPost(e.target.value).then((res) => {
        var data = {
          total : 0,
          skip : current,
          pageSize: pageSize,
          datas : []
        }
        if(res && res.length > 0){
          res && res.map((item, i) => {
            let image = item.post_image.toString().split('\\');
            if (item.post_image && image[1] === 'fakepath') {
              item.post_image = URL_IMAGE_BUNNY + item.post_image.substr(12)
            }
          })
          var datas = paginate(res, pageSize, current);
          data.total = res.length;
          data.datas = datas;
          setPostSearch(res);
          setRes(data);
          setPosts(datas);
          setCurrent(current);
          setIsLoading(false);
        }else{
          setRes(data);
          setPosts(res);
          setCurrent(current);
          setIsLoading(false);
        }      
      });
    }
  };
  const paginate = (array, page_size, page_number) => {
    let skip = page_number === 0 ? 1 : page_number; 
    if(array && array.length > 0){
      return array.slice((skip - 1) * page_size, skip * page_size);
    }
  }
  const onLoadPagination = (pageTmp, skipTmp) => {
    let arraySearch = postSearch ? postSearch : null;
    setIsLoading(true);
    var data = {
      total : 0,
      skip : skipTmp,
      pageSize: pageTmp,
      datas : []
    }
    if(arraySearch != null){
      var datas = paginate(arraySearch, pageTmp, skipTmp);
      data.total = arraySearch.length;
      datas.datas = datas;
      setRes(data);
      setPosts(datas);
      setIsLoading(false);
    }else{
      setIsLoading(false);
    }
  }
  const onSearch = (limitTmp, skipTmp) => {
    let page = limitTmp ? limitTmp : pageSize;
    let skipPage = skipTmp ? skipTmp : current;
    
    if(page && skipPage) {
      setIsLoading(true);
      searchPost(searchInput).then(res => {
        var data = {
          total : 0,
          skip : skipPage,
          pageSize: page,
          datas : []
        }
        if(res && res.length > 0){
          res && res.map((item, i) => {
            let image = item.post_image.toString().split('\\');
            if (item.post_image && image[1] === 'fakepath') {
              item.post_image = URL_IMAGE_BUNNY + item.post_image.substr(12)
            }
          })
          var datas = paginate(res, pageSize, current);
          data.total = res.length;
          data.datas = datas;
          setPostSearch(res);
          setRes(data);
          setPosts(datas);
          setCurrent(skipPage);
          setIsLoading(false);
        }else{
          setRes(data);
          setPosts(res);
          setCurrent(skipPage);
          setIsLoading(false);
        }
      })
      .catch(error => {
        notification['error']({
          message: 'System error',
          description:
            error,
        });
        setIsLoading(false);
      })
    }
   
  };
  const onChangeCategory = (value) => {
    if(value){
      setSelectedCategory(value)
      getAllByTaxDate(value, dateRange[0], dateRange[1])
    }else{
      getPosts();
    }   
  }
  const onChangeDateRange = (dates, dateStrings) => {
    setDateRange(dateStrings);
    if(dateStrings[0] !== "" && selectedCategory){
      getAllPostsByTaxDate(selectedCategory, dateStrings[0], dateStrings[1]);
    } else if(dateStrings[0] !== "") {
      getAllPostsByDate(dateStrings[0], dateStrings[1]);
    }
  }
  return (
    <React.Fragment>
      <Spin spinning={isLoading}>
        <div className="page-content">
          <Container fluid>
            <BreadCrumb title="Bài viết" pageTitle="Statistics" />
            <Row className="mb-3">
              <Col lg="4">
                <div>
                  <InputGroup>
                    <Input
                      value={searchInput}
                      onChange={(e) => onSearchPost(e)}
                      placeholder="Tìm kiếm..."
                    />
                    <InputGroupText onClick={onSearch}>
                      <i className="ri-search-line"></i>
                    </InputGroupText>
                  </InputGroup>
                </div>
              </Col>
              <Col lg="4">
                <div>
                <Select
                      allowClear={true}
                      style={{ width: "100%" }}
                      placeholder="Tìm kiếm theo chuyên mục"
                      onChange={onChangeCategory}
                      optionFilterProp="children"
                      filterOption={(input, option) => option.children.includes(input)}
                      filterSort={(optionA, optionB) =>
                        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                      }
                      // value={selectCategory}
                    >
                      {categories && categories?.map((item) => (
                        <Option key={item._id}>{item?.tax_name}</Option>
                      ))}
                </Select>
                </div>
              </Col>
              <Col lg="4">
                <RangePicker
                  defaultValue={[moment(new Date(), dateFormat), moment(new Date(), dateFormat)]}
                  format={dateFormat} onChange={onChangeDateRange}
                />
              </Col>
            </Row>

            <Row>
                <Col md={4}>
                    <Card className="card-animate">
                        <CardBody>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <p className="fw-medium text-muted mb-0">Ngày đăng bài nhiều nhất</p>
                                    <h2 className="mt-4 ff-secondary fw-semibold">
                                        <span className="counter-value">
                                            <CountUp
                                                start={0}
                                                end={maximum[0]}
                                                decimals={0}
                                                duration={4}
                                            />
                                        </span>
                                      </h2>
                                    <p className="mb-0 text-muted">{maximum[1]}</p>
                                </div>
                                <div>
                                    <div className="avatar-sm flex-shrink-0">
                                        <span className="avatar-title bg-soft-info rounded-circle fs-2">
                                            <FeatherIcon
                                                icon="activity"
                                                className="text-info"
                                            />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="card-animate">
                        <CardBody>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <p className="fw-medium text-muted mb-0">Ngày đăng bài ít nhất</p>
                                    <h2 className="mt-4 ff-secondary fw-semibold">
                                        <span className="counter-value" data-target="97.66">
                                            <CountUp
                                                start={0}
                                                end={minimum[0]}
                                                decimals={0}
                                                duration={4}
                                            />
                                        </span>
                                      </h2>
                                    <p className="mb-0 text-muted">{minimum[1]}</p>
                                </div>
                                <div>
                                    <div className="avatar-sm flex-shrink-0">
                                        <span className="avatar-title bg-soft-info rounded-circle fs-2">
                                            <FeatherIcon
                                                icon="activity"
                                                className="text-info"
                                            />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="card-animate">
                        <CardBody>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <p className="fw-medium text-muted mb-0">Số bài viết</p>
                                    <h2 className="mt-4 ff-secondary fw-semibold">
                                        <span className="counter-value" data-target="97.66">
                                            <CountUp
                                                start={0}
                                                end={numPostsByDate}
                                                decimals={0}
                                                duration={4}
                                            />
                                        </span>
                                      </h2>
                                    <p className="mb-0 text-muted">{dateRange[0]} ~ {dateRange[1]}</p>
                                </div>
                                <div>
                                    <div className="avatar-sm flex-shrink-0">
                                        <span className="avatar-title bg-soft-info rounded-circle fs-2">
                                            <FeatherIcon
                                                icon="activity"
                                                className="text-info"
                                            />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Row>
              <Col lg={12}>
                <Table rowKey='_id'
                  dataSource={posts}
                  pagination={false}
                >
                  <Column
                    title="#"
                    render={(val, rec, index) => {
                      return index + 1;
                    }}
                  />
                  <Column title="Tiêu đề" dataIndex="post_title" key="post_title" />
                  <Column
                    title="Trạng thái"
                    dataIndex="post_status"
                    key="post_status"
                  />
                  <Column
                    title="Mô tả"
                    dataIndex="post_description"
                    key="post_description"
                    render={(item) => (
                      <>{convertHtmlText(item)}</>
                    )}
                  />
                  <Column
                    title="Hình ảnh"
                    dataIndex="post_image"
                    key="post_image"
                    render={(image) => (
                      <img
                        src={image}
                        alt="pro_image"
                        style={{ width: "50%" }}
                      />
                    )}
                  />
                  <Column
                    title="Đường dẫn tĩnh"
                    dataIndex="post_slug"
                    key="post_slug"
                  />
                </Table>
                <div className="text-right">
                  <Pagination
                    onChange={(page, newPageSize) => {
                      let pageTmp = page - 1;
                      setPageSize(newPageSize);
                      setCurrent(pageSize !== newPageSize ? 0 : pageTmp);
                      console.log(pageTmp,newPageSize)
                      if(postSearch.length > 0){
                        onLoadPagination(newPageSize, page);
                      }else{
                        getPosts(newPageSize, pageTmp)
                      }
                    }}
                    showSizeChanger={true}
                    total={res.total}
                    current={current+1}
                    pageSize={pageSize}
                    showTotal={total => `Total ${total} items`}
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

export default PostStatistics;
