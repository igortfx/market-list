import * as React from 'react';
import {Body, Container, Title} from 'native-base';
import {Header as NativeHeader} from 'native-base';
import {Platform, StatusBar} from "react-native";


export default function Header({title}) {
    return (
        <Container>
            <NativeHeader>
                {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
                <Body>
                    <Title>{title}</Title>
                </Body>
            </NativeHeader>
        </Container>
    );
}