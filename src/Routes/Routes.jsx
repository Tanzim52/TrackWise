
import { createBrowserRouter } from 'react-router-dom';
import Root from './Components/Root';
import Error from './Components/Error/Error';
import Home from './Components/Home/Home';

const router = createBrowserRouter([
    {
      path: "/",
      element: <Root></Root>,
      errorElement: <Error></Error>,
      children: [{
        path: "/",
        element: <Home></Home>
      },
      {
        
      }
    
    ],
    },
  ]);

export default router;