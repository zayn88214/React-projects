import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from '@/routes/AppRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
    </QueryClientProvider>
  );
}
