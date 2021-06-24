import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Modal, Radio, Tabs, Form } from 'antd'
import CustomRegisterForm from './Forms/CustomRegisterForm'


const { TabPane } = Tabs
 
function AddStaffModal({ visible, clickCancel, loading, form, handleChange, handleClickAdd, clickAdd, values, resetFormFields, updateStaff, setUpdateStaff }) {
    return (
        <div>
            <Modal
                visible={visible}
                title="Staff Form"
                onOk={clickAdd}
                onCancel={clickCancel}
                footer={[
                <Button key="back" onClick={clickCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" loading={loading} onClick={handleClickAdd}>
                    {
                        updateStaff.isUpdate
                        ? 'Update'
                        : 'Add'
                    }
                </Button>,
                ]}
            >
              <CustomRegisterForm 
                handleFormSubmit={handleClickAdd} 
                handleChange={handleChange} 
                values={values} form={form} 
                resetFormFields={resetFormFields} 
                updateStaff={updateStaff} 
                setUpdateStaff={setUpdateStaff}
            />
            </Modal>
        </div>
    )
}

export default AddStaffModal
