import {
  Modal,
  Button,
  Form
} from 'antd';
import LessonForm from './Form';

const AddModal = ({handleSubmit, handleCancel, visible, fields, handleUpdate, type, branches, schools, getBranches, submit}) => (
  <Modal
    title="Add New Lesson"
    visible={visible}
    footer={null}
    onCancel={handleCancel}
    bodyStyle={{padding: "5px 25px"}}
  >
    <LessonForm
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      fields={fields}
      handleUpdate={handleUpdate}
      type={type}
      branches={branches}
      schools={schools}
      getBranches={getBranches}
      submit={submit}
    />
  </Modal>
)

export default AddModal;
