import { useContext } from 'react';
import { useStore } from 'zustand';
import { GlobalContext, type GlobalState } from './globalStore';

export function useGlobalContext<T>(selector: (state: GlobalState) => T): T {
    const store = useContext(GlobalContext);
    if (!store) throw new Error('useGlobalContext must be used within a GlobalStoreProvider');
    return useStore(store, selector);
}
