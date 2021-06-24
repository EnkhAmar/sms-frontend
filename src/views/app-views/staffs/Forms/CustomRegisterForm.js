import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Row,
  Col,
  Radio,
  DatePicker,
  Select,
  message,
  Spin,
  Alert,
  Checkbox
} from "antd";
import {
  LockOutlined,
  MailOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";
import {
  SUPERADMIN,
  ADMIN,
  OPERATOR,
  TEACHER,
  ACCOUNTANT,
} from "constants/AppConstant";
import { CITIES as cities } from "constants/AddressConstant";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faCrown, faUserTie, faUserGraduate, faPhone, faReceipt } from '@fortawesome/free-solid-svg-icons'
import { motion } from "framer-motion"
import { fetchSchools, fetchBranches } from './fetchData'
import './form.css'

const { Option } = Select;

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
			required: true,
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

const validateMessages = {
  required: "This field is required!",
  types: {
    email: "Not a validate email!",
    number: "Not a validate number!",
  },
  number: {
    range: "Must be between ${min} and ${max}",
  },
};

const getCities = () => {
  const children = [];
  for (let i = 0; i < cities.length; i++) {
    children.push(
      <Option value={`${cities[i].name}`} key={i}>
        {cities[i].name}
      </Option>
    );
  }
  console.log('line 129', children)
  return children;
};

function CustomRegisterForm({
  handleFormSubmit,
  handleChange,
  values,
  form,
  resetFormFields,
  updateStaff,
  setUpdateStaff
}) {
  console.log(values)
  const [expand, setExpand] = useState(false);
  const [schools, setSchools] = useState([]);
  const [branches, setBranches] = useState(null);
  const [loadingSchool, setLoadingSchool] = useState(false)
  const [loadingBranches, setLoadingBranches] = useState(false)

  const user = useSelector((state) => state.userLogin);

  const getSchools = async () => {
    setLoadingSchool(true)

    const res = await fetchSchools(user.token)
    setSchools(res.data.school)

    setLoadingSchool(false)
  };

  const getBranches = async (school) => {
    setLoadingBranches(true)
    form.setFieldsValue({
      branch: null,
    });

    const res = await fetchBranches(user.token, school)

    setBranches(res.data.branch)
  
    setLoadingBranches(false)
  };

  useEffect(() => {
    getSchools();
  }, []);

  const handleSubmit = () => {
    resetFormFields();
    handleFormSubmit();
  };

  const user_role = user.user.role_id;
  let user_school_id;

  if (user_role !== SUPERADMIN) {
    user_school_id = user.user.school;
    values.school = user_school_id;
    getBranches(user_school_id);
    console.log(user_school_id)
  }

  return (
    <>
    <Form
      form={form} layout="vertical"
      className="px-4" name="Staff Form"
      onFinish={() => {
        handleSubmit();
      }}
      validateMessages={validateMessages}
      initialValues={values}
      onValuesChange={handleChange}
    >
      <div style={{ textAlign: "center" }} className="mb-4">
        <Form.Item
          className="flex-1" label="" name="groups">
          <Radio.Group size="medium">
            {user_role === SUPERADMIN && (
              <Radio.Button value={ADMIN} className="choose_role_radio">
                <div className="choose_role_box">
                  <FontAwesomeIcon className="fa-icon" icon={faCrown} />
                  <span className="fa-text">
                    Admin
                  </span>
                </div>
              </Radio.Button>
            )}

            <Radio.Button value={OPERATOR} className="choose_role_radio">
                <div className="choose_role_box">
                  <FontAwesomeIcon className="fa-icon" icon={faPhone} />
                  <span className="fa-text">
                    Operator
                  </span>
                </div>
            </Radio.Button>
            <Radio.Button value={TEACHER} className="choose_role_radio">
                <div className="choose_role_box">
                  <FontAwesomeIcon className="fa-icon" icon={faUserTie} />
                  <span className="fa-text">
                    Teacher
                  </span>
                </div>
            </Radio.Button>
            <Radio.Button value={ACCOUNTANT} className="choose_role_radio">
                <div className="choose_role_box">
                  <FontAwesomeIcon className="fa-icon" icon={faReceipt} />
                  <span className="fa-text">
                    Accountant
                  </span>
                </div>
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
      </div>

      {values.groups === ADMIN ? (
        user_role === SUPERADMIN ? (
          <Row className="gap-5" wrap="true">
            <Form.Item
              className="flex-1"
              label="School"
              name="school"
              rules={[{ required: true }]}
              style={{ width: "100%" }}
            >
              <Select
                showSearch
                placeholder="Select school"
                onSelect={getBranches}
                disabled={!values.groups && !loadingSchool || updateStaff.isUpdate}
                loading={loadingSchool}
              >
                {schools.map((school) => (
                  <Option value={school.id} key={"school" + school.id}>
                    {school.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Row>
        ) : null
      ) : values.groups === OPERATOR ? (
        <Row className="gap-5" wrap="true">
          <Form.Item
            className="flex-1"
            label="School"
            name="school"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              placeholder="Select school"
              // style={{ width: '90%', alignSelf: 'flex-starrt' }}
              onSelect={getBranches}
              disabled={!values.groups && !loadingBranches || updateStaff.isUpdate}
              loading={loadingBranches}
            >
              {schools.map((school) => (
                <Option value={school.id} key={"school" + school.id}>
                  {" "}
                  {school.name}{" "}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            className="flex-1"
            label="Branch"
            name="branch"
            rules={[{ required: true }]}
            style={{ flex: 1 }}
          >
            <Select
              showSearch
              placeholder="Select branch"
              // style={{ width: '80%', alignSelf: 'flex-end' }}
              value={values.branch}
              disabled={!branches || updateStaff.isUpdate}
              allowClear
            >
              {branches &&
                branches.map((branch) => (
                  <Option value={branch.id} key={"branch" + branch.id}>
                    {" "}
                    {branch.name}{" "}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Row>
      ) : values.groups === TEACHER ? (
        <Row className="gap-5" wrap="true">
          <Form.Item
            className="flex-1"
            label="School"
            name="school"
            rules={[{ required: true }]}
            style={{ flex: 1 }}
          >
            <Select
              showSearch
              placeholder="Select school"
              // style={{ width: '90%', alignSelf: 'flex-starrt' }}
              onSelect={getBranches}
              disabled={!values.groups || updateStaff.isUpdate}
            >
              {schools.map((school) => (
                <Option value={school.id} key={"school" + school.id}>
                  {" "}
                  {school.name}{" "}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            className="flex-1"
            label="Branch"
            name="branch"
            rules={[{ required: true }]}
            style={{ flex: 1 }}
          >
            <Select
              showSearch
              placeholder="Select branch"
              // style={{ width: '80%', alignSelf: 'flex-end' }}
              value={values.branch}
              disabled={!branches || updateStaff.isUpdate}
              allowClear
            >
              {branches &&
                branches.map((branch) => (
                  <Option value={branch.id} key={"branch" + branch.id}>
                    {" "}
                    {branch.name}{" "}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Row>
      ) : values.groups === ACCOUNTANT ? (
        <Row className="gap-5" wrap="true">
          <Form.Item
            className="flex-1"
            label="School"
            name="school"
            rules={[{ required: true }]}
            style={{ flex: 1 }}
          >
            <Select
              showSearch
              placeholder="Select school"
              // style={{ width: '90%', alignSelf: 'flex-starrt' }}
              onSelect={getBranches}
              disabled={!values.groups || updateStaff.isUpdate}
            >
              {schools.map((school) => (
                <Option value={school.id} key={"school" + school.id}>
                  {" "}
                  {school.name}{" "}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            className="flex-1"
            label="Branch"
            name="branch"
            rules={[{ required: true }]}
            style={{ flex: 1 }}
          >
            <Select
              showSearch
              placeholder="Select branch"
              // style={{ width: '80%', alignSelf: 'flex-end' }}
              value={values.branch}
              disabled={!branches || updateStaff.isUpdate}
              allowClear
            >
              {branches &&
                branches.map((branch) => (
                  <Option value={branch.id} key={"branch" + branch.id}>
                    {" "}
                    {branch.name}{" "}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Row>
      ) : null}

    {
      values.groups
      && <div>
          <Row className="gap-5">
            <Form.Item
              className="flex-1"
              name="firstname"
              label="First Name"
              rules={rules.firstname}
            >
              <Input placeholder="Enter First Name" disabled={!values.groups} />
            </Form.Item>
            <Form.Item
              className="flex-1"
              name="lastname"
              label="Last Name"
              rules={rules.lastname}
            >
              <Input placeholder="Enter Last Name" disabled={!values.groups} />
            </Form.Item>
          </Row>

          <Row className="gap-5">
            <Form.Item
              className="flex-1"
              name="email"
              label="Email"
              rules={rules.email}
            >
              <Input placeholder="Enter Email" disabled={!values.groups} />
            </Form.Item>
            <Form.Item
              className="flex-1" 
            name="phone" 
            label="Phone" 
            rules={rules.phone}
            // validateStatus="error"
            // help="This number is registered"
            >
              <InputNumber
                type="number"
                placeholder="Enter Phone Number"
                style={{ width: "100%" }}
                disabled={!values.groups}
              />
            </Form.Item>
          </Row>

          {
            updateStaff.isUpdate && 
            <Row className="gap-5 mb-2">
              <Checkbox checked={updateStaff.isPasswordChecked} onChange={() => setUpdateStaff({ ...updateStaff, isPasswordChecked: !updateStaff.isPasswordChecked })}>Forgot password?</Checkbox>
            </Row>
          }


          {
          updateStaff.isUpdate && updateStaff.isPasswordChecked &&  
          <Row className="gap-5">
            <Form.Item
              className="flex-1"
              name="password"
              label="Password"
              rules={rules.password}
              style={{ width: "45%" }}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined className="text-primary" />}
                placeholder="Enter Password"
                disabled={!values.groups}
              />
            </Form.Item>
            <Form.Item
              className="flex-1"
              name="confirmPassword"
              label="Confirm Password"
              rules={rules.confirmPassword}
              style={{ width: "45%" }}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined className="text-primary" />}
                placeholder="Confirm Password"
                disabled={!values.groups}
              />
            </Form.Item>
          </Row>
          }

          {
            !updateStaff.isUpdate && 
            <Row className="gap-5">
            <Form.Item
              className="flex-1"
              name="password"
              label="Password"
              rules={rules.password}
              style={{ width: "45%" }}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined className="text-primary" />}
                placeholder="Enter Password"
                disabled={!values.groups}
              />
            </Form.Item>
            <Form.Item
              className="flex-1"
              name="confirmPassword"
              label="Confirm Password"
              rules={rules.confirmPassword}
              style={{ width: "45%" }}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined className="text-primary" />}
                placeholder="Confirm Password"
                disabled={!values.groups}
              />
            </Form.Item>
          </Row>
          }

          <a onClick={() => setExpand(!expand)} style={{ userSelect: "none" }}>
            {expand ? <UpOutlined /> : <DownOutlined />} Optional
          </a>
          {expand && (
            <div className="pt-3">
              <Row className="gap-5">
                <Form.Item
                  className="flex-1"
                  name="register"
                  label="Register Number"
                  rules={[{ required: false }]}
                >
                  <Input
                    placeholder="Enter Register Number"
                    disabled={!values.groups}
                  />
                </Form.Item>
                <Form.Item
                  className="flex-1"
                  name="dob"
                  label="Birthday"
                  rules={[{ required: false }]}
                  style={{ width: "200px" }}
                >
                  <DatePicker
                    format={'YYYY-MM-DD'}
                    style={{ width: "100%" }}
                    disabled={!values.groups}
                  />
                </Form.Item>
              </Row>
              <Row className="gap-5">
                <Form.Item
                  className="flex-1"
                  name="address_city"
                  label="City/Province"
                  rules={[{ required: false }]}
                  style={{ width: "45%" }}
                >
                  <Select
                    placeholder="Select a city"
                    style={{ width: "100%" }}
                    disabled={!values.groups}
                  >
                    {getCities()}
                  </Select>
                </Form.Item>
                <Form.Item
                  className="flex-1"
                  name="address_district"
                  label="District/Soum"
                  rules={[{ required: false }]}
                  style={{ width: "45%" }}
                >
                  <Input
                    placeholder="Enter district"
                    disabled={!values.groups}
                  />
                </Form.Item>
              </Row>
              <Row className="gap-5">
                <Form.Item
                  className="flex-1"
                  name="address_khoroo"
                  label="Khoroo/Bag"
                  rules={[{ required: false }]}
                >
                  <Input placeholder="Enter khoroo" disabled={!values.groups} />
                </Form.Item>
                <Form.Item
                  className="flex-1"
                  name="address_appartment"
                  label="Bair/Toot"
                  rules={[{ require: false }]}
                >
                  <Input
                    placeholder="Enter Bair / Toot"
                    disabled={!values.groups}
                  />
                </Form.Item>
              </Row>
            </div>
          )}
        </div>
    }
    </Form>
    </>
  );
}

export default CustomRegisterForm;
