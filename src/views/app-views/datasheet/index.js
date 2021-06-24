import React from 'react';
import { Card } from 'antd';
import EditableTable from './EditableTable';
import DatasheetTable from './DatasheetTable';
import './style.css'
import { TableOutlined } from '@ant-design/icons'

const Datasheet = () => {
    return (
        <Card title={<h2><TableOutlined /> Datasheet</h2>} extra={null}>
            {/* <EditableTable /> */}
            <DatasheetTable />
        </Card>
    )
}

export default Datasheet;