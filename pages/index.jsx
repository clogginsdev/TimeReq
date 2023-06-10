import { useState } from "react";
import Head from "next/head";
import { currentMonth, currentYear } from "../utils/calendar";
import { apiFetch } from "../utils/fetch";
import Calendar from "../components/calendar";
import Times from "../components/times";
import { times } from "../components/times";
import Form from "../components/Form";

export default function Home() {
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
		}
	};

	const handleTime = (time) => {
		setSelectedTime(time);
		setForm({
			...form,
			time: { hour: Number(time.slice(0, 2)), minutes: form.time.minutes },
		});
	};

	return (
		<div className={"container mx-auto"}>
			<Head>
				<title>TimeReq - Make a meeting request</title>
				<meta name='description' content='Request time on a calendar.' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<header></header>
			<main className={"main min-h-[90vh] flex items-center"}>
				<div className='bg-white p-4 rounded shadow-md grid grid-cols-1 xl:w-1/3 gap-4 items-center mx-auto text-center'>
					<div className={"p-4"}>
						<img
							className={
								"rounded-full w-[100px] h-[100px] object-cover mx-auto"
							}
							src='images/chris.jpeg'
							alt="Chris Loggins' profile image."
						/>
						<div className='mt-4'>
							<h2 className='font-semibold text-2xl'>
								Meeting With Chris
							</h2>
							<em className={"block mt-2"}>Web Designer & Developer</em>
							<p className='mt-2'>
								Thanks for coming to schedule a meeting with me. After filling
								out the details, I will review your meeting request and send you
								an invite.
							</p>
						</div>
					</div>
					<div className={"p-2"}>
						{!selectedDay && <Calendar handleDay={handleDay} />}
						<div className='mt-2'>
							{selectedDay && !selectedTime && (
								<Times
									handleTime={handleTime}
									handleBlocked={blockTime}
									selectedDay={selectedDay}
								/>
							)}
						</div>
						{selectedDay && selectedTime && !success && (
							<Form
								form={form}
								handleChange={(e) => handleFormChange(e)}
								handleSubmit={persistMeeting}
							/>
						)}
						{success && (
							<div className='p-4 bg-green-600 text-white rounded'>
								{success}
							</div>
						)}
					</div>
					<div className='p-4'>
						<a
							className={"text-blue-600 font-medium hover:text-blue-800"}
							href='/'>
							Go to the Homepage
						</a>
					</div>
				</div>
			</main>

			<footer className={"footer"}></footer>
		</div>
	);
}
