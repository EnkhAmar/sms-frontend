import {
  Card,
  Row,
  Col,
  Avatar,
  Button
} from 'antd'
import {
	MailOutlined,
	HomeOutlined,
	PhoneOutlined,
	UserOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Icon } from 'components/util-components/Icon'
import Flex from 'components/shared-components/Flex'
import { SUPERADMIN, ADMIN } from 'constants/AppConstant'

const ProfileInfo = ({ avatarSize, user, showEditModal, role, id }) => (
	<Card>
		<Row justify="center">
			<Col sm={24} md={24}>
				<div className="d-md-flex">
					<div className="rounded p-2 bg-white shadow-sm mx-auto" style={{'marginTop': '-3.5rem', 'maxWidth': `${avatarSize + 16}px`}}>
						<Avatar shape="square" size={avatarSize} src={user.profile.image ? user.profile.image : `/img/avatars/profile.png`} />
					</div>
					<div className="ml-md-4 w-100">
						<Flex alignItems="center" justifyContent="between" mobileFlex={false} className="mb-3 text-md-left text-center">
							<h2 className="mb-0 mx-3">{user.firstname} {user.lastname}</h2>
							<div className="ml-md-3 mt-3 mt-md-0">
								{
									id === user.id || role === SUPERADMIN || role === ADMIN ?
									<Button size="small" type="primary" onClick={() => showEditModal()}><SettingOutlined /> Edit Profile</Button>
									: null
								}
								<Button size="small" className="ml-2">Message</Button>
							</div>
						</Flex>
						<Row gutter="16">
							<Col sm={24} md={8}>
								<p className="mt-0 mx-3 text-muted text-md-left text-center">
									It is a long established fact that a reader will be distracted.
								</p>
							</Col>
							<Col xs={24} sm={24} md={8}>
								<Row className="mb-2">
									<Col xs={12} sm={12} md={9}>
										<Icon type={MailOutlined} className="text-primary font-size-md"/>
										<span className="text-muted ml-2">Email:</span>
									</Col>
									<Col xs={12} sm={12} md={15}>
										<span className="font-weight-semibold">{user.email ? user.email : 'N/A'}</span>
									</Col>
								</Row>
								<Row className="mb-2 mt-2 mt-md-0 ">
									<Col xs={12} sm={12} md={9}>
										<Icon type={PhoneOutlined} className="text-primary font-size-md"/>
										<span className="text-muted ml-2">Phone:</span>
									</Col>
									<Col xs={12} sm={12} md={15}>
										<span className="font-weight-semibold">+976 {user.phone.slice(0,4)}-{user.phone.slice(4,8)}</span>
									</Col>
								</Row>
							</Col>
							<Col xs={24} sm={24} md={8}>
								<Row className="mb-2 mt-2 mt-md-0 ">
									<Col xs={12} sm={12} md={9}>
										<Icon type={HomeOutlined} className="text-primary font-size-md"/>
										<span className="text-muted ml-2">Address:</span>
									</Col>
									<Col xs={12} sm={12} md={15}>
										<span className="font-weight-semibold">{user.profile.address_district ? user.profile.address_district : 'N/A'}, {user.profile.address_city ? user.profile.address_city : 'N/A'}</span>
									</Col>
								</Row>
								<Row className="mb-2">
									<Col xs={12} sm={12} md={9}>
										<Icon type={UserOutlined} className="text-primary font-size-md"/>
										<span className="text-muted ml-2">Role:</span>
									</Col>
									<Col xs={12} sm={12} md={15}>
										<span className="font-weight-semibold">{user.role_name}</span>
									</Col>
								</Row>
							</Col>
						</Row>
					</div>
				</div>
			</Col>
		</Row>
	</Card>
)

export default ProfileInfo
