import ItemHeader from './ItemHeader';
import ItemAction from './ItemAction';
import ItemInfo from './ItemInfo';
import ItemProgress from './ItemProgress';
import ItemMember from './ItemMember';
import Flex from 'components/shared-components/Flex';
import {
  Card
} from 'antd';
import moment from 'moment';

const GridItem = ({ data, removeId, showEditModal }) => (
  <Card>
    <Flex alignItems="start" justifyContent="between">
      <ItemHeader
        name={data.name}
        start_time={moment(data.start_time, "HH:mm:ss").format("HH:mm")}
        end_time={moment(data.end_time, "HH:mm:ss").format("HH:mm")}
        teacher_name={data.teacher_lastname ? data.teacher_firstname + ' ' + data.teacher_lastname : data.teacher_firstname}
        image={data.branch_image}
        data_id={data.id}
      />
      <ItemAction data={data} removeId={removeId} showEditModal={showEditModal} />
    </Flex>
    <div className="mt-2">
      <ItemInfo
        branch={data.branch_name}
        lesson={data.lesson_name}
        start_date={data.start_date}
        end_date={data.end_date}
      />
    </div>
    <div className="mt-3">
      <ItemProgress start={data.start_date} end={data.end_date} start_time={data.start_time} end_time={data.end_time} />
    </div>
    <div className="mt-2">
      <ItemMember students={data.students_count} />
    </div>
  </Card>
)

export default GridItem;
