import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginFormPage from './components/LoginFormPage';
import SignupFormPage from './components/SignupFormPage';
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
        element: <LoginFormPage />
      },
      {
        path: 'signup',
        element: <SignupFormPage />
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
