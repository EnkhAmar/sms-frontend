import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {url} from 'configs/EnvironmentConfig';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex';
import { ADMIN, SUPERADMIN, PAGINATION_COUNT } from 'constants/AppConstant';
import {
  Table,
  Menu,
  Card,
  Button,
  Skeleton,
  message,
  Modal,
  Pagination,
  Row,
  Col,
  Empty
} from 'antd';
import {
	DeleteOutlined,
	EditOutlined,
  AppstoreOutlined,
  PlusOutlined
} from '@ant-design/icons';

const Body = ({
    data,
    currentPage,
    onChange,
    total,
    loading,
    gridItem,
    modalToggle,
    handleDeleteActionClick,
    childKey
}) => {
    return (
        <div className={`my-4 container-fluid`}>
            {
                loading ?
                    <Skeleton active />
                :
                <>
                {
                    data.length > 0 ?
                        <>
                            <Row gutter={16}>
                                { data.map(elm => (
                                    <Col xs = { 24 } sm = { 8 } lg = { 8 } xl = { 8 } xxl = { 6 } key={ elm.id + childKey } >
                                        { gridItem(elm, modalToggle, handleDeleteActionClick) }
                                    </Col>
                                )) }
                            </Row>
                            {
                                total > PAGINATION_COUNT ?
                                    <Flex justifyContent="end">
                                        <Pagination current={ currentPage } onChange={ onChange } total={ total } pageSize={ PAGINATION_COUNT }/>
                                    </Flex>
                                : null
                            }
                        </>
                    :
                    <Empty />
                }
                </>
            }
		</div>
    )
}

export default React.memo(Body);