import { days, weekDays, currentMonthWord, today } from "../utils/calendar";
function Calendar({ handleDay }) {
  return (
    <div>
      <h2 className="text-xl mb-4 font-medium">Select A Day</h2>
      <div className="mb-2 bg-green-800 p-2 text-center rounded-sm">
        <span className="text-md font-bold text-gray-200">
          {currentMonthWord}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-6">
        {weekDays.map((day, index) => (
          <div key={index} className={"w-1/7 text-center"}>
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <div
            onClick={() => handleDay(day)}
            key={index}
            className={
              day < today
                ? "w-1/7 text-center text-gray-300 cursor-not-allowed"
                : "w-1/7 text-center cursor-pointer hover:bg-gray-100 hover:rounded"
            }
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;
