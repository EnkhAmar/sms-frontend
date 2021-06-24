import {
	Tooltip
} from "antd";
import {
	EnvironmentOutlined,
	EyeOutlined,
} from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import {
  setSchool,
} from 'redux/actions/filterActions';
import { Link } from 'react-router-dom';

const elem = <FontAwesomeIcon icon={["fal", "coffee"]} />;

const ItemHeader = ({name, address, color, dataId}) => {
	const dispatch = useDispatch();

	const selectSchool = () => {
		dispatch(setSchool(dataId));
	}

	return (
		<div>
			<Link to='branch' onClick={selectSchool}><h4 className="mb-0" style={{display: "inline-block", marginRight: 10}}>{name}</h4></Link>
			{address ? <div><EnvironmentOutlined /> {address}</div> : null}
		</div>
	)
}

export default ItemHeader;
