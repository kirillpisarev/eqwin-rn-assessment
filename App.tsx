import { useEffect } from 'react';
import { Linking } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { apiFetch } from './src/api';
import { BuySharesScreen } from './src/BuySharesScreen';
import { HorseListScreen } from './src/HorseListScreen';
import type { Horse, RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const navigationRef = createNavigationContainerRef<RootStackParamList>();

export default function App() {
  const queryClient = new QueryClient();

  // Marketing links: horsemarket://buy?horseId=123
  useEffect(() => {
    Linking.addEventListener('url', async ({ url }) => {
      const horseId = new URL(url).searchParams.get('horseId');
      if (!horseId) return;
      const horse = await apiFetch<Horse>(`/horses/${horseId}`);
      navigationRef.navigate('BuyShares', { horse });
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator>
          <Stack.Screen name="HorseList" component={HorseListScreen} />
          <Stack.Screen name="BuyShares" component={BuySharesScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
