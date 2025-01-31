import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './components/Root';
import Home from './pages/Home';
import ProblemList from './pages/ProblemList';
import ProblemWorkspace from './pages/ProblemWorkspace';
import ProfileDashboard from './pages/ProfileDashboard';
import theme from './theme';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { 
        path: "/", 
        element: <Home /> 
      },
      { 
        path: "/problems", 
        element: <ProblemList /> 
      },
      { 
        path: "/problem/:titleSlug", 
        element: <ProblemWorkspace /> 
      },
      {
        path: 'profile',
        element: <ProfileDashboard />,
      },
    ]
  }
]);

function App() {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
