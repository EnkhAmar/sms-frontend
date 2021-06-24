import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Flex from 'components/shared-components/Flex'
import { ItemAction } from 'components/utility-view-components/GridItem'
import React from 'react'
import '../style.css'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { Form, Input, Card, Tooltip, Radio  } from 'antd'
import FormModalLayout from 'components/utility-view-components/FormModalLayout'
import ScreenLayout from '../ScreenLayout'

const headerConfig = {
    title: "Status",
    modalButton: "Status"
}
const childKey = "status_view_card_list"

const renderGridItem = (
        item,
        modalToggle,
        handleDeleteActionClick
    ) => {
    return (
        <Card>
            <Flex alignItems="center" justifyContent="between">
                <Flex alignItems="center" className="gap-10 font-18 width-70">
                    <FontAwesomeIcon icon={ faCircle } color={ item.color } />
                    <Tooltip title="Name" className="ellipsis">
                        <h4 className="center">{ item.name }</h4>
                    </Tooltip>
                </Flex>
                <ItemAction data={ item } modalToggle={ modalToggle } handleDeleteActionClick={ handleDeleteActionClick } />
            </Flex>
        </Card>
    )
}

const StatusForm = () => {
    return (
        <>
            <Form.Item
                label="Status Name"
                name="name"
                rules={[{ required: true, message: 'Please input status name!' }]}>
                <Input type="text" name="name" />
            </Form.Item>
            <Form.Item name="color">
                <Radio.Group name="color" className="radio-group" defaultValue="a" buttonStyle="solid">
                    <Radio.Button name="color" className="radio-button" style={{ background: "#B9FFB7" }} value="#B9FFB7"></Radio.Button>
                    <Radio.Button name="color" className="radio-button" style={{ background: "#F19A3E" }} value="#F19A3E"></Radio.Button>
                    <Radio.Button name="color" className="radio-button" style={{ background: "#F05D5E" }} value="#F05D5E"></Radio.Button>
                    <Radio.Button name="color" className="radio-button" style={{ background: "#47A8BD" }} value="#47A8BD"></Radio.Button>
                    <Radio.Button name="color" className="radio-button" style={{ background: "#9C3848" }} value="#9C3848"></Radio.Button>
                    <Radio.Button name="color" className="radio-button" style={{ background: "#4062BB" }} value="#4062BB"></Radio.Button>
                </Radio.Group>
            </Form.Item>
        </>
    )
}

const renderFormModal = (
    modal,
    modalToggle, 
    handleFormFinish,
    handleFormUpdateFinish,
    form
) => {
    return (
        <FormModalLayout 
            modal={ modal }
            modalToggle={ modalToggle } 
            handleFormFinish={ handleFormFinish }
            handleFormUpdateFinish={ handleFormUpdateFinish }
            form={ form } >
            <StatusForm />
        </FormModalLayout>
    )
}

const Status = () => {
    return (
        <ScreenLayout 
            renderFormModal={ renderFormModal } 
            renderGridItem={ renderGridItem } 
            childKey={ childKey }
            subUrlPath="/api/utility/status/"
            headerConfig={ headerConfig }
        />
    )
}

export default Status