import { useState } from 'react';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom'
import {
  Table,
  Menu,
  Badge,
  Tag,
  Tooltip,
  Pagination,
  Modal,
  message
} from 'antd';
import {
	DeleteOutlined,
	EditOutlined,
  PlusCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { TUGRUG, ADMIN, SUPERADMIN, PAGINATION_COUNT, TEACHER, STUDENT } from 'constants/AppConstant';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import PaymentModal from './list/payment/paymentModal';
import EditModal from './list/edit/editModal';
import {url} from 'configs/EnvironmentConfig';
import moment from 'moment';
import axios from 'axios';

const { confirm } = Modal;

const StudentList = ({
  students,
  visible,
  showModal,
  handleCancel,
  payments,
  paymentTotal,
  fields,
  paymentTypes,
  paymentLoading,
  handleNewPayment,
  loading,
  changeEdit,
  editPayment,
  deletePayment,
  paymentPage,
  getPayments,
  allStatus,
  allDiscounts,
  getStudents,
  currentPage,
  classItem,
  getClass,
  totalStudents,
  getStatus,
  getDiscounts,
  role
}) => {
  const [editFields, setEditFields] = useState([]);
  const [editVisible, setEditVisible] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const token = useSelector((state) => state.userLogin.token); // auth token from redux
	const config = {
		headers: {
			'Content-type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	}

  const columns = [
    {
      title: 'Name',
      dataIndex: 'user_firstname',
      width: 230,
      key: 'name',
      render: (text, record) => (
        <span>
          <Link to={`/app/profile/${record.user}`}><h5 style={{display: 'inline-block'}}>{record.user_firstname} {record.user_lastname}</h5> </Link> &nbsp;
          <Tooltip title={record.total_payment - record.payments_paid - record.discount_amount <= 0 ? "Payment Completed" : "Payment Incomplete"}>
            <Badge
              count={
                record.total_payment - record.payments_paid - record.discount_amount <= 0 ?
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                :
                <ExclamationCircleOutlined style={{ color: '#f5222d' }} />
              }
            />
          </Tooltip>
          <div>
            <p>{record.note}</p>
          </div>
        </span>
      )
    },
    {
      title: 'Start Date',
      dataIndex: 'start_date',
      width: 105,
      key: 'start_date'
    },
    {
      title: 'End Date',
      dataIndex: 'end_date',
      width: 105,
      key: 'end_date'
    },
    {
      title: 'Original Fee',
      dataIndex: 'total_payment',
      align: 'center',
      key: 'total_payment',
      render: text => (
        <Tag color="geekblue">{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{TUGRUG}</Tag>
      )
    },
    {
      title: 'Discount',
      dataIndex: 'discount_amount',
      align: 'center',
      key: 'discount_amount',
      render: text => (
        <Tag color="orange">{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{TUGRUG}</Tag>
      )
    },
    {
      title: 'Payment Fee',
      align: 'center',
      key: 'amount_to_pay',
      render: (text, record) => (
        <Tag color="red">{(record.total_payment - record.discount_amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{TUGRUG}</Tag>
      )
    },
    {
      title: 'Total Paid',
      dataIndex: 'payments_paid',
      align: 'center',
      key: 'payments_paid',
      render: text => (
        <Tag color="green">{text ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}{TUGRUG}</Tag>
      )
    },
    {
      title: 'Remaining Fee',
      key: 'remaining_fee',
      align: 'center',
      render: (text, record) => (
        <Tag color="error">{(record.total_payment - record.payments_paid - record.discount_amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{TUGRUG}</Tag>
      )
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: (text, record) => (
        <span>
          {
            record.canceled ?
            <EllipsisDropdown
              menu={
                <Menu>
                  <Menu.Item key="0" onClick={() => handleMakeActive(record.id, record.status, record.user_firstname + ' ' + (record.user_lastname ? record.user_lastname : ''))}>
                    <CheckCircleOutlined />
                    <span>Make Active</span>
                  </Menu.Item>
                </Menu>
              }
            />
            :
            <EllipsisDropdown
              menu={
                <Menu>
                  <Menu.Item key="0" onClick={() => showEditModal(record)}>
                    <EditOutlined />
                    <span>Edit</span>
                  </Menu.Item>
                  {
                    role !== TEACHER || role !== STUDENT ?
                    <>
                    <Menu.Item key="1" onClick={() => showModal(record.id, record.total_payment - record.payments_paid - record.discount_amount, record.payments_paid)}>
                      <WalletOutlined />
                      <span>Payment</span>
                    </Menu.Item>
                    <Menu.Divider />
                    </> : null
                  }
                  <Menu.Item key="2" onClick={() => handleDelete(record.id, record.status, record.user_firstname + ' ' + (record.user_lastname ? record.user_lastname : ''))}>
                    <DeleteOutlined />
                    <span>Remove</span>
                  </Menu.Item>
                </Menu>
              }
            />
          }
        </span>
      ),
    }
  ]

  const handleMakeActive = (user_id, status_id, name) => {
    confirm({
      title: 'Are you sure you want to make this student active?',
      content: name,
      okText: 'Yes',
      onOk() {
        const key = "updatable";
        message.loading({ content: `Making ${name} ...`, key, duration: 2 })
        axios.put(
          `${url}/api/class/action/${classItem.id}/student/`,
          {
            "student": user_id,
            "status": status_id,
            "canceled": false
          },
          config
        ).then((response) => {
          if ((totalStudents - 1) - (currentPage - 1)*PAGINATION_COUNT <= 0 && totalStudents > 1) {
            getStudents(currentPage - 1);
					} else {
            getStudents(currentPage);
					}
          getClass()
          message.success({ content: `${name} made active successfully`, key, duration: 2 })
        }).catch(function (error) {
          console.log(error.response.data);
          Object.values(error.response.data).forEach(
            msg => message.error({ content: msg, key, duration: 2 })
          )
        })
      }
    });
  }

  const handleDelete = (user_id, status_id, name) => {
    confirm({
      title: 'Are you sure you want to remove this student?',
      content: name,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        const key = "updatable";
        message.loading({ content: "Removing...", key, duration: 2 })
        axios.put(
          `${url}/api/class/action/${classItem.id}/student/`,
          {
            "student": user_id,
            "status": status_id,
            "canceled": true
          },
          config
        ).then((response) => {
          if ((totalStudents - 1) - (currentPage - 1)*PAGINATION_COUNT <= 0 && totalStudents > 1) {
            getStudents(currentPage - 1);
					} else {
            getStudents(currentPage);
					}
          getClass()
          message.success({ content: `${name} removed successfully`, key, duration: 2 })
        }).catch(function (error) {
          console.log(error.response.data);
          Object.values(error.response.data).forEach(
            msg => message.error({ content: msg, key, duration: 2 })
          )
        })
      }
    });
  }

  const showEditModal = (data) => {
    let discounts = data.discounts.map(function (obj) {
      return obj.id;
    });
    getStatus();
    getDiscounts();
    setEditFields([
      {name: ['status'], value: data.status},
      {name: ['discounts'], value: discounts},
      {name: ['start_date'], value: moment(data.start_date)},
      {name: ['end_date'], value: moment(data.end_date)},
      {name: ['note'], value: data.note},
      {name: "firstname", value: data.user_firstname},
      {name: "lastname", value: data.user_lastname},
    ]);
    setStudentId(data.id);
    setEditVisible(true);
  }

  const handleCancelEdit = () => {
    setEditVisible(false);
  }

  const handleEdit = (status_id, note, start_date, end_date, discounts) => {
    setEditLoading(true);
    let formData = {};
    formData["student"] = studentId;
    formData["status"] = status_id;
    formData["start_date"] = start_date.format("YYYY-MM-DD");
    formData["end_date"] = end_date.format("YYYY-MM-DD");
    if (note) formData["note"] = note;
    if (discounts) formData["discounts"] = discounts;
    axios.put(
      `${url}/api/class/action/${classItem.id}/student/`,
      formData,
      config
    ).then((response) => {
      getStudents(currentPage);
      setEditLoading(false);
      setEditVisible(false);
      message.success({ content: "Updated successfully", duration: 2 })
    }).catch(function (error) {
      console.log(error.response.data);
      setEditLoading(false);
      Object.values(error.response.data).forEach(
        msg => message.error({ content: msg, duration: 2 })
      )
    })
  }

  return (
    <>
      <Table
        columns={columns}
        dataSource={students}
        pagination={false}
        scroll={{x: 1000}}
      />
      <PaymentModal
        visible={visible}
        handleCancel={handleCancel}
        payments={payments}
        paymentTotal={paymentTotal}
        fields={fields}
        paymentTypes={paymentTypes}
        loading={paymentLoading}
        handleSubmit={handleNewPayment}
        loadingPayment={loading}
        changeEdit={changeEdit}
        editPayment={editPayment}
        deletePayment={deletePayment}
        paymentPage={paymentPage}
        getPayments={getPayments}
      />
      <EditModal
        visible={editVisible}
        handleSubmit={handleEdit}
        handleCancel={handleCancelEdit}
        loading={editLoading}
        fields={editFields}
        status={allStatus}
        discounts={allDiscounts}
      />
    </>
  )
}

export default StudentList;
