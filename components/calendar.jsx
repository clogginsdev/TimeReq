import { days, weekDays, currentMonthWord, today } from "../utils/calendar";
function Calendar({ handleDay }) {
  return (
    <div>
      <h2 className="text-xl mb-4 font-medium">Select A Day</h2>
      <div className="mb-2 bg-neutral-800 p-2 text-center rounded-sm">
        <span className="text-sm font-bold text-neutral-200">
          {currentMonthWord}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-3">
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
                ? "w-1/7 text-center text-neutral-600 opacity-50 cursor-not-allowed"
                : "w-1/7 text-center cursor-pointer hover:bg-neutral-800 hover:rounded transition-colors"
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
