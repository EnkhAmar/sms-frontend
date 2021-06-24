import {
  Modal,
  Tabs
} from 'antd';
import AddStudentForm from './addStudentForm';
import SelectStudentForm from './selectStudentForm'

const { TabPane } = Tabs;

const AddStudentModal = ({
  visible,
  handleCancel,
  handleNewStudent,
  loading,
  fields,
  handleSelectStudent,
  students,
  status,
  discounts,
  totalPayment
}) => {
  return (
    <>
      <Modal
        visible={visible}
        title="Student Form"
        onCancel={handleCancel}
        footer={null}
        bodyStyle={{padding: "5px 25px"}}
      >
        <Tabs defaultActiveKey="1" tabBarStyle={{borderBottom: 'none'}}>
          <TabPane tab="Add Student" key="1" style={{ borderBottom: 'none' }}>
            <SelectStudentForm
              handleSubmit={handleSelectStudent}
              handleCancel={handleCancel}
              loading={loading}
              fields={fields}
              students={students}
              status={status}
              discounts={discounts}
              totalPayment={totalPayment}
            />
          </TabPane>
          <TabPane tab="New Student" key="2">
            <AddStudentForm
              handleSubmit={handleNewStudent}
              handleCancel={handleCancel}
              loading={loading}
              fields={fields}
              discounts={discounts}
              status={status}
            />
          </TabPane>
        </Tabs>
      </Modal>
    </>
  )
}

export default AddStudentModal;
