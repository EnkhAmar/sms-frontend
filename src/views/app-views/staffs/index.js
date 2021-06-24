import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Admins from './Admins'
import Operators from './Operators'
import Teachers from './Teachers'
import Accountant from './Accountant'
import { Tabs, Button, Spin, Form, message, Modal } from 'antd';
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import Flex from 'components/shared-components/Flex'
import { UserAddOutlined } from '@ant-design/icons'
import { url } from 'configs/EnvironmentConfig'
import { listTeachers, listOperators, listAdmins, listAccounts } from 'redux/actions/staffsActions'
import AddStaffModal from './AddStaffModal';
import axios from 'axios'
import moment from 'moment'
import { ADMIN, ADMIN_GROUP, OPERATOR_GROUP, TEACHER_GROUP, ACCOUNTANT_GROUP, TEACHER, STUDENT } from 'constants/AppConstant'
import { fetchStaffs } from './Forms/fetchData'

const { TabPane } = Tabs;
const { confirm } = Modal
function callback(key) {
     
}

const token = localStorage.getItem("userToken");

const Staffs = () => {
    const [form] = Form.useForm()

    const [visible, setVisible] = useState(false)
    const [loadingModal, setLoadingModal] = useState(false)

    const role = useSelector(state => state.userLogin.user.role_id)

    const history = useHistory()
    
    useEffect(() => {
        if (role === TEACHER || role === STUDENT) {
            history.push('/')
        }
    }, [])

    const initialUpdate = {
        staff_id: null,
        isUpdate: false,
        isPasswordChecked: false
    }
    const [updateStaff, setUpdateStaff] = useState(initialUpdate)
    const [isPasswordChecked, setIsPasswordChecked] = useState(false)
    
    const initialState = {
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        register: '',
        dob: '',
        address_city: null,
        address_district: '',
        address_khoroo: '',
        address_appartment: '',
        branch: null,
        groups: null,
        school: null,
    }
    const [values, setValues] = useState(initialState)

    const [ staffUpdate, setStaffUpdate ] = useState(false);

    useEffect(async () => {
    }, [])

    const showModal = () => {
        setVisible(true)
    }

    const handleClickCancel = () => {
        setUpdateStaff(initialUpdate)
        setVisible(false)
        resetFormFields()
        console.log(initialState)
        setValues(initialState)
    }

    const config = {
        headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
        }
    }
    
    const handleChange = (_values, allValues) => {
        setValues({
        ...values,
        ..._values
        })
    }

    const handleClickAdd = () => {
        const key = 'updatable'
        message.loading('Action in progess...', key)
        setLoadingModal(true)
        setStaffUpdate(true);
        if (updateStaff.isUpdate) {
            const formData = new FormData()
            formData.append('firstname', values.firstname)
            formData.append('lastname', values.lastname)
            formData.append('email', values.email)
            formData.append('phone', values.phone)
            isPasswordChecked && formData.append('password', values.password)
            formData.append('register', values.register ? values.register : '')
            formData.append('dob', moment(values.dob._d).format('YYYY-MM-DD'))
            formData.append('address_city', values.address_city ? values.address_city : null)
            formData.append('address_district', values.address_district ? values.address_district : '')
            formData.append('address_khoroo', values.address_khoroo ? values.address_khoroo : '')
            formData.append('address_appartment', values.address_appartment ? values.address_appartment : '')
            formData.append('groups', values.groups)

            axios.put(
                `${url}/api/auth/action/${updateStaff.staff_id}/`,
                formData,
                config).then((res) => {
                    console.log(res)
                    message.success({ content: `${res.data.data.email} has updated successfully.`, key, duration: 5 })        
                    setVisible(false)
                    setValues(initialState)
                    setStaffUpdate(false)
                    resetFormFields()
                }).catch((err) => {
                    console.log((err.response.data))
                    Object.values(err.response.data).forEach(
                        msg => message.error({ content: msg, key, duration: 5 })
                    )        
                })
                setStaffUpdate(false)
                setUpdateStaff(initialUpdate)
        } else  {
            const formData = new FormData()
            formData.append('firstname', values.firstname)
            formData.append('lastname', values.lastname)
            formData.append('email', values.email)
            formData.append('phone', values.phone)
            formData.append('password', values.password)
            formData.append('register', values.register)
            formData.append('dob', moment(values.dob._d).format('YYYY-MM-DD'))
            formData.append('address_city', values.address_city)
            formData.append('address_district', values.address_district)
            formData.append('address_khoroo', values.address_khoroo)
            formData.append('address_appartment', values.address_appartment)
            if (values.groups !== ADMIN) {
                formData.append('branch', values.branch)
            
            }
            formData.append('groups', values.groups)
            formData.append('school', values.school)

            axios.post(
            `${url}/api/auth/action/`,
            formData,
            config).then((res) => {
                console.log(res)
                message.success({ content: `${res.data.data.email} has added successfully.`, key, duration: 5})
                setStaffUpdate(false)
                setVisible(false)
                setValues(initialState)
                resetFormFields()
            }).catch((err) => {
                console.log((err.response.data))
                Object.values(err.response.data).forEach(
                    msg => message.error({ content: msg, key, duration: 5 })
                )
                setStaffUpdate(false)
            })
        }
        setLoadingModal(false)
    }
  
    const clickAdd = () => {
        handleClickAdd()
        resetFormFields()
    }
  
    const resetFormFields = () => {
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

    const confirmDelete = (data) => {
        console.log(data)
        confirm({
            content:
                <div> 
                    <h4>Are you sure to delete <span style={{ color: 'crimson' }}>{data.name}</span>?</h4>
                    <div style={{ paddingLeft: '20px' }}>
                        <h5>School: <span style={{ fontSize: '12px', color: '#455560' }}>{data.school}</span></h5>
                        <h5>Phone: <span style={{ fontSize: '12px', color: '#455560' }}>{data.phone}</span></h5>
                        <h5>Email: <span style={{ fontSize: '12px', color: '#455560' }}>{data.email}</span></h5>
                    </div>
                </div>,
            onOk() {
                deleteStaffHandler(data.id)
            },
            onCancel() {
                console.log('cancelled deleting')
            }
        })
    }

    const deleteStaffHandler = useCallback(async (id) => {
        setStaffUpdate(true)
        const key = 'updatable'
        message.loading('Action in progess...', key)
        try {
            const config = {
            headers: {
                'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
      
            const { data } = await axios.delete(
                `${url}/api/auth/action/${id}/`,
                config
            )
            message.success({ content: `Staff has been deleted.`, key, duration: 5 })
            setStaffUpdate(false)
        } catch (err) {
            Object.values(err.response.data).forEach(
                msg => message.error({ content: msg, key, duration: 5 })
            )
            setStaffUpdate(false)
        }
    }, [])

    const editStaffHandler = useCallback(async (id) => {
        let res
        try {
            const { data } = await axios.get(
                `${url}/api/auth/action/${id}`,
                config
            )
            res = data.data.user

        } catch (err) {
            Object.values(err.response.data).forEach(
                msg => message.error({ content: msg, duration: 5 })
            )
        }
        console.log(res)
        let _values = {}
        _values.groups = res.groups
        _values.school = res.school
        _values.branch = res.branch_name
        _values.firstname = res.firstname
        _values.lastname = res.lastname
        _values.email = res.email
        _values.phone = res.phone
        _values.password = res.password
        _values.confirmPassword = res.password
        _values.register = res.profile ? res.profile.register : ''
        _values.dob = res.profile.dob ? moment(res.profile.dob, 'YYYY-MM-DD') : ''
        _values.address_city = res.profile.address_city ? res.profile.address_city : null
        _values.address_district = res.profile.address_district ? res.profile.address_district : null
        _values.address_khoroo = res.profile.address_khoroo ? res.profile.address_khoroo : null
        _values.address_appartment = res.profile.address_appartment ? res.profile.address_appartment : null

        setValues(_values)

        form.setFieldsValue({
            ..._values,
            address_city: values.address_city ? values.address_city : 'Ulaanbaatar',
            address_district: values.address_district ? values.address_district : '',
            address_khoroo: values.address_khoroo ? values.address_khoroo : '',
            address_appartment: values.address_appartment ? values.address_appartment : '',
        })
        console.log(values)
        setVisible(true)
        setUpdateStaff({ staff_id: id, isUpdate: true, isPasswordChecked: false })
    }, [])

	return (
        <>
        <AddStaffModal 
            visible={visible} 
            clickCancel={handleClickCancel} 
            loading={loadingModal} 
            handleModalVisible={setVisible}
            handleChange={handleChange} 
            form={form}
            clickAdd={clickAdd}
            handleClickAdd={handleClickAdd}
            values={values}
            resetFormFields={resetFormFields}
            updateStaff={updateStaff}
            setUpdateStaff={setUpdateStaff}
        />
        <PageHeaderAlt className="border-bottom" overlap>
            <div className="container" style={{ width: '100%' }}>
                <Flex className="py-2" mobileFlex={false} justifyContent="between" alignItems="center">
                    <h2 className="mb-3">Staffs</h2>
                    <div className="mb-3">
                        <Button type="primary" htmlType="submit" onClick={showModal}>
                            <UserAddOutlined /> Add Staff
                        </Button>
                    </div>
                </Flex>
            </div>
		<Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="Teachers" key="1">
                <Teachers
                    staffUpdate={ staffUpdate }
                    deleteStaff={confirmDelete} 
                    editStaff={editStaffHandler} 
                    token={token}
                />
            </TabPane>
            <TabPane tab="Operators" key="2">
                <Operators
                    staffUpdate={staffUpdate}
                    deleteStaff={confirmDelete} 
                    editStaff={editStaffHandler} 
                    token={token}
                />
            </TabPane>
            <TabPane tab="Admins" key="3">
                <Admins
                    staffUpdate={staffUpdate}
                    deleteStaff={confirmDelete} 
                    editStaff={editStaffHandler} 
                    token={token}
                />
            </TabPane>
            <TabPane tab="Accountants" key="4">
                <Accountant 
                    staffUpdate={staffUpdate}
                    deleteStaff={confirmDelete}
                    editStaff={editStaffHandler} 
                    handleChange={handleChange} 
                    token={token}
                />
            </TabPane>
        </Tabs>
		</PageHeaderAlt>
        </>
	)
}

export default Staffs
