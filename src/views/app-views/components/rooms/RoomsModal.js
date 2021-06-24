import {
  Modal,
  Button,
} from 'antd';
import RoomForm from './RoomForm';

const RoomModal = ({handleSubmit, handleCancel, visible, fields, handleUpdate, type, branches, schools, getBranches, role, submit}) => (
  <Modal
    title="Add New Room"
    visible={visible}
    footer={null}
    onCancel={handleCancel}
    bodyStyle={{padding: "5px 25px"}}
  >
    <RoomForm
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      fields={fields}
      handleUpdate={handleUpdate}
      type={type}
      schools={schools}
      getBranches={getBranches}
      branches={branches}
      role={role}
      submit={submit}
    />
  </Modal>
)

export default RoomModal;
