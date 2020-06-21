import * as React from 'react';
import {
    Content,
    Container,
    Text,
    Button,
    Form,
    Item,
    Label,
    Input,
} from 'native-base';

import { TextInputMask } from 'react-native-masked-text'

import {StyleSheet, SafeAreaView} from 'react-native';
import * as SQLite from "expo-sqlite";
import Items from "../models/Items";

const db = SQLite.openDatabase('db.db');

export default class ItemScreen extends React.Component {

    state = {
        id: null,
        name: '',
        quantity: '',
        amount: 0,
        in_cart: '',
    };

    constructor(props) {
        super(props);
        this._saveItem.bind(this);
    }
    async componentDidMount() {
        const itemId = this.props.route.params;
        if(itemId){
            Items.find(itemId).then(item => {
                this.setState(item);
                if( ! this.state.amount){
                    this.setState({amount: 0})
                }
            });
        }
    }

    _saveItem () {
        const itemId = this.props.route.params;
        if(itemId){
            console.log('Salvou: ', this.state)
            Items.update(itemId, this.state).then(() => {
                this.props.navigation.goBack();
            })
        }else{
            Items.create({
                name: this.state.name,
                quantity: this.state.quantity,
                amount: this.state.amount,
                in_cart: this.state.in_cart ? 1 : 0,
            }).then(id => {
                this.props.navigation.navigate('List');
            }).catch(err => {
                console.log(err);
            })
        }
    }

    _removeItem(id) {
        Items.delete(id).then(() => {
            this.props.navigation.goBack();
        })
    }

    render() {
        let removeButton = null;
        if(this.props.route.params){
            removeButton = (
                <Button onPress={() => this._removeItem(this.props.route.params)} style={styles.button} danger block>
                    <Text>Remover</Text>
                </Button>
            );
        }
        return (
            <Container>
                <Content padder>
                    <Form>
                        <Item floatingLabel>
                            <Label>Nome</Label>
                            <Input onChangeText={(name) => this.setState({name})} value={this.state.name} />
                        </Item>
                        <Item floatingLabel>
                            <Label>Quantidade</Label>
                            <Input keyboardType={'number-pad'} onChangeText={quantity => this.setState({quantity})} value={String(this.state.quantity)} />
                        </Item>
                        <Item stackedLabel>
                            <Label>Valor</Label>
                            <TextInputMask
                                includeRawValueInChangeText={true}
                                ref={ref => this.amountField = ref}
                                type={'money'}
                                customTextInput={Input}
                                onChangeText={(maskedAmount, amount) => this.setState({amount})}
                                value={this.state.amount}
                            />
                        </Item>

                    </Form>
                    <Button onPress={() => this._saveItem()} style={styles.button} success block>
                        <Text>Salvar</Text>
                    </Button>

                    {removeButton}
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        marginTop:10
    }
});
