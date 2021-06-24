import ItemHeader from './ItemHeader';
import ItemAction from './ItemAction';
import ItemInfo from './ItemInfo';
import ItemProgress from './ItemProgress';
import ItemMember from './ItemMember';
import {
  Row,
  Col,
  Card
} from 'antd'

const ListItem = ({ data, removeId, showEditModal }) => (
	<Card className="rounded p-3 mb-3 border" bodyStyle={{padding: 0}}>
		<Row align="middle">
    	<Col xs={24} sm={24} md={8}>
				<ItemHeader
          name={data.name}
          start_time={data.start_time}
          end_time={data.end_time}
          teacher_name={data.teacher_lastname ? data.teacher_firstname + ' ' + data.teacher_lastname : data.teacher_firstname}
          image={data.branch_image}
          data_id={data.id}
        />
			</Col>
			<Col xs={24} sm={24} md={6}>
				<ItemInfo
					branch={data.branch_name}
					lesson={data.lesson_name}
					start_date={data.start_date}
					end_date={data.end_date}
				/>
			</Col>
			<Col xs={24} sm={24} md={5}>
				<ItemProgress start={data.start_date} end={data.end_date} start_time={data.start_time} end_time={data.end_time} />
			</Col>
			<Col xs={24} sm={24} md={3} align="center">
				<div className="ml-0 ml-md-3" style={{border: 10}}>
					<ItemMember students={data.students_count} />
				</div>
			</Col>
			<Col xs={24} sm={24} md={2}>
				<div className="text-right">
					<ItemAction data={data} removeId={removeId} showEditModal={showEditModal} />
				</div>
			</Col>
		</Row>
	</Card>
)

export default ListItem;
