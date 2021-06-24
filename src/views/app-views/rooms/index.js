import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {url} from 'configs/EnvironmentConfig';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex';
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import RoomModal from '../components/rooms/RoomsModal';
import GridItem from '../components/rooms/GridItem';
import { ADMIN, SUPERADMIN, PAGINATION_COUNT } from 'constants/AppConstant';
import {
  Table,
  Menu,
  Card,
  Button,
  Skeleton,
  message,
  Modal,
  Pagination,
  Row,
  Col,
  Empty
} from 'antd';
import {
	DeleteOutlined,
	EditOutlined,
  AppstoreOutlined,
  PlusOutlined
} from '@ant-design/icons';
const { confirm } = Modal;

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [type, setType] = useState('add');
  const [branches, setBranches] = useState(null);
  const [schools, setSchools] = useState(null);
  const [dataId, setDataId] = useState(null);
  const [branchId, setBranchId] = useState(useSelector((state) => state.userLogin.user.branch));
  const [fields, setFields] = useState([
    { name: ["name"], value: '' },
    { name: ["capacity"], value: '' },
    { name: ['branch'], value: null},
  ])
  const schoolFilter = useSelector((state) => state.filters.school);
  const branchFilter = useSelector((state) => state.filters.branch);
  const token = useSelector((state) => state.userLogin.token);
  const role = useSelector((state) => state.userLogin.user.role_id);
  const schoolId = useSelector((state) => state.userLogin.user.school);
  const config = {
		headers: {
			'Content-type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	}

  useEffect(() => {
    getRooms(1);
    if (role === SUPERADMIN) {
      getSchools();
    }
    if (role === ADMIN) {
      getBranches(schoolId);
    }
  }, [schoolFilter, branchFilter])

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
      setFields([
        { name: ["branch"], value: null },
      ])
		}).catch(function (error) {
			console.log("get schools error: ", error.response.data);
		})
	}

  // get all the rooms on parameter page
  const getRooms = (page) => {
    setLoading(true);
    let api = `${url}/api/class/room/?page=${page}`;
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
      setRooms(data);
      setCurrentPage(page);
      setLoading(false);
    }).catch((error) => {
      console.log(error.response.data);
    })
  }

  // show the modal with fields prefilled with the values of the room to edit
  const showEditModal = (data) => {
    setFields([
      { name: ["name"], value: data.name },
      { name: ["capacity"], value: data.capacity },
      { name: ['branch'], value: data.branch},
    ]);
    setDataId(data.id);
    setBranchId(data.branch);
    setType('edit');
    setVisible(true);
  }

  // show the modal with the fields on the modal empty to add new room
  const showModal = () => {
    setFields([
      { name: ["name"], value: '' },
      { name: ["capacity"], value: '' },
      { name: ['branch'], value: null},
      { name: ['school'], value: null},
    ]);
    if (role===SUPERADMIN) {
      setBranches(null);
    }
    setType('add');
    setVisible(true);
  }

  // show the delete modal and send request if user selects 'yes'
  const showDeleteConfirm = (id, name) => {
    confirm({
	    title: 'Are you sure delete this room?',
	    content: name,
	    okText: 'Yes',
	    okType: 'danger',
	    cancelText: 'No',
	    onOk() {
        const key = 'updatable';
        message.loading('Deleting room...', key, 0);
        axios.delete(
          `${url}/api/class/room/${id}/`,
          config
        ).then((response) => {
          if ((total - 1) - (currentPage - 1)*PAGINATION_COUNT <= 0 && total > 1) {
						getRooms(currentPage - 1);
					} else {
						getRooms(currentPage);
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

  // set visiblity of modal to false
  const handleCancel = e => {
    setVisible(false);
  };

  // send request to add new room
  const handleNewRoom = (e) => {
    setSubmit(true);
    const formData = {};
    formData['name'] = e.name;
    formData['capacity'] = e.capacity;
    if (role != SUPERADMIN && role != ADMIN) {
      formData['branch'] = branchId;
    } else {
      formData['branch'] = e.branch;
    }
    axios.post(
      `${url}/api/class/room/`,
      formData,
      config
    ).then((response) => {
      getRooms(currentPage);
      message.success({ content: `${e.name} added successfully!`, duration: 2 });
      setSubmit(false);
      setVisible(false);
    }).catch((error) => {
      console.log(error.response.data);
      Object.values(error.response.data).forEach(
        msg => message.error({ content: msg, duration: 2 })
      )
      setSubmit(false);
    })
  };

  // send request to update a room
  const handleUpdate = (e) => {
    setSubmit(true);
    const formData = {};
    formData['name'] = e.name;
    formData['capacity'] = e.capacity;
    formData['branch'] = branchId;
    axios.put(
      `${url}/api/class/room/${dataId}/`,
      formData,
      config
    ).then((response) => {
      let items = [...rooms];
      let itemIndex = items.findIndex((elem) => elem.id===dataId);
      items[itemIndex].name = e.name;
      items[itemIndex].capacity = e.capacity;
      // getRooms(currentPage);
      setRooms(items);
      message.success({ content: `${e.name} updated successfully!`, duration: 2 });
      setSubmit(false);
      setVisible(false);
    }).catch((error) => {
      console.log(error.response.data);
      Object.values(error.response.data).forEach(
        msg => message.error({ content: msg, duration: 2 })
      )
      setSubmit(false);
    })
  }

  return (
    <>
    <PageHeaderAlt className="border-bottom">
			<div className="container-fluid">
				<Flex justifyContent="between" alignItems="center">
					<h2><AppstoreOutlined /> Rooms</h2>
					<div>
						<Button type="primary" className="ml-2" onClick={showModal}>
							<PlusOutlined />
							<span>Add Room</span>
						</Button>
					</div>
				</Flex>
			</div>
		</PageHeaderAlt>
		<div className={`my-4 container-fluid`}>
      {
        loading ?
        <Skeleton active />
        :
        <>
          {
            rooms.length > 0 ?
            <>
            <Row gutter={16}>
            {rooms.map(elm => (
              <Col xs={24} sm={8} lg={8} xl={8} xxl={6} key={elm.id}>
                <GridItem data={elm} remove={showDeleteConfirm} showEditModal={showEditModal}/>
              </Col>
            ))}
            </Row>
            {
              rooms.length > PAGINATION_COUNT ?
              <Flex justifyContent="end">
                <Pagination current={currentPage} onChange={getRooms} total={total} pageSize={PAGINATION_COUNT}/>
              </Flex>
              : null
            }
            </>
            :
            <Empty />
          }
        </>
      }
		</div>
    <RoomModal
      handleSubmit={handleNewRoom}
      handleUpdate={handleUpdate}
      handleCancel={handleCancel}
      visible={visible}
      type={type}
      branches={branches}
      getBranches={getBranches}
      schools={schools}
      fields={fields}
      role={role}
      submit={submit}
    />
    </>
  )
}

export default Rooms;
