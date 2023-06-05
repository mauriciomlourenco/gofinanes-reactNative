import React, { useCallback, useEffect } from 'react';
import { StatusBar, Platform } from 'react-native'
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from 'styled-components';

import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import 'react-native-gesture-handler';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';

SplashScreen.preventAutoHideAsync(); // Keep the splash screen visible while we fetch resources

import theme from './src/global/styles/theme';

import { Routes } from './src/routes';
import { AppRoutes } from './src/routes/app.routes';

import { View } from 'react-native';
import { SignIn } from './src/screens/Signin';

import { AuthProvider, useAuth } from './src/hooks/auth';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  const { userStorageLoading } = useAuth();

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || userStorageLoading) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, userStorageLoading]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      
        <StatusBar barStyle={Platform.OS === 'ios' ? 'light-content': 'dark-content'}/>
          <AuthProvider>
            <Routes />
          </AuthProvider>

          <View
            onLayout={onLayoutRootView}
          />      
    </ThemeProvider>

  );
}
