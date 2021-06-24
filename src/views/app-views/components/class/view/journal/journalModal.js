import {
  Modal,
} from 'antd';
import JournalForm from './journalForm';

const JournalModal = ({ visible, handleCancel, handleSubmit, loading, fields, rooms }) => {
  return (
    <>
    <Modal
      visible={visible}
      title="Add New Day"
      onCancel={handleCancel}
      footer={null}
      bodyStyle={{padding: "5px 25px"}}
    >
      <JournalForm
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        loading={loading}
        fields={fields}
        rooms={rooms}
      />
    </Modal>
    </>
  )
}

export default JournalModal;
