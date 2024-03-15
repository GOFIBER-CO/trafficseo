import {
  Button,
  Card,
  Checkbox,
  Modal,
  Select,
  Spin,
  message,
  notification,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
  addCategory,
  addSchema,
  addTag,
  createPost,
  deleteSchema,
  editPost,
  getAllCate,
  getAllSchemas,
  getAllTag,
  getAllUsers,
  getPagingBrand,
  getPostById,
  getPostBySlug,
  getpagingDomains,
} from "../../helpers/helper";

import { Editor } from "@tinymce/tinymce-react";
import { MdOutlineEdit } from "react-icons/md";
import { error, success } from "../../Components/Common/message";
import toSlug from "../../common/function";
import { getListImageBunny, uploadFileToBunny } from "../../helpers/api_bunny";
import useDebounce from "../../helpers/useDebounce";
import TagComp from "./tag";
import { PictureOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
const { Meta } = Card;

const { Option } = Select;

const initialData = {
  _id: "",
  title: "",
  domains: [],
  categories: [],
  tags: [],
  views: 0,
  likes: 0,
  status: 0,
  userid: "",
  thumb: "",
  thumbAlt: "",
  content: "",
  keyword: [],
  slug: "",
  description: "",
  post_schemaid: [],
  isNoIndex: false,
  isNoFollow: false,
  isTOC: false,
  questions: [],
};

function CreateEditPost() {
  const [isLoading, setIsLoading] = useState(false);
  const [schemaList, setSchemaList] = useState([]);
  const [schemas, setSchemas] = useState([]);
  const [posts, setPosts] = useState([]);
  const [domain, setDomain] = useState([]);
  const [user, setUser] = useState([]);
  const [cateList, setCateList] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [keyword, setFocusKeyword] = useState([]);
  const [formTax, setFormTax] = useState([]);
  const [mediaList, setMediaList] = useState([]);
  const [formAdd, setFormAdd] = useState(initialData);
  const [isNoIndex, setIsNoIndex] = useState(false);
  const [isNoFollow, setIsNoFollow] = useState(false);
  const [isTOC, setIsTOC] = useState(false);
  const editorDescriptionRef = useRef(null);
  const editorContentRef = useRef(null);
  // const [slugValue, setSlugVlue] = useState();
  const [isModalAddSchemaVisible, setIsModalVisible] = useState(false);
  const [isModalEditImage, setIsModalEditImage] = useState(false);
  const [isModalChooseImage, setIsModalChooseImage] = useState(false);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [imageChoose, setImageChoose] = useState();

  const [questions, setQuestions] = useState([{ question: "", answer: "" }]);
  const [brand, setBrand] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState();
  const getBrand = async () => {
    const brands = await getPagingBrand();
    setBrand(brands.data);
  };
  const location = useLocation();
  const id = location?.state?.id || "";
  const authUser = sessionStorage.getItem("authUser")
    ? JSON.parse(sessionStorage.getItem("authUser"))
    : null;
  const { slug } = useParams();
  const history = useHistory();

  const slugDebounce = useDebounce(formAdd.slug, 300);

  useEffect(() => {
    if (!slug && slugDebounce) {
      if (slugDebounce) {
        getPostBySlug(slugDebounce)
          .then((res) => {
            if (Object.keys(res).length > 0) {
              setFormAdd({
                ...res,
                id: res?._id,
                thumb: res.thumb,
                thumbAlt: res.thumbAlt || "",
                status: res.status,
                categories: res.categories?.map((i) => i._id),
                tags: res.tags?.map((i) => i._id),
                keyword: res.keyword,
                isNoFollow: res?.isNoFollow,
                isNoIndex: res?.isNoIndex,
                isTOC: res?.isTOC,
                post_schemaid: res.post_schemaid?.map((i) => i._id),
                userid: res.userid?.id,
                faqPage: res?.faqPage || {},
                questions: res?.questions,
              });
              setIsNoIndex(res?.isNoIndex);
              setIsNoFollow(res?.isNoFollow);
              setIsTOC(res?.isTOC);
              const KeyFocus = res?.keyword?.map((item, i) => ({
                id: new Date().getTime() + i,
                text: item,
              }));
              setFocusKeyword(KeyFocus);
            } else {
              setFormAdd({
                ...formAdd,
                _id: "",
              });
            }
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
          });
      }
    }
  }, [slugDebounce, slug]);

  // console.log(formAdd);
  const [formSchema, setFormSchema] = useState({
    schema_type: "",
    schema_script: "",
    post_id: [],
    page_id: [],
  });
  useEffect(() => {
    getPagingBrand("", 100, 1);
  }, []);
  const getPost = async (id) => {
    const result = await getPostById(id);

    const res = result?.data;
    setFormAdd({
      ...res,
      id: res?._id,
      thumb: res.thumb,
      thumbAlt: res.thumbAlt || "",
      status: res.status,
      categories: res.categories?.map((i) => i._id),
      tags: res.tags?.map((i) => i._id),
      keyword: res.keyword,
      isNoFollow: res?.isNoFollow,
      isNoIndex: res?.isNoIndex,
      isTOC: res?.isTOC,
      post_schemaid: res.post_schemaid?.map((i) => i._id),
      faqPage: res?.faqPage || {},
      questions: res?.questions,
    });

    setIsNoIndex(res?.isNoIndex);
    setIsNoFollow(res?.isNoFollow);
    setIsTOC(res?.isTOC);
    const KeyFocus = res?.keyword?.map((item, i) => ({
      id: new Date().getTime() + i,
      text: item,
    }));
    setFocusKeyword(KeyFocus);
    // setFormAdd(result?.data);

    // const dataKeyWord = result?.data?.keyword;

    // setFocusKeyword(dataKeyWord);
  };
  // useEffect(() => {
  //   if (id) {
  //     getPost(id);
  //   }
  // }, [id]);
  const handleChangeEditorDescription = async (value, editor) => {
    const p = document.createElement("p");
    p.innerHTML = value;
    const description = p.innerText;
    formAdd.description = description;
  };
  const handleChangeEditorContent = async (value, editor) => {
    // const p = document.createElement("p");
    // p.innerHTML = value;
    // const content = p.innerText;
    console.log(value);
    formAdd.content = value;
  };
  const getSchemas = () => {
    getAllSchemas().then((res) => {
      setSchemas(res);
    });
  };
  const convertHtmlText = (htmlText) => {
    if (htmlText && htmlText.length > 0) {
      let strText =
        new DOMParser().parseFromString(htmlText, "text/html").documentElement
          .textContent || "";
      return strText;
    }
    return "";
  };
  useEffect(() => {
    setIsLoading(true);
    if (!authUser) {
      notification["error"]({
        message: "System error",
        description: "Vui lòng đăng nhập lại",
      });
      setIsLoading(false);
    }
    if (slug) {
      getPostBySlug(slug)
        .then((res) => {
          setFormAdd({
            ...res,
            id: res?._id,
            thumb: res.thumb,
            thumbAlt: res.thumbAlt || "",
            status: res.status,
            categories: res.categories?.map((i) => i._id),
            tags: res.tags?.map((i) => i._id),
            keyword: res.keyword,
            isNoFollow: res?.isNoFollow,
            isNoIndex: res?.isNoIndex,
            isTOC: res?.isTOC,
            post_schemaid: res.post_schemaid?.map((i) => i._id),
            userid: res.userid?.id,
            faqPage: res?.faqPage || {},
            questions: res?.questions,
          });
          setIsNoIndex(res?.isNoIndex);
          setIsNoFollow(res?.isNoFollow);
          setIsTOC(res?.isTOC);
          const KeyFocus = res?.keyword?.map((item, i) => ({
            id: new Date().getTime() + i,
            text: item,
          }));
          setFocusKeyword(KeyFocus);
          setIsLoading(false);
        })
        .catch((error) => {
          notification["error"]({
            message: "System error",
            description: error,
          });
          setIsLoading(false);
        });
    }
    // getPostXML().then((res) => {
    //   if (res && res.length > 0) {
    //     setPosts(res);
    //   }
    // });
    // getAllSchemas()
    //   .then((res) => {
    //     const formatRes = res.map((item) => {
    //       item.schema_script = convertHtmlText(item.schema_script);
    //       return item;
    //     });
    //     setSchemaList(formatRes);
    //     setIsLoading(false);
    //     //return getAllTaxonomies();
    //   })
    //   // .then((res) => {
    //   //   setTaxList(res);
    //   //   //setIsLoading(false);
    //   // })
    //   .catch((error) => {
    //     setIsLoading(false);\
    //     notification["error"]({
    //       message: "System error",
    //       description: error,
    //     });
    //   });
    getDomains();
    getCate();
    getTags();
    getUsers();
  }, []);
  const getDomains = async () => {
    const result = await getpagingDomains(10000, 1, "");
    if (result) {
      setDomain(result?.data);
    }
  };
  const getUsers = async () => {
    const result = await getAllUsers();
    if (result) {
      setUser(result);
    }
  };
  const getCate = () => {
    getAllCate().then((cateList) => {
      setCateList(cateList);
      setIsLoading(false);
    });
  };
  const getTags = () => {
    getAllTag().then((tagList) => {
      setTagList(tagList);
      setIsLoading(false);
    });
  };

  const handleAddNewTag = async (listTagForm) => {
    let newTagList = await Promise.all(
      listTagForm &&
        listTagForm.map(async (item) => {
          if (!tagList.tags.find((a) => a._id === item)) {
            let dataReq = {
              name: item,
              slug: toSlug(item),
              id: Math.random(),
            };
            await addTag(dataReq).then((tag) => {
              item = tag?.newTag?._id;
            });
            return item;
          } else {
            return item;
          }
        })
    );
    return newTagList;
  };

  const handleOpenChooseImage = () => {
    getListImageBunny().then((res) => {
      if (res.HttpCode === 401) {
        setMediaList();
      } else {
        setMediaList(res);
      }
    });
    setIsModalChooseImage(true);
  };

  const handleAddNewTax = async (listTaxForm) => {
    let newTaxList = await Promise.all(
      listTaxForm &&
        listTaxForm.map(async (item) => {
          if (!cateList?.categories?.find((a) => a._id === item)) {
            let dataReq = {
              name: item,
              slug: toSlug(item),
              id: Math.random(),
              isNoFlow: true,
              isNoIndex: true,
              isShow: true,
              description: item,
            };
            await addCategory(dataReq).then((tax) => {
              item = tax?.newCategory?._id;
            });
            return item;
          } else {
            return item;
          }
        })
    );
    return newTaxList;
  };

  const handleChooseImage = () => {
    setFormAdd({
      ...formAdd,
      thumb: `https://gofiber.b-cdn.net/Admin/${imageChoose}`,
    });
    setIsModalChooseImage(false);
  };

  const onSave = async () => {
    let newTaxList = await handleAddNewTax(formAdd.categories);
    let newTagList = await handleAddNewTag(formAdd.tags);
    setIsLoading(true);

    const data = {
      type: "post",
      title: formAdd.title,
      slug: formAdd.slug,
      thumb: formAdd.thumb,
      thumbAlt: formAdd.thumbAlt,
      guid: "",
      status: formAdd.status,
      domains: formAdd.domains,
      // commentStatus: false,
      categories: newTaxList,
      tags: newTagList,
      views: formAdd.views,
      likes: formAdd.likes,
      description: formAdd.description,
      content: formAdd.content,
      keyword: formAdd.keyword,
      isNoFollow: formAdd.isNoFollow,
      isNoIndex: formAdd.isNoIndex,
      isTOC: formAdd.isTOC,
      userid: formAdd.userid,
      questions: formAdd.questions,
    };

    if (formAdd._id !== "") {
      // update
      editPost(formAdd._id, data)
        .then((res) => {
          if (res.success === true) {
            // notification["success"]({
            //   message: "Notification",
            //   description: "Create post successfully!",
            // });
            message.success("Lưu thành công");
          }

          setIsLoading(false);
          //   history.push('/posts');
        })
        .catch((error) => {
          setIsLoading(false);
          notification["error"]({
            message: "System error",
            description: error,
          });
        });
    } else if (id) {
      // update
      editPost(id, data)
        .then((res) => {
          if (res.success === true) {
            // notification["success"]({
            //   message: "Notification",
            //   description: "Create post successfully!",
            // });
            message.success("Lưu thành công");
          }

          setIsLoading(false);
          //   history.push('/posts');
        })
        .catch((error) => {
          setIsLoading(false);
          notification["error"]({
            message: "System error",
            description: error,
          });
        });
    } else {
      //Lưu
      // return;
      setIsLoading(true);
      createPost(data)
        .then((res) => {
          if (res.status === -2) {
            throw new Error(res.error);
          }
          setIsLoading(false);
          notification["success"]({
            message: "Notification",
            description: "Create post successfully!",
          });
          history.push("/posts");
        })
        .catch((error) => {
          setIsLoading(false);
          notification["error"]({
            message: "System error",
            description: error,
          });
        });
    }
  };
  const onBack = () => {
    history.goBack();
  };
  const onInputChange = async (e) => {
    formAdd[e.target.name] = e.target.value;
    setFormAdd(formAdd);
    if (e.target.name === "title") {
      setFormAdd({
        ...formAdd,
        thumbAlt: e.target.value,
      });
      if (!slug) {
        setFormAdd({
          ...formAdd,
          slug: toSlug(e.target.value),
        });
      }

      // setSlugVlue(toSlug(e.target.value));
    }

    let file = e.target.files ? e.target.files[0] : null;

    if (file) {
      uploadFileToBunny(file).then((res) => {
        if (res.HttpCode === 201) {
          setFormAdd({
            ...formAdd,
            [e.target.name]: "https://gofiber.b-cdn.net/Admin/" + file.name,
          });
        }
      });
    }
  };
  //domain
  const onDomainChange = (value) => {
    setFormAdd({
      ...formAdd,
      domains: value,
    });
  };

  const onUserChange = (value) => {
    setFormAdd({
      ...formAdd,
      userid: value,
    });
  };

  const onCheckboxChange = async (e) => {
    formAdd[e.target.name] = !formAdd[e.target.name];
    if (e.target.name === "isNoIndex") setIsNoIndex(!isNoIndex);
    if (e.target.name === "isNoFollow") setIsNoFollow(!isNoFollow);
    if (e.target.name === "isTOC") setIsTOC(!isTOC);

    // setIsNoIndex(!isNoIndex);
    // console.log(`formAdd`, formAdd);
    // console.log(e.target.checked);
  };
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);

      reader.onerror = (error) => reject(error);
    });
  const onSchemaInputChange = (e) => {
    setFormSchema({
      ...formSchema,
      [e.target.name]: e.target.value,
    });
  };
  const onChangeStatus = (e) => {
    setFormAdd({
      ...formAdd,
      status: e,
    });
  };

  const onDescriptionChange = (value) => {
    setFormAdd({
      ...formAdd,
      description: value,
    });
  };

  const onSchemaChange = (value) => {
    setFormAdd({
      ...formAdd,
      post_schemaid: value,
    });
  };
  const onTaxChange = (value) => {
    setFormAdd({
      ...formAdd,
      categories: value,
    });
  };

  const onTagChange = (value) => {
    setFormAdd({
      ...formAdd,
      tags: value,
    });
    // console.log(`form`, formAdd);
  };
  const onPostChange = (e) => {
    // console.log(e);
    setFormSchema({
      ...formSchema,
      _id: e,
    });
  };
  const addNewSchema = () => {
    addSchema({ ...formSchema, post_id: formSchema.post_id.join(",") })
      .then((res) => {
        success();
        setIsModalVisible(false);
        getSchemas();
        setFormSchema({
          schema_type: "",
          schema_script: "",
          post_id: [],
        });
      })
      .catch((err) => {
        error();
      });
  };

  const removeSchema = () => {
    // console.log('formSchema.post_schemaid: ', formAdd.post_schemaid);
    if (formAdd.post_schemaid && formAdd.post_schemaid.length) {
      formAdd.post_schemaid.split(",").forEach((id) => {
        deleteSchema(id)
          .then((res) => {
            getSchemas();
            success();
          })
          .catch((er) => {
            error();
          });
      });
      setTimeout(() => {
        setFormAdd({
          ...formAdd,
          post_schemaid: "",
        });
      }, 1000);
      setConfirmModalVisible(false);
    }
  };
  const handleSubmitKeyword = (e) => {
    console.log(e);
  };
  const onPressKeyfocus = (e) => {
    if (e.key === "Enter" && e.target.value) {
      setFocusKeyword([
        ...keyword,
        { id: new Date().getTime(), text: e.target.value },
      ]);
      const txtValues = keyword.map((item) => item.text);
      setFormAdd({
        ...formAdd,
        keyword: [...txtValues, e.target.value],
      });
      e.target.value = "";
    }
  };
  const onRemoveKeyfocus = (id) => {
    const rates = keyword.filter((item) => item.id !== id);
    setFocusKeyword(rates);
    const txtValues = rates.map((item) => item.text);
    setFormAdd({
      ...formAdd,
      keyword: txtValues,
    });
  };

  const breadCrumbTitle = id ? "Sửa" : "Thêm mới";

  function handleQuestionChange(index, event, action) {
    const newQuestions = [...formAdd.questions];
    if (action === "delete") {
      newQuestions.splice(index, 1);
    } else {
      newQuestions[index][event.target.name] = event.target.value;
    }
    // setQuestions(newQuestions);
    setFormAdd({
      ...formAdd,
      questions: newQuestions,
    });
  }

  function addQuestion() {
    const newQuestions = [...formAdd.questions, { question: "", answer: "" }];
    // setQuestions(newQuestions);
    setFormAdd({
      ...formAdd,
      questions: newQuestions,
    });
  }

  return (
    <>
      <Spin spinning={isLoading}>
        <div className="page-content">
          <BreadCrumb
            title={breadCrumbTitle}
            pageTitle="Bài viết"
            slug="posts"
          />
          <div style={{ marginLeft: "10px" }}>
            <Form onSubmit={onSave}>
              <Row>
                <Col lg={12}>
                  <Label className="mb-1">Domains</Label>
                  <FormGroup>
                    <Select
                      mode="multiple"
                      style={{ width: "100%" }}
                      placeholder="Please select"
                      onChange={onDomainChange}
                      value={formAdd.domains || []}
                    >
                      {domain &&
                        domain?.map((item) => (
                          <Option key={item._id}>{item?.host} </Option>
                        ))}
                    </Select>
                  </FormGroup>
                </Col>
                <Col lg={12}>
                  <FormGroup rules={[{ required: true }]}>
                    <Label className="mb-1" for="title">
                      Tiêu đề
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Title"
                      type="title"
                      defaultValue={formAdd.title || ""}
                      onChange={onInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col lg={12}>
                  <FormGroup>
                    <Label className="mb-1" for="slug">
                      Đường dẫn tĩnh
                    </Label>
                    <Input
                      id="slug"
                      name="slug"
                      placeholder="Slug"
                      type="slug"
                      defaultValue={formAdd.slug || ""}
                      onChange={onInputChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col lg={3}>
                  <FormGroup>
                    <Label className="mb-1" for="views">
                      Views
                    </Label>
                    <Input
                      id="views"
                      name="views"
                      placeholder="Views"
                      type="number"
                      defaultValue={formAdd.views || ""}
                      onChange={onInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col lg={3}>
                  <FormGroup>
                    <Label className="mb-1" for="likes">
                      Likes
                    </Label>
                    <Input
                      id="likes"
                      name="likes"
                      placeholder="Likes"
                      type="number"
                      defaultValue={formAdd.likes || ""}
                      onChange={onInputChange}
                    />
                  </FormGroup>
                </Col>

                <Col lg={12}>
                  <FormGroup>
                    <Label className="mb-1" for="description">
                      Mô tả
                    </Label>

                    {/* <TextArea style={{minHeight}}/> */}
                  </FormGroup>
                </Col>

                <Col lg={12}>
                  <FormGroup>
                    <Label className="mb-1" for="status">
                      Trạng thái
                    </Label>
                    <Select
                      value={formAdd.status}
                      // key={formAdd.status}
                      style={{ width: "100%" }}
                      onChange={onChangeStatus}
                    >
                      <Option label="Đăng ngay" key={1} value={1}>
                        Đăng ngay
                      </Option>
                      <Option label="Nháp" key={-1} value={-1}>
                        Nháp
                      </Option>
                      <Option label="Chờ xét duyệt" key={0} value={0}>
                        Chờ xét duyệt
                      </Option>
                    </Select>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </div>
          <Row>
            <Col style={{ marginLeft: "10px", marginTop: "10px" }}>
              <Button style={{ marginRight: "10px" }} onClick={onBack}>
                Quay lại
              </Button>
              <Button type="primary" onClick={onSave}>
                Lưu
              </Button>
            </Col>
          </Row>
        </div>
      </Spin>

      <Modal
        title="Thêm mới schema"
        okText="Save"
        visible={isModalAddSchemaVisible}
        onOk={addNewSchema}
        onCancel={() => setIsModalVisible(false)}
        width="680px"
      >
        <div>
          <Form>
            <Row>
              <Col lg={6}>
                <FormGroup>
                  <Label className="mb-1" for="schema_type">
                    Loại
                  </Label>
                  <Input
                    id="schema_type"
                    name="schema_type"
                    placeholder="Schema type"
                    type="text"
                    value={formSchema.schema_type}
                    onChange={onSchemaInputChange}
                  />
                </FormGroup>
              </Col>
              <Col lg={6}>
                <FormGroup>
                  <Label className="mb-1" for="schema_script">
                    Đoạn mã
                  </Label>
                  <Input
                    id="schema_script"
                    name="schema_script"
                    placeholder="Schema script"
                    type="text"
                    value={formSchema.schema_script}
                    onChange={onSchemaInputChange}
                  />
                </FormGroup>
              </Col>
              <Col lg={12}>
                <FormGroup>
                  <Label className="mb-1" for="post_id">
                    Bài viết
                  </Label>
                  <Select
                    mode="multiple"
                    size="large"
                    name="post_id"
                    id="post_id"
                    value={formSchema.post_id}
                    onChange={onPostChange}
                    placeholder="Posts"
                    style={{ width: "100%" }}
                  >
                    {posts &&
                      posts.length > 0 &&
                      posts?.map((post) => {
                        return (
                          <Option key={post._id} value={post._id}>
                            {post.title}
                          </Option>
                        );
                      })}
                  </Select>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>

      <Modal
        title="Confirm to delete"
        visible={isConfirmModalVisible}
        onOk={removeSchema}
        onCancel={() => setConfirmModalVisible(false)}
      >
        <p>Are you sure to delete this faq?</p>
      </Modal>

      <Modal
        title="Chỉnh sửa hình ảnh"
        open={isModalEditImage}
        // onOk={removeSchema}
        footer={
          <>
            <Button type="primary" onClick={() => setIsModalEditImage(false)}>
              OK
            </Button>
          </>
        }
        onCancel={() => setIsModalEditImage(false)}
      >
        <Form>
          <FormGroup>
            <Label className="mb-1" for="post_id">
              Văn bản thay thế
            </Label>
            <Input
              className="mt-2"
              style={{ minHeight: "100px" }}
              type="textarea"
              placeholder="Nhập văn bản thay thế"
              id="thumbAlt"
              name="thumbAlt"
              defaultValue={formAdd.thumbAlt || ""}
              onChange={onInputChange}
            />
          </FormGroup>
        </Form>
      </Modal>
      <Modal
        title="Chọn ảnh từ thư viện"
        open={isModalChooseImage}
        onOk={handleChooseImage}
        width={1200}
        onCancel={() => setIsModalChooseImage(false)}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            overflow: "scroll",
            maxHeight: 700,
          }}
        >
          {mediaList?.map((img) => {
            return (
              <Card
                key={img.Guid}
                hoverable
                style={{
                  width: 150,
                  margin: 16,
                  border: `${
                    imageChoose === img.ObjectName ? "3px solid green" : "0"
                  }`,
                }}
                onClick={() => {
                  setImageChoose(img.ObjectName);
                }}
                cover={
                  <div style={{ overflow: "hidden", height: 150 }}>
                    <img
                      alt="example"
                      style={{ height: "100%" }}
                      src={`https://gofiber.b-cdn.net/Admin/${img.ObjectName}`}
                    />
                  </div>
                }
              >
                <Meta title={img.ObjectName} />
              </Card>
            );
          })}
        </div>
      </Modal>
    </>
  );
}

export default CreateEditPost;
