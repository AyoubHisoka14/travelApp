import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {ChakraProvider} from "@chakra-ui/react";
import {BrowserRouter} from "react-router-dom";
import {TravelProvider} from "./provider/TravelProvider.tsx";
import {DestinationProvider} from "./provider/DestinationProvider.tsx";
import {ParticipantProvider} from "./provider/ParticipantProvider.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ChakraProvider>
            <BrowserRouter>
                <TravelProvider>
                    <DestinationProvider>
                        <ParticipantProvider>
                            <App />
                        </ParticipantProvider>
                    </DestinationProvider>
                </TravelProvider>
            </BrowserRouter>
        </ChakraProvider>
    </React.StrictMode>,
)
