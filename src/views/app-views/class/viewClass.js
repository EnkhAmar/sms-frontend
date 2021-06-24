import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import {
  Skeleton,
  Tabs,
  Button,
  message,
  Modal
} from 'antd';
import {
  PlusCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
import {url} from 'configs/EnvironmentConfig';
import { SUPERADMIN, ADMIN, STUDENT_GROUP } from 'constants/AppConstant';
import './styles.css'
import Class from '../components/class/view/class';
import Students from '../components/class/view/students';
import AddStudentModal from '../components/class/view/new/addStudentModal';
import Flex from 'components/shared-components/Flex';
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import moment from 'moment';

const { TabPane } = Tabs;
const { confirm } = Modal;

const ViewClass = (props) => {
  const { id } = props.match.params;
  const [students, setStudents] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('active');
  const [allStudents, setAllStudents] = useState(null);
  const [classItem, setClassItem] = useState(null);
  const [status, setStatus] = useState(null);
  const [discounts, setDiscounts] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [studentLoading, setStudentLoading] = useState(false);
  const [editNote, setEditNote] = useState(false);
  const [noteLoading, setNoteLoading] = useState(false);
  const [fields, setFields] = useState([
    {name: ['first_name'], value: ''},
    {name: ['last_name'], value: ''},
    {name: ['email'], value: ''},
    {name: ['phone'], value: ''},
    {name: ['start_date'], value: ''},
    {name: ['end_date'], value: ''},
  ])
  const [total, setTotal] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState(1);
  const [searchFilter, setSearchFilter] = useState(null);
  const role = useSelector((state) => state.userLogin.user.role_id); // role id from redux
  const schoolId = useSelector((state) => state.userLogin.user.school); // school id from redux
  const branchId = useSelector((state) => state.userLogin.user.branch); // branch id from redux
  const branchFilter = useSelector((state) => state.filters.branch); // branch filter from redux
  const schoolFilter = useSelector((state) => state.filters.school); // schoolFilter from redux
  const token = useSelector((state) => state.userLogin.token); // auth token from redux
	const config = {
		headers: {
			'Content-type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	}

  useEffect(() => {
    getStudents(1);
    getClass();
  }, [currentStatus, searchFilter]);

  // get all the students on the page parameter
  const getStudents = (page) => {
    setStudentLoading(true);
    let api = `${url}/api/class/action/${id}/student/?page=${page}`;
    if (currentStatus === 'active') {
      api = api + '&status=active';
    } else if (currentStatus === 'completed') {
      api = api + '&status=completed';
    } else {
      api = api + '&status=canceled';
    }
    if (searchFilter) api = api + `&search=${searchFilter}`;
    axios.get(
      api,
      config
    ).then(function (response) {
      var data = response.data.results;
      data.forEach((item, i) => {
        item.key = i;
      }) // add unique key to each student
      setStudents(data);
      console.log(data);
      setCurrentPage(page);
      setTotal(response.data.count);
      setStudentLoading(false);
    }).catch(function (error) {
      console.log(error.response.data);
      setStudentLoading(false);
    })
  }

  // get info of the class user is in
  const getClass = () => {
    axios.get(
      `${url}/api/class/action/${id}/`,
      config
    ).then(function (response) {
      setClassItem(response.data.data);
      setTotalPayment(response.data.data.lesson_price * response.data.data.students_count)
      console.log(response.data.data);
    }).catch(function (error) {
      console.log(error);
    })
  }

  // show modal to add new student to a class and empty the input fields
  const showModal = () => {
    if (!classItem) {
      message.error({ content: "Please Wait", duration: 2 });
      return false;
    }
    getAllStudents();
    getStatus();
    getDiscounts()
    setFields([
      {name: ['student'], value: null},
      {name: ['status'], value: null},
      {name: ['discount'], value: []},
      {name: ['first_name'], value: ''},
      {name: ['last_name'], value: ''},
      {name: ['email'], value: ''},
      {name: ['phone'], value: ''},
      {name: ['note'], value: null},
      {name: ['payment_paid'], value: null},
      {name: ['start_date'], value: moment(classItem.start_date, "YYYY-MM-DD")},
      {name: ['end_date'], value: moment(classItem.end_date, "YYYY-MM-DD")},
    ])
    setVisible(true)
  }

  // get all status in same branch as the class
  const getStatus = () => {
    setStatus(null);
    axios.post(
			`${url}/api/utility/detail/`,
			{
				'projection': ['status'],
        "branch": classItem.branch
			},
			config
		).then(function (response) {
			setStatus(response.data.data.status);
		}).catch(function (error) {
			console.log("get schools error: ", error.response.data);
		})
  }

  // get all discounts in same branch as the class
  const getDiscounts = () => {
    setDiscounts(null);
    axios.post(
			`${url}/api/utility/detail/`,
			{
				'projection': ['discount'],
        "branch": classItem.branch
			},
			config
		).then(function (response) {
			setDiscounts(response.data.data.discount);
		}).catch(function (error) {
			console.log("get schools error: ", error.response.data);
		})
  }

  // get all the students in the same branch as the class
  const getAllStudents = () => {
    setAllStudents(null);
    axios.post(
			`${url}/api/utility/detail/`,
			{
				'projection': ['user'],
				"groups": STUDENT_GROUP,
        "branch": classItem.branch
			},
			config
		).then(function (response) {
      setAllStudents(response.data.data.user);
		}).catch(function (error) {
			console.log("get students error: ", error.response.data);
		})
  }

  // set the visibility of the modal to false
  const handleCancel = () => {
    setVisible(false)
  }

  // send request to add a new student user
  const handleNewStudent = (e) => {
    setLoading(true);
    let formData = {};
    formData['firstname'] = e.first_name;
    formData['lastname'] = e.last_name;
    formData['branch'] = classItem.branch;
    formData['school'] = classItem.school;
    formData['phone'] = e.phone;
    formData['email'] = e.email;
    formData['groups'] = STUDENT_GROUP;
    axios.post(
			`${url}/api/auth/action/`,
      formData,
			config
		).then(function (response) {
      handleSelectStudent(response.data.data.id, e.status, e.discount, '', e.start_date, e.end_date, 0);
		}).catch(function (error) {
      setLoading(false);
      console.log(error.response.data);
      Object.values(error.response.data).forEach(
				msg => message.error({ content: msg, duration: 2 })
			)
		})
  }

  // send request to add student to the class
  const handleSelectStudent = (user_id, status_id, discount, note, start_date, end_date) => {
    setLoading(true);
    let formData = {};
    formData["user"] = user_id;
    formData["status"] = status_id;
    formData['start_date'] = start_date.format('YYYY-MM-DD');
    formData['end_date'] = end_date.format('YYYY-MM-DD');
    if (discount) formData['discount'] = discount;
    if (note) formData["note"] = note;
    axios.post(
      `${url}/api/class/action/${id}/student/`,
      formData,
      config
    ).then((response) => {
      getStudents(currentPage);
      setVisible(false);
      setLoading(false);
      getClass();
      message.success({ content: "Added successfully", duration: 2 })
    }).catch(function (error) {
      setLoading(false);
      console.log(error.response.data);
      Object.values(error.response.data).forEach(
				msg => message.error({ content: msg, duration: 2 })
			)
		})
  }

  // send request to update class note
  const handleNote = (note) => {
    setNoteLoading(true);
    axios.put(
      `${url}/api/class/action/${id}/`,
      {
        "name": classItem.name,
        "start_date": classItem.start_date,
        "end_date": classItem.end_date,
        "start_time": classItem.start_time,
        "end_time": classItem.end_time,
        "branch": classItem.branch,
        "lesson": classItem.lesson,
        "teacher": classItem.teacher,
        "note": note
      },
      config
    ).then(function (response) {
      getClass();
      setNoteLoading(false);
      setEditNote(false);
      message.success({ content: "Class note updated successfully", duration: 2 })
    }).catch(function (error) {
      console.log(error);
      setNoteLoading(false);
      Object.values(error.response.data).forEach(
				msg => message.error({ content: msg, duration: 2 })
			)
    })
  }

  return (
    <>
      <PageHeaderAlt className="border-bottom" overlap>
        <div className="container-fluid">
          <Flex className="py-2" justifyContent="between" alignItems="center">
            <h2 className="mb-3">Class Information</h2>
            <div className="mb-3" style={{textAlign: 'right'}}>
							<Button type="primary" icon={<PlusCircleOutlined />} onClick={showModal} block>Add Student</Button>
						</div>
          </Flex>
        </div>
      </PageHeaderAlt>
      <div className="container">
        <Tabs defaultActiveKey="1" style={{marginTop: 30}}>
          <TabPane tab="Class Detail" key="1">
            {
              classItem && students ?
              <Class
                classItem={classItem}
                showModal={showModal}
                totalPayment={totalPayment}
                handleNote={handleNote}
                edit={editNote}
                setEdit={setEditNote}
                loading={noteLoading}
              />
              :
              <Skeleton active />
            }
          </TabPane>
          <TabPane tab="Students" key="2">
            {
              students && classItem ?
              <Students
                students={students}
                classItem={classItem}
                getStudents={getStudents}
                currentPage={currentPage}
                setCurrentStatus={setCurrentStatus}
                loading={studentLoading}
                getClass={getClass}
                setStudents={setStudents}
                allStatus={status}
                allDiscounts={discounts}
                totalStudents={total}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                setSearchFilter={setSearchFilter}
                getStatus={getStatus}
                getDiscounts={getDiscounts}
                role={role}
              />
              :
              <Skeleton active />
            }
          </TabPane>
        </Tabs>
      </div>
      <AddStudentModal
        visible={visible}
        handleCancel={handleCancel}
        handleNewStudent={handleNewStudent}
        handleSelectStudent={handleSelectStudent}
        loading={loading}
        fields={fields}
        students={allStudents}
        status={status}
        discounts={discounts}
        totalPayment={totalPayment}
      />
    </>
  )
}

export default ViewClass;
