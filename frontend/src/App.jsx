import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginFormModal from './components/LoginFormModal';
import Navigation from './components/Navigation/Navigation-bonus';
import * as sessionActions from './store/session';
import { Modal } from './context/Modal';
import './index.css'
import LandingPage from './components/LandingPage/LandingPage';
import GroupListPage from './components/GroupListPage/GroupListPage';
import GroupDetailsPage from './components/GroupDetailsPage/groupDetailsPage';
import CreateGroupForm from './components/CreateGroupForm/CreateGroupForm';
import UpdateGroupForm from './components/UpdateGroupForm/UpdateGroupForm';
import EventDetailsPage from './components/EventDetailsPage/EventDetailsPage';
import EventListPage from './components/EventListPage/EventListPage';
import CreateEventForm from './components/CreateEventForm/CreateEventForm';
import UpdateEventForm from './components/UpdateEventForm';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Modal/>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: 'login',
        element: <LoginFormModal />
      },
      {
        path: 'groups',
        element: <GroupListPage />
      },
      {
        path: 'groups/:groupId',
        element: <GroupDetailsPage />
      },
      {
        path: 'groups/new',
        element: <CreateGroupForm />
      },
      {
        path: 'groups/:groupId/edit',
        element: <UpdateGroupForm />
      },
      {
        path: 'events',
        element: <EventListPage />
      },
      {
        path: `events/:eventId`,
        element: <EventDetailsPage />
      },
      {
        path: 'groups/:groupId/events/new',
        element: <CreateEventForm />
      },
      {
        path: `events/:eventId/edit`,
        element: <UpdateEventForm />
      },
      {
        path: `events/:eventId/update`,
        element: <UpdateEventForm />
      }
    ]
  }
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
)}

export default App;
