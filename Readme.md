# TravelApp

## Overview

TravelApp is a web application designed to manage and track travels. It allows users to add, view, update, and delete travel plans. The application also includes a currency conversion feature to assist users in planning their travel budgets in different currencies.

## Prerequisites

- There needs to be a running PostgreSQL DB accessible.
- [Node.js](https://nodejs.org) runtime installed

## Configuration

#### Install modules

- Install node modules for frontend: 
    ```bash
    cd frontend 
    ```
    ```bash
    npm install
    ```
    
- Install node modules for backend: 
    ```bash
    cd backend 
    ```
    ```bash
    npm install
    ```
    
#### Start Database

- If you have Docker installed and running, you can use the included docker-compose file   
    ```bash
    cd backend
    ```
    ```bash
    docker compose up
    ```
    
#### Start the server

- It would be better to first clear all tables:
    ```bash
    npm run schema:fresh
    ```

- Run the server in development mode:
    ```bash
    npm run start:dev
    ```

#### Start the frontend

- Navigate to the frontend folder and run the frontend :
    ```bash
    npm run dev
    ```

## Backend-Project structure

- [src](backend/src): This directory contains all the source code of this API.
  - [index.ts](backend/src/index.ts): Here the configuration of [Express] takes place.
  - [entities](backend/src/entities): The MikroORM entities are located here.
  - [uploads](backend/src/uploads): Here are all the Uploads of the User, in this case the images.
  - [controllers](backend/src/controller): The controller contains the logic.
  Each router has his controller with the handler functions for the routes.

  #### Routes

  - [/travels](backend/src/controller/travel.controller.ts): This Route is to manage all Travels. The TravelController manages retrieving, creating, editing and deleting travels 
  - [/destinations](backend/src/controller/destination.controller.ts): This Route is to manage all Destinations. The DestinationController manages retrieving, creating, editing and deleting Destinations. 
  - [/participants](backend/src/controller/participant.controller.ts): This Route is to manage all Participants. The ParticipantController manages retrieving, creating, editing and deleting Participants. 
  - [/currency](backend/src/controller/currency.controller.ts): This Route is to manage currency conversion.

## Frontend-Project structure

- [src](./src): This directory contains all the source code.
  - [pages](frontend/src/pages): This folder containes all Pages of the App.
  - [layout](frontend/src/layout): The Main-Layout that is used in all Pages .
  - [provider](frontend/src/provider): They are used to provide crucial data of Entities that can be used across the App
  - [appRoutes](frontend/src/AppRoutes.tsx): All Routes are defined here including the their Pages. 

  #### Routes

  - [/travels]: All Travels gets displayed.
  - [/destinations]: All Destinations gets displayed.
  - [/participants]: All Participants gets displayed.
  - [/travelDetailsPage]: All Informations about a specific Travel gets displayed, including its Destinations and Participants.
  - [/destinationDetailsPage]: All Informations about a specific Destination gets displayed, including its Travel.
  - [/participantDetailsPage]: All Informations about a specific Participant gets displayed, including its Travels.

## App Features:

#### Travels:

- The User can create new Travels, specifying them with a Name, image, Start date and End Date. Each Travel can have many Destinations and Participants. Travels could be created and deleted in the Travels-Page, and when clicking on a specific Page, all informations about this travel including its destinations and participants gets displayed in the Travels Details Page. In the Travel Details Page, the User can add new Destinations, and new or already existing Participants. The User can also do a search in the Travels Page. With two options for the search, name and/or Start Date, the displayed travels gets filtered.

#### Destinations:

- Every Destination has a name, image, Start Date and End Date. Destinations can be created in the Travels Details Page. All Destinations from all Travels are displayed in the Destinations Page. When clicking on a Destination, all informations about this destination including its Travel gets displayed in the Destination Details Page.

#### Participants:

- Every Participant has a name and an image. Participants could be created in the Travels Details Page. Each Participant can have many travels. All Participants from all Travels are displayed in the Participants Page. When clicking on a Participant, all informations about this participant including its Travels gets displayed in the Participant Details Page.

#### Currency Conversion:

- The User can convert amounts between different currencies using up-to-date exchange rates. The main currency is EUR and the user can specify the amount and currency to convert. 

#### Freestyle task #1

- For this Freestyle task, i decided to add a new page to display all Participants from all Travels (as mentioned above). And this gives the user the ability to manage all users, including deleting and editing specific Users, and having an overview about the travels of each User.

#### Freestyle task #2

- For this Freestyle task, i decided to add the posibility to convert EUR to another currency. The User can give the amount and the currency, and the result is gonna be the converted amount in the specified currency. For this i used an external API [ExchangeRate-API](https://www.exchangerate-api.com) that provides currency conversion rates for 161 currencies. For this i created a new Route [/currency](backend/src/controller/currency.controller.ts) that receives Requests with the amount and the currency, and using the external Data from the API, it converts the amount from EUR to the specified currency.
