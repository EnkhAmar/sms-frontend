import { useState, useEffect } from 'react';
import {
  Table,
  InputNumber,
  Button,
  Menu,
} from 'antd'
import {
  PlusCircleOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import ExamModal from './exam/examModal'
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import './styles.css'

const StudentExam = ({
  students,
  exams,
  id,
  handleNew,
  examLoading,
  visible,
  showModal,
  handleCancel,
  deleteConfirm,
  fields,
  handleNewMark,
  handleMarkUpdate,
}) => {
  const columns = [
    {
      title: "Name",
      width: 140,
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
  for (let i = 0; i < exams.length; i++) {
    let col = {}
    col['title'] = (
      <div style={{textAlign: 'center'}}>
        <div style={{display: 'inline-block', marginRight: 10}}>
          {exams[i].name} <span style={{fontWeight: 'normal'}}>({exams[i].total_mark})</span><br/>
          {exams[i].date}
        </div>

        <EllipsisDropdown
      		menu={
      			<Menu>
      				<Menu.Item key="1" onClick={() => deleteConfirm(exams[i].id, exams[i].name)}>
      					<DeleteOutlined />
      					<span>Delete</span>
      				</Menu.Item>
      			</Menu>
      		}
      	/>
      </div>
    );
    col['key'] = i;
    col['align'] = 'center';
    col['width'] = 180;
    col['render'] = (text, record) => (
      <InputNumber
        onBlur={(e) => {
          if (e.target.value) {
            let value = e.target.value;
            if (e.target.value > exams[i].total_mark) {
              value = exams[i].total_mark;
            }
            record.exam_results.filter((item) => item.exam === exams[i].id).length > 0 ?
            handleMarkUpdate(exams[i].id, record.id, parseInt(value), record.exam_results.find((item) => item.exam === exams[i].id).id)
            :
            handleNewMark(exams[i].id, record.id, parseInt(value))
          }
        }}
        min={0}
        max={exams[i].total_mark}
        style={{width: 170}}
        defaultValue={
          record.exam_results.filter((item) => item.exam === exams[i].id).length > 0 ?
          record.exam_results.filter((item) => item.exam === exams[i].id)[0].mark : null
        }
      />
    )
    columns.push(col)
  }

  return (
    <>
      <Table
        columns={columns}
        dataSource={students}
        pagination={false}
        scroll={ exams.length ? { x: exams.length * 240 } : null}
        title={() => (
          <div className="r-align">
            <Button type="primary" icon={<PlusCircleOutlined />} block style={{width: 130}} onClick={showModal}>Add Exam</Button>
          </div>
        )}
      />
      <ExamModal
        visible={visible}
        handleCancel={handleCancel}
        handleSubmit={handleNew}
        loading={examLoading}
        fields={fields}
      />
    </>
  )
}

export default StudentExam
