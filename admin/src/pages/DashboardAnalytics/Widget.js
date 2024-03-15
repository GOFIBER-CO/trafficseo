import React, { useState, useEffect, useRef } from "react";
import FeatherIcon from "feather-icons-react";
import { Card, CardBody, Col, Row } from "reactstrap";
import CountUp from "react-countup";
// const host = "http://localhost:3000";
//Import Icons
import { ggAnalytics, ggAnalyticsGraph, getAllPosts, getAllUsers } from "../../helpers/helper";
import PostList from "../Posts/PostList";

const Widget = (props) => {
  const [dataUsers, setDataUsers] = useState();
  const [dataPageViews, setDataPageViews] = useState();
  const [dataSessions, setDataSessions] = useState();
  const [dataSearchs, setDataSearchs] = useState();
  const [metricsUsers, setMetricsUsers] = useState("ga:users");
  const [metricsPageViews, setMetricsPageViews] = useState("ga:pageviews");
  const [metricsSessions, setMetricsSessions] = useState("ga:sessions");
  const [metricsSearchs, setMetricsSearchs] = useState("ga:organicSearches");
  const [start, setStart] = useState("60daysAgo");
  const [end, setEnd] = useState("today");
  const [increasePercentageUsers, setIncreasePercentageUsers] = useState();
  const [increasePercentagePageViews, setIncreasePercentagePageViews] =
    useState();
  const [increasePercentageSessions, setIncreasePercentageSessions] =
    useState();
  const [increasePercentageSearchs, setIncreasePercentageSearchs] = useState();
  const [flagUses, setFlagUses] = useState(false);
  const [flagPageViews, setFlagPageViews] = useState(false);
  const [flagSessions, setFlagSessions] = useState(false);
  const [flagSearchs, setFlagSearchs] = useState(false);
  const [totalUsers, setTotalUsers] = useState();
  const [totalPosts, setTotalPosts] = useState();

  useEffect(() => {
    getListAnalytics();

    // phần này đơn giản để gán id cho mỗi phiên kết nối vào page. Mục đích chính là để phân biệt đoạn nào là của mình đang chat.
    //   socketRef.current.on('sendDataServer', dataGot => {
    //     setMess(oldMsgs => [...oldMsgs, dataGot.data])
    //   })
    // mỗi khi có tin nhắn thì mess sẽ được render thêm
    // mỗi khi có tin nhắn thì mess sẽ được render thêm
  }, []);



  const getListAnalytics = () => {
    getUsers();
    getSessions();
    getPageView();
    getSearchOrganic();
    getTotalPosts();
    getTotalUsers();
  };
  const getUsers = () => {
    ggAnalytics(metricsUsers, start, end)
      .then((res) => {
        let valueUsers = res && res.data && parseInt(res.data["ga:users"].value);

        let increasePercentage = 0;
        increasePercentage = ((valueUsers - valueUsers) / valueUsers) * 100;
        if (increasePercentage > 0) {
          setFlagUses(true);
        } else {
          setFlagUses(false);
        }

        const roundNumbers = (num, decPlaces) => {
          // 2 decimal places => 100, 3 => 1000, etc
          decPlaces = Math.pow(10, decPlaces);

          // Enumerate number abbreviations
          var abbrev = ["k", "m", "b", "t"];

          // Go through the array backwards, so we do the largest first
          for (var i = abbrev.length - 1; i >= 0; i--) {
            // Convert array index to "1000", "1000000", etc
            var size = Math.pow(10, (i + 1) * 3);

            // If the number is bigger or equal do the abbreviation
            if (size <= valueUsers) {
              // Here, we multiply by decPlaces, round, and then divide by decPlaces.
              // This gives us nice rounding to a particular decimal place.
              valueUsers =
                Math.round((valueUsers * decPlaces) / size) / decPlaces;

              // Handle special case where we round up to the next abbreviation
              if (valueUsers === 1000 && i < abbrev.length - 1) {
                valueUsers = 1;
                i++;
              }

              // Add the letter for the abbreviation
              valueUsers += abbrev[i];

              // We are done... stop
              break;
            }
          }

          return num;
        };
        roundNumbers(valueUsers, 4);
       
        setDataUsers(valueUsers);
        setIncreasePercentageUsers(parseFloat(increasePercentage));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getSessions = (next, pre) => {
    // // var abc = next ? next : start;
    // let nextDate = typeof next === "string" ? next : start;
    // let preDate = typeof pre === "string" ? pre : end;
    ggAnalytics(metricsSessions, start, end)
      .then((res) => {
        let valueSessions = res && res.data && res.data["ga:sessions"].value;

        let increasePercentage = 0;
        increasePercentage = ((100 - 10) / 10) * 100;
        if (increasePercentage > 0) {
          setFlagSessions(true);
        } else {
          setFlagSessions(false);
        }

        const roundNumbers = (num, decPlaces) => {
          // 2 decimal places => 100, 3 => 1000, etc
          decPlaces = Math.pow(10, decPlaces);

          // Enumerate number abbreviations
          var abbrev = ["k", "m", "b", "t"];

          // Go through the array backwards, so we do the largest first
          for (var i = abbrev.length - 1; i >= 0; i--) {
            // Convert array index to "1000", "1000000", etc
            var size = Math.pow(10, (i + 1) * 3);

            // If the number is bigger or equal do the abbreviation
            if (size <= valueSessions) {
              // Here, we multiply by decPlaces, round, and then divide by decPlaces.
              // This gives us nice rounding to a particular decimal place.
              valueSessions =
                Math.round((valueSessions * decPlaces) / size) / decPlaces;

              // Handle special case where we round up to the next abbreviation
              if (valueSessions === 1000 && i < abbrev.length - 1) {
                valueSessions = 1;
                i++;
              }

              // Add the letter for the abbreviation
              valueSessions += abbrev[i];

              // We are done... stop
              break;
            }
          }

          return num;
        };
        roundNumbers(valueSessions, 4);
        
        setDataSessions(valueSessions);
        setIncreasePercentageSessions(parseFloat(increasePercentage));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getSearchOrganic = () => {
    ggAnalytics(metricsSearchs, start, end)
      .then((res) => {
        let valueSearchOrganic = res && res.data && res.data["ga:organicSearches"].value;
        let increasePercentage = 0;
        increasePercentage =
          ((valueSearchOrganic - valueSearchOrganic) / valueSearchOrganic) *
          100;
        if (increasePercentage > 0) {
          setFlagSearchs(true);
        } else {
          setFlagSearchs(false);
        }

        const roundNumbers = (num, decPlaces) => {
          // 2 decimal places => 100, 3 => 1000, etc
          decPlaces = Math.pow(10, decPlaces);

          // Enumerate number abbreviations
          var abbrev = ["k", "m", "b", "t"];

          // Go through the array backwards, so we do the largest first
          for (var i = abbrev.length - 1; i >= 0; i--) {
            // Convert array index to "1000", "1000000", etc
            var size = Math.pow(10, (i + 1) * 3);

            // If the number is bigger or equal do the abbreviation
            if (size <= valueSearchOrganic) {
              // Here, we multiply by decPlaces, round, and then divide by decPlaces.
              // This gives us nice rounding to a particular decimal place.
              valueSearchOrganic =
                Math.round((valueSearchOrganic * decPlaces) / size) / decPlaces;

              // Handle special case where we round up to the next abbreviation
              if (valueSearchOrganic === 1000 && i < abbrev.length - 1) {
                valueSearchOrganic = 1;
                i++;
              }

              // Add the letter for the abbreviation
              valueSearchOrganic += abbrev[i];

              // We are done... stop
              break;
            }
          }

          return num;
        };
        roundNumbers(valueSearchOrganic, 4);

        
        setDataSearchs(valueSearchOrganic);
        setIncreasePercentageSearchs(parseFloat(increasePercentage));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getPageView = () => {
    ggAnalytics(metricsPageViews, start, end)
      .then((res) => {
        let valuePageView = res && res.data && res.data["ga:pageviews"].value;

        let increasePercentage = 0;
        increasePercentage =
          ((valuePageView - valuePageView) / valuePageView) * 100;
        if (increasePercentage > 0) {
          setFlagPageViews(true);
        } else {
          setFlagPageViews(false);
        }

        const roundNumbers = (num, decPlaces) => {
          // 2 decimal places => 100, 3 => 1000, etc
          decPlaces = Math.pow(10, decPlaces);

          // Enumerate number abbreviations
          var abbrev = ["k", "m", "b", "t"];

          // Go through the array backwards, so we do the largest first
          for (var i = abbrev.length - 1; i >= 0; i--) {
            // Convert array index to "1000", "1000000", etc
            var size = Math.pow(10, (i + 1) * 3);

            // If the number is bigger or equal do the abbreviation
            if (size <= valuePageView) {
              // Here, we multiply by decPlaces, round, and then divide by decPlaces.
              // This gives us nice rounding to a particular decimal place.
              valuePageView =
                Math.round((valuePageView * decPlaces) / size) / decPlaces;

              // Handle special case where we round up to the next abbreviation
              if (valuePageView === 1000 && i < abbrev.length - 1) {
                valuePageView = 1;
                i++;
              }

              // Add the letter for the abbreviation
              valuePageView += abbrev[i];

              // We are done... stop
              break;
            }
          }

          return num;
        };
        roundNumbers(valuePageView, 4);

        

        setDataPageViews(valuePageView);
        setIncreasePercentagePageViews(parseFloat(increasePercentage));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getTotalPosts = () => {
    getAllPosts(1,0).then((res) => {
      if(res){
        setTotalPosts(res.total);
      }
      
    })
  }
  const getTotalUsers = () => {
    getAllUsers().then((res) => {
      if(res) {
        setTotalUsers(res.length);
      }
    })
  }
  return (
    <React.Fragment>
       
      <Row>
        <Col md={6}>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex justify-content-between">
                <div>
                  <p className="fw-medium text-muted mb-0">Tổng thành viên</p>
                  <h2 className="mt-4 ff-secondary fw-semibold">
                    <span className="counter-value">
                      {totalUsers}
                    </span>
                  </h2>
                  
                </div>
                <div>
                  <div className="avatar-sm flex-shrink-0">
                    <span className="avatar-title bg-soft-info rounded-circle fs-2">
                      <FeatherIcon icon="users" className="text-info" />
                    </span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex justify-content-between">
                <div>
                  <p className="fw-medium text-muted mb-0">Tổng bài viết</p>
                  <h2 className="mt-4 ff-secondary fw-semibold">
                    <span className="counter-value" data-target="97.66">
                      {totalPosts}
                    </span>
                  </h2>
                </div>
                <div>
                  <div className="avatar-sm flex-shrink-0">
                    <span className="avatar-title bg-soft-info rounded-circle fs-2">
                      <FeatherIcon icon="bar-chart-2" className="text-info" />
                    </span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row></Row>
      <Row>
        <Col md={6}>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex justify-content-between">
                <div>
                  <p className="fw-medium text-muted mb-0">Users</p>
                  <h2 className="mt-4 ff-secondary fw-semibold">
                    <span className="counter-value">
                      {dataUsers}
                    </span>
                  </h2>
                  <p className="mb-0 text-muted">
                    <span className="badge bg-light text-success mb-0">
                      {flagUses === true ? (
                        <>
                          {" "}
                          <span className="badge bg-light text-success mb-0">
                            <i className="ri-arrow-up-line align-middle"></i>
                            {increasePercentageUsers}%
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="badge bg-light text-danger mb-0">
                            <i className="ri-arrow-down-line align-middle"></i>
                            {increasePercentageUsers}%
                          </span>
                        </>
                      )}
                    </span>{" "}
                    vs. previous month
                  </p>
                </div>
                <div>
                  <div className="avatar-sm flex-shrink-0">
                    <span className="avatar-title bg-soft-info rounded-circle fs-2">
                      <FeatherIcon icon="user" className="text-info" />
                    </span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex justify-content-between">
                <div>
                  <p className="fw-medium text-muted mb-0">Sessions</p>
                  <h2 className="mt-4 ff-secondary fw-semibold">
                    <span className="counter-value" data-target="97.66">
                      {dataSessions}
                    </span>
                  </h2>
                  <p className="mb-0 text-muted">
                    {flagSessions === true ? (
                      <>
                        {" "}
                        <span className="badge bg-light text-success mb-0">
                          <i className="ri-arrow-up-line align-middle"></i>
                          {increasePercentageSessions}%
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="badge bg-light text-danger mb-0">
                          <i className="ri-arrow-down-line align-middle"></i>
                          {increasePercentageSessions}%
                        </span>
                      </>
                    )}
                    vs. previous month
                  </p>
                </div>
                <div>
                  <div className="avatar-sm flex-shrink-0">
                    <span className="avatar-title bg-soft-info rounded-circle fs-2">
                      <FeatherIcon icon="activity" className="text-info" />
                    </span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex justify-content-between">
                <div>
                  <p className="fw-medium text-muted mb-0">PageViews</p>
                  <h2 className="mt-4 ff-secondary fw-semibold">
                    <span className="counter-value" data-target="3">
                     
                      {dataPageViews}
                    </span>
                  </h2>
                  <p className="mb-0 text-muted">
                    <span className="badge bg-light text-danger mb-0">
                      {flagPageViews === true ? (
                        <>
                          {" "}
                          <span className="badge bg-light text-success mb-0">
                            <i className="ri-arrow-up-line align-middle"></i>
                            {increasePercentagePageViews}%
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="badge bg-light text-danger mb-0">
                            <i className="ri-arrow-down-line align-middle"></i>
                            {increasePercentagePageViews}%
                          </span>
                        </>
                      )}
                    </span>{" "}
                    vs. previous month
                  </p>
                </div>
                <div>
                  <div className="avatar-sm flex-shrink-0">
                    <span className="avatar-title bg-soft-info rounded-circle fs-2">
                      <FeatherIcon icon="clock" className="text-info" />
                    </span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex justify-content-between">
                <div>
                  <p className="fw-medium text-muted mb-0">OrganicSearches</p>
                  <h2 className="mt-4 ff-secondary fw-semibold">
                    <span className="counter-value" data-target="33.48">
                    
                      {dataSearchs}
                    </span>
                  </h2>
                  <p className="mb-0 text-muted">
                    <span className="badge bg-light text-success mb-0">
                      {flagSearchs === true ? (
                        <>
                          {" "}
                          <span className="badge bg-light text-success mb-0">
                            <i className="ri-arrow-up-line align-middle"></i>
                            {increasePercentageSearchs}%
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="badge bg-light text-danger mb-0">
                            <i className="ri-arrow-down-line align-middle"></i>
                            {increasePercentageSearchs}%
                          </span>
                        </>
                      )}
                    </span>{" "}
                    vs. previous month
                  </p>
                </div>
                <div>
                  <div className="avatar-sm flex-shrink-0">
                    <span className="avatar-title bg-soft-info rounded-circle fs-2">
                      <FeatherIcon icon="external-link" className="text-info" />
                    </span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    
    </React.Fragment>
  );
};

export default Widget;