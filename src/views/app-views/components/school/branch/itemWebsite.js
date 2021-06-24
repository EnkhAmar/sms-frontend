import { Tooltip } from 'antd';
import Flex from 'components/shared-components/Flex';

const ItemWebsite = ({website}) => (
	<Flex alignItems="left">
		<div className="mr-3">
			<Tooltip title="Website">
				<a style={{textDecoration: "underline"}} href={website}>{website}</a>
			</Tooltip>
		</div>
	</Flex>
)

export default ItemWebsite;
