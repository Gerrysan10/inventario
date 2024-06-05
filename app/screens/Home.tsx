import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, Touchable, View } from 'react-native';
import { Product } from './model/Product';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { Props as ProductDetailsProps } from './productDetails'
import { RootStackParamList } from '../../App';
import LocalDB from '../persistance/localdb';


type HomeScreenProps = StackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRoute = RouteProp<RootStackParamList, 'Home'>;

type HomeProps = {
    navigation: HomeScreenProps;
    route: HomeScreenRoute;
};

function Home({ navigation }: HomeProps): React.JSX.Element {
    const [products, setProducts] = useState<Product[]>([]);
    const productItem = ({ item }: { item: Product }) => (
        <TouchableOpacity style={styles.productItem}
            onPress={() => navigation.push("ProductDetails", { product: item })}>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flexDirection: 'column', flexGrow: 9 }}>
                    <Text style={styles.itemTitle}>{item.nombre}</Text>
                    <Text style={styles.itemDetails}> Precio: $ {item.precio}</Text>
                </View>
                <Text style={
                    [
                        styles.itemBadge, item.currentStock < item.minStock ? styles.itemBadgeError : null,
                    ]
                }>{item.currentStock}</Text>
            </View>
        </TouchableOpacity>
    );

    useEffect(() => {
        // LocalDB.init();
        /*const db = await LocalDB.connect();
        db.transaction(async tx => {
            tx.executeSql('SELECT * FROM productos',[],(_,res)=>setProducts(res.rows.raw()),
            error => console.error({error}),
        );
    });*/
        navigation.addListener('focus',async ()=>{
            try{
                const response = await fetch(
                    `http://$(WebServiceParams.host):$(WebServiceParams.port)/productos`,
                    {
                        method: 'GET',
                        headers:{
                            'Accept': 'application/json',
                            'Content-Type':'text/plain',
                        },
                    },
                );
                setProducts(await response.json());
            } catch(error){
                console.log(error);
            }
});
    },[navigation]);

    return (
        <SafeAreaView>
            <FlatList data={products} renderItem={productItem} keyExtractor={(item) => item.id.toString()} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    itemBadge: {
        fontSize: 24,
        color: 'blue',
        fontWeight: 'bold',
        alignSelf: 'center',

    },

    itemBadgeError: {
        color: 'red',
    },

    productItem: {
        padding: 12,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        backgroundColor: 'white',
    },
    itemTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',

    },
    itemDetails: {
        fontSize: 14,
        opacity: 0.7,
    }

})

export default Home;