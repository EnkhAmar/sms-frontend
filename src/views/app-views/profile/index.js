import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom'
import { Row, Col, Card, Avatar, Button, Modal, Form, Input, InputNumber, Upload, message, Select, DatePicker, Collapse, Skeleton, Tabs } from 'antd';
import { Icon } from 'components/util-components/Icon'
import { employementList, interestedList, connectionList, groupList } from './profileData';
import {
	GlobalOutlined,
	MailOutlined,
	HomeOutlined,
	PhoneOutlined,
	UserOutlined,
	LoadingOutlined,
	UploadOutlined,
	LockOutlined,
	WalletOutlined,
	SettingOutlined,
	GroupOutlined
} from '@ant-design/icons';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import Flex from 'components/shared-components/Flex'
import { ImageSvg } from 'assets/svg/icon';
import CustomIcon from 'components/util-components/CustomIcon'
import ProfileInfo from './components/profileInfo'
import UserModal from './components/edit/userModal'
import { SUPERADMIN, ADMIN, OPERATOR, TEACHER, ACCOUNTANT, STUDENT, REGISTER_REGEX } from 'constants/AppConstant'
import { CITIES as cities } from "constants/AddressConstant";
import moment from 'moment'
import axios from 'axios';
import { url } from 'configs/EnvironmentConfig'
import './styles.css'

const { Dragger } = Upload;
const { Option } = Select;
const { Panel } = Collapse;
const { TabPane } = Tabs;

const Experiences = () => (
	<Card title="Experiences">
		<div className="mb-3">
			<Row>
				<Col sm={24} md={22}>
					{employementList.map((elm, i) => {
						return (
							<div className={`${i === (employementList.length - 1)? '' : 'mb-4'}`} key={`eduction-${i}`}>
								<AvatarStatus src={elm.img} name={elm.title} subTitle={elm.duration}/>
								<p className="pl-5 mt-2 mb-0">{elm.desc}</p>
							</div>
						)
					})}
				</Col>
			</Row>
		</div>
	</Card>
)

const Interested = () => (
	<Card title="Interested">
		<Row gutter={30}>
			<Col sm={24} md={12}>
				{interestedList.filter((_, i) => i < 4).map((elm, i) => {
					return (
						<div className="mb-3" key={`interested-${i}`}>
							<h4 className="font-weight-semibold">{elm.title}</h4>
							<p>{elm.desc}</p>
						</div>
					)
				})}
			</Col>
			<Col sm={24} md={12}>
				{interestedList.filter((_, i) => i >= 4).map((elm, i) => {
					return (
						<div className="mb-3" key={`interested-${i}`}>
							<h4 className="font-weight-semibold">{elm.title}</h4>
							<p>{elm.desc}</p>
						</div>
					)
				})}
			</Col>
		</Row>
	</Card>
)

const Connection = () => (
	<Card title="Connection">
		{
			connectionList.map((elm, i) => {
				return (
					<div className={`${i === (connectionList.length - 1)? '' : 'mb-4'}`} key={`connection-${i}`}>
						<AvatarStatus src={elm.img} name={elm.name} subTitle={elm.title}/>
					</div>
				)
			})
		}
	</Card>
)

const Group = () => (
	<Card title="Group">
		{
			groupList.map((elm, i) => {
				return (
					<div className={`${i === (groupList.length - 1)? '' : 'mb-4'}`} key={`connection-${i}`}>
						<AvatarStatus src={elm.img} name={elm.name} subTitle={elm.desc}/>
					</div>
				)
			})
		}
	</Card>
)

const Profile = () => {
	const { id } = useParams()
	const [visible, setVisible] = useState(false)
	const [submitLoading, setSubmitLoading] = useState(false)
	const [loading, setLoading] = useState(false);
	const [profileImage, setProfileImage] = useState([])

	const [uploadLoading, setUploadLoading] = useState(false)
	const [user, setUser] = useState(null);

	const role = useSelector(state => state.userLogin.user.role_id)

	const token = useSelector((state) => state.userLogin.token); // auth token from redux
  const config = {
		headers: {
			'Content-type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	}

	const props = {
    onRemove: file => {
      setProfileImage([])
    },
    beforeUpload: file => {
      setProfileImage([file])
      return false;
    },
    fileList: profileImage,
  };

	const initialFields = [
		{name: ['firstname'], value: null},
		{name: ['lastname'], value: null},
		{name: ['email'], value: null},
		{name: ['password'], value: null},
		{name: ['phone'], value: null},
		{name: ['image'], value: null},
		{name: ['address_city'], value: null},
		{name: ['address_district'], value: null},
		{name: ['address_khoroo'], value: null},
		{name: ['address_apartment'], value: null},
		{name: ['dob'], value: null},
		{name: ['register'], value: null}
	]
	const [fields, setFields] = useState(initialFields)

	const avatarSize = 150

	useEffect(() => {
		getUser();
	}, [id]);

	const getUser = () => {
		setUser(null);
		axios.get(
			`${url}/api/auth/action/${id}`,
			config
		).then((res) => {
			console.log(res.data.data.user);
			setUser(res.data.data.user);
		}).catch((err) => {
			console.log((err.response.data))
			Object.values(err.response.data).forEach(
					msg => message.error({ content: msg, duration: 5 })
			)
		})
	}

	const showEditModal = () => {
		console.log(user.profile.image);
		setFields([
			{name: ['firstname'], value: user.firstname},
			{name: ['lastname'], value: user.lastname},
			{name: ['email'], value: user.email},
			{name: ['phone'], value: parseInt(user.phone)},
			{name: ['password'], value: null},
			{name: ['confirmPassword'], value: null},
			{name: ['image'], value: null},
			{name: ['address_city'], value: user.profile.address_city},
			{name: ['address_district'], value: user.profile.address_district},
			{name: ['address_khoroo'], value: user.profile.address_khoroo},
			{name: ['address_apartment'], value: user.profile.address_apartment},
			{name: ['dob'], value: user.profile.dob ? moment(user.profile.dob) : null},
			{name: ['register'], value: user.profile.register}
		])
		setVisible(true)
	}

	const beforeUpload = file => {
		console.log(file)
		setProfileImage([file])
		const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
		if (!isJpgOrPng) {
			message.error('You can only upload JPG/PNG file!');
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			message.error('Image must smaller than 2MB!');
		}
		// return isJpgOrPng && isLt2M;
	}

	const handleUploadChange = (info) => {
		console.log(info)
		const { status } = info.file
		if (status !== 'uploading') {
			console.log(info.file, info.fileList)
		}
		if (status === 'done') {

			message.success(`${info.file.name} file uploaded successfully.`)
		} else if (status === 'error') {
			message.error(`${info.file.name} file upload failed.`)
		}
	}

	const handleFormSubmit = (values) => {
		setSubmitLoading(true);
		const formData = new FormData()
		formData.append('firstname', values.firstname)
		formData.append('lastname', values.lastname)
		formData.append('email', values.email)
		formData.append('phone', values.phone)
		formData.append('password', values.password)
		formData.append('register', values.register)
		formData.append('dob', values.dob ? moment(values.dob, "YYYY-MM-DD").format('YYYY-MM-DD') : '')
		formData.append('address_city', values.address_city)
		formData.append('address_district', values.address_district)
		formData.append('address_khoroo', values.address_khoroo)
		formData.append('address_appartment', values.address_appartment)
		formData.append('image', profileImage[0] ? profileImage[0] : "");
		if (values.groups !== ADMIN) {
				formData.append('branch', user.branch)
		}
		formData.append('groups', user.groups)
		formData.append('school', user.school)
		axios.put(
			`${url}/api/auth/action/${user.id}/`,
			formData,
			config
		).then((res) => {
			console.log(res)
			getUser();
			message.success({ content: `${res.data.data.email} has updated successfully.`, duration: 5 })
			setVisible(false);
			setSubmitLoading(false);
		}).catch((err) => {
			console.log((err.response.data))
			Object.values(err.response.data).forEach(
					msg => message.error({ content: msg, duration: 5 })
			)
			setSubmitLoading(false);
		})
	}

	const handleCancel = () => {
		setVisible(false)
	}

	const changeTab = (key) => {

	}

	return (
		<>
			{
				user === null ?
				<Skeleton active />
				:
				<>
				<PageHeaderAlt background={`/img/others/img-12.jpg`} cssClass="bg-primary" overlap>
					<div className="container text-center">
						<div className="py-5 my-md-5">
						</div>
					</div>
				</PageHeaderAlt>
				<div className="container my-4">
					<ProfileInfo avatarSize={avatarSize} user={user} showEditModal={showEditModal} role={role} id={id} />
					<Card>
					<Tabs tabPosition="left" onChange={changeTab}>
				    <TabPane tab={<><UserOutlined/> Profile</>} key="1" style={{paddingBottom: 20}}>
				      Content of tab 1
				    </TabPane>
						{
							user.role_id === STUDENT ?
							<>
								<TabPane tab={<><WalletOutlined/> Payment</>} key="2">
						      Content of tab 2
						    </TabPane>
								<TabPane tab={<><GroupOutlined /> Classes</>} key="3">
						      Content of tab 3
						    </TabPane>
							</>
							: null
						}
				  </Tabs>
					</Card>
					<Row gutter="16">
						<Col xs={24} sm={24} md={8}>
							<Connection />
							<Group />
						</Col>
						<Col xs={24} sm={24} md={16}>
							<Experiences />
							<Interested />
						</Col>
					</Row>
				</div>
				<UserModal
					visible={visible}
					handleCancel={handleCancel}
					handleFormSubmit={handleFormSubmit}
					fields={fields}
					submitLoading={submitLoading}
					props={props}
				/>
				</>
			}
		</>
	)
}

export default Profile
