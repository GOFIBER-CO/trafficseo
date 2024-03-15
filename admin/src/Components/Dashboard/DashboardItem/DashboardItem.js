import React, { useEffect, useState } from "react";

import { ggAnalytics, ggAnalyticsGraph } from "../../../helpers/helper";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';




export default function DashboardItem() {
  const [metric, setMetric] = useState("ga:users");
  const [start, setStart] = useState("60daysAgo");
  const [end, setEnd] = useState("today");
  const [datas, setDatas] = useState({});

  useEffect(() => {
    getListAnalytics();
  }, []);

  const getListAnalytics = () => {
    getUser();
  };
  const getUser = () => {
    const arrValue = [];

    ggAnalyticsGraph(metric)
      .then((res) => {
        res && res.data && res.data["ga:users"].map((item, index) => {
          let itemValue = {
            name : item.start,
            value : item.value
          };
          arrValue.push(itemValue); 
        });
        setDatas({
          labels: arrValue,
        
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };


  return (
    <div>
      <h4 style={{marginLeft: "180px"}}>Người dùng truy cập</h4>
      <LineChart
      width={500}
      height={300}
      data={datas.labels}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
     
      <Line type="monotone" dataKey="value" stroke="#82ca9d" />
    </LineChart>
    </div>
  );
}