import {
	Form,
	Input,
	Upload,
	Select,
  Button,
  Col,
	Radio,
	Switch,
	InputNumber,
  DatePicker,
	TimePicker,
} from 'antd';
import {
	UploadOutlined,
} from '@ant-design/icons';
import { TUGRUG, ADMIN, SUPERADMIN } from 'constants/AppConstant';
import Flex from 'components/shared-components/Flex';
import './styles.css';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ClassForm = ({
	handleCancel,
	handleSubmit,
	fields,
	handleUpdate,
	type,
	branches,
	schools,
	getBranches,
	lessons,
	teachers,
	role,
	getLessons,
  getTeachers,
	submit,
	setFields,
}) => {
	let startDate = fields.find((item) => item.name[0] === 'start').value;
	let endDate = fields.find((item) => item.name[0] === 'end').value;

	function disabledEndDate(current) {
		if (startDate) {
			return current <= startDate
		} else {
			return null
		}
	}

	function disabledStartDate(current) {
		if (endDate) {
			return current >= endDate;
		} else {
			return null
		}
	}

	return (
		<Form
	    {...{
	      labelCol: { span: 24 },
	      wrapperCol: { span: 24 },
	    }}
	    onFinish={type==='add' ? handleSubmit : handleUpdate}
	    name="Class Form"
			fields={fields}
	  >

	    <Form.Item
	      label="Class Name"
	      name="name"
	      rules={[{ required: true, message: 'Please input class name!' }]}
	    >
	      <Input placeholder="Enter Class Name" />
	    </Form.Item>

			{
				role === SUPERADMIN && type==="add" ?
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
	              placeholder="Select a School"
	              onChange={getBranches}
								loading={schools ? false : true}
	              filterOption={(input, option) =>
	          			option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
	        			}
	            >
							{
								schools ?
								schools.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
								: null
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
								placeholder="Select a Branch"
								disabled={branches ? false : true}
								onChange={(id) => {
									setFields([
										{name: ['lesson'], value: null},
										{name: ['teacher'], value: null},
										{name: ['start'], value: null},
										{name: ['end'], value: null},
									])
									getLessons(id);
									getTeachers(id);
								}}
								filterOption={(input, option) =>
			      			option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
				role === ADMIN && type==="add" ?
				<Form.Item
					label="Branch"
					name="branch"
					rules={[{ required: true, message: 'Please select a branch!' }]}
				>
					<Select
						showSearch
						style={{ width: "100%" }}
						placeholder="Select a Branch"
						loading={branches ? false : true}
						onChange={(id) => {
							getLessons(id);
							getTeachers(id);
						}}
						filterOption={(input, option) =>
	      			option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
	    			}
					>
					{
						branches ?
						branches.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
						: null
					}
					</Select>
				</Form.Item> :
				null
			}

			<div className="flex gap-5">
				<div className="flex-1">
			    <Form.Item
			      label="Lesson"
			      name="lesson"
						rules={[{ required: true, message: 'Please select class lesson!'}]}
			    >
	          <Select
	            showSearch
	            style={{ width: "100%" }}
	            placeholder="Select a Lesson"
							disabled={lessons ? false : true}
	            filterOption={(input, option) =>
	              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
	            }
	          >
	          {
							lessons ?
	            lessons.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
							: null
	          }
	          </Select>
			    </Form.Item>
				</div>
				<div className="flex-1">
			    <Form.Item
			      label="Teacher"
			      name="teacher"
	          rules={[{ required: true, message: 'Please select class teacher!'}]}
			    >
	          <Select
	            showSearch
	            style={{ width: "100%" }}
	            placeholder="Select a Teacher"
							disabled={teachers ? false : true}
	            filterOption={(input, option) => {
								let item = option.children[0] + option.children[1] + option.children[2];
	              return item.toLowerCase().indexOf(input.toLowerCase()) >= 0
							}}
	          >
	          {
							teachers ?
	            teachers.map(item => <Option key={item.id} value={item.id}>{item.firstname} {item.lastname ? item.lastname : ' '}</Option>)
							: null
	          }
	          </Select>
			    </Form.Item>
				</div>
			</div>

	    <div className="flex gap-5">
	      <div className="flex-1">
	        <Form.Item
	          label="Start Date"
	          name="start"
						rules={[{ required: true, message: 'Please select start date!' }]}
	        >
	          <DatePicker
							placeholder="Select Start Date"
							style={{ width: "100%" }}
							disabledDate={disabledStartDate}
							onChange={(value) => startDate = value}
						/>
	        </Form.Item>
	      </div>
	      <div className="flex-1">
	        <Form.Item
	          label="End Date"
	          name="end"
						rules={[{ required: true, message: 'Please select end date!' }]}
	        >
	          <DatePicker
							placeholder="Select End Date"
							style={{ width: "100%" }}
							disabledDate={disabledEndDate}
							onChange={(value) => endDate = value}
						/>
	        </Form.Item>
	      </div>
	    </div>

			<div className="flex gap-5">
	      <div className="flex-1">
	        <Form.Item
	          label="Start Time"
	          name="start_time"
						rules={[{ required: true, message: 'Please select start time!' }]}
	        >
	          <TimePicker placeholder="Select Start Time" format="HH:mm" style={{ width: "100%" }} />
	        </Form.Item>
	      </div>
	      <div className="flex-1">
	        <Form.Item
	          label="End Time"
	          name="end_time"
						rules={[{ required: true, message: 'Please select end time!' }]}
	        >
	          <TimePicker placeholder="Select End Time" format="HH:mm" style={{ width: "100%" }} />
	        </Form.Item>
	      </div>
	    </div>

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
}

export default ClassForm;
