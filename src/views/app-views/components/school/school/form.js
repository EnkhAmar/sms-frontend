import {
	Form,
	Input,
	Upload,
	Select,
  Button,
	Row,
  Col,
	Radio,
} from 'antd';
import {
	UploadOutlined,
} from '@ant-design/icons';
import './styles.css';
const { Option } = Select;

const SchoolForm = ({handleCancel, handleSubmit, props, logoProps, handleUpdate, fields, type, submit}) => (
  <Form
    {...{
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
    }}
    onFinish={type==='add' ? handleSubmit : handleUpdate}
    name="School Form"
		fields={fields}
  >
    <Form.Item
      label="School Name"
      name="name"
      rules={[{ required: true, message: 'Please input school name!' }]}
    >
      <Input placeholder="Enter School Name" />
    </Form.Item>

    <Form.Item
      label="Description"
      name="description"
			rules={[{ max: 128, message: 'Description cannot be more than 128 characters!' }]}
    >
      <Input placeholder="Enter School Description" />
    </Form.Item>

    <Form.Item
      label="Address"
      name="address"
    >
      <Input placeholder="Enter School Address" />
    </Form.Item>

    <Form.Item
      label="Website"
      name="website"
    >
      <Input placeholder="Enter School Website" />
    </Form.Item>

    <div className="flex">
			<div className="flex-1">
	      <Form.Item
	        label="Image"
	        name="image"
	      >
	        <Upload {...props} multiple={false} accept="image/*">
	          <Button>
	            <UploadOutlined /> Select Image
	          </Button>
	        </Upload>
	      </Form.Item>
			</div>
			<div className="flex-1">
	      <Form.Item
	        label="Logo"
	        name="logo"
	      >
	        <Upload {...logoProps} multiple={false} accept="image/*">
	          <Button>
	            <UploadOutlined /> Select Logo
	          </Button>
	        </Upload>
	      </Form.Item>
			</div>
    </div>

    <Form.Item
      label="Color"
      name="color"
    >
			<Radio.Group name="color" className="radio-group" buttonStyle="solid">
				<Radio.Button className="radio-button" value="#ef476f" style={{backgroundColor: "#ef476f"}} ></Radio.Button>
				<Radio.Button className="radio-button" value="#ffd166" style={{backgroundColor: "#ffd166"}} ></Radio.Button>
				<Radio.Button className="radio-button" value="#06d6a0" style={{backgroundColor: "#06d6a0"}} ></Radio.Button>
				<Radio.Button className="radio-button" value="#457b9d" style={{backgroundColor: "#457b9d"}} ></Radio.Button>
				<Radio.Button className="radio-button" value="#6d597a" style={{backgroundColor: "#6d597a"}} ></Radio.Button>
				<Radio.Button className="radio-button" value="#073b4c" style={{backgroundColor: "#073b4c"}} ></Radio.Button>
				<Radio.Button className="radio-button" value="#a44a3f" style={{backgroundColor: "#a44a3f"}} ></Radio.Button>
			</Radio.Group>
    </Form.Item>

    <Form.Item>
      <Col style={{ textAlign: 'right' }}>
      <Button onClick={handleCancel}>
        Cancel
      </Button>
      <Button type="primary" loading={submit} htmlType="submit" style={{ marginLeft: 8 }}>
        {
					type==='add' ?
					"Submit"
					:
					"Save"
				}
      </Button>
      </Col>
    </Form.Item>
  </Form>
)

export default SchoolForm;
