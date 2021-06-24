import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import {
  Menu,
} from 'antd';
import {
	EditOutlined,
	DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';
import Flex from 'components/shared-components/Flex';
import { Link } from 'react-router-dom';

const ItemAction = ({data, removeId, showEditModal}) => (
	<EllipsisDropdown
		menu={
			<Menu>
        <Menu.Item key="0">
          <Link to={`view/${data.id}`}>
            <EyeOutlined />
            <span>View Details</span>
          </Link>
        </Menu.Item>
				<Menu.Item key="1" onClick={() => showEditModal(data)}>
					<EditOutlined />
					<span>Edit</span>
				</Menu.Item>
        <Menu.Divider />
				<Menu.Item key="2" onClick={() => removeId(data.id, data.name)}>
					<DeleteOutlined />
					<span>Delete</span>
				</Menu.Item>
			</Menu>
		}
	/>
)

export default ItemAction;
