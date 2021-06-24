import {
	Tooltip
} from "antd";
import {
	EnvironmentOutlined
} from '@ant-design/icons';

const ItemHeader = ({name, address, color}) => (
	<div>
		<h4 className="mb-0" style={{display: "inline-block", marginRight: 10}}>{name}</h4>
		<Tooltip title={color}>
		</Tooltip>
		{address ? <div><EnvironmentOutlined /> {address}</div> : null}
	</div>
)

export default ItemHeader;
