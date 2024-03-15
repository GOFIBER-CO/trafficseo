import React from "react";
import styles from "./Posts.module.css";
import { IoShieldCheckmarkOutline } from "react-icons/io5";

const EndPost = () => {
  return (
    <div className={`${styles["container"]} w-100 mt-3 py-3`}>
      <div className="d-flex flex-column w-100 justify-content-center align-items-center px-3 py-2">
        <IoShieldCheckmarkOutline size={64} color="green" />
        <h3>Bạn đã xem hết tin</h3>
      </div>
    </div>
  );
};

export default EndPost;
