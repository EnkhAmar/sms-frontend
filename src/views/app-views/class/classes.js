import React, { useState, useEffect, useRef } from 'react'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import {
	Radio,
	Button,
	Row,
	Col,
	Skeleton,
	Pagination,
	Modal,
	Empty,
	message,
} from 'antd';
import { AppstoreOutlined, UnorderedListOutlined, PlusOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import {
	GroupOutlined,
} from '@ant-design/icons';
import './styles.css';
import Filters from '../components/class/classes/Filters';
import ClassModal from '../components/class/classes/ClassModal';
import GridItem from '../components/class/classes/GridItem';
import ListItem from '../components/class/classes/ListItem';
import { SUPERADMIN, ADMIN, PAGINATION_COUNT, TEACHER_GROUP } from 'constants/AppConstant';
import Flex from 'components/shared-components/Flex';
import axios from 'axios';
import {url} from 'configs/EnvironmentConfig';
import moment from 'moment';
const { confirm } = Modal;

const VIEW_LIST = 'LIST';
const VIEW_GRID = 'GRID';

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const Classes = () => {
	const [view, setView] = useState(VIEW_GRID); // either in grid view or list view
	const [classes, setClasses] = useState([]); // store all the classes
	const [loading, setLoading] = useState(false); // true if getting the data. False otherwise
	const [visible, setVisible] = useState(false); // true if modal is visible.
	const [submit, setSubmit] = useState(false); // true if a request to add or edit is sent.
	const [total, setTotal] = useState(0); // store the total number of classes
	const [currentPage, setCurrentPage] = useState(1); // store the current page the user is on
	const [type, setType] = useState('add'); // either add or edit.
	const [schools, setSchools] = useState(null); // store the schools
	const [branches, setBranches] = useState(null); // store the branches.
	const [teachers, setTeachers] = useState(null); // store the teachers.
	const [lessons, setLessons] = useState(null); // store the lessons.
	const [dataId, setDataId] = useState(null); // store the id of the class to be edited
	const [lessonFilter, setLessonFilter] = useState(null);
	const [teacherFilter, setTeacherFilter] = useState(null);
	const [searchFilter, setSearchFilter] = useState(null);
	const [statusFilter, setStatusFilter] = useState('active');
	const [lessonFilterItems, setLessonFilterItems] = useState(null);
	const [teacherFilterItems, setTeacherFilterItems] = useState([]);
	const [fields, setFields] = useState([
		{name: ['name'], value: null},
		{name: ['school'], value: null},
		{name: ['branch'], value: null},
		{name: ['teacher'], value: null},
		{name: ['lesson'], value: null},
		{name: ['start'], value: null},
		{name: ['end'], value: null},
		{name: ['start_time'], value: null},
		{name: ['end_time'], value: null},
	]) // store the values for the fields on the modal
	const [filterFields, setFilterFields] = useState([
		{name: ['lesson'], value: null},
		{name: ['teacher'], value: null},
		{name: ['status'], value: 'active'}
	])
	const token = useSelector((state) => state.userLogin.token); // auth token from redux
	const role = useSelector((state) => state.userLogin.user.role_id); // role id from redux
	const schoolId = useSelector((state) => state.userLogin.user.school); // school the user is in, from redux
	const [branchId, setBranchId] = useState(useSelector((state) => state.userLogin.user.branch)); // branch the user is in, from redux
	const schoolFilter = useSelector((state) => state.filters.school); // the school filter from redux
	const branchFilter = useSelector((state) => state.filters.branch); // the branch filter from redux
	const config = {
		headers: {
			'Content-type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	}
	const key = "add";
	const delKey = 'delete';
	const prevFilter = usePrevious({schoolFilter, branchFilter});

	useEffect(() => {
		getClasses(1);
		if (role === SUPERADMIN) {
			// get all the schools if user is superadmin
			getSchools();
		} else if (role === ADMIN) {
			// get all branches in the school the user belongs to
			getBranches(schoolId);
		} else {
			// get all lessons and teachers if user is neither superadmin nor admin
			getLessons(branchId);
			getTeachers(branchId);
		}
		if (role !== ADMIN && role !== SUPERADMIN) {
			getLessons(branchId, 'filter');
			getTeachers(branchId, 'filter');
		} else {
			if (branchFilter != null) {
				getLessons(branchFilter, 'filter');
				getTeachers(branchFilter, 'filter');
			} else {
				setTeacherFilterItems(null);
				setLessonFilterItems(null);
			}
		}
	}, [schoolFilter, branchFilter, statusFilter, lessonFilter, teacherFilter, searchFilter]);

	// set the filter fields to null
	const resetFilterFields = () => {
		setTeacherFilter(null);
		setLessonFilter(null);
		setFilterFields([
			{name: ['lesson'], value: null},
			{name: ['teacher'], value: null},
		]);
	}

	// get all the classes on parameter page
	const getClasses = (page) => {
		setLoading(true);
		let api = `${url}/api/class/action/?page=${page}`;
		if (branchFilter != null) {
      api = api + `&branch=${branchFilter}`
    } else if (schoolFilter != null) {
      api = api + `&school=${schoolFilter}`
    }
		if (statusFilter != null) api = api + `&status=${statusFilter}`;
		if (prevFilter) {
      if (prevFilter.schoolFilter === schoolFilter && prevFilter.branchFilter === branchFilter) {
        if (lessonFilter != null) api = api + `&lesson=${lessonFilter}`;
				if (teacherFilter != null) api = api + `&teacher=${teacherFilter}`;
				if (searchFilter != null) api = api + `&search=${searchFilter}`;
      } else {
        resetFilterFields();
      }
    }
		axios.get(
			api,
			config
		).then(function (response) {
			setTotal(response.data.count);
			setCurrentPage(page);
			setClasses(response.data.results);
			setLoading(false);
		}).catch(function (error) {
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
				{name: ['start'], value: null},
				{name: ['end'], value: null},
      ]);
		}).catch(function (error) {
			console.log("get schools error: ", error);
		})
	}

	// get all the lessons in the parameter branch and store the values as filter items
	// or items in the form
	const getLessons = (branch, lessonType) => {
		if (lessonType==='filter') {
			setLessonFilterItems(null);
		} else {
			setLessons(null);
		}
		axios.post(
			`${url}/api/utility/detail/`,
			{
				'projection': ['lesson'],
				"branch": branch
			},
			config
		).then(function (response) {
			if (lessonType==='filter') {
				setLessonFilterItems(response.data.data.lesson);
			} else {
				setLessons(response.data.data.lesson);
			}
		}).catch(function (error) {
			console.log("get schools error: ", error.response.data);
		})
	}

	// get all the teachers in the parameter branch and store the values as filter items
	// or items in the form
	const getTeachers = (branch, teacherType) => {
		if (teacherType==='filter') {
			setTeacherFilterItems(null);
		} else {
			setTeachers(null);
		}
		axios.post(
			`${url}/api/utility/detail/`,
			{
				'projection': ['user'],
				"groups": TEACHER_GROUP,
				"branch": branch
			},
			config
		).then(function (response) {
			if (teacherType==='filter') {
				setTeacherFilterItems(response.data.data.user);
			} else {
				setTeachers(response.data.data.user);
			}
		}).catch(function (error) {
			console.log("get schools error: ", error.response.data);
		})
	}

	// change the view between grids and list
	const onChangeProjectView = e => {
		setView(e.target.value)
	}

	// show modal to add new class and empty all the input fields on the modal
	const showModal = () => {
		setType('add');
		if (role===SUPERADMIN) {
      setBranches(null);
    }
		if (role===ADMIN || role===SUPERADMIN) {
			setTeachers(null);
			setLessons(null);
		}
		setFields([
			{name: ['name'], value: ''},
			{name: ['school'], value: null},
			{name: ['branch'], value: null},
			{name: ['teacher'], value: null},
			{name: ['lesson'], value: null},
			{name: ['start'], value: null},
			{name: ['end'], value: null},
			{name: ['start_time'], value: null},
			{name: ['end_time'], value: null},
		]);
		setVisible(true);
	}

	// show modal to edit a class and prefill all the inputs on the modal with the class
	const showEditModal = (data) => {
		setType('edit');
		setDataId(data.id);
		setBranchId(data.branch);
		getTeachers(data.branch);
		getLessons(data.branch);
		setFields([
			{name: ['name'], value: data.name},
			{name: ['teacher'], value: data.teacher},
			{name: ['lesson'], value: data.lesson},
			{name: ['start'], value: moment(data.start_date, 'YYYY-MM-DD')},
			{name: ['end'], value: moment(data.end_date, 'YYYY-MM-DD')},
			{name: ['start_time'], value: moment(data.start_time, 'HH:mm')},
			{name: ['end_time'], value: moment(data.end_time, 'HH:mm')},
		]);
		setVisible(true);
	}

	// show modal to delete a class and send delete request if user selects 'yes'
	const	deleteItem = (id, name) =>{
		confirm({
	    title: 'Are you sure delete this class?',
			content: (
				<div>
					{name}
				</div>
			),
	    okText: 'Yes',
	    okType: 'danger',
	    cancelText: 'No',
	    onOk() {
				message.loading('Deleting room...', delKey, 0);
				axios.delete(
					`${url}/api/class/action/${id}/`,
					config
				).then(function (response) {
					if ((total - 1) - (currentPage - 1)*PAGINATION_COUNT <= 0 && total > 1) {
						getClasses(currentPage - 1);
					} else {
						getClasses(currentPage);
					}
					message.success({ content: 'Deleted successfully!', delKey, duration: 2 });
				}).catch(function (error) {
					console.log(error.response.data);
					message.error({ content: 'Delete unsuccessful!', delKey, duration: 2 });
				})
	    },
	  });
	}

	// send request to add new class
	const handleNewClass = (e) => {
		setSubmit(true);
		let start_date = e.start.format('YYYY-MM-DD');
		let start_time = e.start_time.format('HH:mm');

		let end_date = e.end.format('YYYY-MM-DD');
		let end_time = e.end_time.format('HH:mm');
		let branch = branchId;
		if (role===ADMIN || role===SUPERADMIN) branch = e.branch
		axios.post(
			`${url}/api/class/action/`,
			{
				'name': e.name,
				'branch': branch,
				'lesson': e.lesson,
				'teacher': e.teacher,
				'start_date': start_date,
				'start_time': start_time,
				'end_date': end_date,
				'end_time': end_time
			},
			config
		).then(function (response) {
			getClasses(currentPage);
			setSubmit(false);
			setVisible(false);
			message.success({ content: 'Added successfully!', key, duration: 2 });
		}).catch(function (error) {
			console.log(error.response.data);
			setSubmit(false);
			Object.values(error.response.data).forEach(
				msg => message.error({ content: msg, key, duration: 2 })
			)
		})
	}

	// send request to edit a class
	const handleUpdate = (e) => {
		setSubmit(true);
		let start_date = e.start.format('YYYY-MM-DD');
		let start_time = e.start_time.format('HH:mm');
		let end_date = e.end.format('YYYY-MM-DD');
		let end_time = e.end_time.format('HH:mm');
		axios.put(
			`${url}/api/class/action/${dataId}/`,
			{
				'name': e.name,
				'branch': branchId,
				'lesson': e.lesson,
				'teacher': e.teacher,
				'start_date': start_date,
				'start_time': start_time,
				'end_date': end_date,
				'end_time': end_time
			},
			config
		).then(function (response) {
			getClasses(currentPage);
			setSubmit(false);
			setVisible(false);
			message.success({ content: 'Updated successfully!', duration: 2 });
		}).catch(function (error) {
			console.log(error.response.data);
			setSubmit(false);
			Object.values(error.response.data).forEach(
				msg => message.error({ content: msg, duration: 2 })
			)
		})
	}

	// set the visibility of the modal to false
	const handleCancel = () => {
    setVisible(false);
  };

	// set the lesson filter value
	const handleLessonFilterChange = (value) => {
		value ? setLessonFilter(value) : setLessonFilter(null)
	}

	// set the teacher filter value
	const handleTeacherFilterChange = (value) => {
		value ? setTeacherFilter(value) :	setTeacherFilter(null)
	}

	// set the status filter value
	const handleStatusFilterChange = (value) => {
		value ? setStatusFilter(value) :	setStatusFilter(null)
	}

	// set the search filter value
	const handleSearch = (value) => {
		value ? setSearchFilter(value) : setSearchFilter(null)
	}

	return (
		<>
			<PageHeaderAlt className="border-bottom">
				<div className="container-fluid">
					<Flex justifyContent="between" alignItems="center">
						<Row wrap="true">
							<Col style={{marginRight: 20}}>
								<h2><GroupOutlined /> Classes</h2>
							</Col>
							<Col >
								<Filters
									teachers={teacherFilterItems}
									lessons={lessonFilterItems}
									teacherChange={handleTeacherFilterChange}
									lessonChange={handleLessonFilterChange}
									statusChange={handleStatusFilterChange}
									fields={filterFields}
									branchFilter={branchFilter}
									role={role}
									handleSearch={handleSearch}
								/>
							</Col>
						</Row>
						<div style={{display: 'flex', flexWrap: 'wrap'}}>
							<div style={{flex: 1, textAlign: "right", marginBottom: 10, minWidth: 91}}>
								<Radio.Group defaultValue={VIEW_GRID} onChange={e => onChangeProjectView(e)}>
									<Radio.Button value={VIEW_GRID}><AppstoreOutlined /></Radio.Button>
									<Radio.Button value={VIEW_LIST}><UnorderedListOutlined /></Radio.Button>
								</Radio.Group>
							</div>
							<div style={{textAlign: "right", flex: 1}}>
								<Button type="primary" className="ml-2" onClick={showModal} >
									<PlusOutlined />
									<span>New Class</span>
								</Button>
							</div>
						</div>
					</Flex>
				</div>
			</PageHeaderAlt>
			{
				loading ?
				<Skeleton active />
				:
				<div className={`my-4 ${view === VIEW_LIST? 'container' : 'container-fluid'}`}>
					{
						classes.length > 0 ?
						<>
							{
								view === VIEW_LIST ?
								classes.map(elm => <ListItem data={elm} removeId={deleteItem} key={elm.id} showEditModal={showEditModal} />)
								:
								<Row gutter={26}>
									{classes.map(elm => (
										<Col xs={24} sm={12} lg={8} xl={8} xxl={6} key={elm.id}>
											<GridItem data={elm} removeId={deleteItem} showEditModal={showEditModal}/>
										</Col>
									))}
								</Row>
							}
							{
								classes.length > PAGINATION_COUNT ?
								<Flex justifyContent="end">
									<Pagination current={currentPage} onChange={getClasses} total={total} pageSize={PAGINATION_COUNT}/>
								</Flex>
								: null
							}
						</>
						:
						<Empty />
					}
				</div>
			}
			<ClassModal
        handleSubmit={handleNewClass}
        handleUpdate={handleUpdate}
        handleCancel={handleCancel}
        visible={visible}
        type={type}
        branches={branches}
        schools={schools}
				lessons={lessons}
				teachers={teachers}
        getBranches={getBranches}
				role={role}
        fields={fields}
				getLessons={getLessons}
				getTeachers={getTeachers}
				submit={submit}
				setFields={setFields}
      />
		</>
	)
}

export default Classes;
