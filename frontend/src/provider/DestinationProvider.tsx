import React, { createContext, useContext, useState, useCallback } from 'react';

interface DestinationContextType {
    selectedDestination: string | null;
    setSelectedParticipant: React.Dispatch<React.SetStateAction<string | null>>;
    resetSelectedDestination: () => void;
}

const initialContextValue: DestinationContextType = {
    selectedDestination: null,
    setSelectedParticipant: () => {},
    resetSelectedDestination: () => {},
};

const DestinationContext = createContext<DestinationContextType>(initialContextValue);

export const DestinationProvider = ({ children }:{children: React.ReactNode}) => {
    const [selectedDestination, setSelectedDestination] = useState<string | null>(null);

    const resetSelectedDestination = useCallback(() => {
        setSelectedDestination(null);
    }, []);

    return (
        <DestinationContext.Provider value={{ selectedDestination, setSelectedParticipant: setSelectedDestination, resetSelectedDestination }}>
            {children}
        </DestinationContext.Provider>
    );
};

export const useDestination = () => {
    return useContext(DestinationContext);
};
