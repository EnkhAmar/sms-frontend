import { useState, useEffect } from 'react'
import {
	Radio,
	Button,
	Row,
	Col,
	Avatar,
	Card,
	message,
} from 'antd';
import getInitials from 'utils/getInitials';
import ItemHeader from './itemHeader';
import ItemDescription from './itemDescription';
import ItemWebsite from './itemWebsite';
import ItemAction from './itemAction';
import AddModal from '../branch/addModal';
import {
	DeleteFilled,
	EditFilled,
} from '@ant-design/icons';
import axios from 'axios';

const ListItem = ({ data, removeId, handleUpdate, schools, showModal }) => {
	return (
		<Card className="rounded p-3 mb-3 border" bodyStyle={{padding: 0}}>
			<Row align="middle">
				<Col xs={24} sm={24} md={2}>
					<Avatar style={{backgroundColor: data.color, border: data.image ? `3px solid ${data.color}` : null}} src={data.school_image} >
						{data.school_image? '' : <span className="font-weight-semibold font-size-sm">{getInitials(data.name)}</span>}
					</Avatar>
				</Col>
				<Col xs={24} sm={24} md={7}>
					<ItemHeader name={data.name} address={data.address} color={data.color} />
				</Col>
				<Col xs={24} sm={24} md={13}>
					<div className="text-left">
						<ItemWebsite website={data.website} />
						<ItemDescription description={data.description} />
					</div>
				</Col>
				<Col xs={24} sm={24} md={2}>
					<div className="text-right">
						<ItemAction data={data} removeId={removeId} showModal={showModal}/>
					</div>
				</Col>
			</Row>
		</Card>
	)
}

export default ListItem;
