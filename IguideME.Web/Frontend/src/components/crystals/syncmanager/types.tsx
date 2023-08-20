import { createContext } from 'react';

type contextType = {
    startTime: number | null;
    setStartTime: React.Dispatch<React.SetStateAction<number | null>>;
}

export const syncContext = createContext<contextType>({
    startTime: null,
    setStartTime: () => {}
});
