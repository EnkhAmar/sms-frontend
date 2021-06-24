import { Tooltip } from 'antd';
import Flex from 'components/shared-components/Flex';

const ItemDescription = ({description}) => (
	<Flex alignItems="left">
		<div className="mr-3">
			<Tooltip title="Description">
				<span>{description}</span>
			</Tooltip>
		</div>
	</Flex>
)

export default ItemDescription;
