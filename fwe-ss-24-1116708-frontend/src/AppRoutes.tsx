import {Route, Routes } from "react-router-dom";
import {TravelPage} from "./pages/TravelPage.tsx";
import React from "react";
import TravelDetailsPage from "./pages/TravelDetailsPage.tsx";
import {DestinationPage} from "./pages/DestinationPage.tsx";
import {DestinationDetailsPage} from "./pages/DestinationDetailsPage.tsx";
import {ParticipantPage} from "./pages/ParticipantPage.tsx";
import {ParticipantDetailsPage} from "./pages/ParticipantDetailsPage.tsx";

export type RouteConfig = {
  path: string;
  element: React.ReactNode;
};

export const routes: RouteConfig[] = [
  { path: "/", element: <TravelPage /> },
  { path: "/travelDetail", element: <TravelDetailsPage /> },
  { path: "/destinations", element: <DestinationPage /> },
  { path: "/destinationDetail", element: <DestinationDetailsPage /> },
  { path: "/participants", element: <ParticipantPage /> },
  { path: "/participantDetail", element: <ParticipantDetailsPage /> },
];

const renderRouter = ({ element, ...restRoute }: RouteConfig) => {
  return (
      <Route key={restRoute.path} {...restRoute} element={element} />

  );
};

export const AppRoutes = () => {
  return <Routes>{routes.map((route) => renderRouter(route))}</Routes>;
};
