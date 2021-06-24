import {
  Modal
} from 'antd';
import EditForm from './editForm'

const EditModal = ({
  visible,
  handleCancel,
  loading,
  fields,
  status,
  discounts,
  handleSubmit
}) => {
  return (
    <>
      <Modal
        visible={visible}
        title="Edit Student"
        onCancel={handleCancel}
        footer={null}
        bodyStyle={{padding: "5px 25px"}}
      >
        <EditForm
          loading={loading}
          fields={fields}
          status={status}
          discounts={discounts}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
        />
      </Modal>
    </>
  )
}

export default EditModal;
