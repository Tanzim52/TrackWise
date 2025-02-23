
import { createBrowserRouter } from 'react-router-dom';
import Root from './Components/Root';
import Error from './Components/Error/Error';
import Home from './Components/Home/Home';
import Tasks from './Components/Pages/Tasks/Tasks';
import Reminder from './Components/Pages/Reminder/Reminder';
import Expenses from './Components/Pages/Expenses/Expenses';
import AddTask from './Components/AddTask/AddTask';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    errorElement: <Error></Error>,
    children: [
      {
        path: "/",
        element: <Home></Home>
      },
      {
        path: "/tasks",
        element: <Tasks></Tasks>,
        children: [{
          path: "add-tasks",
          element: <AddTask></AddTask>
        },]
          
      },
      
      {
        path: "/reminders",
        element: <Reminder></Reminder>
      },
      {
        path: "/expenses",
        element: <Expenses></Expenses>
      },
      {

      }

    ],
  },
]);

export default router;