import * as React from 'react';
import Items from "../models/Items";
import {
    Container,
    List,
    Text,
    Footer,
    FooterTab,
    Button,
} from 'native-base'
import {StyleSheet} from 'react-native';
import * as Haptics from 'expo-haptics';
import ListItemCheck from "../components/ListItemCheck";
import {MaskService} from "react-native-masked-text";

export default class ListScreen extends React.Component {

    state = {
        items: [],
        sumInCart: 0,
        sumTotal: 0,
    };

    constructor(props) {
        super(props);
        this.renderRow = this.renderRow.bind(this);
        this.toggleCheckedItem = this.toggleCheckedItem.bind(this);
        this.getAll = this.getAll.bind(this);
        props.navigation.addListener('focus', payload => {
            this.getAll();
        });
    }

    componentDidMount() {
        this.getAll();
    }

    getAll() {
        Items.all().then(items => {
            this.setState({items});
        });
        Items.sumInCart().then(sumInCart => {
            this.setState({sumInCart});
        })
        Items.sumTotal().then(sumTotal => {
            this.setState({sumTotal});
        })
    }

    renderRow(data) {
        return (
            <ListItemCheck
                checked={!!data.in_cart}
                onCheckPress={() => this.toggleCheckedItem(data.id)}
                onItemPress={() => {this.props.navigation.navigate('Item', data.id)}}
                text={data.name}
                value={data.amount}
            />
        );
    }

    toggleCheckedItem(id) {
        const itemIndex = this.state.items.findIndex(function (item) {
            return item.id === id;
        });
        const currentList = this.state.items;
        currentList[itemIndex].in_cart = !currentList[itemIndex].in_cart;
        const in_cart = currentList[itemIndex].in_cart ? 1 : 0;

        if(id){
            Items.update(id, {in_cart}).then(() => {
                Haptics.selectionAsync().then(() => {
                    this.getAll();
                });
            })
        }
    }
    render () {
        return (
            <Container>
                <List
                    button={true}
                    renderRow={this.renderRow}
                    dataArray={this.state.items}
                    style={styles.list}/>
                <Footer>
                    <FooterTab>
                        <Button vertical>
                            <Text>Total: {MaskService.toMask('money', this.state.sumTotal ?? 0)}</Text>
                        </Button>
                    </FooterTab>
                    <FooterTab>
                        <Button vertical>
                            <Text>Total no Carrinho: {MaskService.toMask('money', this.state.sumInCart ?? 0)}</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    list: {
        backgroundColor: 'white'
    }
});
