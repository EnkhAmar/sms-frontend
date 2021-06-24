import { useState } from 'react'
import { useSelector } from "react-redux";
import {
  Table,
  Checkbox,
  Button,
  message,
  Menu,
  Modal
} from 'antd'
import {
  PlusCircleOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { getDatesAndTime } from 'utils/getDates';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import JournalModal from './journal/journalModal';
import axios from 'axios';
import {url} from 'configs/EnvironmentConfig';

const { confirm } = Modal;

const StudentJournal = ({ students, days, start_date, end_date, handleCheck, handleCheckUpdate, getStudents, currentPage, branch, class_id, getDays }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState([]);
  const [rooms, setRooms] = useState(null);
  const token = useSelector((state) => state.userLogin.token); // auth token from redux
	const config = {
		headers: {
			'Content-type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	}

  const dates = getDatesAndTime(start_date, end_date, days);

  const columns = [
    {
      title: "Name",
      width: 150,
      dataIndex: 'user_firstname',
      key: 'name',
      fixed: 'left',
      render: (text, record) => (
        <span>
          {record.user_firstname} {record.user_lastname}
        </span>
      )
    }
  ]
  
  for (let i = 0; i < dates.length; i++) {
    let col = {}
    col['title'] = (text, record) => (
      <span style={{textAlign: 'center'}}>
        <div style={{display: 'inline-block', marginRight: 10}}>
          <div>{dates[i].date}</div>
          <div>{dates[i].start_time} - {dates[i].end_time}</div>
          <Checkbox onClick={(e) => e.target.checked ? checkDates(dates[i]) : null} > Check All</Checkbox>
        </div>
        <EllipsisDropdown
      		menu={
      			<Menu>
      				<Menu.Item key="1" onClick={() => showDeleteConfirm(dates[i].id, dates[i].name)}>
      					<DeleteOutlined />
      					<span>Delete</span>
      				</Menu.Item>
      			</Menu>
      		}
      	/>
      </span>
    );
    col['key'] = i;
    col['align'] = 'center';
    col['width'] = 180;
    col['dataIndex'] = 'journals';
    col['render'] = (text, record) => (
      <span>
        <Checkbox
          onClick={(e) => {
            let item = text.find((item) => (item.date === dates[i].date) && (item.calendar === dates[i].calendar));
            item ?
            handleCheckUpdate(item.id, record.id, dates[i].date, dates[i].calendar, e.target.checked)
            :
            handleCheck(record.id, dates[i].date, dates[i].calendar)
          }}
          checked={record.journals.filter((item) => (item.date === dates[i].date) && (item.calendar === dates[i].calendar) && item.state).length}
        />
      </span>
    );
    columns.push(col)
  }

  const checkDates = (date) => {
    for (let i = 0; i < students.length; i++) {
      let journal = students[i].journals.find((item) => item.date === date.date && item.calendar === date.calendar);
      if (!journal) {
        handleCheck(students[i].id, date.date, date.calendar)
      } else if (!journal.state) {
        handleCheckUpdate(journal.id, students[i].id, date.date, date.calendar, true)
      }
    }
  }

  const getRooms = () => {
    axios.post(
			`${url}/api/utility/detail/`,
			{
				'projection': ['room'],
        "branch": branch
			},
			config
		).then(function (response) {
			setRooms(response.data.data.room);
		}).catch(function (error) {
			console.log(error.response.data);
		})
  }

  const showModal = () => {
    getRooms();
    setFields([
      {name: ['room'], value: null},
      {name: ['start_time'], value: null},
      {name: ['end_time'], value: null},
      {name: ['day'], value: null},
    ])
    setVisible(true);
  }

  const handleCancel = () => {
    setVisible(false);
  }

  const handleSubmit = (e) => {
    setLoading(true);
    let start_time = e.start_time.format("HH:mm")
    let end_time = e.end_time.format("HH:mm")
    axios.post(
      `${url}/api/class/action/${class_id}/calendar/`,
      {
        'day': e.day,
        'start_time': start_time,
        'end_time': end_time,
        'room': e.room
      },
      config
    ).then(function (response) {
      getDays();
      setLoading(false);
      setVisible(false);
      message.success({ content: 'Day added successfully', duration: 2 });
    }).catch(function (error) {
      setLoading(false);
      console.log(error.response.data);
      Object.values(error.response.data).forEach(
        msg => message.error({ content: msg, duration: 2 })
      )
    })
  }

  function showDeleteConfirm() {
    confirm({
      title: 'Are you sure delete this task?',
      content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  return (
    <>
      <Table
        title={() => (
          <div className="r-align">
            <Button type="primary" icon={<PlusCircleOutlined />} block style={{width: 130}} onClick={showModal}>Add Day</Button>
          </div>
        )}
        columns={columns}
        dataSource={students}
        scroll={ dates.length ? { x: dates.length * 290 } : null}
        pagination={false}
      />
      <JournalModal
        visible={visible}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        loading={loading}
        fields={fields}
        rooms={rooms}
      />
    </>
  )
}

export default StudentJournal
