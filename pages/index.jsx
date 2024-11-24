import { useState } from "react";
import Head from "next/head";
import Link from 'next/link'
import Profile from "../components/Profile";
import { currentMonth, currentYear } from "../utils/calendar";
import { apiFetch } from "../utils/fetch";
import Calendar from "../components/calendar";
import Times from "../components/times";
import { times } from "../components/times";
import Form from "../components/Form";

export default function Home() {
	const initialForm = {
		year: currentYear,
		month: currentMonth,
		day: "",
		time: "",
		name: "",
		email: "",
		description: "",
	};

	const [step, setStep] = useState('profile'); // 'profile', 'calendar', 'time', 'form'
	const [selectedDay, setSelectedDay] = useState(null);
	const [selectedTime, setSelectedTime] = useState(null);
	const [blockTime, setBlockTime] = useState([]);
	const [form, setForm] = useState(initialForm);
	const [success, setSuccess] = useState("");

	const convertTo12HourFormat = (hour) => {
		if (hour === 0) return { hour: 12, period: 'AM' };
		if (hour === 12) return { hour: 12, period: 'PM' };
		if (hour > 12) return { hour: hour - 12, period: 'PM' };
		return { hour: hour, period: 'AM' };
	};

	const formatTimeForDB = (hour, minutes) => {
		const { hour: formattedHour, period } = convertTo12HourFormat(hour);
		return `${formattedHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
	};

	const resetState = () => {
		setStep('profile');
		setSelectedDay(null);
		setSelectedTime(null);
		setBlockTime([]);
		setForm(initialForm);
		setSuccess("");
	};

	async function checkMeeting() {
		try {
			const meetings = await apiFetch("meetings", { method: "GET" });
			return meetings || [];
		} catch (error) {
			console.error('Failed to check meetings:', error);
			return [];
		}
	}

	async function persistMeeting() {
		// First create the meeting in the database
		await apiFetch("meetings", {
			method: "POST",
			body: {
				...form,
				year: currentYear,
				month: currentMonth
			},
		});

		// Then send the email notifications
		const getSuccessMessage = await apiFetch("meetings/getinvite", {
			method: "POST",
			body: form,
		});

		setSuccess(getSuccessMessage.message);
	}

	const handleFormChange = (e) => {
		setForm((prevForm) => ({ ...prevForm, [e.target.name]: e.target.value }));
	};

	const handleDay = async (day) => {
		const currentDay = new Date().getDate();
		const meetingList = await checkMeeting();

		meetingList.map((item) => {
			const start = item.start.toString();

			times.map((time) => {
				const date = [2023, currentMonth, day, time.value].toString();
				
				if (start.includes(date)) {
					setBlockTime((prevState) => {
						return [...prevState, time.value];
					});
				}
			});
		});
		if (day < currentDay) {
			return;
		} else {
			setSelectedDay(day);
			setForm({ ...form, day: day });
			setStep('time');
		}
	};

	const handleTime = (time) => {
		setSelectedTime(time);
		setForm({
			...form,
			time: time
		});
		setStep('form');
	};

	return (
		<div className="min-h-screen bg-neutral-950">
			<div className="container mx-auto px-4 py-4">
			<Head>
				<title>TimeReq - Make a meeting request</title>
				<meta name='description' content='Request time on a calendar.' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<header></header>
			<main className="min-h-[90vh] flex items-center justify-center">
				<div className='backdrop-blur-xl bg-neutral-900/90 p-6 md:p-8 rounded-2xl max-w-sm w-full mx-auto text-center transition-all text-neutral-100 shadow-xl border border-neutral-800/50'>
					{step === 'profile' && (
						<>
							<Profile />
							<button 
								className="mt-4 bg-emerald-600 hover:bg-emerald-500 rounded px-6 py-3 text-white font-medium transition-colors text-sm w-full flex items-center justify-center"
								onClick={() => setStep('calendar')}
							>
								Continue
							</button>
						</>
					)}
					<div className={"p-2"}>
						{step === 'calendar' && <Calendar handleDay={handleDay} />}
						<div className='mt-2'>
							{step === 'time' && (
								<Times
									handleTime={handleTime}
									handleBlocked={blockTime}
									selectedDay={selectedDay}
								/>
							)}
						</div>
						{step === 'form' && !success && (
							<Form
								form={form}
								handleChange={(e) => handleFormChange(e)}
								handleSubmit={persistMeeting}
							/>
						)}
						{success && (
							<div className='p-6 bg-green-600 text-white rounded-lg shadow-md animate-fade-in'>
								<svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
								</svg>
								{success}
							</div>
						)}
					</div>
					{step !== 'profile' && (
						<div className='p-4 mt-4 border-t border-gray-800'>
							<div
							role="button"
								className="inline-flex items-center text-neutral-200 hover:text-neutral-300"
								onClick={resetState}>
								<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
								</svg>
								Back to Homepage
							</div>
						</div>
					)}
				</div>
			</main>

			<footer></footer>
			</div>
		</div>
	);
}
