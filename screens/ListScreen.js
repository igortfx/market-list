import * as React from 'react';
import Items from "../models/Items";
import {
    Container,
    List,
    Text,
    Footer,
    FooterTab,
    Button,
    Spinner,
} from 'native-base'
import {StyleSheet, Alert} from 'react-native';
import * as Haptics from 'expo-haptics';
import ListItemCheck from "../components/ListItemCheck";
import {MaskService} from "react-native-masked-text";

export default class ListScreen extends React.Component {

    state = {
        isLoading: false,
        items: [],
        sumInCart: 0,
        sumTotal: 0,
    };

    constructor(props) {
        super(props);
        this.renderRow = this.renderRow.bind(this);
        this.toggleCheckedItem = this.toggleCheckedItem.bind(this);
        this.shouldCleanList = this.shouldCleanList.bind(this);
        this.getAll = this.getAll.bind(this);
        this.deleteAllItems = this.deleteAllItems.bind(this);
        this.refresh = this.refresh.bind(this);
    }

    componentDidMount() {
        this.refresh();
        this._unsubscribeNavigationFocus = this.props.navigation.addListener('focus', payload => {
            this.setState({isLoading: true});
            this.refresh();
        });
    }

    componentWillUnmount() {
        this._unsubscribeNavigationFocus();
    }

    refresh() {
        this.getAll().then(([items, sumInCart, sumTotal]) => {
            this.setState({
                items, sumInCart, sumTotal, isLoading: false
            });
            console.log(items)
        })
    }

    getAll() {
        return Promise.all([
            Items.all(),
            Items.sumInCart(),
            Items.sumTotal()
        ]);
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

    /**
     * I dont know why this works
     * @param id
     */
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
                    this.refresh();
                });
            })
        }
    }

    shouldCleanList() {
        Haptics.impactAsync('light').then(() => {
            Alert.alert(
                "Limpar Lista",
                "Deseja remover todos os itens da lista?",
                [
                    {
                        text: "Cancelar",
                        style: "cancel"
                    },
                    {
                        text: "Limpar", onPress: () => this.deleteAllItems(),
                        style: 'destructive'
                    }
                ],
                { cancelable: false }
            );
        });

    }

    deleteAllItems() {
        this.setState({isLoading: true});
        Items.deleteAll().then(() => {
            this.refresh();
        });
    }

    render () {
        if(this.state.isLoading){
            return (
                <Container>
                    <Spinner color={'gray'}/>
                </Container>
            )
        }
        return (
            <Container>
                <List
                    button={true}
                    renderRow={this.renderRow}
                    dataArray={this.state.items}
                    style={styles.list}
                    keyExtractor={item => item.id.toString()}
                />
                <Footer>
                    <FooterTab>
                        <Button onLongPress={() => {this.shouldCleanList()}} vertical>
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