# SyncUp

SyncUp is a Meetup clone designed specifically for technology professionals and enthusiasts. The platform facilitates organizing and joining tech-focused events, from workshops and hackathons to study groups and networking sessions.

[Live Site](https://aaron-pollock-api-project.onrender.com)

## Features

### Groups
* Create and manage tech-focused groups
* Join existing communities
* Public and private group options
* Group image management
* Organizer and co-host roles

### Events
* Create and manage events
* Various event types (Online/In-person)
* Flexible scheduling (morning sessions to multi-day conferences)
* Event image management
* Capacity management and waitlists

### User Interactions
* User authentication
* Group membership management
* Event attendance tracking
* Profile customization

## Technologies Used

### Frontend
* React
* Redux
* JavaScript
* HTML5
* CSS3

### Backend
* Express
* Sequelize
* PostgreSQL
* Node.js

## Database Schema

The application uses a PostgreSQL database with the following models:

* Users
* Groups
* Events
* Venues
* GroupImages
* EventImages
* Memberships
* Attendances

![Database Schema](https://appacademy-open-assets.s3.us-west-1.amazonaws.com/Modular-Curriculum/content/week-12/meetup-db-schema.png)

## API Documentation

### Authentication Endpoints

* GET /api/session - Get current user
* POST /api/session - Log in user
* POST /api/users - Sign up new user
* DELETE /api/session - Log out user

### Groups Endpoints

* GET /api/groups - Get all groups
* POST /api/groups - Create a group
* GET /api/groups/current - Get current user's groups
* GET /api/groups/:groupId - Get group details
* PUT /api/groups/:groupId - Update a group
* DELETE /api/groups/:groupId - Delete a group

### Events Endpoints

* GET /api/events - Get all events
* POST /api/groups/:groupId/events - Create an event
* GET /api/events/:eventId - Get event details
* PUT /api/events/:eventId - Update an event
* DELETE /api/events/:eventId - Delete an event

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/aaronipollock/syncup.git
```

2. Install dependencies
```bash
cd syncup
npm install
```

3. Set up your database
```bash
npx dotenv sequelize db:create
npx dotenv sequelize db:migrate
npx dotenv sequelize db:seed:all
```

4. Start the development server
```bash
npm start
```

## Future Features

* Real-time chat
* Event recommendations
* Skills tracking
* Resource sharing
* Integration with video conferencing platforms

## Contact

Aaron Pollock (https://github.com/aaronipollock) - Project Owner

## Acknowledgments

* App Academy
* [Unsplash](https://unsplash.com) for images
* All contributors and testers
