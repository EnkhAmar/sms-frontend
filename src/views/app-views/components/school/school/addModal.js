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
import SchoolForm from './form';
const { Option } = Select;

const AddModal = ({visible, handleCancel, handleSubmit, props, logoProps, type, fields, handleUpdate, submit}) => (
  <Modal
    title="Add New School"
    visible={visible}
    onCancel={handleCancel}
    footer={null}
    bodyStyle={{padding: "5px 25px"}}
  >
	<SchoolForm
		fields={fields}
		handleCancel={handleCancel}
		handleUpdate={handleUpdate}
		handleSubmit={handleSubmit}
		props={props}
		logoProps={logoProps}
		type={type}
		submit={submit}
	/>
  </Modal>
)

export default AddModal;
