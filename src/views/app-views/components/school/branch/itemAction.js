import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import {
	Menu,
} from 'antd';
import {
	EditOutlined,
	DeleteOutlined,
} from '@ant-design/icons';

const ItemAction = ({data, removeId, showModal}) => (
	<EllipsisDropdown
		menu={
			<Menu>
				<Menu.Item key="0" onClick={() => showModal(data)}>
					<EditOutlined />
					<span>Edit</span>
				</Menu.Item>
				<Menu.Item key="1" onClick={() => removeId(data.name, data.id)}>
					<DeleteOutlined />
					<span>Delete</span>
				</Menu.Item>
			</Menu>
		}
	/>
)

export default ItemAction;
