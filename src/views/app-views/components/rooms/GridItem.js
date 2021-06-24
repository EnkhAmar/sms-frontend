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

const ItemAction = ({data, remove, showEditModal}) => (
	<EllipsisDropdown
		menu={
			<Menu>
				<Menu.Item key="1" onClick={() => showEditModal(data)}>
					<EditOutlined />
					<span>Edit</span>
				</Menu.Item>
				<Menu.Item key="2" onClick={() => remove(data.id, data.name)}>
					<DeleteOutlined />
					<span>Delete</span>
				</Menu.Item>
			</Menu>
		}
	/>
)

const ItemHeader = ({name, capacity, branch}) => (
  <>
  	<div style={{width: '100%'}}>
		  <h4><Tooltip title="Name">{name}</Tooltip></h4>
      <div>
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <div><strong>Capacity:</strong></div>
    		  <div>{capacity}</div>
        </Col>
        <Col xs={24} sm={12}>
          <div><strong>Branch:</strong></div>
    		  <div>{branch}</div>
        </Col>
      </Row>
      </div>
  	</div>
  </>
)

const GridItem = ({ data, remove, showEditModal }) => (
	<Card>
		<Flex alignItems="start" justifyContent="between">
			<ItemHeader name={data.name} capacity={data.capacity} branch={data.branch} />
			<ItemAction data={data} showEditModal={showEditModal} remove={remove}/>
		</Flex>
	</Card>
)

export default GridItem;
