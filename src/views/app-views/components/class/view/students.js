import { useState, useEffect } from 'react'
import { useSelector } from "react-redux";
import {
  Tabs,
  Radio,
  Badge,
  Skeleton,
  message,
  Modal,
  Pagination,
  Input,
  Row
} from 'antd';
import {
  SearchOutlined
} from '@ant-design/icons';
import { PAGINATION_COUNT } from 'constants/AppConstant';
import Flex from 'components/shared-components/Flex';
import StudentList from './studentList';
import StudentJournal from './studentJournal';
import StudentExam from './studentExam';
import axios from 'axios';
import {url} from 'configs/EnvironmentConfig';
import moment from 'moment';
import './styles.css'

const { confirm } = Modal;
const { TabPane } = Tabs;

const Students = ({
  students,
  classItem,
  getStudents,
  currentPage,
  setCurrentStatus,
  loading,
  getClass,
  setStudents,
  allStatus,
  allDiscounts,
  totalStudents,
  currentTab,
  setCurrentTab,
  setSearchFilter,
  getStatus,
  getDiscounts,
  role
}) => {
  const [examLoading, setExamLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dataId, setDataId] = useState(null);
  const [paymentVisible, setPaymentVisible] = useState(false);
  const [paymentTotal, setPaymentTotal] = useState(0);
  const [payments, setPayments] = useState(null);
  const [paymentTypes, setPaymentTypes] = useState(null);
  const [newPaymentLoading, setNewPaymentLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentPage, setPaymentPage] = useState(1);
  const [exams, setExams] = useState(null);
  const [days, setDays] = useState(null);
  const [editFields, setEditFields] = useState([]);
  const [editVisible, setEditVisible] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [examFields, setExamFields] = useState([
    {name: ['name'], value: ''},
    {name: ['date'], value: null},
    {name: ['total_mark'], value: null}
  ]);
  const [paymentFields, setPaymentFields] = useState([
    {name: ['date'], value: moment()},
    {name: ['paid'], value: ''},
    {name: ['pay_type'], value: null}
  ]);
  const token = useSelector((state) => state.userLogin.token); // auth token from redux
	const config = {
		headers: {
			'Content-type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	}

  // change the selected students depending on the status chosen
  const changeStudents = (value) => {
    setCurrentStatus(value);
  }

  // get all the possible exams in the class
  const getExams = () => {
    axios.get(
      `${url}/api/class/action/${classItem.id}/exam/`,
       config
   ).then(function (response) {
       setExams(response.data.data);
     }).catch(function (error) {
       console.log(error);
     })
   }

   // get the days that the class in on
   const getDays = () => {
     axios.get(
       `${url}/api/class/action/${classItem.id}/calendar/`,
       config
     ).then(function (response) {
       setDays(response.data.data);
     }).catch(function (error) {
       console.log(error);
     })
   }

   // either get all the exams or the days of the class depending on the tab
   const changeTab = (key) => {
     setCurrentTab(key)
     key = parseInt(key)
     if (key === 3) {
       getExams();
     } else if (key === 2) {
       getDays();
     }
   }

   // send request to add new journal date to a student
   const handleCheckDate = (student_id, date, calendar) => {
     axios.post(
       `${url}/api/student/action/${student_id}/journal/`,
       {
         'date': date,
         'calendar': calendar,
         'state': true
       },
       config
     ).then((response) => {
       let items = [...students];
       let index = items.findIndex((item) => item.id === student_id);
       items[index].journals.push(response.data.data)
       setStudents(items);
     }).catch(function (error) {
       console.log(error.response.data);
       Object.values(error.response.data).forEach(
         msg => message.error({ content: msg, duration: 2 })
       )
     })
   }

   // send request to uodate a journal date of a student
   const handleCheckDateUpdate = (item_id, student_id, date, calendar, state) => {
     axios.put(
       `${url}/api/student/action/${student_id}/journal/`,
       {
         'id': item_id,
         'date': date,
         'calendar': calendar,
         'state': state
       },
       config
     ).then((response) => {
       let items = [...students];
       let index = items.findIndex((item) => item.id === student_id);
       let journalIndex = items[index].journals.findIndex((item) => item.id === item_id);
       items[index].journals[journalIndex].state = state;
       setStudents(items)
     }).catch(function (error) {
       console.log(error.response.data);
       Object.values(error.response.data).forEach(
         msg => message.error({ content: msg, duration: 2 })
       )
     })
   }

   // show modal to add new exam
   const showModal = () => {
     setVisible(true);
     setExamFields([
       {name: ['name'], value: ''},
       {name: ['date'], value: null},
       {name: ['total_mark'], value: null}
     ])
   }

   // set the visiblity of all the modals to false
   const handleCancel = () => {
     setVisible(false);
     setPaymentVisible(false);
   };

   // send request to add new exam
   const handleNewExam = (e) => {
     setExamLoading(true);
     let date = e.date.format('YYYY-MM-DD');
     axios.post(
       `${url}/api/class/action/${classItem.id}/exam/`,
       {
         'date': date,
         'name': e.name,
         'total_mark': e.total_mark
       },
       config
     ).then(function (response) {
       getExams();
       setExamLoading(false);
		   setVisible(false);
       message.success({ content: 'Added successfully', duration: 2 });
     }).catch(function (error) {
       console.log(error.response.data);
       setExamLoading(false);
       Object.values(error.response.data).forEach(
         msg => message.error({ content: msg, duration: 2 })
       )
     })
   }

   // show modal to delete an exam and send delete request of user selects 'yes'
   const showDeleteExamConfirm = (id, name) => {
    confirm({
      title: 'Are you sure delete this exam?',
      content: name,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        const key = "updatable";
        message.loading({ content: 'Deleting exam...', key, duration: 0 });
        const temp_config = config;
        temp_config.data = {
         "exams": [id]
        }
        axios.delete(
          `${url}/api/class/action/${classItem.id}/exam/`,
          temp_config,
        ).then((response) => {
          getClass();
          setExams(exams.filter((item) => item.id != id))
          message.success({ content: 'Deleted successfully!', key, duration: 2 });
        }).catch((error) => {
          console.log(error.response.data);
          Object.values(error.response.data).forEach(
            msg => message.error({ content: msg, key, duration: 2 })
          )
        })
      },
    });
  }

  // send request to add new exam result to a student
  const handleNewMark = (exam_id, student_id, mark) => {
    axios.post(
      `${url}/api/class/exam/${exam_id}/result/`,
      {
        "student": student_id,
        "mark": mark
      },
      config
    ).then((response) => {
      let items = [...students];
      let index = items.findIndex((item) => item.id === student_id);
      items[index].exam_results.push(response.data.data)
      setStudents(items);
      getExams();
    }).catch((error) => {
      console.log(error.response.data);
      Object.values(error.response.data).forEach(
        msg => message.error({ content: msg, duration: 2 })
      )
    })
  }

  // send request to update an exam result of a student
  const handleMarkUpdate = (exam_id, student_id, mark, result_id) => {
    axios.put(
      `${url}/api/class/exam/${exam_id}/result/`,
      {
        "student": student_id,
        "mark": mark,
        "id": result_id
      },
      config
    ).catch((error) => {
      console.log(error.response.data);
    })
  }

  // get the payment history of student with id student_id on page parameter
  const getPayments = (page, student_id) => {
    setPaymentLoading(true);
    axios.get(
      `${url}/api/student/action/${student_id}/payment/?page=${page}`,
      config
    ).then((response) => {
      var data = response.data.results;
      data.forEach((item) => {
        item.key = item.id;
        item.edit = false;
      })
      setPayments(data);
      setPaymentTotal(response.data.count);
      setPaymentPage(page);
      setPaymentLoading(false);
    }).catch((error) => {
      setPaymentLoading(false);
      console.log(error.response.data);
    })
  }

  // get payment types in the same branch as the class
  const getPaymentTypes = () => {
    axios.post(
      `${url}/api/utility/detail/`,
      {
        "projection": ["payment"],
        "branch": classItem.branch
      },
      config
    ).then((response) => {
      setPaymentTypes(response.data.data.payment);
    }).catch((error) => {
      console.log(error.response.data);
    })
  }

  // show the payment modal with the input fields empty
  const showPaymentModal = (student_id, remaining, refund) => {
    setDataId(student_id);
    console.log(refund);
    setPaymentFields([
      {name: ['paid'], value: null},
      {name: ['date'], value: moment()},
      {name: ['pay_type'], value: null},
      {name: 'remaining', value: remaining},
      {name: 'refund', value: -refund},
    ])
    getPaymentTypes();
    setPaymentPage(1);
    getPayments(1, student_id);
    setPaymentVisible(true);
  }

  // send request to add new payment to a student
  const addPayment = (e) => {
    setNewPaymentLoading(true);
    axios.post(
      `${url}/api/student/action/${dataId}/payment/`,
      {
        "paid": e.paid,
        "pay_type": e.pay_type,
        "date": e.date
      },
      config
    ).then((response) => {
      getClass();
      let newItem = response.data.data;
      newItem.key = newItem.id;
      let items = [...students];
      let index = items.findIndex((item) => item.id === dataId);
      items[index].payments_paid = items[index].payments_paid + newItem.paid;
      setPaymentFields([
        {name: 'remaining', value: items[index].total_payment - items[index].payments_paid - items[index].discount_amount},
        {name: 'refund', value: -items[index].payments_paid}
      ]);
      setStudents(items);
      items = [...payments];
      items.push(newItem);
      setPayments(items);
      setNewPaymentLoading(false);
      setPaymentVisible(false);
      message.success({ content: "Payment added successfully", duration: 2 })
    }).catch((error) => {
      console.log(error.response.data);
      setNewPaymentLoading(false);
      Object.values(error.response.data).forEach(
        msg => message.error({ content: msg, duration: 2 })
      )
    })
  }

  // set the payment history item either editable or not
  const changeEdit = (id, edit) => {
    const temp = [...payments];
    let dataIndex = temp.findIndex((item) => item.id === id);
    temp[dataIndex].edit = edit;
    setPayments(temp);
  }

  // send request to edit a payment history of a student
  const editPayment = (payment_id, paid, pay_type) => {
    setPaymentLoading(true);
    if (paid===0) {
      message.error({ content: 'Payment cannot be 0!', duration: 2 })
      setPaymentLoading(false);
      return false;
    }
    axios.put(
      `${url}/api/student/payment/${payment_id}/`,
      {
        "paid": paid,
        "pay_type": pay_type,
      },
      config
    ).then((response) => {
      getClass();
      let items = [...students];
      let index = items.findIndex((item) => item.id === dataId);
      let diff = paid - payments.find((item) => item.id === payment_id).paid;
      items[index].payments_paid = items[index].payments_paid + diff;
      setPaymentFields([
        {name: 'remaining', value: items[index].total_payment - items[index].payments_paid - items[index].discount_amount},
        {name: 'refund', value: -items[index].payments_paid}
      ]);
      setStudents(items);
      items = [...payments];
      index = items.findIndex((item) => item.id === payment_id);
      let editItem = response.data.data;
      editItem.key = editItem.id;
      items[index] = editItem;
      setPayments(items);
      setPaymentLoading(false);
      message.success({ content: "Payment updated successfully", duration: 2 })
    }).catch((error) => {
      console.log(error.response.data);
      setPaymentLoading(false);
      Object.values(error.response.data).forEach(
        msg => message.error({ content: msg, duration: 2 })
      )
    })
  }

  // send request to delete an item from a student's payment history
  const deletePayment = (payment_id) => {
    setPaymentLoading(true);
    axios.delete(
      `${url}/api/student/payment/${payment_id}/`,
      config
    ).then((response) => {
      getClass();
      let items = [...students];
      let index = items.findIndex((item) => item.id === dataId);
      items[index].payments_paid = items[index].payments_paid - payments.find((item) => item.id === payment_id).paid;
      setPaymentFields([
        {name: 'remaining', value: items[index].total_payment - items[index].payments_paid - items[index].discount_amount},
        {name: 'refund', value: -items[index].payments_paid}
      ]);
      setStudents(items);
      if ((paymentTotal - 1) - (paymentTotal - 1)*PAGINATION_COUNT <= 0 && paymentTotal > 1) {
        getPayments(paymentPage - 1, items[index].id);
      } else {
        getPayments(paymentPage, items[index].id);
      }
      setPaymentLoading(false);
      message.success({ content: "Payment deleted successfully", duration: 2 })
    }).catch((error) => {
      console.log(error.response.data);
      setPaymentLoading(false);
      Object.values(error.response.data).forEach(
        msg => message.error({ content: msg, duration: 2 })
      )
    })
  }

  // set the search filter item
  const handleSearch = (val) => {
    val ? setSearchFilter(val) : setSearchFilter(null);
  }

  return (
    <>
      <Row className="p-top">
        <Radio.Group onChange={(e) => changeStudents(e.target.value)} defaultValue="active" className="mr-3 margin-top-10">
          <Radio.Button value="active" style={{width: 101, textAlign: 'center'}}>Active</Radio.Button>
          <Radio.Button value="completed">Completed</Radio.Button>
          <Radio.Button value="canceled" style={{width: 101, textAlign: 'center'}}>Canceled</Radio.Button>
        </Radio.Group>
        <Input placeholder="Search..." onChange={e => handleSearch(e.target.value)} addonAfter={<SearchOutlined />} className="search margin-top-10" />
      </Row>
      {
        loading ?
        <Skeleton active />
        :
        <>
        <Tabs defaultActiveKey={currentTab} tabPosition="top" onChange={(key) => changeTab(key)}>
          <TabPane tab="Students" key="1">
            <StudentList
              students={students}
              visible={paymentVisible}
              showModal={showPaymentModal}
              handleCancel={handleCancel}
              payments={payments}
              paymentTotal={paymentTotal}
              fields={paymentFields}
              paymentTypes={paymentTypes}
              paymentLoading={newPaymentLoading}
              handleNewPayment={addPayment}
              loading={paymentLoading}
              changeEdit={changeEdit}
              editPayment={editPayment}
              deletePayment={deletePayment}
              paymentPage={paymentPage}
              getPayments={getPayments}
              allStatus={allStatus}
              allDiscounts={allDiscounts}
              getStudents={getStudents}
              currentPage={currentPage}
              classItem={classItem}
              getClass={getClass}
              totalStudents={totalStudents}
              getStatus={getStatus}
              getDiscounts={getDiscounts}
              role={role}
            />
          </TabPane>
          <TabPane tab="Journal" key="2">
            {
              days ?
              <StudentJournal
                students={students}
                days={days}
                start_date={classItem.start_date}
                end_date={classItem.end_date}
                handleCheck={handleCheckDate}
                handleCheckUpdate={handleCheckDateUpdate}
                getStudents={getStudents}
                currentPage={currentPage}
                branch={classItem.branch}
                class_id={classItem.id}
                getDays={getDays}
              />
              :
              <Skeleton active />
            }
          </TabPane>
          <TabPane tab="Exam" key="3">
            {
              exams ?
              <StudentExam
                students={students}
                exams={exams}
                id={classItem.id}
                handleNew={handleNewExam}
                examLoading={examLoading}
                visible={visible}
                showModal={showModal}
                handleCancel={handleCancel}
                deleteConfirm={showDeleteExamConfirm}
                fields={examFields}
                handleNewMark={handleNewMark}
                handleMarkUpdate={handleMarkUpdate}
              />
              :
              <Skeleton active />
            }
          </TabPane>
        </Tabs>
        {
          totalStudents > PAGINATION_COUNT ?
          <Flex justifyContent="end">
            <Pagination style={{marginTop: 20}} current={currentPage} onChange={(page) => getStudents(page)} total={totalStudents} pageSize={PAGINATION_COUNT}/>
          </Flex>
          : null
        }
        </>
      }
    </>
  )
}

export default Students;
