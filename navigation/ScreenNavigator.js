import { createStackNavigator } from "@react-navigation/stack";
import * as React from 'react';
import ListScreen from "../screens/ListScreen";
import {Button, Text} from "native-base";
import { SimpleLineIcons } from '@expo/vector-icons';
import ItemScreen from "../screens/ItemScreen";
const Stacks = createStackNavigator();

const INITIAL_ROUTE_NAME = 'List';

export default function ScreenNavigator({navigation, route}) {
    navigation.setOptions({ headerTitle: getHeaderTitle(route) });

    return (
        <Stacks.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
            <Stacks.Screen
                name='List'
                component={ListScreen}
                options={{
                    title: 'Lista de Compras',
                    headerRight: () => {
                        return (<Button onPress={() => navigation.navigate('Item')} transparent><Text><SimpleLineIcons name="plus" size={22} /></Text></Button>);
                    }
                }}
            />
            <Stacks.Screen
                name='Item'
                component={ItemScreen}
                options={{
                    headerBackTitle: 'Lista'
                }}
            />
        </Stacks.Navigator>
    );
}

function getHeaderTitle(route) {
    const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

    switch (routeName) {
        case 'List':
            return 'Lista de Compras';
        case 'Item':
            return 'Item da Lista';
    }
}