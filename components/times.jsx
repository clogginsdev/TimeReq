import { useEffect, useState } from 'react';

export const times = [
	{name: "9:00", value: "09"},
	{name: "10:00", value: "10"},
	{name: "11:00", value: "11"},
	{name: "12:00", value: "12"},
	{name: "01:00", value: "13"},
	{name: "02:00", value: "14"},
	{name: "03:00", value: "15"},
	{name: "04:00", value: "16"},
	{name: "05:00", value: "17"}

];
function Times({ handleTime, handleBlocked, selectedDay }) {
const [existingMeetings, setExistingMeetings] = useState([]);
const checked = handleBlocked.toString();

useEffect(() => {
    fetch('/api/meetings')
        .then(res => res.json())
        .then(meetings => setExistingMeetings(meetings))
        .catch(err => console.error('Failed to fetch meetings:', err));
}, []);

const isTimeSlotTaken = (timeValue) => {
    return existingMeetings.some(meeting => {
        const [year, month, day, hour] = meeting.start;
        return day === selectedDay && hour === timeValue;
    });
};
const currentHour = new Date().getHours();
console.log(checked);
const currentDay = new Date().getDay() + 1;

const sendTime = (time) => {
	if (checked.includes(time.value) ) {
		return;
	} else {
		handleTime(time.value);
	}
}


	return (
		<div>
			<h2 className='text-xl mb-4 font-medium'>Select A Time</h2>
			<div className={"grid grid-cols-3 items-center gap-3"}>
				{times.map((time, index) => (

					<div
						onClick={() => sendTime(time)}
						key={index}
						className={
							checked.includes(time.value) || 
							((+time.value) === currentHour && currentDay === selectedDay) || 
							((+time.value) <= currentHour && currentDay === selectedDay) ||
							isTimeSlotTaken(time.value)
								? "opacity-25 text-center border border-neutral-700 p-2 rounded cursor-not-allowed bg-neutral-800"
								: "border border-neutral-700 p-2 text-center rounded cursor-pointer hover:bg-neutral-800 transition-colors"
						}>
						{time.name}
					</div>
				))}
			</div>
		</div>
	);
}

export default Times;
