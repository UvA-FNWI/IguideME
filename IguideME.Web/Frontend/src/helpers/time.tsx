/**
 * Helper function to get the timespan since a timestamp in a nice string.
 *
 * @param timestamp - The timestamp to compare to as a number
 * @returns {string} The human readable timespan since the timestamp
 */
export const getRelativeTimeString = (timestamp: number): string => {
	const deltaSeconds = Math.round((timestamp - Date.now()) / 1000);

	// Array reprsenting one minute, hour, day, week, month, year, beyond.
	const cutoffs = [60, 60 * 60, 3600 * 24, 86400 * 7, 604800 * 30, 18144000 * 365, Infinity];

	// Array equivalent to the above but in the string representation of the units
	const units: Intl.RelativeTimeFormatUnit[] = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];

	const unitIndex = cutoffs.findIndex((cutoff) => cutoff > Math.abs(deltaSeconds));

	// Get the divisor to divide from the seconds. E.g. if our unit is "day" our divisor
	// is one day in seconds, so we can divide our seconds by this to get the # of days
	const divisor = unitIndex !== 0 ? cutoffs[unitIndex - 1] : 1;

	const rtf = new Intl.RelativeTimeFormat(navigator.language, { numeric: 'auto' });
	return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
};

export const getRelativeTimeTimer = (start: number, end: number): string => {
	// Could not find an easy locale independent way to do this, so manually
	// computing the hours, minutes and seconds that the sync took.
	const seconds = (end - start) / 1000;
	const hours = ~~(seconds / (60 * 60));
	const minutes = ~~((seconds % (60 * 60)) / 60);
	return `${padZeros(hours)}:${padZeros(minutes)}:${padZeros(~~(seconds % 60))}`;
};

const padZeros = (number: number): string => {
	if (number === 0) {
		return '00';
	}
	if (number < 10) {
		return '0' + number;
	}
	return '' + number;
};
