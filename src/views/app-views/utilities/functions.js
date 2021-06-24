import { message } from "antd"
import axios from "axios"

const header = {
    "Content-type": "application/json",
    "Authorization": `Bearer ${ localStorage.getItem("userToken") }`
}

const config = {
    "headers": header
}


export const fetchData = (url, filter) => {
    let _filter = { ...filter }
    Object.keys(filter).forEach(item => {
        if (_filter[item]===null)
            delete _filter[item]
    })
    let queryParams = Object.keys(_filter).map(item => `${item}=${_filter[item]}`).join("&");
    return axios.get(url + (queryParams === "" ? "" : "&" + queryParams), config)
}

export const addItemData = (url, body) => {
    return axios.post(url, JSON.stringify(body), config)
}

export const updateItemData = (url, body) => {
    return axios.put(url, JSON.stringify(body), config)
}

export const deleteItemData = (url, body) => {
    return axios.delete(url, config)
}

export const showErrorMessage = (err) => {
    Object.keys(err).forEach(item => {
        message.error(err[item])
    })
}