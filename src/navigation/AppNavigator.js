import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import DPSScreen from '../screens/DPSScreen';
import FDRScreen from '../screens/FDRScreen';
import EMIScreen from '../screens/EMIScreen';
import AmortizationScreen from '../screens/AmortizationScreen';
import GoalPlannerScreen from '../screens/GoalPlannerScreen';
import AboutScreen from '../screens/AboutScreen';
import { colors } from '../theme/theme';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false, cardStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="DPSCalculator" component={DPSScreen} />
        <Stack.Screen name="FDRCalculator" component={FDRScreen} />
        <Stack.Screen name="EMICalculator" component={EMIScreen} />
        <Stack.Screen name="AmortizationCalculator" component={AmortizationScreen} />
        <Stack.Screen name="GoalPlanner" component={GoalPlannerScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
