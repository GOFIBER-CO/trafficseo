import React, {
  createRef,
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./Posts.module.css";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { BiDotsHorizontalRounded, BiShowAlt } from "react-icons/bi";
import { BsYoutube } from "react-icons/bs";

import TimeAgo from "react-timeago";
import viStrings from "react-timeago/lib/language-strings/vi";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { AuthContext } from "@/context/AuthContext";
import { SocketContext } from "@/context/SocketContext";
import { Modal, Tooltip } from "antd";
import { FaSpinner, FaUserCheck } from "react-icons/fa";
import { MdDeleteOutline, MdOutlinePendingActions } from "react-icons/md";
import { createComment, deleteComment } from "@/api/post";
import { getPagingComment } from "@/api/post";
import moment from "moment";
const formatter = buildFormatter(viStrings);
import "moment/locale/vi";
moment.locale("vi");
const PostItem = ({
  _id,
  content,
  userCompleted,
  createdAt,
  quantity,
  quantityEveryDay,
  userId,
  running,
  openReportPost,
  handleDelete,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpenComment, setDropdownOpenComment] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const toggleComment = () => setDropdownOpenComment((prevState) => !prevState);
  const [modal, contextHolder] = Modal.useModal();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const messageRef = useRef(null);
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const getListComments = async () => {
    const result = await getPagingComment(_id, 10000, 1);
    setComments(result);
  };
  useEffect(() => {
    getListComments();
  }, [_id]);
  useEffect(() => {
    socket?.on("new comment", (data) => {
      getListComments();
      messageRef?.current?.scrollIntoView({ behavior: "smooth" });
      // if (data?.postId?.toString() === _id.toString())
      //   setComments((prev) => [...prev, data]);
    });

    return () => socket?.removeAllListeners();
  }, [socket]);
  const confirm = (id) => {
    modal.confirm({
      title: "Xóa bài viết",
      content: "Bạn có chắc chắc muốn xóa bài viết này",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk() {
        handleDelete(id);
      },
    });
  };

  const confirmDeleteComment = (id) => {
    modal.confirm({
      title: "Xóa bình luận",
      content: "Bạn có chắc chắc muốn bình luận này",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk() {
        deleteComment(id);
        getPagingComment(_id);
      },
    });
  };
  const commentPost = async () => {
    const result = await createComment({
      postId: _id,
      content: comment,
      userId: user?._id,
    });
    if (result?._id) {
      getListComments();
      messageRef.current?.scrollIntoView({ behavior: "smooth" });
      setComment("");
    }
  };
  return (
    <div className={`${styles["container"]} w-100 mt-3 py-3`}>
      <div className="d-flex w-100 justify-content-between align-items-center px-3 py-2">
        <div className="d-flex align-items-center">
          <div className="relative">
            <img
              src={userId?.avatar}
              alt="Avatar"
              className={`${styles["avatar"]} rounded-circle`}
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="d-flex flex-column ms-2">
            <div className="fw-semibold">
              <a href={"#"} target="_blank" style={{ color: "black" }}>
                {userId?.username}
              </a>
            </div>
            <span className={styles["post-info"]}>
              {/* <span className="me-3">
                <TimeAgo date={createdAt} formatter={formatter} />
              </span> */}
              <span>Điểm: {new Intl.NumberFormat().format(userId?.point)}</span>
            </span>
          </div>
        </div>

        <div className={styles["action-button"]}>
          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle
              tag="span"
              data-toggle="dropdown"
              aria-expanded={dropdownOpen}
            >
              <BiDotsHorizontalRounded />
            </DropdownToggle>

            <DropdownMenu>
              <DropdownItem onClick={() => openReportPost(_id)}>
                Cảnh báo
              </DropdownItem>
            
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div className="px-3 py-2" style={{ textAlign: "justify" }}>
        <div
          id="anhzo"
          className="post-content"
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      </div>

      <div className="py-2 px-3">
        <div className={styles["post-action"]}>
          <div className="d-flex mt-2">
            <Tooltip title="Số lần đã thực hiện">
              <div className={styles["post-action-button"]}>
                <FaUserCheck color="green" />
                <span className="ms-2 fs-6 fw-semibold">
                  {userCompleted?.length}
                </span>
              </div>
            </Tooltip>
            <Tooltip title="Số lượt còn lại">
              <div className={styles["post-action-button"]}>
                <MdOutlinePendingActions color="blue" />
                <span className="ms-2 fs-6 fw-semibold">
                  {parseInt(quantityEveryDay) - userCompleted?.length}
                </span>
              </div>
            </Tooltip>
            <Tooltip title="Số người đang chạy">
              <div className={styles["post-action-button"]}>
                <FaSpinner color="blue" />
                <span className="ms-2 fs-6 fw-semibold">
                  {running?.length || 0}
                </span>
              </div>
            </Tooltip>
            <div className={styles["post-action-button"]}>
              <BsYoutube />
              <span className="ms-2 fs-6 fw-semibold">Subscibe</span>
            </div>
          </div>
        </div>
      </div>
      <div className="py-2 px-3">
        <div className={styles["container-comments"]}>
          {comments?.map((item) => (
            <div
              key={item?._id}
              className="d-flex w-100 justify-content-between align-items-center px-2"
            >
              <div className="d-flex ms-2 py-3">
                <img
                  src={item?.userId?.avatar}
                  alt="Avatar"
                  className="rounded-circle"
                  style={{
                    width: "2.25rem",
                    height: "2.25rem",
                  }}
                />
                <div>
                  <div className="d-flex align-text-start gap-3">
                    <div className="fw-semibold ms-2 d-flex align-text-start">
                      {item?.userId?.username}
                    </div>
                    <div>{moment(item?.createdAt).fromNow()}</div>
                  </div>
                  <div className={`ms-2`}>
                    <span>{item?.content}</span>
                  </div>
                </div>
              </div>
              {user?._id === item?.userId?._id && (
                <MdDeleteOutline
                  size={25}
                  color="red"
                  cursor={"pointer"}
                  onClick={() => confirmDeleteComment(item?._id)}
                />
              )}
            </div>
          ))}
          {/* <div ref={messageRef} /> */}
        </div>
        <div className="d-flex ms-2 py-2">
          <img
            src={user?.avatar}
            alt="Avatar"
            className="rounded-circle"
            style={{
              width: "2.25rem",
              height: "2.25rem",
            }}
          />
          <div className={`${styles["comment-input"]} ms-2`}>
            <input
              type="text"
              value={comment}
              placeholder="Bình luận"
              style={{ color: "black" }}
              onChange={(e) => setComment(e.target?.value)}
              onKeyDown={(e) => {
                if (e?.keyCode === 13) commentPost();
              }}
            />
          </div>
          <Button className="d-flex ms-2" onClick={() => commentPost()}>
            Bình luận
          </Button>
        </div>
      </div>
      {contextHolder}
    </div>
  );
};

export default memo(PostItem);
