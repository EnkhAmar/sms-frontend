import moment from 'moment';

export const getDates = (start_date, end_date, days) => {
  days = days.sort((a,b) => (a.day > b.day) ? 1 : ((b.day > a.day) ? -1 : 0))
  let dates = [];
  let current = moment(start_date, 'YYYY-MM-DD');
  end_date = moment(end_date, 'YYYY-MM-DD');
  while (current <= end_date) {
    var indices = days.map((e, i) => e.day === parseInt(current.format('d')) ? i : '').filter(String);
    for (let i = 0; i < indices.length; i++) {
      dates.push(current.format('YYYY-MM-DD'));
    }
    current = moment(current).add(1, 'days');
  }
  return dates
}

export const getDatesAndTime = (start_date, end_date, days) => {
  days = days.sort((a,b) => (a.day > b.day) ? 1 : ((b.day > a.day) ? -1 : 0))
  let dates = [];
  let current = moment(start_date, 'YYYY-MM-DD');
  end_date = moment(end_date, 'YYYY-MM-DD');
  while (current <= end_date) {
    var indices = days.map((e, i) => e.day === current.format('d') ? i : '').filter(String);
    for (let i = 0; i < indices.length; i++) {
      let temp = {};
      temp['date'] = current.format('YYYY-MM-DD');
      temp['start_time'] = moment(days[indices[i]].start_time, "HH:mm:ss").format("HH:mm");
      temp['end_time'] = moment(days[indices[i]].end_time, "HH:mm:ss").format("HH:mm");
      temp['calendar'] = days[indices[i]].id;
      dates.push(temp);
    }
    current = moment(current).add(1, 'days');
  }
  return dates
}

// export default getDates;
