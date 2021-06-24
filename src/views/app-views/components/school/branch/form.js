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

const BranchForm = ({handleCancel, handleSubmit, props, schools, type, fields, handleUpdate, submit}) => (
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
      label="Branch Name"
      name="name"
      rules={[{ required: true, message: 'Please input branch name!' }]}
    >
      <Input placeholder="Enter Branch Name" />
    </Form.Item>

		{
			schools && schools.length > 0 ?
			<Form.Item
			label="School"
			name="school"
			rules={[{ required: true, message: 'Please select a school!' }]}
			>
				<Select
					showSearch
					style={{ width: "100%" }}
					placeholder="Select a school"
					filterOption={(input, option) =>
						option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
					}
				>
				{
					schools.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
				}
				</Select>
			</Form.Item> :
			null
		}

		<Form.Item
      label="Description"
      name="description"
			rules={[{ max: 128, message: 'Description cannot be more than 128 characters!' }]}
    >
      <Input placeholder="Enter Branch Description" />
    </Form.Item>

    <Form.Item
      label="Address"
      name="address"
    >
      <Input placeholder="Enter Branch Address" />
    </Form.Item>

    <Form.Item
      label="Website"
      name="website"
    >
      <Input placeholder="Enter Branch Website" />
    </Form.Item>

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
				{	type==="add" ? "Submit" : "Save" }
      </Button>
      </Col>
    </Form.Item>
  </Form>
)

export default BranchForm;
