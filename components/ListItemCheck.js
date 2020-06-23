import * as React from 'react';
import {Body, Button, Icon, Left, ListItem, Right, Text} from "native-base";
import { MaskService } from 'react-native-masked-text'

export default class ListItemCheck extends React.Component {

    constructor(props) {
        super(props);
        this.onCheckPress = typeof props.onCheckPress == "function" ? props.onCheckPress : () => {};
        this.onItemPress = typeof props.onItemPress == "function" ? props.onItemPress : () => {};
    }

    render() {

        let valueText;
        if('value' in this.props){
            valueText = <Text>{MaskService.toMask('money', this.props.value, {unit: 'R$ '})} un.</Text>
        }

        return (
            <ListItem icon onLongPress={this.onCheckPress} onPress={this.onItemPress}>
                <Left>
                    <Button onPress={this.onCheckPress} transparent>
                        <Icon
                            style={{
                                color: 'blue',
                                fontSize: 24
                            }}
                            name={(this.props.checked ? 'ios-checkmark-circle-outline' : 'ios-radio-button-off')} />
                    </Button>
                </Left>
                <Body>
                    <Text>{this.props.text}</Text>
                </Body>
                <Right>
                    {valueText}
                    <Icon name="arrow-forward" style={{
                        fontSize: 18,
                        color: 'gray'
                    }} />
                </Right>
            </ListItem>
        );
    }
}