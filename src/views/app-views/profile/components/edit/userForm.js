import {
  Form,
  Upload,
  Button,
  Input,
  Collapse,
  InputNumber,
  Col,
  DatePicker,
  Select
} from 'antd'
import {
  UploadOutlined,
  LockOutlined,
} from '@ant-design/icons'
import { REGISTER_REGEX } from 'constants/AppConstant'
import { CITIES as cities } from "constants/AddressConstant"

const { Panel } = Collapse
const { Option } = Select

const rules = {
	firstname: [
		{
			required: true,
			message: 'Please input your first name'
		}
	],
	lastname: [
		{
			required: true,
			message: 'Please input your last name'
		}
	],
	email: [
		{
			required: false,
			message: 'Please input your email address'
		},
		{
			type: 'email',
			message: 'Please enter a validate email!'
		}
	],
	phone: [
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
			if (!value || !first_value) {
				return Promise.reject('Phone number must start with 8 or 9')
			}
			if (!value || num_digits !== 8) {
				return Promise.reject('Phone number must be 8 digits')
			}
			if (!value || first_value && num_digits === 8) {
				return Promise.resolve()
			}
			return Promise.reject('Please provide valid phone number')
			}
		})
	],
	password: [
		{
		required: true,
		message: 'Please input your password'
		}
	],
	confirmPassword: [
		{
			required: true,
			message: 'Please confirm your password!'
		},
		({ getFieldValue }) => ({
			validator(rule, value) {
				if (!value || getFieldValue('password') === value) {
					return Promise.resolve();
				}
				return Promise.reject('Passwords do not match!');
			},
		})
	]
}

const UserForm = ({
  fields,
  handleFormSubmit,
  handleCancel,
  submitLoading,
  props
}) => {
  return (
    <Form
      fields={fields}
      layout="vertical"
      onFinish={handleFormSubmit}
      style={{marginTop: 5}}
    >
      <div className="flex gap-5">
        <div className="flex-1">
          <Form.Item name="image" label="Profile Image">
            <Upload {...props}>
              <Button>
                <UploadOutlined /> Select File
              </Button>
            </Upload>
          </Form.Item>
        </div>
      </div>

      <div className="flex gap-5">
        <div className="flex-1">
          <Form.Item name="firstname" label="First name" rules={rules.firstname}>
            <Input placeholder="Enter First Name" />
          </Form.Item>
        </div>
        <div className="flex-1">
          <Form.Item name="lastname" label="Last name" >
            <Input placeholder="Enter Last Name" />
          </Form.Item>
        </div>
      </div>

      <div className="flex gap-5">
        <div className="flex-1">
          <Form.Item name="email" label="Email" rules={rules.email}>
            <Input placeholder="Enter Email" />
          </Form.Item>
        </div>
        <div className="flex-1">
          <Form.Item name="phone" label="Phone" rules={rules.phone}>
            <InputNumber placeholder="Enter phone" style={{ width: '100%' }} />
          </Form.Item>
        </div>
      </div>

      <Collapse bordered={false} style={{marginBottom: 20}}>
        <Panel header="Reset Password" key="1">
          <div className="flex gap-5">
            <div className="flex-1">
              <Form.Item
                className="flex-1"
                name="password"
                label="Password"
                rules={rules.password}
                hasFeedback
              >
                <Input.Password
                  prefix={<LockOutlined className="text-primary" />}
                  placeholder="Enter Password"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </div>
            <div className="flex-1">
              <Form.Item
                className="flex-1"
                name="confirmPassword"
                label="Confirm Password"
                rules={rules.confirmPassword}
                hasFeedback
              >
                <Input.Password
                  prefix={<LockOutlined className="text-primary" />}
                  placeholder="Confirm Password"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </div>
          </div>
        </Panel>
      </Collapse>

      <Collapse bordered={false} style={{marginBottom: 20}}>
        <Panel header="Optional" key="1">
          <div className="flex gap-5">
            <div className="flex-1">
              <Form.Item
                name="register"
                label="Register Number"
                rules={[
                  {
                    required: false,
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if ((REGISTER_REGEX.test(value) && value.length === 10) || value === null || value === '') {
                        return Promise.resolve()
                      }
                      return Promise.reject('Register must be in correct format!')
                    }
                  })
                ]}
              >
                <Input placeholder="Enter Register Number" style={{ width: "100%" }} />
              </Form.Item>
            </div>
            <div className="flex-1">
              <Form.Item
                name="dob"
                label="Birth Date"
              >
                <DatePicker format={'YYYY-MM-DD'} style={{ width: "100%" }} />
              </Form.Item>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="flex-1">
              <Form.Item
                name="address_city"
                label="City/Province"
              >
                <Select
                  placeholder="Select a city"
                  style={{ width: "100%" }}
                >
                  {
                    cities.map(item => <Option key={item.key} value={item.name}>{item.name}</Option>)
                  }
                </Select>
              </Form.Item>
            </div>
            <div className="flex-1">
              <Form.Item
                name="address_district"
                label="District/Soum"
              >
                <Input placeholder="Enter district" style={{ width: "100%" }} />
              </Form.Item>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="flex-1">
              <Form.Item
                name="address_khoroo"
                label="Khoroo/Bag"
              >
                <Input placeholder="Enter khoroo" />
              </Form.Item>
            </div>
            <div className="flex-1">
              <Form.Item
                name="address_appartment"
                label="Bair/Toot"
              >
                <Input placeholder="Enter Bair / Toot" />
              </Form.Item>
            </div>
          </div>
        </Panel>
      </Collapse>

      <Form.Item>
        <Col style={{ textAlign: 'right' }}>
        <Button onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="primary" loading={submitLoading} htmlType="submit" style={{ marginLeft: 8 }}>
          Save
        </Button>
        </Col>
      </Form.Item>
    </Form>
  )
}

export default UserForm
