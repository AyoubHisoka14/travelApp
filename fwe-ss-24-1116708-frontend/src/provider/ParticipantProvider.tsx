import React, { createContext, useContext, useState, useCallback } from 'react';

interface ParticipantContextType {
    selectedParticipant: string | null;
    setSelectedParticipant: React.Dispatch<React.SetStateAction<string | null>>;
    resetSelectedParticipant: () => void;
}

const initialContextValue: ParticipantContextType = {
    selectedParticipant: null,
    setSelectedParticipant: () => {},
    resetSelectedParticipant: () => {},
};

const ParticipantContext = createContext<ParticipantContextType>(initialContextValue);

export const ParticipantProvider = ({ children }:{children: React.ReactNode}) => {
    const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);

    const resetSelectedParticipant = useCallback(() => {
        setSelectedParticipant(null);
    }, []);

    return (
        <ParticipantContext.Provider value={{ selectedParticipant, setSelectedParticipant, resetSelectedParticipant }}>
            {children}
        </ParticipantContext.Provider>
    );
};

export const useParticipant = () => {
    return useContext(ParticipantContext);
};
