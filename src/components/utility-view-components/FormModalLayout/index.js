import { Form, Modal, Input, Card, Col, Tooltip, Button, message, Radio  } from 'antd'
import Flex from 'components/shared-components/Flex'

const FormModalLayout = ({
    modal,
    modalToggle, 
    handleFormFinish,
    handleFormUpdateFinish,
    form,
    children,
    modifyLoading
}) => {
    const id = form.getFieldValue("id")
    return (
        <Modal
            visible={ modal }
            title="Add New Status"
            footer={ null }
            onCancel={ modalToggle.bind(this, false) }
            width={ 400 }>
            <Form
                form={ form }
                onFinish={ id === undefined ? handleFormFinish : handleFormUpdateFinish .bind(this, id)}>
                { children }
                <Form.Item className="margin-0">
                    <Flex justifyContent="end" className="gap-10">
                        <Button onClick={ modalToggle.bind(this, false) }>Cancel</Button>
                        <Button loading={ modifyLoading } type="primary" htmlType="submit"> { id === undefined ? "Submit" : "Save" } </Button>
                    </Flex>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default FormModalLayout