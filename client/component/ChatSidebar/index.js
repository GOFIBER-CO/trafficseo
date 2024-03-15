import { getPaginatedMessage, sendMessage } from "@/api/message";
import { AuthContext } from "@/context/AuthContext";
import { SocketContext } from "@/context/SocketContext";
import { getInstance } from "@/helper/axios";
import Upload from "rc-upload";
import { useContext, useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";
import InfiniteScroll from "react-infinite-scroll-component";
import PostLoadMore from "../Posts/PostLoadMore";
import styles from "./ChatSidebar.module.css";
import MessageItem from "./MessageItem";
import { Button } from "antd";
import { IoDownloadOutline } from "react-icons/io5";
import Link from "next/link";

const ChatSidebar = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPage, setTotalPage] = useState(10);
  const [messages, setMesages] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const socket = useContext(SocketContext);
  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    const getMessage = async () => {
      const data = await getPaginatedMessage(20, 1);
      setMesages(data?.messages);
      setTotalPage(data?.totalPages);
    };
    getMessage();
  }, []);

  const handleLoadMore = async () => {
    const data = await getPaginatedMessage(20, pageIndex + 1);
    setPageIndex(pageIndex + 1);
    setMesages([...messages, ...data?.messages]);
  };
  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      if (messageContent.trim() === "") return;
      const res = await sendMessage(messageContent);
      if (res.status === 1) {
        const badMessage = {
          _id: new Date(),
          content: "Tin nhắn chứa từ khóa nhạy cảm",
          type: "text",
          from: {
            ...user,
          },
        };
        setMesages([badMessage, ...messages]);
      }
      setMessageContent("");
    }
  };

  useEffect(() => {
    socket?.on("send message", (data) => {
      setMesages((prev) => [data, ...prev]);
    });

    return () => socket?.removeAllListeners();
  }, [socket]);

  return (
    <div
      className="d-none d-lg-flex col col-3 position-fixed"
      style={{ top: 0, left: 0, paddingTop: "3.5rem" }}
    >
      <div className="p-3 w-100" style={{ height: "90vh" }}>
        <div className={styles["container"]}>
          <div className={styles["message-container"]}>
            <div className="px-2 py-2">
              <InfiniteScroll
                dataLength={messages?.length}
                next={handleLoadMore}
                inverse={true}
                hasMore={pageIndex < totalPage}
                height={"75vh"}
                style={{
                  display: "flex",
                  flexDirection: "column-reverse",
                }}
                loader={<PostLoadMore />}
              >
                {messages?.map((message) => (
                  <MessageItem key={message._id} message={message} />
                ))}
              </InfiniteScroll>
            </div>
          </div>
          <div className="w-90 d-flex justify-content-center flex-column">
            <div className={styles["message-input-container"]}>
              <div className={styles["message-input"]}>
                <input
                  type="text"
                  placeholder="Nhập tin nhắn muốn gửi."
                  name="message"
                  id="message"
                  value={messageContent}
                  style={{ color: "black" }}
                  onChange={(e) => {
                    setMessageContent(e.target.value);
                  }}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <span className={`${styles["button-icons"]} p-2`}>
                  <Upload
                    action={"/api/v1/chat/sendImage"}
                    multiple={false}
                    headers={{ Authorization: `Bearer ${token}` }}
                    customRequest={({
                      action,
                      data,
                      file,
                      filename,
                      headers,
                      onError,
                      onProgress,
                      onSuccess,
                      withCredentials,
                    }) => {
                      // EXAMPLE: post form-data with 'axios'
                      // eslint-disable-next-line no-undef
                      const formData = new FormData();
                      formData.append("image", file);

                      getInstance()
                        .post(action, formData, {
                          headers: {
                            ...headers,
                            "Content-Type": "multipart/form-data",
                          },
                        })
                        .then(({ data: response }) => {
                          onSuccess(response, file);
                        })
                        .catch(onError);

                      return {
                        abort() {
                          console.log("upload progress is aborted.");
                        },
                      };
                    }}
                  >
                    <FiUpload />
                  </Upload>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles["privacy-footer"]}>
          <Link href="#">Privacy</Link>

          <Link href="#">Guideline</Link>

          <Link href="#">Affliate</Link>
          <a
            href="https://api.trafficsseo.com/main_v2.zip"
            style={{ lineHeight: 700 }}
            target="_blank"
          >
            <Button
              type="primary"
              shape="round"
              icon={<IoDownloadOutline size={17} />}
              size={"middle"}
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              AI TOOLS
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
