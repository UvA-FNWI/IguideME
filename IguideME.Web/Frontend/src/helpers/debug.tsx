export const debug = (): boolean => {
	const { REACT_APP_DEBUG } = process.env;

	if (REACT_APP_DEBUG === null) return false;
	return REACT_APP_DEBUG === '1';
};