import Flex from 'components/shared-components/Flex'
import { ItemAction } from 'components/utility-view-components/GridItem'
import React, { useState } from 'react'
import '../style.css'
import { Form, Input, Card, Tooltip, Radio, Col, Row, Tag, Badge, InputNumber, Switch, Button, DatePicker, Select  } from 'antd'
import FormModalLayout from 'components/utility-view-components/FormModalLayout'
import ScreenLayout from '../ScreenLayout'
import { TUGRUG } from 'constants/AppConstant'
import { CloseOutlined, CheckOutlined, PercentageOutlined } from '@ant-design/icons';

const headerConfig = {
    title: "Datasheet Status",
    modalButton: "Datasheet Status",
}
const childKey = "status_view_card_list"

const renderGridItem = (
        item,
        modalToggle,
        handleDeleteActionClick,
    ) => {
    return (
        <Card>
            <Flex alignItems="center" justifyContent="between">
                <Flex alignItems="center" className="gap-10 font-18 width-70">
                    <Tooltip title="Name" className="ellipsis">
                        <h4 className="center">{ item.name }</h4>
                    </Tooltip>
                </Flex>
                <ItemAction data={ item } modalToggle={ modalToggle } handleDeleteActionClick={ handleDeleteActionClick } />
            </Flex>
        </Card>
    )
}

const DatasheetStatusForm = () => {
    return (
        <>
            <Form.Item
                label="Datasheet Status Name"
                name="name"
                rules={[{ required: true, message: 'Please input payment method name!' }]}>
                <Input type="text" name="name" />
            </Form.Item>
            {/* <Form.Item
                labelCol={{ span: 24 }} 
                label="Priority"
                name="priority">
                <Flex justifyContent="center">
                    <Radio.Group name="priority" defaultValue="1" buttonStyle="solid">
                        <Radio.Button name="color" value="1">dwq</Radio.Button>
                        <Radio.Button name="color" value="2">dwq</Radio.Button>
                        <Radio.Button name="color" value="3">dwq</Radio.Button>
                        <Radio.Button name="color" value="4">dwq</Radio.Button>
                        <Radio.Button name="color" value="5">dwq</Radio.Button>
                        <Radio.Button name="color" value="6">dwq</Radio.Button>
                    </Radio.Group>
                </Flex>
            </Form.Item> */}
        </>
    )
}

const renderFormModal = (
    modal,
    modalToggle, 
    handleFormFinish,
    handleFormUpdateFinish,
    form,
    modifyLoading
) => {
    return (
        <FormModalLayout 
            modal={ modal }
            modalToggle={ modalToggle } 
            handleFormFinish={ handleFormFinish }
            handleFormUpdateFinish={ handleFormUpdateFinish }
            form={ form }
            modifyLoading={ modifyLoading } >
            <DatasheetStatusForm form={ form } />
        </FormModalLayout>
    )
}

const DatasheetStatus = () => {
    return (
        <ScreenLayout 
            renderFormModal={ renderFormModal } 
            renderGridItem={ renderGridItem } 
            childKey={ childKey }
            subUrlPath="/api/datasheet/status/"
            headerConfig={ headerConfig }
        />
    )
}

export default DatasheetStatus