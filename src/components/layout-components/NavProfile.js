import React from "react";
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { Menu, Dropdown, Avatar } from "antd";
import { connect } from 'react-redux';
import getInitials from 'utils/getInitials'
import {
  EditOutlined,
  SettingOutlined,
  ShopOutlined,
  QuestionCircleOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import Icon from 'components/util-components/Icon';
import { logout } from '../../redux/actions/userActions';
import { useHistory } from "react-router-dom";

const menuItem = [
	{
		title: "Edit Profile",
		icon: EditOutlined ,
		path: "/app/profile"
    },
    {
		title: "Billing",
		icon: ShopOutlined ,
		path: "/"
	},
    {
		title: "Help Center",
		icon: QuestionCircleOutlined,
		path: "/"
	}
]

export const NavProfile = ({logout, children}) => {
  const user = useSelector((state) => state.userLogin.user);
  const history = useHistory()

  const handleLogoutClick = e => {
    logout()
    history.push("/auth/login")
  }

  const profileMenu = (
    <div className="nav-profile nav-dropdown">
      <div className="nav-profile-header">
        <Link to={`/app/profile/${user.id}`}>
          <div className="d-flex">
              <Avatar style={{backgroundColor: "rgb(61, 63, 86)"}} src={user.profile.image} >
                {user.profile.image? '' : <span className="font-weight-semibold font-size-sm">{getInitials(`${user.firstname} ${user.lastname}`)}</span>}
              </Avatar>
            <div className="pl-3">
              <h4 className="mb-0">{user.lastname ? user.lastname[0] : ''}. {user.firstname}</h4>
              <span className="text-muted">{user.email}</span>
            </div>
          </div>
        </Link>
      </div>
      <div className="nav-profile-body">
        {children}
        <Menu>
          {menuItem.map((el, i) => {
            return (
              <Menu.Item key={i}>
                <a href={el.path}>
                  <Icon className="mr-3" type={el.icon} />
                  <span className="font-weight-normal">{el.title}</span>
                </a>
              </Menu.Item>
            );
          })}
          <Menu.Item key={menuItem.length + 2} onClick={ handleLogoutClick }>
            <span>
              <LogoutOutlined className="mr-3"/>
              <span className="font-weight-normal">Sign Out</span>
            </span>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
  return (
    <Dropdown placement="bottomRight" overlay={profileMenu} trigger={["click"]}>
      <Menu className="d-flex align-item-center" mode="horizontal">
        <Menu.Item>
          <Avatar style={{backgroundColor: "rgb(61, 63, 86)"}} src={user.profile.image} >
            {user.profile.image? '' : <span className="font-weight-semibold font-size-sm">{getInitials(user.firstname)}</span>}
          </Avatar>
        </Menu.Item>
      </Menu>
    </Dropdown>
  );
}

export default connect(null, {logout})(NavProfile)
