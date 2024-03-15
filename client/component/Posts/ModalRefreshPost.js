import { useCallback, useEffect, useState } from "react";
import { Button, Modal, Tooltip } from "antd";
import { FcRefresh } from "react-icons/fc";
import { getPagingBrand } from "@/api/profile";
import { createPost, getQuantityResetPost } from "@/api/post";
import styles from "./Posts.module.css";
import { toast } from "react-toastify";
import ReactDatePicker from "react-datepicker";
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
import vi from "date-fns/locale/vi";
const ModalRefreshPost = ({ record, getData }) => {
  const DateCompleted = new Date();
  DateCompleted.setDate(DateCompleted.getDate() + 1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [brand, setBrand] = useState([]);
  const [startDate, setStartDate] = useState(new Date(DateCompleted));
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [repeat, setRepeat] = useState(0);
  const [postQuantity, setPostQuantity] = useState();
  const [quantityEveryDay, setQuantityEveryDay] = useState();
  const [quantityTotal, setQuantityTotal] = useState();
  const [postContent, setPostContent] = useState("");
  const [maxRepeatPost, setMaxRepeatPost] = useState(1);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleChangeQuantity = useCallback((e) => {
    setPostQuantity(e.target.value);
  }, []);
  const handleSubmit = useCallback(async () => {
    try {
      if (postContent === "" || !postQuantity) {
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
      if (regex.test(domain) === false) {
        return toast.error("Domain không hợp lệ!");
      }
      const newPost = await createPost({
        content: postContent,
        quantity: postQuantity,
        repeat,
        brand: selectedBrand,
        dateCompleted: startDate,
        team: record?.team,
        quantityEveryDay,
        quantityTotal,
      });
      if (newPost?.status === 1) {
        toast.success("Đăng bài viết thành công");
        setIsModalOpen(false);
        getData();
      } else {
        toast.error(newPost?.message || "Đăng bài viết thất bại");
      }
    } catch (error) {
      toast.error("Đăng bài viết thất bại");
    }
    handleCancel();
    // setSelectedBrand(null);
    // setPostContent("");
    // setPostQuantity(0);
  }, [
    postContent,
    postQuantity,
    isModalOpen,
    selectedBrand,
    startDate,
    quantityEveryDay,
    quantityTotal,
  ]);
  const handleChange = useCallback((e) => {
    const input = e.target.value?.replace(/[D&\/\\,+()$~%'":*?<>{}]/g, "");
    setPostContent(input);
  }, []);
  const getMaxRepeatPost = async () => {
    const dataRepeat = await getQuantityResetPost();

    setMaxRepeatPost(dataRepeat?.data?.quantity || 0);
  };
  const getBrand = async () => {
    const brands = await getPagingBrand();

    setBrand(brands.data?.data);
  };

  useEffect(() => {
    if (isModalOpen) {
      getMaxRepeatPost();
      getBrand();
    }
  }, [isModalOpen]);
  useEffect(() => {
    setPostContent(record?.content);
    setSelectedBrand(record?.brand);
    setPostQuantity(record?.quantity);
    setQuantityEveryDay(record?.quantityEveryDay);
    setQuantityTotal(record?.quantityTotal);
  }, [record]);
  return (
    <>
      <Tooltip title="Đăng lại bài viết">
        <FcRefresh onClick={showModal} size={20} cursor={"pointer"} />
      </Tooltip>

      <Modal
        title="Đăng lại bài viết"
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCancel}
      >
        <textarea
          className={`w-100 h-100 ${styles["post-content-input"]} rounded p-2`}
          rows={8}
          placeholder={`Nhập 1 link dạng: keywords###domain.com
VD: iphone 14 pro max###topzone.vn`}
          value={postContent}
          onChange={handleChange}
          style={{ color: "black", border: "1px solid #dee2e6" }}
        ></textarea>
        <div className="grid mt-2">
          <label className="fs-6">Traffic mỗi ngày</label>
          <input
            style={{ color: "black", border: "1px solid #dee2e6" }}
            className={`w-100 h-100 rounded p-2 ${styles["post-quantity-input"]}`}
            placeholder={`Số lượng mỗi ngày (*)`}
            value={quantityEveryDay}
            onChange={(e) => setQuantityEveryDay(e.target.value)}
            type="number"
          />
        </div>
        <div className="grid mt-2">
          <label className="fs-6">Traffic tổng</label>
          <input
            style={{ color: "black", border: "1px solid #dee2e6" }}
            className={`w-100 h-100 rounded p-2 ${styles["post-quantity-input"]}`}
            placeholder={`Số lượng tổng (*)`}
            value={quantityTotal}
            onChange={(e) => quantityTotal(e.target.value)}
            type="number"
          />
        </div>
        <div className="grid mt-2">
          <label className="fs-6">Xoay vòng bài viết</label>
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
          <label className="fs-6">Brand</label>
          <select
            className="form-select mt-1"
            aria-label="Chọn brand"
            required
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            <option selected>Chọn brand</option>
            {brand?.map((item) => (
              <option key={item?._id} value={item?._id}>
                {item?.name}
              </option>
            ))}
          </select>
        </div>
        <label className="mr-2">Thời gian hoàn thành</label>
        <ReactDatePicker
          locale={vi}
          className={`${styles["date-completed"]} mt-2 w-100 border p-1`}
          selected={startDate}
          minDate={new Date()}
          dateFormat={"dd-MM-yyyy"}
          onChange={(date) => setStartDate(date)}
        ></ReactDatePicker>
      </Modal>
    </>
  );
};
export default ModalRefreshPost;
