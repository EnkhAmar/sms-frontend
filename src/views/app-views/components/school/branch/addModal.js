import {
	Modal,
	Form,
	Input,
	Upload,
	Select,
  Button,
	Row,
  Col,
	Radio,
} from 'antd';
import {
	UploadOutlined,
} from '@ant-design/icons';
import BranchForm from './form';
const { Option } = Select;

const AddModal = ({ visible, handleCancel, handleSubmit, props, logoProps, schools, type, fields, handleUpdate, submit }) => (
  <Modal
    title="Add New Branch"
    visible={visible}
    onCancel={handleCancel}
    footer={null}
    bodyStyle={{padding: "5px 25px"}}
  >
		<BranchForm
			handleCancel={handleCancel}
			handleSubmit={handleSubmit}
			handleUpdate={handleUpdate}
			props={props}
			logoProps={logoProps}
			schools={schools}
			type={type}
			fields={fields}
			submit={submit}
		/>
  </Modal>
)

export default AddModal;
