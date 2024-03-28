import TextArea from "antd/lib/input/TextArea";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { getQuantityResetPost, updatePost } from "../../../helpers/helper";
import { toast } from "react-toastify";
import { EditOutlined } from "@ant-design/icons";
import { Input, Select } from "antd";
import ReactDatePicker from "react-datepicker";
import moment from "moment";
const VALUE_REPEAT_POST = [
  {
    value: 0,
    label: "Xoay vòng bài viết",
  },
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
const STATUS_POST = [
  {
    value: 0,
    label: "Chờ leader duyệt",
  },
  {
    value: 1,
    label: "Chờ trợ lý duyệt",
  },
  {
    value: 2,
    label: "Đang hoạt động",
  },
  {
    value: 3,
    label: "Đã tắt",
  },
  {
    value: 4,
    label: "Leader từ chối",
  },
  {
    value: 5,
    label: "Trợ lý từ chối",
  },
  {
    value: 6,
    label: "Đã đủ số lượng hôm nay",
  },
];

export default function ModalEditPost({
  record,
  getData,
  brand,
  statusPost,
  teams,
}) {
  const [user, setUser] = useState({});
  const [postContent, setPostContent] = useState(record?.content);
  const [postQuantity, setPostQuantity] = useState(record?.quantity);
  const [quantityEveryDay, setQuantityEveryDay] = useState(
    record?.quantityEveryDay
  );
  const [quantityTotal, setQuantityTotal] = useState(record?.quantityTotal);
  const [status, setStatus] = useState(record?.status);
  const [note, setNote] = useState(record?.note);
  const [selectedBrand, setSelectedBrand] = useState();
  const [team, setTeam] = useState();
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [dateCompleted, setDateCompleted] = useState();
  const [repeat, setRepeat] = useState(1);
  const [maxRepeatPost, setMaxRepeatPost] = useState(1);
  const [optionsRepeat, setOptionsRepeat] = useState([]);
  const [postByTime6h, setPostByTime6h] = useState(0);
  const [postByTime12h, setPostByTime12h] = useState(0);
  const [postByTime18h, setPostByTime18h] = useState(0);

  const updatePostByTime = (value, key) => {
    let newValue = Number(value);
    if (value < 0) {
      newValue = 0;
    }

    if (key === "6h") {
      if (postByTime18h + postByTime12h + newValue > quantityEveryDay) {
        newValue = quantityEveryDay - (postByTime18h + postByTime12h);
      }
      setPostByTime6h(newValue);
      return;
    }

    if (key === "12h") {
      console.log(postByTime18h + postByTime6h + newValue);

      if (postByTime18h + postByTime6h + newValue > quantityEveryDay) {
        newValue = quantityEveryDay - (postByTime18h + postByTime6h);
        console.log(quantityEveryDay - (postByTime18h + postByTime6h));
        console.log(newValue);
      }
      setPostByTime12h(newValue);
      return;
    }

    if (key === "18h") {
      if (postByTime6h + postByTime12h + newValue > quantityEveryDay) {
        newValue = quantityEveryDay - (postByTime6h + postByTime12h);
      }
      setPostByTime18h(newValue);
      return;
    }
  };

  const getMaxRepeatPost = async () => {
    const dataRepeat = await getQuantityResetPost();

    setMaxRepeatPost(dataRepeat?.quantity || 0);
    const data = VALUE_REPEAT_POST?.filter(
      (item) => item?.value <= maxRepeatPost
    );
    setOptionsRepeat(data);
  };
  useEffect(() => {
    if (openCreatePost) {
      setUser(JSON.parse(sessionStorage.getItem("authUser") || []));
      setPostContent(record?.content);
      setPostQuantity(record?.quantity);
      setStatus(record?.status);
      setSelectedBrand(record?.brand?._id);
      setNote(record?.note);
      setQuantityEveryDay(record?.quantityEveryDay);
      setTeam(record?.team);
      setRepeat(record?.repeat);
      setQuantityTotal(record?.quantityTotal);
      setDateCompleted(new Date(record?.dateCompleted));
      setPostByTime6h(record?.postByTime6h || 0);
      setPostByTime12h(record?.postByTime12h || 0);
      setPostByTime18h(record?.postByTime18h || 0);
    }
    getMaxRepeatPost();
  }, [record, openCreatePost]);

  const handleChange = useCallback((e) => {
    setPostContent(e.target.value);
  }, []);

  const toggle = useCallback(
    () => setOpenCreatePost(!openCreatePost),
    [openCreatePost]
  );
  const handleSubmit = async () => {
    if (!selectedBrand) {
      return toast.warning("Vui lòng chọn brand!");
    }
    try {
      const editPost = await updatePost(record?._id, {
        content: postContent,
        quantityEveryDay: quantityEveryDay,
        quantityTotal,
        status: status,
        brand: selectedBrand,
        note: note,
        team: team,
        repeat: repeat,
        dateCompleted: dateCompleted,
        postByTime6h,
        postByTime12h,
        postByTime18h,
      });
      toggle();
      getData();
      toast.success("Cập nhật thành công!");
    } catch (error) {
      console.log(error);
      toast.error("Cập nhật thất bại!");
    }
  };

  return (
    <>
      <EditOutlined
        style={{ color: "blue", fontSize: "20px" }}
        onClick={toggle}
      />
      <Modal
        isOpen={openCreatePost}
        toggle={toggle}
        // className={className}
        centered
        backdrop={true}

        // keyboard={keyboard}
      >
        <ModalHeader className={"modal-header"} toggle={toggle}>
          Chỉnh sửa bài đăng
        </ModalHeader>
        <ModalBody>
          <TextArea
            className={`w-100 h-30 post-content-input`}
            rows={3}
            placeholder={`Điểm nhiều hơn 10k sẽ được ưu tiên hiển thị.
Nhập 3 link dạng: keywords###domain.com`}
            value={postContent}
            onChange={handleChange}
          ></TextArea>
          <div className="grid mt-3">
            <label>Số lượng mỗi ngày</label>
            <Input
              placeholder={`Số lượng mong muốn`}
              value={quantityEveryDay}
              onChange={(e) => setQuantityEveryDay(e.target.value)}
              type="number"
            />
          </div>
          <div className="grid mt-2">
            <label>Số lượng tổng</label>
            <Input
              placeholder={`Số lượng tổng`}
              value={quantityTotal}
              onChange={(e) => setQuantityTotal(e.target.value)}
              type="number"
            />
          </div>
          <div className="grid">
            <label>Brand</label>
            <Select
              className="w-100"
              placeholder="Chọn brand"
              allowClear
              onChange={(value) => setSelectedBrand(value)}
              value={selectedBrand}
              options={brand?.map((item) => {
                return {
                  label: item?.name,
                  value: item?._id,
                };
              })}
            ></Select>
          </div>
          <div className="grid">
            <label>Xoay vòng bài viết</label>
            <Select
              defaultValue={1}
              value={repeat}
              className="w-100"
              placeholder="Xoay vòng bài viết"
              onChange={(value) => setRepeat(value)}
              options={optionsRepeat}
            />
          </div>
          {user?.user?.roleOfUser?.name === "superAdmin" &&
            user?.user?.email !== "sala@okvip.com" &&
            user?.user?.email !== "yonna@okvip.com" && (
              <>
                <div className="grid">
                  <label>Team</label>
                  <Select
                    className="w-100"
                    placeholder="Chọn team"
                    allowClear
                    onChange={(value) => setTeam(value)}
                    value={team}
                    options={teams?.map((item) => {
                      return {
                        label: item?.name,
                        value: item?._id,
                      };
                    })}
                  ></Select>
                </div>
                <div className="grid">
                  <label>Note</label>
                  <TextArea
                    className={`w-100 post-content-input`}
                    placeholder={`Note`}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  ></TextArea>
                </div>
                <div className="grid">
                  <label>Trạng thái</label>
                  <Select
                    placeholder="Trạng thái"
                    className="w-100"
                    value={status}
                    onChange={(value) => setStatus(value)}
                    options={STATUS_POST?.map((item) => {
                      return {
                        label: item?.label,
                        value: item?.value,
                      };
                    })}
                  ></Select>
                </div>
              </>
            )}
          {/* <div className="d-grid">
            <label>Dự kiến hoàn thành</label>
            <ReactDatePicker
              selected={dateCompleted}
              className="w-100"
              placeholder="Thời gian dự kiến hoàn thành"
              dateFormat={"dd-MM-yyyy"}
              onChange={(value) => setDateCompleted(value)}
            />
          </div> */}
          <div className="grid mt-2">
            <label>
              Số lượng bài viết (6h) (Phải nhỏ hơn tổng mỗi ngày và tổng 3 khung
              giờ không vượt quá tổng mỗi ngày)
            </label>
            <Input
              placeholder={`Số lượng bài viết theo giờ (6h)`}
              value={postByTime6h}
              onChange={(e) => updatePostByTime(e.target.value, "6h")}
              type="number"
            />
          </div>
          <div className="grid mt-2">
            <label>
              Số lượng bài viết (12h) (Phải nhỏ hơn tổng mỗi ngày và tổng 3
              khung giờ không vượt quá tổng mỗi ngày)
            </label>
            <Input
              placeholder={`Số lượng bài viết theo giờ (6h)`}
              value={postByTime12h}
              onChange={(e) => updatePostByTime(e.target.value, "12h")}
              type="number"
            />
          </div>
          <div className="grid mt-2">
            <label>
              Số lượng bài viết (18h) (Phải nhỏ hơn tổng mỗi ngày và tổng 3
              khung giờ không vượt quá tổng mỗi ngày)
            </label>
            <Input
              placeholder={`Số lượng bài viết theo giờ (6h)`}
              value={postByTime18h}
              onChange={(e) => updatePostByTime(e.target.value, "18h")}
              type="number"
            />
          </div>
          <div className="d-grid mt-2">
            <label>Số lượng hoàn thành</label>
            {Object.keys(record?.quantityCurrent || {})?.length > 0 ? (
              Object.keys(record?.quantityCurrent || {})?.map((item) => (
                <div key={item}>
                  <span style={{ fontSize: 15, fontWeight: "bold" }}>
                    {item}
                  </span>
                  :{" "}
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: "bold",
                      color: "green",
                    }}
                  >
                    {record?.quantityCurrent[item]}{" "}
                  </span>
                </div>
              ))
            ) : (
              <span className="w-100">Chưa có</span>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            className="w-100"
            onClick={handleSubmit}
            disabled={
              (user?.user?.roleOfUser?.name === "leader" &&
                (record?.status === 0 || record?.status === 1)) === true
            }
          >
            Cập nhật
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
