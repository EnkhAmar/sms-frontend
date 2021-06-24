import Body from 'components/utility-view-components/Body'
import Header from 'components/utility-view-components/Header'
import { url } from 'configs/EnvironmentConfig'
import { OPERATOR, OPERATOR_GROUP } from 'constants/AppConstant'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { addItemData, deleteItemData, fetchData, showErrorMessage, updateItemData } from '../functions'
import '../style.css'
import { Form, message  } from 'antd'
import { Modal } from 'antd'
import moment, { isMoment } from 'moment'

const ScreenLayout = ({
    subUrlPath,
    renderFormModal,
    renderGridItem,
    childKey,
    headerConfig,
}) => {

    const [ form ] = Form.useForm()
    const filters = useSelector(state => state.filters)
    const user = useSelector(state => state.userLogin)
    const [ dataSource, setDataSource ] = useState([])
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ total, setTotal ] = useState(0)
    const [ isLoading, setLoading ] = useState(false)
    const [ modal, setModal ] = useState(false)
    const [ modifyLoading, setModifyLoading ] = useState(false)

    const handleFetchData = (page) => {
        let _filters = user.role_id === OPERATOR ? {} : filters;
        setLoading(true);
        fetchData(`${url}${subUrlPath}?page=${page}`, _filters)
            .then(res => {
                const { count, results } = res.data;
                setTotal(count)
                setDataSource(results)
                setLoading(false);
                setCurrentPage(page)
            })
            .catch(err => {
                console.log(err.response.data)
            })
    }

    const handleModalToggleClick = useCallback((state, type=0, data=null) => {
        if (state && type === 2 && data != null) {
            const _data = { ...data };
            if ("withMoment" in headerConfig) {
                console.log(headerConfig)
                headerConfig.dateFields.forEach(item => _data[item] = moment(_data[item]))
            }
            form.setFieldsValue(_data)
        }
        if (!state)
            form.resetFields()
        setModal(state)
    }, [ setModal, headerConfig ])

    const handleFormFinish = useCallback((data) => {
        const _data = { ...data }
        if ("withMoment" in headerConfig) {
            headerConfig.dateFields.forEach(item => {
                const date = _data[item].toDate()
                _data[item] = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
            })
        }
        _data.branch = user.role_id === OPERATOR ? user.branch : filters.branch
        setModifyLoading(true)
        addItemData(`${url}${subUrlPath}`, _data)
            .then(res => {
                handleModalToggleClick(false)
                handleFetchData(currentPage)
                message.success("Successfully added!")
                setModifyLoading(false)
            })
            .catch(err => {
                showErrorMessage(err.response.data)
                setModifyLoading(false)
            })
    }, [ user, filters, handleFetchData ])

    const handleFormUpdateFinish = useCallback((id, data) => {
        console.log(data)
        const tempStatus = [ ...dataSource ]
        const _data = { ...data }
        if ("withMoment" in headerConfig) {
            headerConfig.dateFields.forEach(item => {
                const date = _data[item].toDate()
                _data[item] = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
            })
        }
        setModifyLoading(true)
        updateItemData(`${url}${subUrlPath}${id}/`, _data)
            .then(res => {
                tempStatus.splice(
                    tempStatus.findIndex((item) => item.id === id), 
                    1, 
                    res.data.data
                )
                setDataSource(tempStatus)
                handleModalToggleClick(false)
                setModifyLoading(false)
                message.success("Successfully updated!")
            })
            .catch(err => { 
                showErrorMessage(err.response.data)
                setModifyLoading(false)
            })
    }, [ dataSource ])

    const handleDeleteActionClick = (id) => {
        Modal.confirm({
            title: 'Are you sure delete this room?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => {
                deleteItemData(`${url}${subUrlPath}${id}/`)
                    .then(res => {
                        message.success("Successfully deleted!")
                        handleFetchData(currentPage)
                    })
                    .catch(err => showErrorMessage(err.response.data))
            }
        })
    }

    useEffect(() => {
        handleFetchData(1);
    }, [ filters ])

    return (
        <div>
            <Header 
                config={ headerConfig } 
                showModal={ handleModalToggleClick } 
                branch={ filters.branch } />
            <Body 
                data={ dataSource } 
                childKey={ childKey } 
                modalToggle={ handleModalToggleClick } 
                handleDeleteActionClick={ handleDeleteActionClick } 
                total={ total } 
                currentPage={ currentPage } 
                loading={ isLoading } 
                onChange={ handleFetchData } 
                gridItem={ renderGridItem } />
            { renderFormModal(
                modal, 
                handleModalToggleClick, 
                handleFormFinish, 
                handleFormUpdateFinish, 
                form,
                modifyLoading
            ) }
        </div>
    )
}

export default ScreenLayout;