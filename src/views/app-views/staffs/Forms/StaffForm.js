import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Input, InputNumber, Button , Row, Col, Radio, DatePicker, Select, message } from 'antd'
import { LockOutlined, MailOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import { SUPERADMIN, ADMIN, OPERATOR } from 'constants/AppConstant'
import { url } from 'configs/EnvironmentConfig'
import axios from 'axios'
import { fromPairs } from 'lodash';
import { CITIES as cities } from 'constants/AddressConstant'


const { Option } = Select

// const layout = {
//     labelCol: { span: 8 },
//     wrapperCol: { span: 16 },
//   };
  
  const validateMessages = {
    required: 'This field is required!',
    types: {
      email: 'Not a validate email!',
      number: 'Not a validate number!',
    },
    number: {
      range: 'Must be between ${min} and ${max}',
    },
  };
  
    const onFinish = values => {
       
    }



const printCities = () => {
  cities.map((city, index) => {
    return <Option value={city.name} key={index}>{city.name}</Option>
  })
}

const getCities = () => {
  const children = []
  for (let i=0; i < cities.length; i++) {
    children.push(
      <Option value={`${cities[i].name}`} key={i}>{cities[i].name}</Option>
    )
  }
  return children
}


function StaffForm({ handleFormSubmit, handleChange, values }) {
    const [form] = Form.useForm()

    const [expand, setExpand] = useState(false)
    const [schools, setSchools] = useState([])
    const [branches, setBranches] = useState([])
    const [selectedBranch, setSelectedBranch] = useState('')
    const _select = useRef(null);

    const user = useSelector(state => state.userLogin)

    const user_role = user.user.role_id

    const getSchools = async () => {
      try {
        const config = {
          headers: {
              'Content-type': 'application/json',
              Authorization: `Bearer ${user.token}`
          }
        }

        const body = {
          "projection": [ `school` ]
        }

        const { data } = await axios.post(
            `${url}/api/utility/detail/`,
            body,
            config
        )
        
      console.log(data.data.school)
      setSchools(data.data.school)
      console.log("schools", schools)

      } catch (err) {
        console.log(err)
      }
    }

    const getBranches = async (school) => {
      console.log("line 155")
      form.setFieldsValue({
        branch: null
      })
      try {
        const config = {
          headers: {
              'Content-type': 'application/json',
              Authorization: `Bearer ${user.token}`
          }
        }

        const body = {
          "projection": [ "branch" ],
          "school": school
        }

        const { data } = await axios.post(
            `${url}/api/utility/detail/`,
            body,
            config
        )
        
      console.log(data.data.branch);
      setBranches(data.data.branch)

      } catch (err) {
        console.log(err)
      }
    }

    useEffect(async () => {
      console.log(_select.current);
      getSchools();
      console.log("schools", schools)
    }, [])

    const handleSubmit = () => {
      console.log('i am angry now')
      resetFormFields()
      handleFormSubmit()
      // form.setFieldsValue({
        //   firstname: '',
        // });
      console.log("after call");
    }

    const resetFormFields = () => {
      console.log("here is hi");
      form.setFieldsValue({
        groups: null,
        school: null,
        branch: null,
        firstname: null,
        lastname: null,
        email: null,
        password: null,
        phone: null,
        confirmPassword: null,
        register: null,
        dob: null,
        address_city: null,
        address_district: null,
        address_khoroo: null,
        address_appartment: null,
      })
    }

    return (
        <Form
          form={form}
          layout="vertical" 
          className="px-4" 
          name="Staff Form" 
          onFinish={handleSubmit} 
          validateMessages={validateMessages}
          initialValues={values}  
          onValuesChange={handleChange}
        >


            <div style={{ textAlign: 'center' }} className="mb-4">
              <Form.Item label="" name="groups">
                <Radio.Group size="medium">
                <Radio.Button value="5">Teacher</Radio.Button>
                <Radio.Button value="3">Operator</Radio.Button>
                <Radio.Button value="2">Admin</Radio.Button>
                <Radio.Button value="4">Accountant</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </div>

            { user_role === SUPERADMIN ? 
            (
              <Row justify="space-between" wrap="true">
                <Form.Item label="School" name="school" rules={[{ required: true }]} style={{ flex: 1, maxWidth: '195px' }}>
                  <Select 
                    showSearch
                    placeholder="Select school"
                    // style={{ width: '90%', alignSelf: 'flex-starrt' }}
                    onSelect={ getBranches }
                    >
                    {
                      schools.map(school => <Option value={school.id} key={ "school" + school.id } > { school.name } </Option>)
                    }
                  </Select>
                </Form.Item>

                <Form.Item label="Branch" name="branch" rules={[{ required: true }]} style={{ flex: 1, maxWidth: '195px' }}>
                  <Select 
                    showSearch
                    placeholder="Select branch"
                    // style={{ width: '80%', alignSelf: 'flex-end' }}
                    ref={ _select }
                    value={values.branch}
                    allowClear
                    >
                    {
                      branches &&
                      branches.map(branch => <Option value={branch.id} key={ "branch" + branch.id } > { branch.name } </Option>)
                    }
                  </Select>
                </Form.Item>

              </Row>
            ) : user_role === ADMIN ?
            (
              <h2>HELLO ORDINARY ADMIN</h2>
            ) : user_role === OPERATOR ?
            (
              <h2>HELLO OPERATOR</h2>
            ) : null
          }


            <Row justify="space-between">
              <Form.Item name='firstname' label="First Name" rules={[{ required: true }]}>
                  <Input placeholder="Enter First Name" />
              </Form.Item>
              <Form.Item name='lastname' label="Last Name" rules={[{ required: true }]}>
                  <Input placeholder="Enter Last Name" />
              </Form.Item>
            </Row>  
            
            <Row justify="space-between">
            <Form.Item name='email' label="Email" rules={[{ required: true, type: 'email' }]}>
                <Input placeholder="Enter Email" />
            </Form.Item>
            <Form.Item name='phone' label="Phone" rules={[{ required: true }]}>
                <InputNumber placeholder="Enter Phone Number" style={{ width: '100%' }} />
            </Form.Item>
            </Row>

            <Row justify="space-between">
            <Form.Item name='password' label="Password" rules={[{ required: true }]} style={{ width: '45%' }}>
                <Input.Password prefix={<LockOutlined className="text-primary" />} placeholder="Enter Password" />
            </Form.Item>
            <Form.Item name='confirmPassword' label="Confirm Password" rules={[{ required: true }]} style={{ width: '45%' }}>
                <Input.Password prefix={<LockOutlined className="text-primary" />} placeholder="Confirm Password" />
            </Form.Item>
            </Row>
            <a
              onClick={() => setExpand(!expand)}
              style={{ userSelect: 'none' }}
            >
              {expand ? <UpOutlined /> : <DownOutlined />} Optional
            </a>
            {expand && (
              <div className="pt-3">
                <Row justify="space-between">
                  <Form.Item name='register' label="Register Number" rules={[{ required: false }]} >
                    <Input placeholder="Enter Register Number" />
                  </Form.Item>
                  <Form.Item name='dob' label="Birthday" rules={[{ required: false }]} style={{ width: '200px' }} >
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Row>
                <Row justify="space-between">
                  <Form.Item name='address_city' label="City/Province" rules={[{ required: false }]} style={{ width: '45%' }} >
                    <Select placeholder="Select a city" style={{ width: '100%' }} >
                      {getCities()}
                    </Select>
                  </Form.Item>
                  <Form.Item name='address_district' label="District/Soum" rules={[{ required: false }]} style={{ width: '45%' }} >
                    <Input placeholder="Enter district" />
                  </Form.Item>
                </Row>
                <Row justify="space-between">
                  <Form.Item name='address_khoroo' label="Khoroo/Bag" rules={[{ required: false }]} >
                    <Input  placeholder="Enter khoroo" />
                  </Form.Item>
                  <Form.Item name='address_appartment' label="Bair/Toot" rules={[{ require: false }]} >
                    <Input placeholder="Enter Bair / Toot" />  
                  </Form.Item> 
                </Row>
              </div>
            )}

            <Row justify="center">
                <Button onClick={resetFormFields}>
                  Reset
                </Button>
            </Row>
        </Form>
    )
}

export default StaffForm
