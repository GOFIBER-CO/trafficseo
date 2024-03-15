import React, { useCallback, useContext, useEffect, useState } from "react";
import CreatePost from "./CreatePost";
import PostItem from "./PostItem";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import styles from "./Posts.module.css";
import {
  createPost,
  createReport,
  deletePost,
  getPaginatedPosts,
  getQuantityResetPost,
} from "@/api/post";
import "react-datepicker/dist/react-datepicker.css";
import InfiniteScroll from "react-infinite-scroll-component";
import vi from "date-fns/locale/vi";
import PostLoadMore from "./PostLoadMore";
import EndPost from "./EndPost";
import { ToastContainer, toast } from "react-toastify";
import { SocketContext } from "@/context/SocketContext";
import { AuthContext } from "@/context/AuthContext";
import { getPagingBrand } from "@/api/profile";
import ReactDatePicker from "react-datepicker";
import moment from "moment";
const VALUE_REPEAT_POST = [
  {
    value: 1,
    label: "1 ( Vào lúc 12h )",
  },
  {
    value: 2,
    label: "2 ( Vào lúc 8h và 16h )",
  },
  {
    value: 3,
    label: "3 ( Vào lúc 6h, 12h và 18h )",
  },
  {
    value: 5,
    label: "5 ( Vào lúc 4h, 8h, 12h, 16h và 20h )",
  },
];
const Posts = () => {
  const DateCompleted = new Date();

  // add a day
  DateCompleted.setDate(DateCompleted.getDate() + 1);
  const { user, getLoggedinUser } = useContext(AuthContext);
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [repeat, setRepeat] = useState(0);
  const [openReportPost, setOpenReportPost] = useState(false);
  const [brand, setBrand] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [postId, setPostId] = useState("");
  const socket = useContext(SocketContext);
  const [postContent, setPostContent] = useState("");
  const [postQuantity, setPostQuantity] = useState();
  const [quantityTotal, setQuantityTotal] = useState();
  const [quantityEveryDay, setQuantityEveryDay] = useState();
  const [startDate, setStartDate] = useState(new Date(DateCompleted));
  const [reportPostContent, setReportPostContent] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPage, setTotalPage] = useState(10);
  const [maxRepeatPost, setMaxRepeatPost] = useState(1);
  const [posts, setPosts] = useState([]);
  const toggle = useCallback(() => {
    if (user?.acceptPost === true) {
      setOpenCreatePost(!openCreatePost);
    } else {
      toast.warning("Bạn không có quyền đăng bài!");
    }
  }, [openCreatePost]);
  const openReportPostModal = useCallback((postId) => {
    setOpenReportPost(true), setPostId(postId);
  }, []);
  const getBrand = async () => {
    const brands = await getPagingBrand();
    setBrand(brands.data?.data);
  };
  const getMaxRepeatPost = async () => {
    const dataRepeat = await getQuantityResetPost();

    setMaxRepeatPost(dataRepeat?.data?.quantity || 0);
  };
  const toggleReportPostModal = useCallback(() => {
    setOpenReportPost(!openReportPost);
  }, [openReportPost]);

  const getPost = async () => {
    try {
      const posts = await getPaginatedPosts(10, 1);
      setPosts(posts.data);
      setTotalPage(posts.totalPages);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    socket?.on("createPost", (data) => {
      getPost();
    });

    return () => socket?.removeAllListeners();
  }, [socket]);
  useEffect(() => {
    getPost();
    getMaxRepeatPost();
    getBrand();
  }, []);

  useEffect(() => {
    const timmerId = window.setInterval(() => {
      getPost();
    }, 30000);

    return () => window.clearInterval(timmerId);
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await deletePost(id);
      if (res?.status === 1) {
        await getPost();
        toast.success("Xóa bài viết thành công");
      } else {
        toast.error("Xóa bài viết thất bại");
      }
    } catch (error) {
      toast.error("Xóa bài viết thất bại");
    }
  };

  const handleLoadMore = async () => {
    const res = await getPaginatedPosts(10, pageIndex + 1);
    setPosts([...posts, ...res.data]);
    setPageIndex(pageIndex + 1);
  };

  const handleChange = useCallback((e) => {
    const input = e.target.value?.replace(/[D&\/\\,+()$~%'":*?<>{}]/g, "");
    setPostContent(input);
  }, []);

  const handleChangeQuantity = useCallback((e) => {
    setPostQuantity(e.target.value);
  }, []);

  const handleReportPostContentChange = useCallback((e) => {
    setReportPostContent(e.target.value);
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      if (postContent === "" || !quantityTotal || !quantityEveryDay) {
        toast.warning("Vui lòng điền đầy đủ thông tin!");
        return;
      }
      if (!selectedBrand) {
        toast.warning("Vui lòng chọn brand!");
        return;
      }
      const [keyword, domain] = postContent?.split("###");
      let regex = new RegExp(
        /^(?!-)[A-Za-z0-9-]+([\-\.]{1}[a-z0-9]+)*\.[A-Za-z]{2,}$/
      );
      if (!keyword || !domain) {
        return toast.error("Bài viết không hợp lệ!");
      }
    //   if (regex.test(domain) === false) {
    //     return toast.error("Domain không hợp lệ!");
    //   }
      const newPost = await createPost({
        content: postContent,
        quantity: postQuantity,
        quantityTotal,
        quantityEveryDay,
        repeat,
        brand: selectedBrand,
        team: selectedTeam,
        dateCompleted: moment(startDate).toISOString(),
      });
      if (newPost?.status === 1) {
        // setPosts([newPost?.data, ...posts]);
        toast.success(
          "Đăng bài viết thành công. Bài viết của bạn cần phải được duyệt!"
        );
        toggle();
        setSelectedBrand(null);
        setPostContent("");
        setPostQuantity(0);
        setSelectedTeam();
        setQuantityEveryDay(0);
        setQuantityTotal(0);
      } else {
        toast.error(newPost?.message || "Đăng bài viết thất bại");
      }
    } catch (error) {
      toast.error("Đăng bài viết thất bại");
    }
  }, [
    postContent,
    postQuantity,
    toggle,
    posts,
    selectedBrand,
    selectedTeam,
    quantityTotal,
    quantityEveryDay,
  ]);

  const handleReport = useCallback(async () => {
    try {
      const data = {
        postId: postId,
        reason: reportPostContent,
      };

      await createReport(data);
      toast.success("Cảnh báo bài viết thành công");
    } catch (error) {
      toast.error("Cảnh báo bài viết thất bại");
    }
    toggleReportPostModal();
  }, [postId, reportPostContent, toggleReportPostModal]);

  return (
    <div className="col-11 col-lg-6 col-xl-6 col-md-11 col-sm-11  mb-5 pb-3">
      <CreatePost toggle={toggle} user={user} />
      <InfiniteScroll
        dataLength={posts?.length}
        next={handleLoadMore}
        hasMore={pageIndex < totalPage}
        style={{ overflow: "hidden" }}
        loader={<PostLoadMore />}
        endMessage={<EndPost />}
      >
        {posts.map((post) => (
          <PostItem
            key={post?._id}
            {...post}
            openReportPost={openReportPostModal}
            handleDelete={handleDelete}
          />
        ))}
      </InfiniteScroll>
      <Modal
        isOpen={openCreatePost}
        toggle={toggle}
        // className={className}
        centered
        backdrop={true}
        // keyboard={keyboard}
      >
        <ModalHeader className={styles["modal-header"]} toggle={toggle}>
          Tạo bài đăng
        </ModalHeader>
        <ModalBody>
          <textarea
            className={`w-100 h-100 ${styles["post-content-input"]} rounded p-2`}
            rows={8}
            placeholder={`Nhập 1 link dạng: keywords###domain.com
VD: iphone 14 pro max###topzone.vn`}
            value={postContent}
            onChange={handleChange}
            style={{ color: "black" }}
          ></textarea>

          <div className="grid">
            <label>Traffic mỗi ngày</label>
            <input
              className={`w-100 h-100 rounded p-2 ${styles["post-quantity-input"]} mt-1`}
              placeholder={`Số lượng mỗi ngày (*)`}
              value={quantityEveryDay}
              onChange={(e) => setQuantityEveryDay(e.target.value)}
              type="number"
              style={{ color: "black" }}
            />
          </div>
          <div className="grid mt-2">
            <label>Traffic tổng</label>
            <input
              className={`w-100 h-100 rounded p-2 ${styles["post-quantity-input"]}`}
              placeholder={`Số lượng tổng (*)`}
              value={quantityTotal}
              onChange={(e) => setQuantityTotal(e.target.value)}
              type="number"
              style={{ color: "black" }}
            />
          </div>
          <div className="grid mt-2">
            <label>Xoay vòng bài viết</label>
            <select
              className="form-select mt-1"
              aria-label="Default select example"
              required
              defaultValue={1}
              onChange={(e) => setRepeat(e.target.value)}
            >
              <option value={0}>Xoay vòng bài viết</option>
              {VALUE_REPEAT_POST?.map(
                (item) =>
                  item?.value <= maxRepeatPost && (
                    <option key={item?.value} value={item?.value}>
                      {item?.label}
                    </option>
                  )
              )}
            </select>
          </div>
          <div className="grid mt-2">
            <label>Brand</label>
            <select
              className="form-select mt-1"
              aria-label="Chọn brand"
              required
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option selected value={selectedBrand}>
                Chọn brand
              </option>
              {brand?.map((item) => (
                <option key={item?._id} value={item?._id}>
                  {item?.name}
                </option>
              ))}
            </select>
          </div>

          {user?.team?.length > 1 && (
            <div className="grid mt-2">
              <label>Team</label>
              <select
                className="form-select mt-1"
                aria-label="Chọn team"
                required
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
              >
                <option selected>Chọn team</option>
                {user?.team?.map((item) => (
                  <option key={item?._id} value={item?._id}>
                    {item?.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="grid">
            <label className="">Thời gian hoàn thành</label>
            <ReactDatePicker
              locale={vi}
              className={`${styles["date-completed"]} mt-2 w-100 border p-1`}
              selected={startDate}
              minDate={new Date()}
              dateFormat={"dd-MM-yyyy"}
              onChange={(date) => setStartDate(date)}
            ></ReactDatePicker>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" className="w-100" onClick={handleSubmit}>
            Đăng bài
          </Button>
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={openReportPost}
        toggle={toggleReportPostModal}
        // className={className}
        centered
        backdrop={true}
        // keyboard={keyboard}
      >
        <ModalHeader
          className={styles["modal-header"]}
          toggle={toggleReportPostModal}
        >
          Cảnh báo
        </ModalHeader>
        <ModalBody>
          <textarea
            className={`w-100 h-100 ${styles["post-content-input"]} rounded p-2`}
            rows={8}
            placeholder={`Lý do`}
            value={reportPostContent}
            onChange={handleReportPostContentChange}
            style={{ color: "black" }}
          ></textarea>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" className="w-100" onClick={handleReport}>
            Cảnh báo
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Posts;
