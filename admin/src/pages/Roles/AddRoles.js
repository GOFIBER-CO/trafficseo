import "../../assets/scss/components/_addRole.scss";
import {
  Col,
  Container,
  Input,
  InputGroup,
  InputGroupText,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
} from "reactstrap";
import { useState } from "react";
import { addNewRole } from "../../helpers/helper";

const AddRole = (props) => {
  const [roleName, setRoleName] = useState("");

  return (
    <div className="add-role">
      <div className="add-role-wrapper">
        <h3>Thêm mới</h3>
        <Form>
          <Row>
            <Col lg={12}>
              <FormGroup>
                <Label className="mb-1" for="role">
                  Tên
                </Label>
                <Input
                  id="role"
                  name="role"
                  placeholder="Role"
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              onClick={() => props.closeFunc()}
              style={{ backgroundColor: "#b51b04", border: "none" }}
            >
              Close
            </Button>
            <Button
              onClick={() => props.addFunc(roleName)}
              style={{ marginLeft: "10px" }}
            >
              Save
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddRole;
