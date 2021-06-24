import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChalkboardTeacher, faLongArrowAltRight, faClock } from '@fortawesome/free-solid-svg-icons'
import {
  Tooltip,
  Avatar,
  Row,
} from 'antd';
import {
  ClockCircleOutlined
} from '@ant-design/icons'
import Flex from 'components/shared-components/Flex';
import { Link } from 'react-router-dom';

const ItemHeader = ({name, teacher_name, start_time, end_time, image, data_id}) => (
	<div>
    <Row>
      <Flex alignItems="middle">
        <Avatar src={image} />
        <div style={{marginLeft: 10}}>
      		<Link to={`view/${data_id}`}><h4 className="mb-0">{name}</h4></Link>
          <p><ClockCircleOutlined /> {start_time} <FontAwesomeIcon className="far-icon" icon={faLongArrowAltRight} /> {end_time}</p>
        </div>
      </Flex>
    </Row>
		<h5><Tooltip title="Teacher Name"><FontAwesomeIcon className="far-icon" icon={faChalkboardTeacher} /> {teacher_name}</Tooltip></h5>
	</div>
)

export default ItemHeader;
