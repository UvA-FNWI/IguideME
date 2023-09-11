import { createContext } from 'react';

interface contextType {
	startTime: number | null;
	setStartTime: React.Dispatch<React.SetStateAction<number | null>>;
}

export const syncContext = createContext<contextType>({
	startTime: null,
	setStartTime: () => {},
});
