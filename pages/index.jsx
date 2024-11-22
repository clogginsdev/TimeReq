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
	const [step, setStep] = useState('profile'); // 'profile', 'calendar', 'time', 'form'
	const [selectedDay, setSelectedDay] = useState(null);
	const [selectedTime, setSelectedTime] = useState(null);
	const [blockTime, setBlockTime] = useState([]);
	const [form, setForm] = useState({
		year: currentYear,
		month: currentMonth,
		day: "",
		time: {
			hour: 0,
			minutes: 0,
		},
		name: "",
		email: "",
		description: "",
	});

	const [success, setSuccess] = useState("");

	async function checkMeeting() {
		return await apiFetch("meetings", { method: "GET" });
	}

	async function persistMeeting() {
		await apiFetch("meetings", {
			method: "POST",
			body: form,
		});

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
				const date = [2023, currentMonth, day, time.value, 0].toString();
				if (start.includes(date)) {
					setBlockTime((prevState) => {
						return [...prevState, time.value.toString()];
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
			time: { hour: Number(time.slice(0, 2)), minutes: form.time.minutes },
		});
		setStep('form');
	};

	return (
		<div className={"container mx-auto bg-neutral-950 min-h-screen"}>
			<Head>
				<title>TimeReq - Make a meeting request</title>
				<meta name='description' content='Request time on a calendar.' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<header></header>
			<main className={"main min-h-[90vh] flex items-center"}>
				<div className='bg-neutral-900 p-4 md:p-6 rounded-lg shadow-lg max-w-sm mx-auto text-center transition-all text-neutral-100'>
					<div className="flex justify-center mb-6 text-sm">
						<div className={`px-4 py-2 ${step === 'profile' ? 'bg-blue-600 text-white' : 'text-gray-500'} rounded-l-full`}>
							Profile
						</div>
						<div className={`px-4 py-2 ${step === 'calendar' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>
							Date
						</div>
						<div className={`px-4 py-2 ${step === 'time' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>
							Time
						</div>
						<div className={`px-4 py-2 ${step === 'form' ? 'bg-blue-600 text-white' : 'text-gray-500'} rounded-r-full`}>
							Details
						</div>
					</div>
					{step === 'profile' && (
						<>
							<Profile />
							<button 
								onClick={() => setStep('calendar')}
								className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
							>
								Continue to Calendar
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
					<div className='p-4 mt-4 border-t border-gray-800'>
						<Link
							className="inline-flex items-center text-gray-400 hover:text-gray-200 transition-colors"
							href='/'>
							<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
							</svg>
							Back to Homepage
						</Link>
					</div>
				</div>
			</main>

			<footer className={"footer"}></footer>
		</div>
	);
}
