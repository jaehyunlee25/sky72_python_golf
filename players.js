const clubId = 'fccb4e5e-bf95-11ec-a93e-0242ac11000a';
const courses = { 
	VALLEY: '83703462-bf96-11ec-a93e-0242ac11000a', // 'VALLEY 코스', 
	LAKE: '837037a5-bf96-11ec-a93e-0242ac11000a', // 'Pine 코스', 
	MOUNTAIN: '837037e3-bf96-11ec-a93e-0242ac11000a', // 'MOUNTAIN 코스', 
};
const OUTER_ADDR_HEADER = 'https://dev.mnemosyne.co.kr';
const addrOuter = OUTER_ADDR_HEADER + '/api/reservation/golfSchedule';
const header = { 'Content-Type': 'application/json' };

const now = new Date();
const thisyear = now.getFullYear() + "";
const thismonth = ("0" + (1 + now.getMonth())).slice(-2);
const thisdate = thisyear + thismonth;

now.setMonth(now.getMonth() + 1);
const nextyear = now.getFullYear() + "";
const nextmonth = ("0" + (1 + now.getMonth())).slice(-2);
const nextdate = nextyear + nextmonth;

console.log(thisdate, nextdate);

const dates = [];
const result = [];
const golf_schedule = [];

mneCall(thisdate, procDate);

function procDate() {
  const lmt = dates.length - 1;
  let cnt = 0;
  const timer = setInterval(() => {
    // 마지막 수신 데이터까지 처리하기 위해 종료조건이 상단에 위치한다.
    if(cnt > lmt) {
      clearInterval(timer);
      procGolfSchedule();
      return;
    }
    // 데이터 수집
    const [date] = dates[cnt];
	  console.log('수집하기', cnt + '/' + lmt, date);
    mneCallDetail(date);
    cnt++;
    // if(cnt > 0) clearInterval(timer);
  }, 300);
}
function procGolfSchedule() {
	golf_schedule.forEach((obj) => {
		obj.golf_course_id = courses[obj.golf_course_id];
		obj.date = obj.date.gh(4) + '-' + obj.date.ch(4).gh(2) + '-' + obj.date.gt(2);
	});
	console.log(golf_schedule);
	const param = { golf_schedule, golf_club_id: clubId };
	post(addrOuter, param, header, () => {});
};
function mneCallDetail(date) {
  const param = { 
    type: 'Real',
    membership: '',
    timezone: '',
    course: '',
    date: date,
  };
  post('/_cm_core/reservation/ajax/timelist.asp', param, {}, (data) => {
    const objResp = JSON.parse(data).timelist;
    const dict = {1: 'VALLEY', 2: 'LAKE', 3: 'MOUNTAIN'};
    objResp.forEach((obj) => {
      const course = dict[obj.course];
      const time = obj.time.gh(2) + ":" + obj.time.gt(2);
      const fee_normal = obj.gf_ori * 1;
      const fee_discount = obj.gf_dis * 1;
      
      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: '',
        persons: '',
        fee_normal,
        fee_discount,
        others: '9홀',
      });
    });
  });
}
function mneCall(date, callback) {
  const as = Array.from(document.getElementsByClassName('reservation_request_button'));
  as.forEach((a) => {
    const date = a.getAttribute('date');
    dates.push([date, 0]);
  });
  callback();
}