import React from "react";
import { Button as BtnAntd } from "antd";
import "./index.scss";

const TagComp = (props) => {
  return (
    <div className="tagComp">
      <span>{props?.content?.text}</span>
      <BtnAntd
        style={{ padding: "0", marginLeft: "3px" }}
        onClick={() => props?.onRemove(props?.id)}
      >
        <i className="ri-close-line"></i>
      </BtnAntd>
    </div>
  );
};
export default TagComp;
