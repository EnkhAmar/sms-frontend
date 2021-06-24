import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Col,
  Button,
  Select,
} from 'antd';
import { SUPERADMIN, ADMIN } from 'constants/AppConstant';
import '../styles.css';

const { Option } = Select;

const AddStudentForm = ({handleSubmit, handleCancel, loading, fields, status, discounts}) => {
  let startDate = fields.find((item) => item.name[0] === 'start_date').value;
	let endDate = fields.find((item) => item.name[0] === 'end_date').value;

	function disabledEndDate(current) {
	  return current <= startDate;
	}

	function disabledStartDate(current) {
	  return current >= endDate;
	}

  return (
    <>
      <Form
        {...{
          labelCol: { span: 24 },
          wrapperCol: { span: 24 },
        }}
        onFinish={handleSubmit}
        name="Student Form"
        fields={fields}
      >
    		<div className="flex gap-5">
    			<div className="flex-1">
    		    <Form.Item
    		      label="First Name"
    		      name="first_name"
    					rules={[{ required: true, message: 'Please enter first name!'}]}
    		    >
              <Input placeholder="Enter First Name" />
    		    </Form.Item>
    			</div>
          <div className="flex-1">
    		    <Form.Item
    		      label="Last Name"
    		      name="last_name"
    		    >
              <Input placeholder="Enter Last Name" />
    		    </Form.Item>
    			</div>
    		</div>

        <div className="flex gap-5">
          <div className="flex-1">
            <Form.Item
              className="flex-1"
              name="email"
              label="Email"
              rules={[
            		{
            			required: true,
            			message: 'Please input your email address'
            		},
            		{
            			type: 'email',
            			message: 'Please enter a validate email!'
            		}
            	]}
            >
              <Input placeholder="Enter Email" />
            </Form.Item>
          </div>
          <div className="flex-1">
            <Form.Item
              className="flex-1"
              name="phone"
              label="Phone"
              rules={[
                {
                  required: true,
                  message: 'Please input your phone number'
                },
                {
                  type: 'number',
                  message: 'Please enter a number'
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    const num_digits = Number(String(value).length)
                    const first_value = Number(String(value)[0]) === 8 || Number(String(value)[0]) === 9
                    if (!value || first_value && num_digits === 8) {
                      return Promise.resolve()
                    }
                    return Promise.reject('Please provide valid phone number')
                  }
                })
              ]}
            >
              <InputNumber
                type="number"
                placeholder="Enter Phone Number"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </div>
        </div>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Please select status!'}]}
        >
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Select Status"
            loading={status ? false : true}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
          {
            status ?
            status.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
            : null
          }
          </Select>
        </Form.Item>

        <Form.Item
          label="Discount"
          name="discount"
        >
          <Select
            mode="multiple"
            showSearch
            style={{ width: "100%" }}
            placeholder="Select Discount"
            loading={discounts ? false : true}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
          {
            discounts ?
            discounts.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
            : null
          }
          </Select>
        </Form.Item>

        <div className="flex gap-5">
          <div className="flex-1">
            <Form.Item
              label="Start Date"
              name="start_date"
              rules={[{ required: true, message: 'Please enter start date!'}]}
            >
              <DatePicker
                placeholder="Select Start Date"
                style={{ width: "100%" }}
                disabledDate={endDate ? disabledStartDate : null}
  							onChange={(value) => startDate = value}
              />
            </Form.Item>
          </div>
          <div className="flex-1">
            <Form.Item
              label="End Date"
              name="end_date"
              rules={[{ required: true, message: 'Please enter end date!'}]}
            >
              <DatePicker
                placeholder="Select End Date"
                style={{ width: "100%" }}
                disabledDate={startDate ? disabledEndDate : null}
  							onChange={(value) => endDate  = value}
              />
            </Form.Item>
          </div>
        </div>

        <Form.Item>
          <Col style={{ textAlign: 'right' }}>
          <Button onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="primary" loading={loading} htmlType="submit" style={{ marginLeft: 8 }}>
            Save
          </Button>
          </Col>
        </Form.Item>
      </Form>
    </>
  )
}

export default AddStudentForm;
