import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  Col,
  Container,
  Input,
  InputGroup,
  Row,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "reactstrap";
import { Select } from "antd";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import "./style.css";
import { getAllCate, getCateParent, updateCate } from "../../helpers/helper";
import { array } from "prop-types";
import { withSuccess } from "antd/lib/modal/confirm";
const { Option } = Select;
function CategoryController() {
  const [cateList, setCateList] = useState([]);
  const [showList, setShowList] = useState([]);
  const [hideList, setHideList] = useState([]);
  const [selectedCate, setSelectedCate] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [index, setIndex] = useState("");
  const getCate = async () => {
    getAllCate().then((res) => {
      setCateList(res);
      let hide = res.filter(
        (item) => item.cateOrder === 0 && item.parent === null
      );
      setHideList(hide);
    });
  };
  const getShowList = async () => {
    const parentList = await getCateParent();
    const listItem =
      parentList &&
      parentList.map((item) => {
        if (item.cateOrder !== 0) {
          return { id: item._id, label: item.name };
        }
      });
    setShowList(listItem);
  };
  const resetCate = () => {
    getCate();
    getShowList();
  };
  console.log("1");

  useEffect(() => {
    getCate();
    getShowList();
    // getHideList();
  }, []);
  const onDragComplete = (result) => {
    if (!result.destination) return;

    const arr = [...showList];
    //Changing the position of Array element
    let removedItem = arr.splice(result.source.index, 1)[0];
    arr.splice(result.destination.index, 0, removedItem);

    //Updating the list
    setShowList(arr);
  };

  const onDragDelete = () => {
    let arr = [...showList];
    let newHide = [...hideList];
    let removeItem = arr.splice(index, 1)[0];
    let item = cateList.find((item) => item._id === removeItem[0].id);
    newHide.push(item);
    setShowList([...arr]);
    setHideList(newHide);
  };
  const addShowList = () => {
    if (selectedCate) {
      let arr = [...showList];
      let hide = [...hideList];
      let item = cateList.find((item) => item._id === selectedCate);
      arr.push({ id: item._id, label: item.name });
      let newHide = hide.filter((z) => z._id !== item._id);
      setHideList(newHide);
      setShowList(arr);
      toggle();
    }
  };

  const toggle = () => {
    setSelectedCate("");
    setIsOpen(!isOpen);
  };
  const errorToggle = () => {
    setError(!error);
  };
  const handleSelectCate = (e) => {
    setSelectedCate(e);
  };
  const handleSubmit = async () => {
    //check hideList and set order === 0
    try {
      let updateHideList = hideList.filter((item) => item.cateOrder !== 0);
      await Promise.all(
        updateHideList &&
          updateHideList.map((item, index) => {
            let data = { cateOrder: 0 };
            updateCate(item._id, data);
          })
      ).then(async () => {
        await Promise.all(
          showList &&
            showList.map((item, index) => {
              let data = { cateOrder: index + 1 };
              updateCate(item.id, data);
            })
        ).then(() => {
          setMessage("Chỉnh sửa thành công!");
          errorToggle();
        });
      });
      //set orderCate for showList
    } catch (error) {
      errorToggle();
      setMessage(error);
    }
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Danh mục" pageTitle="Quản lý danh mục" />
          <div className="container">
            <div className="card">
              <div className="header">
                <h1>
                  Sắp xếp danh mục{" "}
                  <i
                    className="mdi mdi-plus-circle"
                    style={{ cursor: "pointer" }}
                    onClick={toggle}
                  ></i>
                </h1>
              </div>

              <DragDropContext onDragEnd={onDragComplete} on>
                <Droppable droppableId="drag-drop-list" direction="horizontal">
                  {(provided, snapshot) => (
                    <div
                      className="drag-drop-list-container"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {showList &&
                        showList.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.label}
                            index={index}
                          >
                            {(provided) => (
                              <div>
                                <div
                                  className="item-card"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  {/* <span className="material-symbols-outlined">
                                drag_indicator
                              </span> */}
                                  {/* <div className="char-avatar">{item.label}</div> */}
                                  <i
                                    className="mdi mdi-close-circle show_circle"
                                    onClick={() => {
                                      const newShowList = [...showList];
                                      const newHideList = [...hideList];
                                      let a = newShowList.splice(index, 1)[0];
                                      newHideList.push(
                                        cateList.find((x) => x._id === a.id)
                                      );
                                      setHideList(newHideList);
                                      setShowList(newShowList);
                                    }}
                                  ></i>
                                  <p className="label">{item.label}</p>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
            <div>
              <Button size="lg" color="warning" onClick={resetCate}>
                Reset
              </Button>
              <Button
                size="lg"
                style={{ marginLeft: "10px" }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </div>
        </Container>
        <Modal isOpen={isOpen} toggle={toggle}>
          <ModalHeader toggle={toggle}>Add Cate</ModalHeader>
          <ModalBody>
            <Select
              showSearch
              placeholder="Select cate"
              optionFilterProp="children"
              style={{ width: "100%" }}
              value={selectedCate}
              onChange={(e) => handleSelectCate(e)}
            >
              {hideList &&
                hideList.map((item, index) => {
                  return (
                    <Option
                      key={item?._id}
                      value={item?._id}
                      label={item?.name}
                    >
                      {item?.name}
                    </Option>
                  );
                })}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={addShowList}>
              Add
            </Button>{" "}
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={error} toggle={errorToggle}>
          <ModalBody>{message}</ModalBody>
        </Modal>
      </div>
    </React.Fragment>
  );
}

export default CategoryController;
