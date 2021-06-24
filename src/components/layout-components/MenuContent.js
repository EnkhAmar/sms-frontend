import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { Menu, Grid, Select, Form } from "antd";
import IntlMessage from "../util-components/IntlMessage";
import Icon from "../util-components/Icon";
import navigationConfig from "configs/NavigationConfig";
import { connect } from "react-redux";
import { SIDE_NAV_LIGHT, NAV_TYPE_SIDE } from "constants/ThemeConstant";
import utils from 'utils'
import { onMobileNavToggle } from "redux/actions/Theme";
import { useSelector, useDispatch } from "react-redux";
import { ADMIN, SUPERADMIN, TEACHER } from 'constants/AppConstant';
import Flex from 'components/shared-components/Flex';
import {url} from 'configs/EnvironmentConfig';
import {
  setSchool,
  setBranch,
} from 'redux/actions/filterActions';
import axios from 'axios';

const { Option } = Select;
const { SubMenu } = Menu;
const { useBreakpoint } = Grid;

const setLocale = (isLocaleOn, localeKey) =>
  isLocaleOn ? <IntlMessage id={localeKey} /> : localeKey.toString();

const setDefaultOpen = (key) => {
  let keyList = [];
  let keyString = "";
  if (key) {
    const arr = key.split("-");
    for (let index = 0; index < arr.length; index++) {
      const elm = arr[index];
      index === 0 ? (keyString = elm) : (keyString = `${keyString}-${elm}`);
      keyList.push(keyString);
    }
  }
  return keyList;
};

const SideNavContent = (props) => {
  const [schools, setSchools] = useState([]);
  const [branches, setBranches] = useState([]);
  const token = useSelector((state) => state.userLogin.token);
  const branchFilter = useSelector((state) => state.filters.branch);
  const schoolFilter = useSelector((state) => state.filters.school);
  const schoolId = useSelector((state) => state.userLogin.user.school);
  const role = useSelector((state) => state.userLogin.user.role_id);
  const [fields, setFields] = useState([
    {name: ['school'], value: null},
    {name: ['branch'], value: null},
  ])
  const config = {
		headers: {
			'Content-type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	}
	const { sideNavTheme, routeInfo, hideGroupTitle, localization, onMobileNavToggle, navCollapsed, currentTheme } = props;
	const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg')
	const closeMobileNav = () => {
		if (isMobile) {
			onMobileNavToggle(false)
		}
	}
  const dispatch = useDispatch();

  const checkRole = (key) => {
    if (key === 'schools' && role !== SUPERADMIN && role !== ADMIN || key === 'staffs' && role === TEACHER) {
      return false;
    }
    if (key === 'schools-school' && role !== SUPERADMIN) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    if (role == SUPERADMIN) {
      getSchools();
    }
    if (role == ADMIN) {
      getBranches(schoolId);
    }
    if (schoolFilter) {
      getBranches(schoolFilter);
      setFields([
        {name: ['school'], value: schoolFilter},
      ])
    }
  }, [schoolFilter]);

  const getSchools = () => {
		axios.post(
			`${url}/api/utility/detail/`,
			{
				'projection': ['school']
			},
			config
		).then(function (response) {
			setSchools(response.data.data.school);
		}).catch(function (error) {
			console.log(error.response.data);
		})
	}

  const getBranches = (school) => {
		axios.post(
			`${url}/api/utility/detail/`,
			{
				'projection': ['branch'],
        'school': school
			},
			config
		).then(function (response) {
			setBranches(response.data.data.branch);
		}).catch(function (error) {
			console.log("get schools error: ", error.response.data);
		})
	}

  const handleSchoolChange = (value) => {
    setFields([
      {name: ['branch'], value: null},
    ])
    if (value) {
      dispatch(setSchool(value))
      getBranches(value);
    } else {
      dispatch(setSchool(null))
      setBranches([]);
    }
    dispatch(setBranch(null));
  }

  const handleBranchChange = (value) => {
    if (value) {
      dispatch(setBranch(value));
    } else {
      dispatch(setBranch(null));
    }
  }

  return (
    <>
    {
      (role == SUPERADMIN || role == ADMIN) && !navCollapsed ?
      <Form
        fields={fields}
      >
      <p style={{
        fontSize: 12,
        fontWeight: 700,
        marginTop: 16,
        paddingLeft: 26,
        color: sideNavTheme !== SIDE_NAV_LIGHT || currentTheme !== 'light' ? 'rgba(255, 255, 255, 0.6)': 'rgba(26, 51, 83, 0.6)' }}>FILTERS</p>
      <Flex justifyContent="center">
      </Flex>
        {
          role == SUPERADMIN ?
          <Flex justifyContent="center">
            <Form.Item name="school">
              <Select
                allowClear
                placeholder="Select school"
                style={{ width: 200, margin: 0 }}
                onChange={handleSchoolChange}
                showSearch
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {
                  schools.map(school => <Option value={school.id} key={school.id}>{school.name}</Option>)
                }
              </Select>
            </Form.Item>
          </Flex>
          : null
        }
        {
          role == ADMIN || role == SUPERADMIN ?
          <Flex justifyContent="center">
            <Form.Item name="branch" style={{margin: 0}}>
              <Select
                allowClear
                placeholder="Select branch"
                style={{ width: 200, margin: 0, padding: 0 }}
                disabled={branches && branches.length > 0 ? false : true}
                onChange={handleBranchChange}
                showSearch
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {
                  branches.map(branch => <Option value={branch.id} key={branch.id}>{branch.name}</Option>)
                }
              </Select>
            </Form.Item>
          </Flex>
          : null
        }
        </Form>
      :
      null
    }
    <Menu
      theme={sideNavTheme === SIDE_NAV_LIGHT ? "light" : "dark"}
      mode="inline"
      style={{ borderRight: 0 }}
      defaultSelectedKeys={[routeInfo?.key]}
      defaultOpenKeys={setDefaultOpen(routeInfo?.key)}
      className={hideGroupTitle ? "hide-group-title" : ""}
    >

      {navigationConfig.map((menu) =>
        menu.submenu.length > 0 ? (
          <Menu.ItemGroup
            key={menu.key}
            title={setLocale(localization, menu.title)}
          >
            {menu.submenu.map((subMenuFirst) =>
              checkRole(subMenuFirst.key) ?
              subMenuFirst.submenu.length > 0 ? (
                <SubMenu
                  icon={
                    subMenuFirst.icon ? (
                      <Icon type={subMenuFirst?.icon} />
                    ) : null
                  }
                  key={subMenuFirst.key}
                  title={setLocale(localization, subMenuFirst.title)}
                >
                  {subMenuFirst.submenu.map((subMenuSecond) =>
                    checkRole(subMenuSecond.key) ?
                    (
                    <Menu.Item key={subMenuSecond.key}>
                      {subMenuSecond.icon ? (
                        <Icon type={subMenuSecond?.icon} />
                      ) : null}
                      <span>
                        {setLocale(localization, subMenuSecond.title)}
                      </span>
                      <Link onClick={() => closeMobileNav()} to={subMenuSecond.path} />
                    </Menu.Item>
                  ) : null)}
                </SubMenu>
              ) : (
                <Menu.Item key={subMenuFirst.key}>
                  {subMenuFirst.icon ? <Icon type={subMenuFirst.icon} /> : null}
                  <span>{setLocale(localization, subMenuFirst.title)}</span>
                  <Link onClick={() => closeMobileNav()} to={subMenuFirst.path} />
                </Menu.Item>
              ) : null
            )}
          </Menu.ItemGroup>
        ) : (
          <Menu.Item key={menu.key}>
            {menu.icon ? <Icon type={menu?.icon} /> : null}
            <span>{setLocale(localization, menu?.title)}</span>
            {menu.path ? <Link onClick={() => closeMobileNav()} to={menu.path} /> : null}
          </Menu.Item>
        )
      )}
    </Menu>
    </>
  );
};

const TopNavContent = (props) => {
  const { topNavColor, localization } = props;
  return (
    <Menu mode="horizontal" style={{ backgroundColor: topNavColor }}>
      {navigationConfig.map((menu) =>
        menu.submenu.length > 0 ? (
          <SubMenu
            key={menu.key}
            popupClassName="top-nav-menu"
            title={
              <span>
                {menu.icon ? <Icon type={menu?.icon} /> : null}
                <span>{setLocale(localization, menu.title)}</span>
              </span>
            }
          >
            {menu.submenu.map((subMenuFirst) =>
              subMenuFirst.submenu.length > 0 ? (
                <SubMenu
                  key={subMenuFirst.key}
                  icon={
                    subMenuFirst.icon ? (
                      <Icon type={subMenuFirst?.icon} />
                    ) : null
                  }
                  title={setLocale(localization, subMenuFirst.title)}
                >
                  {subMenuFirst.submenu.map((subMenuSecond) => (
                    <Menu.Item key={subMenuSecond.key}>
                      <span>
                        {setLocale(localization, subMenuSecond.title)}
                      </span>
                      <Link to={subMenuSecond.path} />
                    </Menu.Item>
                  ))}
                </SubMenu>
              ) : (
                <Menu.Item key={subMenuFirst.key}>
                  {subMenuFirst.icon ? (
                    <Icon type={subMenuFirst?.icon} />
                  ) : null}
                  <span>{setLocale(localization, subMenuFirst.title)}</span>
                  <Link to={subMenuFirst.path} />
                </Menu.Item>
              )
            )}
          </SubMenu>
        ) : (
          <Menu.Item key={menu.key}>
            {menu.icon ? <Icon type={menu?.icon} /> : null}
            <span>{setLocale(localization, menu?.title)}</span>
            {menu.path ? <Link to={menu.path} /> : null}
          </Menu.Item>
        )
      )}
    </Menu>
  );
};

const MenuContent = (props) => {
  return props.type === NAV_TYPE_SIDE ? (
    <SideNavContent {...props} />
  ) : (
    <TopNavContent {...props} />
  );
};

const mapStateToProps = ({ theme }) => {
  const { sideNavTheme, topNavColor, currentTheme } = theme;
  return { sideNavTheme, topNavColor, currentTheme };
};

export default connect(mapStateToProps, { onMobileNavToggle })(MenuContent);
