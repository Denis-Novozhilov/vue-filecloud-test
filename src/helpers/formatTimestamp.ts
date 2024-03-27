type DateValue = number|string;
export const formatTimestamp = (timestamp: number) => {
	let date = new Date(timestamp);

	let day:DateValue = date.getDate();
	let month:DateValue = date.getMonth() + 1;
	let year:DateValue = date.getFullYear();
	let hours:DateValue = date.getHours();
	let minutes:DateValue = date.getMinutes();

	if (day < 10) {
		day = '0' + day;
	}
	if (month < 10) {
		month = '0' + month;
	}
	if (hours < 10) {
		hours = '0' + hours;
	}
	if (minutes < 10) {
		minutes = '0' + minutes;
	}

	const formattedDate = day + '.' + month + '.' + year + ', ' + hours + ':' + minutes;

	return formattedDate;
};
