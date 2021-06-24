import { url } from 'configs/EnvironmentConfig'
import { ADMIN, OPERATOR, TEACHER, ACCOUNTANT } from 'constants/AppConstant'
const { default: axios } = require("axios")

export const getProfile = async (token, id) => {
    try {
        const config = {
            headers: {
                'Content-type': 'Application/json',
                'Authorization': `Bearer ${token}`
            }
        }

        const { data } = await axios.get(
            `${url}/api/auth/action/${id}/`,
            config
        )

        return data
    } catch (err) {
        return {
            success: false,
            error: err.response.data
        }
    }
}

export const updateProfile = async (token, id) => {
    try {
        const config = {
            headers: {
                'Content-type': 'Applicaton/json',
                'Authorization': `Bearer ${token}`
            }
        }

        const body = {

        }

        const { data } = await axios.put(
            `${url}/api/auth/action/${id}/`,
            body,
            config
        )

        return data
    } catch (err) {
        return {
            success: false,
            error: err.response.data
        }
    }
}