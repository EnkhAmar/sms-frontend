import {
  Avatar,
} from 'antd';
import AvatarStatus from 'components/shared-components/AvatarStatus';

const ItemImg = ({image}) => (
	<AvatarStatus size={100} type="square" src={image}/>
)

export default ItemImg;
