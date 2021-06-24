import {
  Modal
} from 'antd';
import ExamForm from './examForm';

const ExamModal = ({ visible, handleCancel, handleSubmit, loading, fields }) => {

  return (
    <>
      <Modal
        visible={visible}
        title="Add New Exam"
        onCancel={handleCancel}
        footer={null}
        bodyStyle={{padding: "5px 25px"}}
      >
        <ExamForm
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
          loading={loading}
          fields={fields}
        />
      </Modal>
    </>
  )
}

export default ExamModal;
