import React from "react";
import styles from "./ChatSidebar.module.css";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import Link from "next/link";

const MessageItem = ({ message }) => {
  return (
    <div className="d-flex py-2 ms-2">
      <img
        src={message?.from?.avatar}
        alt="Avatar"
        className="rounded-circle"
        style={{
          width: "2.25rem",
          height: "2.25rem",
        }}
        referrerPolicy="no-referrer"
      />
      <div className="ms-2">
        <div className={styles["message-content-container"]}>
          <Link href="#">
            <span className="fw-semibold">{message?.from?.username}</span>
          </Link>
          {message?.type === "image" ? (
            <span>
              <Zoom>
                <img
                  className={styles["message-image"]}
                  src={`https://api.trafficsseo.com/${message?.urlPath}`}
                />
              </Zoom>
            </span>
          ) : (
            <span dangerouslySetInnerHTML={{ __html: message?.content }}></span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
