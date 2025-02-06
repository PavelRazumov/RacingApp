/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DriverScreen } from './src/featute/Drivers/DriverScreen.tsx';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DriverDetailScreen } from './src/featute/DriverDetail/DriverDetailScreen.tsx';
import { RacesScreen } from './src/featute/Races/RacesScreen.tsx';

export type RootStackParamList = {
    Drivers: undefined;
    DriverDetails: { id: string };
    Races: { id: string };
};

const RootStack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <RootStack.Navigator>
                    <RootStack.Screen name={'Drivers'} component={DriverScreen}></RootStack.Screen>
                    <RootStack.Screen name={'DriverDetails'} component={DriverDetailScreen}></RootStack.Screen>
                    <RootStack.Screen name={'Races'} component={RacesScreen}></RootStack.Screen>
                </RootStack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

export default App;
