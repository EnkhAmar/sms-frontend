import {
  Modal,
  Button,
  Form
} from 'antd';
import ClassForm from './ClassForm';

const ClassModal = ({
  handleSubmit,
  handleCancel,
  visible,
  fields,
  handleUpdate,
  type,
  branches,
  schools,
  lessons,
  teachers,
  getBranches,
  role,
  getLessons,
  getTeachers,
  submit,
  setFields,
}) => (
  <Modal
    title="Add New Class"
    visible={visible}
    footer={null}
    onCancel={handleCancel}
    bodyStyle={{padding: "5px 25px"}}
  >
    <ClassForm
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      fields={fields}
      handleUpdate={handleUpdate}
      type={type}
      branches={branches}
      schools={schools}
      lessons={lessons}
      teachers={teachers}
      getBranches={getBranches}
      role={role}
      getLessons={getLessons}
      getTeachers={getTeachers}
      submit={submit}
      setFields={setFields}
    />
  </Modal>
)

export default ClassModal;
