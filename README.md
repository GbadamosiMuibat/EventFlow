## EventFlow 

EventFlow is a lightweight web-based event attendance and check-in system that allows organizers to create events, customize the information they want to collect, and download attendance records as an Excel file.
Instead of manually recording attendance during events, organizers can generate a digital check-in form. Participants simply scan a QR code or open a link, submit their details, and their information is automatically stored. At the end of the event, the organizer can download the complete attendance list.

## Overview

EventFlow is designed to simplify event attendance management. The system allows organizers to create multiple events, define the fields they want participants to fill out, and collect attendance digitally.
The project is built using HTML, CSS, and JavaScript and uses browser local storage to store data. It does not require a backend server, making it easy to deploy and run.

## Key Features

Create multiple events from a dashboard
Custom registration fields for each event
Dynamic form generation based on event settings
QR code check-in for participants
Real-time attendee counter
Local Storage data persistence (data remains after refresh)
Download attendance list in Excel/CSV format
Lightweight and easy to deploy

## How It Works

The organizer creates an event from the dashboard.
The organizer selects the information they want to collect (e.g., Name, Email, Phone).
The system generates a unique registration form for the event.
Participants scan a QR code or open the event link.
Participants submit their information through the form.
The system stores the attendance data locally.
The organizer downloads the attendance list as an Excel file.

## Tech Stack
# Frontend:

HTML
CSS
JavaScript

# Browser APIs:

localStorage API
DOM API
Clipboard API
URL / URLSearchParams API
Blob API for file export
Date API
JSON API

# Third-Party Library:

QRCode.js (loaded via CDN) — generates QR codes for event check-in links

## Live link:

https://e-vent-flow.netlify.app/

