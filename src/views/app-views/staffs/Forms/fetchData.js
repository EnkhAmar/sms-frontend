import { url } from 'configs/EnvironmentConfig'
import { ADMIN, OPERATOR, TEACHER, ACCOUNTANT } from 'constants/AppConstant'
const { default: axios } = require("axios")

export const fetchSchools = async (token) => {
    try {
        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }

        const body = {
            projection: [`school`]
        }

        const { data } = await axios.post(
            `${url}/api/utility/detail/`,
            body,
            config
        )
        return data
    } catch (err) {
        return err.response.data
    }
}

export const fetchBranches = async (token, id) => {
    try {
        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        const body = {
            projection: ['branch'],
            school: id
        }

        const { data } = await axios.post(
            `${url}/api/utility/detail/`,
            body,
            config
        )

        return data
    } catch (err) {
        return err.response.data
    }
}

export const fetchStaffs = async (token, staff_group_id, page) => {
    try {
        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        const { data } = await axios.get(
            `${url}/api/auth/action/${staff_group_id}/group/?page=${page}`,
            config
        )

        return data
    } catch (err) {
        return err.response.data
    }
}