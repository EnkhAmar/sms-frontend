import Flex from 'components/shared-components/Flex'
import { ItemAction } from 'components/utility-view-components/GridItem'
import React, { useState } from 'react'
import '../style.css'
import { Form, Input, Card, Tooltip, Radio, Col, Row, Tag, Badge, InputNumber, Switch, Button, DatePicker  } from 'antd'
import FormModalLayout from 'components/utility-view-components/FormModalLayout'
import ScreenLayout from '../ScreenLayout'
import { TUGRUG } from 'constants/AppConstant'
import { CloseOutlined, CheckOutlined, PercentageOutlined } from '@ant-design/icons';

const headerConfig = {
    title: "Payment Methods",
    modalButton: "Payment Method",
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

const PaymentMethodForm = () => {
    return (
        <>
            <Form.Item
                label="Payment Method Name"
                name="name"
                rules={[{ required: true, message: 'Please input payment method name!' }]}>
                <Input type="text" name="name" />
            </Form.Item>
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
            <PaymentMethodForm form={ form } />
        </FormModalLayout>
    )
}

const PaymentMethod = () => {
    return (
        <ScreenLayout 
            renderFormModal={ renderFormModal } 
            renderGridItem={ renderGridItem } 
            childKey={ childKey }
            subUrlPath="/api/utility/method/"
            headerConfig={ headerConfig }
        />
    )
}

export default PaymentMethod