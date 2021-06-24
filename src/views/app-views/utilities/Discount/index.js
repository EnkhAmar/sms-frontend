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
    title: "Discounts",
    modalButton: "Discount",
    withMoment: true,
    dateFields: [ "start_date", "end_date" ]
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
                <Flex flexDirection="column" className="width-70 gap-10">
                    <Flex justifyContent="start" alignItems="center">
                        { item.limited ? <Tag color={ item.count === item.limit ? "error" : "processing" }>Limited { item.count } / { item.limit } </Tag> : null }
                        <Tooltip title="Name" className="ellipsis">
                            <h4 className="center">{ item.name }</h4>
                        </Tooltip>
                    </Flex>
                    <Row gutter={16}>
                        <Col xs={24} sm={8}>
                            <div style={{ fontSize: "14px" }}><strong>Value:</strong></div>
                            <div> { item.percent === null ? item.value + TUGRUG : item.percent + "%" } </div>
                        </Col>
                        <Col xs={24} sm={8}>
                            <div style={{ fontSize: "14px" }}><strong>From:</strong></div>
                            <div> { item.start_date === null ? "None" : item.start_date } </div>
                        </Col>
                        <Col xs={24} sm={8}>
                            <div style={{ fontSize: "14px" }}><strong>To:</strong></div>
                            <div> { item.end_date === null ? "None" : item.end_date } </div>
                        </Col>
                    </Row>
                </Flex>
                <ItemAction data={ item } modalToggle={ modalToggle } handleDeleteActionClick={ handleDeleteActionClick } />
            </Flex>
        </Card>
    )
}

const DiscountForm = ({ form }) => {
    const [ inputName, setInputName ] = useState("percent")
    const [ showLimitInput, setShowLimitInput ] = useState(form.getFieldValue("limited"))

    const handleRadioButtonChange = (e) => {
        form.setFieldsValue({
            [ inputName ]: null
        })
        console.log(form.getFieldsValue())
        setInputName(e.target.value)
    }

    const handleValuechange = (name, value) => {
        if (name === "limited")
            setShowLimitInput(value)
        form.setFieldsValue({
            [ name ]: value
        })
    }

    return (
        <>
            <Form.Item
                label="Discount Name"
                name="name"
                rules={[{ required: true, message: 'Please input status name!' }]}>
                <Input type="text" name="name" placeholder="Enter Discount Name..." />
            </Form.Item>
            <Row gutter={ 16 }>
                <Col xs={ 24 } sm={ 12 }>
                    <Radio.Group defaultValue="percent" onChange={ handleRadioButtonChange } >
                        <Radio.Button value="percent">Percent</Radio.Button>
                        <Radio.Button value="value">Currency</Radio.Button>
                    </Radio.Group>
                </Col>
                <Col xs={ 24 } sm={ 12 }>
                    <Form.Item
                        label={ "Value" }
                        name={ inputName }
                        initialValue={ null }
                        rules={[{ required: true, message: 'Please set value!' }]}>
                        <Flex alignItems="center">
                            <InputNumber 
                                onChange={ handleValuechange.bind(this, inputName) } 
                                type="number" 
                                min={ 0 }
                                max={ inputName === "percent" ? 100 : null }
                                placeholder="Enter..."
                                style={{ width: "80%" }}
                                />
                            <span className="font-18" style={{ width: "20%" }}>&nbsp;{ inputName === "percent" ? "%" : TUGRUG }</span>
                        </Flex>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={ 16 }>
                <Col xs={ 24 } sm={ 12 }>
                    <Form.Item
                        label="Limited"
                        name="limited"
                        initialValue={ false }>
                        <Switch
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                            defaultChecked={ showLimitInput }
                            onChange={ handleValuechange.bind(this, "limited") }
                        />
                    </Form.Item>
                </Col>
                <Col xs={ 24 } sm={ 12 }>
                    { showLimitInput ? (
                        <Form.Item
                            label="Limit"
                            name="limit"
                            rules={[{ required: true, message: 'Please set the limit!' }]}>
                            <InputNumber 
                                onChange={ handleValuechange.bind(this, "limit") } 
                                type="number" 
                                min={ 0 }
                                placeholder="Enter..."
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    ) : null }
                </Col>
            </Row>
            <Row gutter={ 16 }>
                <Col xs={ 24 } sm={ 12 }>
                    <Form.Item
                        label="From"
                        name="start_date"
                        initialValue={ null }>
                        <DatePicker 
                            placeholder="Start Date..."
                            name="start_date"/>
                    </Form.Item>
                </Col>
                <Col xs={ 24 } sm={ 12 }>
                    <Form.Item
                        label="To"
                        name="end_date"
                        initialValue={ null }>
                        <DatePicker
                            placeholder="End Date..."
                            name="end_date"/>
                    </Form.Item>
                </Col>
            </Row>
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
            <DiscountForm form={ form } />
        </FormModalLayout>
    )
}

const Discount = () => {
    return (
        <ScreenLayout 
            renderFormModal={ renderFormModal } 
            renderGridItem={ renderGridItem } 
            childKey={ childKey }
            subUrlPath="/api/student/discount/"
            headerConfig={ headerConfig }
        />
    )
}

export default Discount