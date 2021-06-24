import { COLORS } from 'constants/ChartConstant';
import {
  Tooltip,
  Progress
} from 'antd';
import moment from 'moment';

const ItemProgress = ({start, end, start_time, end_time}) => {
	let progression = (moment() - moment(start))/(moment(end) - moment(start)) * 100;
  progression = Math.round(progression);
	return (
		<Tooltip title="Status">
			<Progress percent={progression} strokeColor={getProgressStatusColor(progression)} status="active" size="small"/>
		</Tooltip>
	)
}

const getProgressStatusColor = progress => {
	if(progress >= 80) {
		return COLORS[1]
	}
	if(progress < 60 && progress > 30) {
		return COLORS[3]
	}
	if(progress < 30) {
		return COLORS[2]
	}
	return COLORS[0]
}

export default ItemProgress;
