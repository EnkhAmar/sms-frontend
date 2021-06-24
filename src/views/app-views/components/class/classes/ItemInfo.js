import {
  Tooltip,
} from 'antd';
import {
	ApartmentOutlined,
	BarsOutlined,
	GroupOutlined,
	CalendarOutlined
} from '@ant-design/icons';

const ItemInfo = ({branch, lesson, start_date, end_date}) => (
	<>
		<div style={{display: 'flex', justifyContent: "space-between", flexWrap: 'wrap'}}>
			<div style={{ flex: 1, minWidth: '140px', marginTop: 10}}>
				<Tooltip title="Branch">
					<ApartmentOutlined className="font-size-md"/>
					<span className="ml-1">{branch}</span>
				</Tooltip>
			</div>
			<div style={{ flex: 1, textAlign: 'left', minWidth: '140px', marginTop: 10}}>
				<Tooltip title="Lesson">
					<BarsOutlined className="font-size-md"/>
					<span className="ml-1">{lesson}</span>
				</Tooltip>
			</div>
		</div>
		<div style={{display: 'flex', justifyContent: "space-between", flexWrap: 'wrap'}}>
			<div style={{ flex: 1, minWidth: '140px', marginTop: 10}}>
				<Tooltip title="Start Date">
					<span className="font-weight-semibold"><CalendarOutlined className="font-size-md"/> {start_date}</span>
				</Tooltip>
			</div>
			<div style={{ flex: 1, textAlign: 'left', minWidth: '140px', marginTop: 10}}>
				<Tooltip title="End Date">
					<span className="font-weight-semibold"><CalendarOutlined className="font-size-md"/> {end_date}</span>
				</Tooltip>
			</div>
		</div>
	</>
)

export default ItemInfo;
