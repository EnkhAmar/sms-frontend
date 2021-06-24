import {
  Modal
} from 'antd'
import UserForm from './userForm'

const UserModal = ({
  visible,
  handleCancel,
  fields,
  handleFormSubmit,
  submitLoading,
  props
}) => {
  return (
    <Modal
      title="Edit Profile"
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      bodyStyle={{padding: "5px 25px"}}
    >
      <UserForm
        handleCancel={handleCancel}
        handleFormSubmit={handleFormSubmit}
        fields={fields}
        submitLoading={submitLoading}
        props={props}
      />
    </Modal>
  )
}

export default UserModal
