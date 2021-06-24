import { useState } from 'react'
import {
  Card,
  Button,
  Row,
  Col,
  Divider,
  Tag,
  Input
} from 'antd';
import {
  PlusCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import {Doughnut} from 'react-chartjs-2';
import { TUGRUG } from 'constants/AppConstant';
import { COLORS } from 'constants/ChartConstant';
import ItemProgress from './progress';
import './styles.css';
import moment from 'moment';

const { TextArea } = Input;

const Class = ({ classItem, showModal, totalPayment, handleNote, edit, setEdit, loading }) => {
  const [note, setNote] = useState(classItem.note);

  const options = {
    colors: [COLORS[1], COLORS[2]],
    labels: ['Paid', 'Remaining'],
    legend: {
      position: 'top'
    },
    responsive: [{
			breakpoint: 480,
			options: {
				chart: {
					width: 200
				},
				legend: {
					position: 'bottom'
				}
			}
		}]
  }
  const data = {
		labels: ['Paid', 'Discount', 'Remaining'],
    datasets: [
      {
        data: [classItem.total_paid ? classItem.total_paid : 0, classItem.total_discount ? classItem.total_discount : 0, totalPayment - classItem.total_paid - classItem.total_discount],
        backgroundColor: [COLORS[1], COLORS[3], COLORS[2]],
      	pointBackgroundColor : [COLORS[1], COLORS[3], COLORS[2]]
      }
    ]
  }

  return (
    <Card
      title={
        <div className="flex note-header">
        {classItem.name} <Button type="primary" size="small" onClick={() => setEdit(true)}>Edit Note</Button>
        </div>
      }
      style={{ width: '100%' }}
    >
      <div className="note">
        {
          edit ?
          <div className="note-item">
            <TextArea rows={3} placeholder="Enter Class Note" defaultValue={classItem.note} onChange={(e) => setNote(e.target.value)} />
            <Col style={{ textAlign: 'right', marginTop: 10 }}>
            <Button onClick={() => setEdit(false)}>
              Cancel
            </Button>
            <Button type="primary" loading={loading} onClick={() => handleNote(note)} style={{ marginLeft: 8 }}>
              Save
            </Button>
            </Col>
          </div>
          :
          <div className="note-item">
            {
              classItem.note ?
              <span>
                <h5>Note</h5>
                {classItem.note}
              </span>
              : null
            }
          </div>
        }
      </div>
      <div className="flex space-between">
        <div className="mx-3 center-align">
          <div>
            <h5><CalendarOutlined /> Start Date</h5>
            {classItem.start_date}
          </div>
          <div className="py-3">
            <h5><CalendarOutlined /> End Date</h5>
            {classItem.end_date}
          </div>
        </div>
        <div className="mx-3 center-align">
          <div>
            <h5><ClockCircleOutlined /> Start Time</h5>
            {moment(classItem.start_time, "HH:mm:ss").format("HH:mm")}
          </div>
          <div className="py-3">
            <h5><ClockCircleOutlined /> End Time</h5>
            {moment(classItem.end_time, "HH:mm:ss").format("HH:mm")}
          </div>
        </div>
        <div className="mx-3 center-align">
          <div>
            <h5>Student Number</h5>
            {classItem.students_count}
          </div>
          <div className="py-3">
            <h5>Progress</h5>
            <ItemProgress start={classItem.start_date} end={classItem.end_date} />
          </div>
        </div>
        <div className="mx-3 center-align">
          <div>
            <h5>Total Paid Fee</h5>
            <Tag color="green">{(classItem.total_paid ? classItem.total_paid : 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{TUGRUG}</Tag>
          </div>
          <div className="pt-3">
            <h5>Total Discount</h5>
            <Tag color="orange">{(classItem.total_discount ? classItem.total_discount : 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{TUGRUG}</Tag>
          </div>
          <div className="py-3">
            <h5>Total Remaining Fee</h5>
            <Tag color="volcano">{(totalPayment - classItem.total_paid - classItem.total_discount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{TUGRUG}</Tag>
          </div>
        </div>
        <div>
          <Doughnut
            data={data}
            options={options}
            height={200}
            type="donut"
          />
        </div>
      </div>
    </Card>
  )
}

export default Class;
