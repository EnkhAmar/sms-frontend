import React, {useState, useEffect} from 'react';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import {url} from 'configs/EnvironmentConfig';
import axios from 'axios';
import { useSelector } from "react-redux";
import Flex from 'components/shared-components/Flex';
import AddModal from '../components/lessons/AddModal';
import { TUGRUG, ADMIN, SUPERADMIN, PAGINATION_COUNT } from 'constants/AppConstant';
import {
  Table,
  Divider,
  Tag,
  Menu,
  Modal,
  Pagination,
  Avatar,
  Card,
  Button,
  message,
  Switch,
  Radio,
  Spin,
} from 'antd';
import {
	DeleteOutlined,
	EditOutlined,
  PlusCircleOutlined,
  BarsOutlined
} from '@ant-design/icons';
import './styles.css';
const { confirm } = Modal;

const Lessons = () => {
  const [lessons, setLessons] = useState([]); // store all lessons on current page
  const [total, setTotal] = useState(0); // total number of lessons
  const [currentPage, setCurrentPage] = useState(1); // currebt page the user is on
  const [loading, setLoading] = useState(false); //
  const [visible, setVisible] = useState(false); // true if modal is visible, false otherwise
  const [submit, setSubmit] = useState(false); // true if user has submitted a form
  const [branches, setBranches] = useState(null); // store all branches
  const [schools, setSchools] = useState(null); // store all schools
  const [values, setValues] = useState([
    { name: ["name"], value: '' },
    { name: ["short_name"], value: '' },
    { name: ["description"], value: '' },
    { name: ["price"], value: '' },
    { name: ["exam"], value: '' },
    { name: ["sort"], value: '' },
    { name: ["interval"], value: '' },
    { name: ["school"], value: null },
    { name: ["color"], value: '#457b9d' },
    { name: ['branch'], value: null},
  ]) // store prefilled values of the modal
  const [type, setType] = useState('add'); // either edit or add
  const [dataId, setDataId] = useState(null); // id of the lesson being edited
  const token = useSelector((state) => state.userLogin.token); // auth token from redux
  const role = useSelector((state) => state.userLogin.user.role_id); // role id from redux
  const schoolFilter = useSelector((state) => state.filters.school); // school filter from redux
  const branchFilter = useSelector((state) => state.filters.branch); // branch filter from redux
  const [branchId, setBranchId] = useState(useSelector((state) => state.userLogin.user.branch)); // branch the user is in
  const schoolId = useSelector((state) => state.userLogin.user.school); // school the user is in
	const config = {
		headers: {
			'Content-type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	}

  const activeStyle = {
    backgroundColor: "rgba(4,209,130,1)",
    width: 60,
    textAlign: 'center',
    borderColor: 'rgba(4,209,130,1)',
    color: '#fff',
    fontSize: 12
  }

  const inactiveStyle = {
    backgroundColor: "#ff6b72",
    width: 60,
    textAlign: 'center',
    borderColor: '#ff6b72',
    color: '#fff',
    fontSize: 12
  }

  const notActiveStyle = {
    width: 60,
    textAlign: 'center',
    fontSize: 12
  }

  const columns = [
    {
      title: 'Lesson Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Short Name',
      dataIndex: 'short_name',
      key: 'short_name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: 200,
      key: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 205,
      render: (text, record) => (
        <span>
        {text}
        <Radio.Group
        defaultValue={record.is_active === true ? "true" : "false"}
        buttonStyle="outline" size="small"
        onChange={() => handleActive(record.is_active, record.id, record.branch, record.name, record.short_name, record.price)}
        >
        <Radio.Button value="true" style={record.is_active ? activeStyle : notActiveStyle}>Active</Radio.Button>
        <Radio.Button value="false" style={record.is_active===false ? inactiveStyle : notActiveStyle}>Inactive</Radio.Button>
        </Radio.Group>
        </span>
      )
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      render: (text, record) => (
        <span>
        <Avatar
        style={{
          backgroundColor: text,
          border: "2px solid #fff"
        }}
        />
        </span>
      )
    },
    {
      title: "Sort",
      dataIndex: "sort",
      align: 'center',
      key: "sort",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text, record) => (
        <span>
        {text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{TUGRUG}
        </span>
      )
    },
    {
      title: "Exam",
      dataIndex: "exam",
      align: 'center',
      key: "exam",
    },
    {
      title: "Interval",
      dataIndex: "interval",
      align: 'center',
      key: "interval",
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: (text, record) => (
        <span>
          <EllipsisDropdown
            menu={
              <Menu>
                <Menu.Item key="0" onClick={() => showEditModal(record)}>
                  <EditOutlined />
                  <span>Edit</span>
                </Menu.Item>
                <Menu.Item key="1" onClick={() => showDeleteConfirm(record.id, record.name)}>
                  <DeleteOutlined />
                  <span>Delete</span>
                </Menu.Item>
              </Menu>
            }
          />
        </span>
      ),
    },
  ];

  useEffect(() => {
    getLessons(1);
    if (role === SUPERADMIN) {
      getSchools();
    }
    if (role === ADMIN) {
      getBranches(schoolId);
    }
  }, [schoolFilter, branchFilter]);

  // get all the lessons in parameter page
  const getLessons = (page) => {
    setLoading(true);
    let api = `${url}/api/class/lesson/?page=${page}`;
    if (branchFilter != null) {
      api = api + `&branch=${branchFilter}`
    } else if (schoolFilter != null) {
      api = api + `&school=${schoolFilter}`
    }
    axios.get(
      api,
      config
    ).then((response) => {
      setTotal(response.data.count);
      var data = response.data.results;
      data.forEach((item, i) => {
        item.key = i;
      })
      setLessons(data);
      setCurrentPage(page);
      setLoading(false);
    }).catch((error) => {
      setLoading(false);
      console.log(error.response.data);
    })
  }

  // get all the schools
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
			console.log("get schools error: ", error.response.data);
		})
	}

  // get all the branches in parameter school
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
      setValues([
        { name: ["branch"], value: null },
      ]);
		}).catch(function (error) {
			console.log("get schools error: ", error.response.data);
		})
	}

  // toggle the status of a lesson (active or inactive)
  const handleActive = (is_active, id, branch, name, short_name, price) => {
    const key = 'updatable';
    message.loading('Updating lesson...', key, 0);
    const formData = {};
    formData['name'] = name;
    formData['short_name'] = short_name;
    formData['branch'] = branch;
    formData['price'] = price;
    formData['is_active'] = !is_active;
    axios.put(
      `${url}/api/class/lesson/${id}/`,
      formData,
      config
    ).then((response) => {
      let items = [...lessons];
      let itemIndex = items.findIndex((obj => obj.id===id));
      items[itemIndex].is_active = !is_active;
      setLessons(items);
      message.success({ content: `${name} updated successfully!`, key, duration: 2 });
    }).catch((error) => {
      console.log(error.response.data);
      Object.values(error.response.data).forEach(
        msg => message.error({ content: msg, key, duration: 2 })
      )
    })
  }

  // show delete modal and if user selects 'yes', submit form
  const showDeleteConfirm = (id, name) => {
	  confirm({
	    title: 'Are you sure delete this lesson?',
	    content: name,
	    okText: 'Yes',
	    okType: 'danger',
	    cancelText: 'No',
	    onOk() {
        const key = 'updatable';
        message.loading('Deleting lesson...', key, 0);
        axios.delete(
          `${url}/api/class/lesson/${id}/`,
          config
        ).then((response) => {
          if ((total - 1) - (currentPage - 1)*PAGINATION_COUNT <= 0 && total > 1) {
						getLessons(currentPage - 1);
					} else {
						getLessons(currentPage);
					}
          message.success({ content: `${name} deleted successfully!`, key, duration: 2 });
        }).catch((error) => {
          console.log(error.response.data);
          Object.values(error.response.data).forEach(
            msg => message.error({ content: msg, key, duration: 2 })
          )
        })
	    },
	  });
	}

  // show the modal with prefilled values of the lesson to edit
  const showEditModal = (data) => {
    setType('edit');
    setDataId(data.id);
    setBranchId(data.branch);
    setValues([
      { name: ["name"], value: data.name },
      { name: ["short_name"], value: data.short_name },
      { name: ["description"], value: data.description },
      { name: ["price"], value: data.price },
      { name: ["exam"], value: data.exam },
      { name: ["sort"], value: data.sort },
      { name: ["interval"], value: data.interval },
      { name: ["color"], value: data.color },
      { name: ["is_active"], value: data.is_active },
    ]);
    setVisible(true);
  }

  // show the modal with empty fields to add new lesson
  const showModal = () => {
    setType('add');
    setValues([
      { name: ["name"], value: '' },
      { name: ["short_name"], value: '' },
      { name: ["description"], value: '' },
      { name: ["price"], value: '' },
      { name: ["exam"], value: '' },
      { name: ["sort"], value: '' },
      { name: ["interval"], value: '' },
      { name: ["school"], value: null },
      { name: ["color"], value: '#457b9d' },
      { name: ['branch'], value: null},
    ]);
    if (role===SUPERADMIN) {
      setBranches(null);
    }
    setVisible(true);
  };

  // send request to add new lesson
  const handleNewLesson = (e) => {
    setSubmit(true);
    const formData = {};
    formData['name'] = e.name;
    formData['short_name'] = e.short_name;
    if (role != SUPERADMIN && role != ADMIN) {
      formData['branch'] = branchId;
    } else {
      formData['branch'] = e.branch;
    }
    if (e.description) formData['description'] = e.description;
    if (e.price) formData['price'] = e.price;
    if (e.exam) formData['exam'] = e.exam;
    if (e.sort) formData['sort'] = e.sort;
    if (e.interval) formData['interval'] = e.interval;
    if (e.color) formData['color'] = e.color;
    axios.post(
      `${url}/api/class/lesson/`,
      formData,
      config
    ).then((response) => {
      getLessons(currentPage);
      message.success({ content: `${e.name} added successfully!`, duration: 2 });
      setSubmit(false);
      setVisible(false);
    }).catch((error) => {
      console.log(error.response.data);
      setSubmit(false);
      Object.values(error.response.data).forEach(
        msg => message.error({ content: msg, duration: 2 })
      )
    })
  };

  // set visible to false
  const handleCancel = e => {
    setVisible(false);
  };

  // send request to update a lesson
  const handleUpdate = (e) => {
    setSubmit(true);
    const formData = {};
    formData['name'] = e.name;
    formData['short_name'] = e.short_name;
    formData['branch'] = branchId;
    if (e.description) formData['description'] = e.description;
    if (e.price) formData['price'] = e.price;
    if (e.exam) formData['exam'] = e.exam;
    if (e.sort) formData['sort'] = e.sort;
    if (e.interval) formData['interval'] = e.interval;
    if (e.color) formData['color'] = e.color;
    axios.put(
      `${url}/api/class/lesson/${dataId}/`,
      formData,
      config
    ).then((response) => {
      let items = [...lessons];
      let itemIndex = items.findIndex((obj => obj.id===dataId));
      items[itemIndex].name = e.name;
      items[itemIndex].short_name = e.short_name;
      items[itemIndex].description = e.description;
      items[itemIndex].price = e.price;
      items[itemIndex].sort = e.sort;
      items[itemIndex].exam = e.exam;
      items[itemIndex].interval = e.interval;
      items[itemIndex].color = e.color;
      setLessons(items);
      message.success({ content: `${e.name} updated successfully!`, duration: 2 });
      setSubmit(false);
      setVisible(false);
    }).catch((error) => {
      console.log(error.response.data);
      setSubmit(false);
      Object.values(error.response.data).forEach(
        msg => message.error({ content: msg, duration: 2 })
      )
    })
  }

  return (
    <div>
      <Card title={<h2><BarsOutlined /> Lessons</h2>} extra={<Button type="primary" icon={<PlusCircleOutlined />} onClick={showModal} block>Add Lesson</Button>}>
        {
          !loading ?
          <Table
            loading={loading}
            columns={columns}
            dataSource={lessons}
            size="small"
            scroll={{ x: 900 }}
            pagination={false}
          />
          :
          <Flex justifyContent="center" styles={{padding: 10}}>
            <Spin>
              <Table
                loading={loading}
                columns={columns}
                dataSource={lessons}
                pagination={false}
              />
            </Spin>
          </Flex>
        }
        {
          total > PAGINATION_COUNT ?
          <div style={{marginTop: 20}}>
            <Flex justifyContent="end">
              <Pagination current={currentPage} onChange={getLessons} total={total} pageSize={PAGINATION_COUNT}/>
            </Flex>
          </div>
          : null
        }
      </Card>
      <AddModal
        handleSubmit={handleNewLesson}
        handleUpdate={handleUpdate}
        handleCancel={handleCancel}
        visible={visible}
        type={type}
        branches={branches}
        schools={schools}
        getBranches={getBranches}
        fields={values}
        submit={submit}
      />
    </div>
  )
}

export default Lessons;
