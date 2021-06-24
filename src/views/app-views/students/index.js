import { useState, useEffect, useRef } from 'react';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom'
import {
  Table,
  Card,
  Pagination,
  Button,
  Menu,
  Row,
  Col,
  Spin,
  Empty,
  Modal,
  message
} from 'antd';
import {
	DeleteOutlined,
	EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Filters from './filters';
import StudentInfo from './studentInfo';
import StudentModal from './modal/studentModal';
import {url} from 'configs/EnvironmentConfig';
import axios from 'axios';
import { ADMIN, SUPERADMIN, PAGINATION_COUNT, STUDENT_GROUP } from 'constants/AppConstant';
import moment from 'moment';

const { confirm } = Modal;
const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const Students = () => {
  const [students, setStudents] = useState(null);
  const [studentsInfo, setStudentsInfo] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [classFilter, setClassFilter] = useState(null);
  const [lessonFilter, setLessonFilter] = useState(null);
  const [paymentFilter, setPaymentFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchFilter, setSearchFilter] = useState(null);
  const [classes, setClasses] = useState(null);
  const [lessons, setLessons] = useState(null);
  const [payments, setPayments] = useState(null);
  const [status, setStatus] = useState(null);
  const [filterFields, setFilterFields] = useState([]);
  const [visible, setVisible] = useState(false);
  const [schools, setSchools] = useState(null);
  const [branches, setBranches] = useState(null);
  const [fields, setFields] = useState([]);
  const [type, setType] = useState('add');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [dataId, setDataId] = useState(null); // the id of the student to edit
  const branchFilter = useSelector((state) => state.filters.branch);
  const schoolFilter = useSelector((state) => state.filters.school);
  const branchId = useSelector((state) => state.userLogin.user.branch); // branch id from redux
  const schoolId = useSelector((state) => state.userLogin.user.school); // school id from redux
  const role = useSelector((state) => state.userLogin.user.role_id); // role id from redux
  const token = useSelector((state) => state.userLogin.token); // auth token from redux
  const config = {
		headers: {
			'Content-type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	}
  const prevFilter = usePrevious({schoolFilter, branchFilter});

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (text, record) => (
        <span>
          <Link to={`/app/profile/${record.id}`}>
            <h5>{record.firstname} {record.lastname}</h5>
          </Link>
          {record.email}
        </span>
      )
    },
    {
      title: "Phone",
      key: 'phone',
      dataIndex: 'phone',
      render: (text) => (
        <span>{`(+976) ${text.toString().slice(0,4)} - ${text.toString().slice(4,8)}`}</span>
      )
    },
    {
      title: "Classes",
      key: "classes",
      align: 'center',
      dataIndex: "students_count"
    },
    {
      title: '',
      key: 'actions',
      align: 'right',
      render: (text, record) => (
        <EllipsisDropdown
        menu={
          <Menu>
            <Menu.Item key="0" onClick={() => showEditModal(record.id)}>
              <EditOutlined />
              <span>Edit</span>
            </Menu.Item>
            <Menu.Item key="1" onClick={() => showDeleteConfirm(record.id, record.firstname + ' ' +record.lastname)}>
              <DeleteOutlined />
              <span>Delete</span>
            </Menu.Item>
          </Menu>
        }
        />
      )
    }
  ]

  useEffect(() => {
    getStudents(1);
    if (role !== ADMIN && role !== SUPERADMIN) {
      getPayments(null);
      getStatus(null);
			getLessons(null);
			getClasses(null);
		} else {
			if (branchFilter != null) {
        getPayments(branchFilter);
        getStatus(branchFilter);
				getLessons(branchFilter);
				getClasses(branchFilter);
			} else {
        setPayments(null);
        setStatus(null);
				setClasses(null);
				setLessons(null);
			}
		}
  }, [schoolFilter, branchFilter, statusFilter, lessonFilter, classFilter, searchFilter, paymentFilter])

  // reset the filter fields and their values
  const resetFilterFields = () => {
		setClassFilter(null);
		setLessonFilter(null);
    setPaymentFilter(null);
    setStatusFilter(null);
		setFilterFields([
			{name: ['lesson'], value: null},
			{name: ['class'], value: null},
      {name: ['status'], value: null},
      {name: ['payment'], value: null},
		]);
	}

  // get the students using the api and adding the filters
  const getStudents = (page) => {
    setLoading(true);
    let api = `${url}/api/student/action/?page=${page}`
    if (branchFilter != null) {
      api = api + `&branch=${branchFilter}`
    } else if (schoolFilter != null) {
      api = api + `&school=${schoolFilter}`
    }
    if (prevFilter) {
      if (prevFilter.schoolFilter === schoolFilter && prevFilter.branchFilter === branchFilter) {
        if (lessonFilter !== null) api = api + `&lesson=${lessonFilter}`;
        if (classFilter !== null) api = api + `&class=${classFilter}`;
        if (statusFilter !== null) api = api + `&status=${statusFilter}`;
        if (searchFilter !== null) api = api + `&search=${searchFilter}`;
        if (paymentFilter !== null) api = api + `&payment=${paymentFilter}`;
      } else {
        resetFilterFields();
      }
    }
    console.log(api);
    axios.get(
      api,
      config
    ).then((response) => {
      var data = response.data.results;
      data.forEach((item, i) => {
        item.key = item.id;
      })
      setStudents(data);
      setTotal(response.data.count);
      setCurrentPage(page);
      setLoading(false);
    }).catch((error) => {
      setLoading(false);
      console.log(error.response.data);
    })
  }

  // get all the classes in a given branch
  const getClasses = (branch) => {
    axios.post(
      `${url}/api/utility/detail/`,
      {
        "projection": ["class"],
        "branch": branch
      },
      config
    ).then((response) => {
      setClasses(response.data.data.class);
    }).catch((error) => {
      console.log("class error", error.response.data);
    })
  }

  // get all the lessons in a given branch
  const getLessons = (branch) => {
    axios.post(
      `${url}/api/utility/detail/`,
      {
        "projection": ["lesson"],
        "branch": branch
      },
      config
    ).then((response) => {
      setLessons(response.data.data.lesson);
    }).catch((error) => {
      console.log(error.response.data);
    })
  }

  // get all payment types
  const getPayments = (branch) => {
    axios.post(
      `${url}/api/utility/detail/`,
      {
        "projection": ["payment"],
        "branch": branch
      },
      config
    ).then((response) => {
      setPayments(response.data.data.payment);
    }).catch((error) => {
      console.log(error.response.data);
    })
  }

  // get all status
  const getStatus = (branch) => {
    axios.post(
      `${url}/api/utility/detail/`,
      {
        "projection": ["status"],
        "branch": branch
      },
      config
    ).then((response) => {
      setStatus(response.data.data.status);
    }).catch((error) => {
      console.log(error.response.data);
    })
  }

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

	const getBranches = (school) => {
    setBranches(null);
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
      ]);
		}).catch(function (error) {
			console.log("get schools error: ", error.response.data);
		})
	}

  const classChange = (val) => {
    if (val) {
      setClassFilter(val);
    } else {
      setClassFilter(null);
      setPaymentFilter(null);
      setStatusFilter(null);
      setLessonFilter(null);
      setFilterFields([
        {name: ['lesson'], value: null},
  			{name: ['class'], value: null},
        {name: ['status'], value: null},
        {name: ['payment'], value: null},
      ])
    }
  }

  const lessonChange = (val) => {
    val ? setLessonFilter(val) : setLessonFilter(null)
  }

  const paymentChange = (val) => {
    val ? setPaymentFilter(val) : setPaymentFilter(null)
  }

  const statusChange = (val) => {
    val ? setStatusFilter(val) : setStatusFilter(null)
  }

  const handleSearch = (value) => {
		value ? setSearchFilter(value) : setSearchFilter(null)
	}

  const getStudentClassInfo = (page, id) => {
    axios.get(
      `${url}/api/student/action/${id}/user/?page=${page}`,
      config
    ).then((response) => {
      var data = response.data.results;
      data.forEach((item, i) => {
        item.key = -item.id;
      })
      setStudentsInfo([...studentsInfo, {id: id, count: response.data.count, results: data}])
    }).catch((error) => {
      console.log(error.response.data);
    })
  }

  // show modal for adding new student
  const showModal = () => {
    setType('add');
    if (role === SUPERADMIN) {
      getSchools();
    } else if (role === ADMIN) {
      getBranches(schoolId)
    }
    setFields([
      {name: ['school'], value: null},
      {name: ['branch'], value: null},
      {name: ['firstname'], value: null},
      {name: ['lastname'], value: null},
      {name: ['email'], value: null},
      {name: ['phone'], value: null},
      {name: ['register'], value: null},
      {name: ['dob'], value: null},
      {name: ['address_city'], value: null},
      {name: ['address_district'], value: null},
      {name: ['address_khoroo'], value: null},
      {name: ['address_appartment'], value: null},
    ])
    setVisible(true);
  }

  // show modal for editing a student
  const showEditModal = (id) => {
    setType('edit');
    axios.get(
      `${url}/api/auth/action/${id}/`,
      config
    ).then((response) => {
      let data = response.data.data
      setDataId(id);
      setFields([
        {name: ['school'], value: null},
        {name: ['branch'], value: null},
        {name: ['firstname'], value: data.firstname},
        {name: ['lastname'], value: data.lastname},
        {name: ['email'], value: data.email},
        {name: ['phone'], value: parseInt(data.phone)},
        {name: ['register'], value: data.profile.register},
        {name: ['dob'], value: data.profile.dob ? moment(data.profile.dob) : null},
        {name: ['address_city'], value: data.profile.address_city},
        {name: ['address_district'], value: data.profile.address_district},
        {name: ['address_khoroo'], value: data.profile.address_khoroo},
        {name: ['address_appartment'], value: data.profile.address_appartment},
      ])
      setVisible(true)
    }).catch((error) => {
      console.log(error.response.data);
    })
  }

  const handleCancel = () => {
    setVisible(false)
  }

  // show modal for deleting a student
  const showDeleteConfirm = (id, name) => {
    confirm({
      title: 'Are you sure delete this student?',
      content: name,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        const key = 'updatable';
        message.loading({ content: 'Deleting...', key, duration: 0 });
        axios.delete(
          `${url}/api/auth/action/${id}/`,
          config
        ).then((response) => {
          if ((total - 1) - (currentPage - 1)*PAGINATION_COUNT <= 0 && total > 1) {
						getStudents(currentPage - 1);
					} else {
						getStudents(currentPage);
					}
          message.success({ content: `${name} deleted successfully!`, key, duration: 2 });
        }).catch((error) => {
          Object.values(error.response.data).forEach(
    				msg => message.error({ content: msg, key, duration: 2 })
    			)
        })
      }
    });
  }

  const handleNewStudent = (e) => {
    setSubmitLoading(true);
    e["groups"] = STUDENT_GROUP;
    if (role !== SUPERADMIN) e["school"] = schoolId;
    if (role !== SUPERADMIN && role !== ADMIN) e["branch"] = branchId;
    if (e.dob) e['dob'] = e.dob.format("YYYY-MM-DD");
    axios.post(
      `${url}/api/auth/action/`,
      e,
      config
    ).then((response) => {
      getStudents(currentPage);
      setSubmitLoading(false);
      setVisible(false);
      message.success({ content: `${e.firstname + ' ' + (e.lastname ? e.lastname : '')} added successfully`, duration: 2 })
    }).catch((error) => {
      setSubmitLoading(false);
      console.log(error.response.data);
      Object.values(error.response.data).forEach(
        msg => message.error({ content: msg, duration: 2 })
      )
    })
  }

  const handleEditStudent = (e) => {
    setSubmitLoading(true);
    e["groups"] = STUDENT_GROUP;
    if (e.dob) e['dob'] = e.dob.format("YYYY-MM-DD");
    axios.put(
      `${url}/api/auth/action/${dataId}/`,
      e,
      config
    ).then((response) => {
      let items = [...students];
      let index = items.findIndex((item) => item.id === dataId);
      items[index].firstname = e.firstname;
      items[index].lastname = e.lastname;
      items[index].email = e.email;
      items[index].phone = e.phone;
      setStudents(items);
      setSubmitLoading(false);
      setVisible(false);
      message.success({ content: `${e.firstname + ' ' + (e.lastname ? e.lastname : '')} updated successfully`, duration: 2 })
    }).catch((error) => {
      setSubmitLoading(false);
      console.log(error.response.data);
      Object.values(error.response.data).forEach(
        msg => message.error({ content: msg, duration: 2 })
      )
    })
  }

  return (
    <>
      <Card title={'Students'} extra={<Button type="primary" icon={<PlusCircleOutlined />} onClick={showModal} block>Add Student</Button>}>
        <Filters
          classes={classes}
          lessons={lessons}
          payments={payments}
          status={status}
          branchFilter={branchFilter}
          role={role}
          fields={filterFields}
          paymentChange={paymentChange}
          classChange={classChange}
          lessonChange={lessonChange}
          statusChange={statusChange}
          handleSearch={handleSearch}
          classFilter={classFilter}
        />
        <Table
          loading={loading}
          columns={columns}
          dataSource={students}
          size="small"
          scroll={{ x: 500 }}
          pagination={false}
          expandable={{
            expandedRowRender: record => {
              if (!studentsInfo.find((item) => item.id === record.id) && record.students_count > 0) getStudentClassInfo(1, record.id);
              return (
                <>
                {
                  record.students_count > 0 ?
                  <>
                  {
                    studentsInfo.find((item) => item.id === record.id) ?
                    <>
                    {
                      <StudentInfo data={studentsInfo.find((item) => item.id === record.id).results} />
                    }
                    {
                      studentsInfo.find((item) => item.id === record.id).count > PAGINATION_COUNT ?
                      <Flex justifyContent="end">
                        <Pagination onChange={(page) => getStudentClassInfo(page, record.id)} total={studentsInfo.find((item) => item.id === record.id).count} pageSize={PAGINATION_COUNT}/>
                      </Flex>
                      : null
                    }
                    </>
                    :
                    <Flex justifyContent="center">
                      <Spin style={{margin: 10}} />
                    </Flex>
                  }
                  </>
                  : <Empty
                      imageStyle={{
                        height: 60,
                      }}
                      description={<span>This student is not in any class</span>}
                    />
                }
                </>
              )
            }
          }}
        />
        {
          total > PAGINATION_COUNT ?
          <div style={{marginTop: 20}}>
            <Flex justifyContent="end">
              <Pagination current={currentPage} onChange={getStudents} total={total} pageSize={PAGINATION_COUNT}/>
            </Flex>
          </div>
          : null
        }
      </Card>
      <StudentModal
        visible={visible}
        handleCancel={handleCancel}
        branches={branches}
        schools={schools}
        getBranches={getBranches}
        role={role}
        type={type}
        fields={fields}
        handleNewStudent={handleNewStudent}
        handleEditStudent={handleEditStudent}
        loading={submitLoading}
      />
    </>
  )
}

// <Row gutter={16} style={{marginTop: 10}}>
// {studentsInfo.find((item) => item.id === record.id).results.map(elm => (
//   <Col xs={12} sm={12} md={8} lg={8} xl={8} xxl={6} key={-elm.id}>
//     <StudentInfo data={elm} />
//   </Col>
// ))}
// </Row>

export default Students;
