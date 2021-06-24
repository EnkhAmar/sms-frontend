import { PageHeaderAlt } from 'components/layout-components/PageHeaderAlt';
import Flex from 'components/shared-components/Flex';
import React from 'react'
import {
	DeleteOutlined,
	EditOutlined,
    AppstoreOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { Button, message } from 'antd';

const Header = ({
    showModal,
    config,
	branch
}) => {

	const handleButtonDisabledClick = () => {
		console.log("dwqwdq")
		message.error("Select branch!")
	}

    return (
        <PageHeaderAlt className="border-bottom">
			<div className="container-fluid">
				<Flex justifyContent="between" alignItems="center">
					<h2><AppstoreOutlined /> { config.title }</h2>
					<div>
						<Button type="primary" className="ml-2" onClick={ branch === null ? handleButtonDisabledClick : showModal.bind(this, true, 1) }>
							<PlusOutlined />
							<span>Add { config.modalButton } </span>
						</Button>
					</div>
				</Flex>
			</div>
		</PageHeaderAlt>
    )
}

export default Header;