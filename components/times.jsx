import { useEffect, useState } from 'react';

export const times = [
	{name: "9:00 AM", value: "9:00 AM"},
	{name: "10:00 AM", value: "10:00 AM"},
	{name: "11:00 AM", value: "11:00 AM"},
	{name: "12:00 PM", value: "12:00 PM"},
	{name: "1:00 PM", value: "1:00 PM"},
	{name: "2:00 PM", value: "2:00 PM"},
	{name: "3:00 PM", value: "3:00 PM"},
	{name: "4:00 PM", value: "4:00 PM"},
	{name: "5:00 PM", value: "5:00 PM"}
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

	const isTimeSlotUnavailable = (timeValue) => {
		return existingMeetings.some(meeting => {
			const [year, month, day, time] = meeting.start;
			return day === selectedDay && time === timeValue && (meeting.status === 'pending' || meeting.status === 'approved');
		});
	};

	const currentHour = new Date().getHours();
	console.log(checked);
	const currentDay = new Date().getDay() + 1;

	const sendTime = (time) => {
		const timeValue = time.value;
		const timeHour = parseInt(timeValue.split(':')[0]) + (timeValue.includes('PM') ? 12 : 0);
		
		// Check all conditions that would make a time slot unavailable
		if (checked.includes(timeValue) || 
			isTimeSlotUnavailable(timeValue) ||
			(currentDay === selectedDay && currentHour >= timeHour)) {
			return;
		}
		
		handleTime(timeValue);
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
							isTimeSlotUnavailable(time.value) ||
							(currentDay === selectedDay && currentHour >= parseInt(time.value.split(':')[0]) + (time.value.includes('PM') ? 12 : 0))
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
