
import { createBrowserRouter } from 'react-router-dom';
import Root from './Components/Root';
import Error from './Components/Error/Error';
import Home from './Components/Home/Home';
// import Dashboard from './Components/Pages/Dashboard/Dashboard';
import Reminder from './Components/Pages/Reminder/Reminder';
import Expenses from './Components/Pages/Expense-features/Expenses/Expenses';
import AddTask from './Components/AddTask/AddTask';
import MyTasks from './Components/MyTasks/MyTasks';
import SignUp from './Components/SignUp/SignUp';
import SignIn from './Components/SignIn/SignIn';
import Dashboard from './Components/Pages/Dashboard/Dashboard';
import AddExpense from './Components/Pages/Expense-features/AddExpense/AddExpense';
import ExpenseInsights from './Components/Pages/Expense-features/Insights/ExpenseInsights';
import MyBudget from './Components/Pages/Expense-features/MyBudget/MyBudget';
import DashHome from './Components/Pages/Dashboard/DashHome/DashHome';
import PrivateRoutes from './Private/PrivateRoutes';
// import PrivateRoutes from './Private/PrivateRoutes';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    errorElement: <Error></Error>,
    children: [
      {
        path: "/",
        element: <PrivateRoutes> <Home></Home> </PrivateRoutes> 
      },
      {
        path:"/about-us",
        element:<AboutUs></AboutUs>
      },
      {
        path: "/reminders",
        element: <Reminder></Reminder>
      },
     
      {

      }

    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard></Dashboard>,
    children:
      [
        {
          path: "/dashboard",
          element:<DashHome></DashHome>
        },
        {
          path: "add-tasks",
          element: <AddTask></AddTask>
        },
        {
          path: "my-tasks",
          element: <MyTasks></MyTasks>
        },
        {
          path: "reminders",
          element: <Reminder></Reminder>
        },
        {
          path: "expenses",
          element:<Expenses></Expenses>
        },
        {
          path:'add-expense',
          element:<AddExpense></AddExpense>
        },
        {
          path:"my-budget",
          element:<MyBudget></MyBudget>
        },

        {
          path:"insights",
          element:<ExpenseInsights></ExpenseInsights>
        }
      ]

  },
  {
    path: "/signup",
    element:<SignUp></SignUp>
  },
  {
    path: "/signin",
    element:<SignIn></SignIn>
  },
]);

export default router;