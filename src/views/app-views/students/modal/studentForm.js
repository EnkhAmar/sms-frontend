import {
  Form,
  Select,
  Col,
  Input,
  InputNumber,
  Collapse,
  Button,
  DatePicker
} from 'antd';
import { TUGRUG, ADMIN, SUPERADMIN, REGISTER_REGEX } from 'constants/AppConstant';
import { CITIES as cities } from "constants/AddressConstant";
import '../studentStyles.css'

const { Option } = Select
const { Panel } = Collapse;

const StudentForm = ({
  handleCancel,
  role,
  type,
  schools,
  branches,
  getBranches,
  fields,
  loading,
  handleNewStudent,
  handleEditStudent
}) => {
  return (
    <Form
      {...{
        labelCol: { span: 24 },
        wrapperCol: { span: 24 },
      }}
      name="Student Form"
      fields={fields}
      onFinish={type === 'add' ? handleNewStudent : handleEditStudent}
    >
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
                style={{ width: "100%"}}
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
            label="First Name"
            name="firstname"
            rules={[{ required: true, message: 'Please enter first name!'}]}
          >
            <Input placeholder="Enter First Name" />
          </Form.Item>
        </div>
        <div className="flex-1 name">
          <Form.Item
            label="Last Name"
            name="lastname"
          >
            <Input placeholder="Enter Last Name" />
          </Form.Item>
        </div>
      </div>

      <div className="flex gap-5">
        <div className="flex-1">
          <Form.Item
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

      <Collapse bordered={false}>
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
        <Col style={{ textAlign: 'right', marginTop: 20 }}>
        <Button onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="primary" loading={loading} htmlType="submit" style={{ marginLeft: 8 }}>
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

export default StudentForm;
