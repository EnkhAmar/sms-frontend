import {
  Modal,
} from 'antd';
import StudentForm from './studentForm';

const StudentModal = ({
  visible,
  handleCancel,
  role,
  type,
  schools,
  branches,
  getBranches,
  fields,
  handleNewStudent,
  handleEditStudent,
  loading
}) => {
  return (
    <Modal
      title={type === 'add' ? 'Add New Student' : 'Edit Student'}
      visible={visible}
      footer={null}
      onCancel={handleCancel}
      bodyStyle={{padding: "5px 25px"}}
    >
      <StudentForm
        handleCancel={handleCancel}
        branches={branches}
        schools={schools}
        getBranches={getBranches}
        role={role}
        type={type}
        fields={fields}
        handleNewStudent={handleNewStudent}
        handleEditStudent={handleEditStudent}
        loading={loading}
      />
    </Modal>
  )
}

export default StudentModal;
