import {
	Form,
	Input,
	Upload,
	Select,
  Button,
	Row,
  Col,
	Radio,
	Switch,
	InputNumber,
} from 'antd';
import {
	UploadOutlined,
} from '@ant-design/icons';
import { TUGRUG, ADMIN, SUPERADMIN } from 'constants/AppConstant';
import Flex from 'components/shared-components/Flex';
import './styles.css';
const { Option } = Select;

const LessonForm = ({handleCancel, handleSubmit, fields, handleUpdate, type, branches, schools, getBranches, submit}) => (
  <Form
    {...{
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
    }}
    onFinish={type==='add' ? handleSubmit : handleUpdate}
    name="Lesson Form"
		fields={fields}
  >

		<div className="flex gap-5">
			<div className="flex-1">
		    <Form.Item
		      label="Lesson Name"
		      name="name"
		      rules={[{ required: true, message: 'Please input lesson name!' }]}
		    >
		      <Input placeholder="Enter Lesson Name" />
		    </Form.Item>
			</div>
			<div className="flex-1">
		    <Form.Item
		      label="Short Name"
		      name="short_name"
					rules={[{ required: true, message: 'Please input lesson short name!' }]}
		    >
		      <Input placeholder="Enter Lesson Short Name" />
		    </Form.Item>
			</div>
		</div>

		{
			schools && schools.length > 0 && type==="add" ?
			<div className="flex gap-5">
				<div className="flex-1">
					<Form.Item
					label="School"
					name="school"
					rules={[{ required: true, message: 'Please select a school!' }]}
					>
						<Select
							showSearch
							style={{ width: "100%" }}
							placeholder="Select a school"
							onChange={getBranches}
							filterOption={(input, option) =>
	              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
	            }
						>
						{
							schools.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
						}
						</Select>
					</Form.Item>
				</div>
				<div className="flex-1">
					<Form.Item
					label="Branch"
					name="branch"
					rules={[{ required: true, message: 'Please select a branch!' }]}
					>
						<Select
							showSearch
							style={{ width: "100%" }}
							placeholder="Select a branch"
							disabled={branches ? false : true}
							filterOption={(input, option) =>
		      			option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
		    			}
						>
						{
							branches ?
							branches.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
							:
							null
						}
						</Select>
					</Form.Item>
				</div>
			</div> :
			null
		}

		{
			branches && branches.length > 0 && schools===null && type==="add" ?
			<Form.Item
			label="Branch"
			name="branch"
			rules={[{ required: true, message: 'Please select a branch!' }]}
			>
				<Select
					showSearch
					style={{ width: "100%" }}
					placeholder="Select a branch"
					filterOption={(input, option) =>
      			option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    			}
				>
				{
					branches.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
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
      <Input placeholder="Enter Lesson Detail" />
    </Form.Item>

		<div className="flex gap-5">
			<div className="flex-1">
		    <Form.Item
		      label="Price"
		      name="price"
					rules={[{ required: true, message: 'Please input lesson price!'}]}
		    >
		      <InputNumber type="number" min={1} max={4294967295} placeholder="Enter Lesson Price" style={{width: "100%"}}/>
		    </Form.Item>
			</div>
			<div className="flex-1">
		    <Form.Item
		      label="Exam"
		      name="exam"
		    >
	      	<InputNumber type="number" min={0} placeholder="Enter Lesson Exam" style={{width: "100%"}} />
		    </Form.Item>
			</div>
		</div>

		<div className="flex gap-5">
			<div className="flex-1">
				<Form.Item
					label="Sort"
					name="sort"
				>
					<InputNumber type="number" min="0" placeholder="Enter Lesson Sort" style={{width: "100%"}} />
				</Form.Item>
			</div>
			<div className="flex-1">
				<Form.Item
					label="Interval"
					name="interval"
				>
					<InputNumber type="number" min="0" placeholder="Enter Lesson Interval" style={{width: "100%"}} />
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
					'Submit'
					:
					'Save'
				}
      </Button>
      </Col>
    </Form.Item>
  </Form>
)

export default LessonForm;
