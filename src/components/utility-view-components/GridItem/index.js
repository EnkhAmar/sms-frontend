import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import { Radio, Button, Row, Col, Tooltip, Tag, Progress, Avatar, Menu, Card } from 'antd';
import { AppstoreOutlined, UnorderedListOutlined, PlusOutlined } from '@ant-design/icons';
import {
  PaperClipOutlined,
	CheckCircleOutlined,
	ClockCircleOutlined,
	EyeOutlined,
	EditOutlined,
	DeleteOutlined
} from '@ant-design/icons';
import utils from 'utils';
import { COLORS } from 'constants/ChartConstant';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';

export const ItemAction = ({data, modalToggle, handleDeleteActionClick}) => (
	<EllipsisDropdown
		menu={
			<Menu>
				<Menu.Item key="1" onClick={ modalToggle.bind(this, true, 2, data) }>
					<EditOutlined />
					<span>Edit</span>
				</Menu.Item>
				<Menu.Item key="2" onClick={() => handleDeleteActionClick(data.id)}>
					<DeleteOutlined />
					<span>Delete</span>
				</Menu.Item>
			</Menu>
		}
	/>
)