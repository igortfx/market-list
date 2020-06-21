import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import {Container} from "native-base";
import * as SQLite from 'expo-sqlite';

import useCachedResources from './hooks/useCachedResources';
import ScreenNavigator from "./navigation/ScreenNavigator";
import LinkingConfiguration from './navigation/LinkingConfiguration';

const Stack = createStackNavigator();

const db = SQLite.openDatabase('db.db');

export default function App(props) {
  const isLoadingComplete = useCachedResources();

  db.transaction(tx => {
    // tx.executeSql('DROP TABLE items');
    tx.executeSql(
        `create table if not exists items (
              id integer primary key not null,
              name text,
              quantity int null default(0),
              amount double default(0),
              in_cart int default(0))`);
  });

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
        <Container>
          {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
          <NavigationContainer linking={LinkingConfiguration}>
            <Stack.Navigator screenOptions={{
              headerShown: false
            }}>
              <Stack.Screen name="Root" component={ScreenNavigator} />
            </Stack.Navigator>
          </NavigationContainer>
        </Container>
    );
  }
}
