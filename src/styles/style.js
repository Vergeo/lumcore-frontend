export const style = {
	title: " text-5xl font-bold ",
	subtitle: " text-lg font-bold ",
	h1: " text-3xl text-(--accent) font-bold ",
	h2: " text-xl text-(--accent) font-bold ",
	h3: " text-lg text-(--accent) font-bold ",
	p: " text-(--text) ",
	p_muted: " text-(--text-muted) ",
	error: " bg-(--alert-red) text-(--bg) w-full p-2 rounded-sm ",
	card: " flex flex-col rounded-sm shadow-md items-center justify-center ",
	button: " px-5 py-2 bg-(--accent) text-(--bg-light) hover:bg-(--accent-dark) rounded-sm shadow-sm transition-all ease-in cursor-pointer ",
	button_muted:
		" px-5 py-2 text-(--bg-light) bg-(--accent-dark) rounded-sm shadow-sm ",
	button_red:
		" px-5 py-2 bg-(--alert-red) text-(--bg-light) hover:bg-(--alert-red-dark) rounded-sm shadow-sm transition-all ease-in cursor-pointer ",
	button_red_muted:
		" px-5 py-2 text-(--bg-light) bg-(--alert-red-dark) rounded-sm shadow-sm ",
	text_input:
		" px-2 pt-1 bg-(--bg-dark) border-b-4 border-(--bg-dark) outline-none focus:border-(--accent) transition-all ease-in rounded-sm ",
	accent_gradient: " bg-linear-to-br from-(--accent) to-(--accent-dark) ",
	bg_gradient: " bg-linear-to-br from-(--bg-light) to-(--bg) ",
	radio: " p-2 flex items-center justify-center bg-(--bg) rounded-sm cursor-pointer hover:bg-(--accent-light) transition-all ease-in ",
	radio_checked:
		" bg-(--accent) text-(--bg-light) p-2 flex items-center justify-center rounded-sm transition-all ease-in ",
	navbar_button:
		" w-full text-(--bg-light) px-2 py-1 flex flex-start items-center cursor-pointer hover:bg-(--accent-light) hover:text-(--text-muted) transition-all ease-in rounded-sm",
};
