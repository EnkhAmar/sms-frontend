import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux";
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import {
	Radio,
	Button,
	Row,
	Col,
	Modal,
	message,
	Skeleton,
	Pagination,
	Select,
	Empty,
} from 'antd';
import { AppstoreOutlined, UnorderedListOutlined, PlusOutlined, ApartmentOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex';
import GridItem from '../../components/school/branch/gridItem';
import ListItem from '../../components/school/branch/listItem';
import AddModal from '../../components/school/branch/addModal';
import { SUPERADMIN, PAGINATION_COUNT } from 'constants/AppConstant';
import {url} from 'configs/EnvironmentConfig';
import axios from 'axios';
const { confirm } = Modal;
const { Option } = Select;
const VIEW_LIST = 'LIST';
const VIEW_GRID = 'GRID';

const Branch = () => {
	const [loading, setLoading] = useState(true);
	const [view, setView] = useState(VIEW_GRID);
	const [list, setList] = useState([]);
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [visible, setVisible] = useState(false);
	const [submit, setSubmit] = useState(false);
	const [file, setFile] = useState([]);
	const [schools, setSchools] = useState([]);
	const [values, setValues] = useState([
		{ name: ["name"], value: '' },
		{ name: ["description"], value: '' },
		{ name: ["address"], value: '' },
		{ name: ["website"], value: '' },
		{ name: ["color"], value: '#457b9d' },
	]);
	const [type, setType] = useState('add');
	const [dataId, setDataId] = useState(null);
	const schoolId = useSelector((state) => state.userLogin.user.school);
	const role = useSelector((state) => state.userLogin.user.role_id);
	const token = useSelector((state) => state.userLogin.token);
	const schoolFilter = useSelector((state) => state.filters.school);
	const config = {
		headers: {
			'Content-type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	}

	// change the view between grids and list
	const onChangeProjectView = e => {
		setView(e.target.value)
	}

	useEffect(() => {
		getPageList(1);
		if (role === SUPERADMIN) {
			getSchools();
		}
	}, [schoolFilter]);

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
			console.log(error.response.data);
		})
	}

	// show modal with parameter data and if data is null then set the fields empty
	// to add new branch but if data is defined then prefill the modal fields to update branch
	const showModal = (data) => {
		if (data) {
			setValues([
				{ name: ["name"], value: data.name },
				{ name: ["description"], value: data.description },
				{ name: ["school"], value: data.school },
				{ name: ["address"], value: data.address },
				{ name: ["website"], value: data.website },
				{ name: ["color"], value: data.color },
			]);
			setType('edit');
			setDataId(data.id);
		} else {
			setValues([
				{ name: ["name"], value: '' },
				{ name: ["description"], value: '' },
				{ name: ["school"], value: null },
				{ name: ["address"], value: '' },
				{ name: ["website"], value: '' },
				{ name: ["color"], value: '#457b9d' },
			]);
			setType('add');
		}
		setFile([]);
		setVisible(true);
  };

	// send request to add new branch
	const handleSubmit = (e) => {
		setSubmit(true);
		const formData = new FormData();
		if (role===SUPERADMIN) {
			formData.append('school', e.school);
		} else {
			formData.append('school', schoolId);
		}
		formData.append('name', e.name);
		formData.append('address', e.address);
		formData.append('description', e.description);
		formData.append('color', e.color);
		formData.append('website', e.website);
		formData.append('image', file[0] ? file[0] : "");
		axios.post(
	    `${url}/api/school/branch/`,
			formData,
	    config
	  ).then(function (response) {
			getPageList(currentPage);
			message.success({ content: `${e.name} added successfully!`, duration: 2 });
			setSubmit(false);
			setVisible(false);
	  }).catch(function (error) {
			console.log(error.response.data);
			setSubmit(false);
			Object.values(error.response.data).forEach(
        msg => message.error({ content: msg, duration: 2 })
      )
		})
  };

	// set the visiblity of the modal to false
	const handleCancel = () => {
		setVisible(false);
  };

	// set file to new_file or set file to an empty array if user deletes the file
	const props = {
    onRemove: new_file => {
      setFile([]);
    },
    beforeUpload: new_file => {
      setFile([new_file]);
      return false;
    },
		fileList: file,
  };

	// show modal to delete branch and send request to delete if user selects 'yes'
	const showDeleteConfirm = (name, id) => {
	  confirm({
	    title: `Are you sure delete this branch?`,
	    content: (
				<div>
					{name}
				</div>
			),
	    okText: (
				<div>
					Yes
				</div>
			),
	    okType: 'danger',
	    cancelText: 'No',
	    onOk() {
				const key = 'updatable';
				message.loading('Deleting branch...', key, 0);
				axios.delete(
			    `${url}/api/school/branch/${id}/`,
			    config
			  ).then(function (response) {
					if ((total - 1) - (currentPage - 1)*PAGINATION_COUNT <= 0 && total > 1) {
						getPageList(currentPage - 1);
					} else {
						getPageList(currentPage);
					}
					message.success({ content: `${name} deleted successfully!`, key, duration: 2 });
			  }).catch(function (error) {
					Object.values(error.response.data).forEach(
		        msg => message.error({ content: msg, key, duration: 2 })
		      )
				})
	    },
	  });
	}

	// get all the branches on parameter page
	const getPageList = (page) => {
		setLoading(true);
		let api = `${url}/api/school/branch/?page=${page}`;
		if (schoolFilter != null) {
			api = `${url}/api/school/action/${schoolFilter}/branch/?page=${page}`;
		}
		axios.get(
	    api,
	    config
	  ).then(function (response) {
			setList(response.data.results);
			setCurrentPage(page);
			setTotal(response.data.count);
			setLoading(false);
	  }).catch(function (error) {
			console.log(error.response.data);
		})
	}

	// send request to update a branch
	const handleUpdate = (e) => {
		setSubmit(true);
		const formData = new FormData();
		if (schoolId===null) {
			formData.append('school', e.school);
		} else {
			formData.append('school', schoolId);
		}
		formData.append('name', e.name);
		formData.append('address', e.address);
		formData.append('description', e.description);
		formData.append('color', e.color);
		formData.append('website', e.website);
		formData.append('image', file[0] ? file[0] : "");
		axios.put(
	    `${url}/api/school/branch/${dataId}/`,
			formData,
	    config
	  ).then(function (response) {
			getPageList(currentPage);
			setSubmit(false);
			setVisible(false);
			message.success({ content: `${e.name} updated successfully!`, duration: 2 });
	  }).catch(function (error) {
			console.log(error.response.data);
			setSubmit(false);
			Object.values(error.response.data).forEach(
        msg => message.error({ content: msg, duration: 2 })
      )
		})
  };

	return (
		<>
			<PageHeaderAlt className="border-bottom">
				<div className="container-fluid">
					<Flex justifyContent="between" alignItems="center">
						<div>
							<h2><ApartmentOutlined /> Branches</h2>
						</div>
						<div style={{display: 'flex', flexWrap: 'wrap'}}>
							<div style={{flex: 1, textAlign: "right", marginBottom: 10, minWidth: 91}}>
								<Radio.Group defaultValue={VIEW_GRID} onChange={e => onChangeProjectView(e)}>
									<Radio.Button value={VIEW_GRID}><AppstoreOutlined /></Radio.Button>
									<Radio.Button value={VIEW_LIST}><UnorderedListOutlined /></Radio.Button>
								</Radio.Group>
							</div>
							<div style={{textAlign: "right", flex: 1}}>
								<Button type="primary" className="ml-2" onClick={() => showModal(null)}>
									<PlusOutlined />
									<span>New Branch</span>
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
				<>
				{
					total===0 ?
					<div style={{marginTop: 20}}>
						<Empty />
					</div>
					:
					<div className={`my-4 ${view === VIEW_LIST? 'container' : 'container-fluid'}`}>
					{
						view === VIEW_LIST ?
						list.map(elm => <ListItem data={elm} removeId={showDeleteConfirm} key={elm.id} handleUpdate={handleUpdate} schools={schools} showModal={showModal}/>)
						:
						<Row gutter={46}>
						{list.map(elm => (
							<Col xs={24} sm={12} lg={12} xl={8} xxl={6} key={elm.id}>
								<GridItem data={elm} removeId={showDeleteConfirm} handleUpdate={handleUpdate} schools={schools} showModal={showModal}/>
							</Col>
						))}
						</Row>
					}
					{
						total > PAGINATION_COUNT ?
						<Flex justifyContent="end">
							<Pagination current={currentPage} onChange={getPageList} total={total} pageSize={PAGINATION_COUNT} />
						</Flex>
						: null
					}
					</div>
				}
				</>
			}
			<AddModal
				visible={visible}
				handleCancel={handleCancel}
				handleSubmit={handleSubmit}
				handleUpdate={handleUpdate}
				props={props}
				schools={schools}
				type={type}
				fields={values}
				submit={submit}
			/>
		</>
	)
}

export default Branch;
