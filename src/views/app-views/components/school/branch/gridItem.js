import { useState, useEffect } from 'react'
import getInitials from 'utils/getInitials';
import Flex from 'components/shared-components/Flex';
import ItemHeader from './itemHeader';
import ItemDescription from './itemDescription';
import ItemWebsite from './itemWebsite';
import AddModal from './addModal';
import {
	Button,
	Avatar,
	Card,
} from 'antd';
import {
	DeleteFilled,
	EditFilled,
} from '@ant-design/icons';
import axios from 'axios';
import './styles.css';

const {Meta} = Card;

const GridItem = ({ data, removeId, handleUpdate, schools, showModal }) => {
	return (
		<Card
			cover={<img src={data.image} style={{height: 200, objectFit: "cover"}} />}
			actions={[
				<div className="edit-button" onClick={() => showModal(data)}><EditFilled key="edit" /></div>,
				<div className="delete-button" onClick={() => removeId(data.name, data.id)}><DeleteFilled key="delete" /></div>,
			]}
		>
			<Meta
				avatar={<Avatar style={{backgroundColor: data.color, border: data.school_image ? `3px solid ${data.color}` : null}} src={data.school_image} >
					{data.school_image? '' : <span className="font-weight-semibold font-size-sm">{getInitials(data.name)}</span>}
				</Avatar>}
				description={
					<div>
						<Flex alignItems="center" justifyContent="between">
							<ItemHeader name={data.name} address={data.address} color={data.color} />
						</Flex>
					</div>
				}
			/>
			<div className="mt-2">
				<ItemWebsite website={data.website} />
				<ItemDescription description={data.description} />
			</div>
		</Card>
	)
}

export default GridItem;
