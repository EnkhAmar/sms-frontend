export const url = 'http://54.180.128.247';

export const dev = 'http://54.180.128.247';

export const DATASHEET_REGISTER_TYPE = [
	{
		name: "Phone",
		id: 1
	},
	{
		name: "In Person",
		id: 2
	},
	{
		name: "Facebook",
		id: 3
	},
	{
		name: "Instagram",
		id: 4
	},
	{
		name: "Facebook",
		id: 5
	},
];

export const DATASHEET_TIME = [
	{ name: "06:00", id: "06:00" }, { name: "06:30", id: "06:30" },
	{ name: "07:00", id: "07:00" }, { name: "07:30", id: "07:30" },
	{ name: "08:00", id: "08:00" }, { name: "08:30", id: "08:30" },
	{ name: "09:00", id: "09:00" }, { name: "09:30", id: "09:30" },
	{ name: "10:00", id: "10:00" }, { name: "10:30", id: "10:30" },
	{ name: "11:00", id: "11:00" }, { name: "11:30", id: "11:30" },
	{ name: "12:00", id: "12:00" }, { name: "12:30", id: "12:30" },
	{ name: "13:00", id: "13:00" }, { name: "13:30", id: "13:30" },
	{ name: "14:00", id: "14:00" }, { name: "14:30", id: "14:30" },
	{ name: "15:00", id: "15:00" }, { name: "15:30", id: "15:30" },
	{ name: "16:00", id: "16:00" }, { name: "16:30", id: "16:30" },
	{ name: "17:00", id: "17:00" }, { name: "17:30", id: "17:30" },
	{ name: "18:00", id: "18:00" }, { name: "18:30", id: "18:30" },
	{ name: "19:00", id: "19:00" }, { name: "19:30", id: "19:30" },
	{ name: "20:00", id: "20:00" }, { name: "20:30", id: "20:30" },
	{ name: "21:00", id: "21:00" }, { name: "21:30", id: "21:30" },
	{ name: "22:00", id: "22:00" }, { name: "22:30", id: "22:30" }
];

const prod = {
  API_ENDPOINT_URL: 'https://api.prod.com'
};

const test = {
  API_ENDPOINT_URL: 'https://api.test.com'
};

const getEnv = () => {
	switch (process.env.NODE_ENV) {
		case 'development':
			return dev
		case 'production':
			return prod
		case 'test':
			return test
		default:
			break;
	}
}

export const env = getEnv();
