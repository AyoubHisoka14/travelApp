import React, { createContext, useContext, useState, useCallback } from 'react';

interface TravelContextType {
    selectedTravel: string | null;
    setSelectedTravel: React.Dispatch<React.SetStateAction<string | null>>;
    resetSelectedTravel: () => void;
}

const initialContextValue: TravelContextType = {
    selectedTravel: null,
    setSelectedTravel: () => {},
    resetSelectedTravel: () => {},
};

const TravelContext = createContext<TravelContextType>(initialContextValue);

// Create a provider component
export const TravelProvider = ({ children }:{children: React.ReactNode}) => {
    const [selectedTravel, setSelectedTravel] = useState<string | null>(null);

    const resetSelectedTravel = useCallback(() => {
        setSelectedTravel(null);
    }, []);

    return (
        <TravelContext.Provider value={{ selectedTravel, setSelectedTravel, resetSelectedTravel }}>
            {children}
        </TravelContext.Provider>
    );
};

// Custom hook to use the TravelContext
export const useTravel = () => {
    return useContext(TravelContext);
};
