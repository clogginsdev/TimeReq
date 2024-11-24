const parseTime = (timeString) => {
    const [timeStr, period] = timeString.split(' ');
    const [hours, minutes] = timeStr.split(':').map(Number);
    let hour = hours;
    
    if (period === 'PM' && hours !== 12) hour += 12;
    if (period === 'AM' && hours === 12) hour = 0;
    
    return { hour, minutes };
};

const createMeetingDate = (day, timeString) => {
    const meetingDate = new Date();
    meetingDate.setDate(day);
    
    const { hour, minutes } = parseTime(timeString);
    meetingDate.setHours(hour);
    meetingDate.setMinutes(minutes);
    
    return meetingDate;
};

module.exports = {
    parseTime,
    createMeetingDate
};
