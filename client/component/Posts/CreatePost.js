import React, { memo } from "react";
import styles from "./Posts.module.css";
import { BiArrowToTop } from "react-icons/bi";

const CreatePost = ({ toggle, user }) => {
  return (
    <div className={`${styles["container"]} w-100 px-3 mt-3`}>
      <div className={`d-flex justify-content-between ms-3 p-2 fw-semibold`}>
        <div>
          <span>Điểm: </span>
          <span>{new Intl.NumberFormat().format(user?.point)}</span>
        </div>

        <div>
          <span>Cảnh báo: </span>
          <span>{user?.report || 0}</span>
        </div>
      </div>
      <div className={`${styles["input-container"]} d-flex p-2`}>
        <img
          src={user?.avatar}
          alt="Avatar"
          className={`rounded-circle ${styles["avatar"]}`}
          referrerPolicy="no-referrer"
        />
        <div
          className={`ms-3 ${
            !user?.acceptPost && user?.roleOfUser?.name !== "btv"
              ? styles["not-allowed"]
              : ""
          } ${styles["post-input"]}`}
          onClick={() => toggle()}
        >
          <span>Đăng một bài viết mới...!</span>
        </div>
      </div>
    </div>
  );
};

export default memo(CreatePost);
