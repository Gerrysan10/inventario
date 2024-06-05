import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, Button, Alert, FlatList, Image } from "react-native";
import { Product } from "./model/Product";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from '../../App';
import { StackNavigationProp } from "@react-navigation/stack";
import LocalDB from "../persistance/localdb";
import { Movement } from "./model/Movement";

export type Params = {
    product: Product;
}

export type Props = {
    route: RouteProp<RootStackParamList, 'ProductDetails'>;
    navigation: StackNavigationProp<RootStackParamList, 'ProductDetails'>;
};

function ProductDetails({ route }: Props): React.JSX.Element {
    const [product, setProduct] = useState<Product>(undefined!);
    const [modalVisible, setModalVisible] = useState(false);
    const [quantity, setQuantity] = useState('');
    const [add, setadd] = useState(false);
    const [movements, setMovements] = useState<Movement[]>([]);


    useEffect(() => {
        setProduct(route.params.product);
    }, [route]);

    useEffect(() => {
        if (product) {
            fetchMovements();
        }
    }, [product]);

    const handleAddPress = () => {
        setModalVisible(true);
        setadd(true);
    };

    const handleSellPress = () => {
        setModalVisible(true);
        setadd(false);
    };

    const fetchMovements = async () => {
        const db = await LocalDB.connect();
        db.transaction(tx => {
            tx.executeSql(
                `SELECT idmovimiento, idproducto, fecha_hora, cantidad, tipomovimiento FROM movimientos WHERE idproducto = ?`,
                [product?.id],
                (_, { rows }) => {
                    let results: Movement[] = [];
                    for (let i = 0; i < rows.length; i++) {
                        results.push(rows.item(i));
                    }
                    setMovements(results);
                },
                error => console.error(error)
            );
        });
    };


    const handleConfirm = async () => {
        const db = await LocalDB.connect();
        const qty = parseInt(quantity);

        if (add) {
            if ((qty + product?.currentStock) > product?.maxStock) {
                Alert.alert('Mensaje', `La cantidad supera al máximo de stock`);
            } else {
                db.transaction(tx => {
                    tx.executeSql(
                        `UPDATE productos SET currentStock = currentStock + ? WHERE id = ?`,
                        [qty, product?.id],
                        () => {
                            tx.executeSql(
                                `INSERT INTO movimientos (idproducto, cantidad, tipomovimiento) VALUES (?, ?, ?)`,
                                [product?.id, qty, 'Entrada'],
                                () => console.log('Movimiento de entrada registrado correctamente'),
                                error => console.error(error)
                            );

                            setProduct(prevProduct => ({
                                ...prevProduct,
                                currentStock: prevProduct.currentStock + qty,
                            }));

                            Alert.alert('Mensaje', 'Agregado correctamente!!');
                        },
                        error => console.error(error)
                    );
                });
            }
        } else {
            if (qty > product?.currentStock) {
                Alert.alert('Mensaje', 'No hay suficiente stock');
            } else {
                db.transaction(tx => {
                    tx.executeSql(
                        `UPDATE productos SET currentStock = currentStock - ? WHERE id = ?`,
                        [qty, product?.id],
                        () => {
                            tx.executeSql(
                                `INSERT INTO movimientos (idproducto, cantidad, tipomovimiento) VALUES (?, ?, ?)`,
                                [product?.id, qty, 'Salida'],
                                () => console.log('Movimiento de salida registrado correctamente'),
                                error => console.error(error)
                            );

                            setProduct(prevProduct => ({
                                ...prevProduct,
                                currentStock: prevProduct.currentStock - qty,
                            }));

                            Alert.alert('Mensaje', 'Vendido correctamente!!');
                        },
                        error => console.error(error)
                    );
                });
            }
        }

        setModalVisible(false);
    };


    const handleCancel = () => {
        setModalVisible(false);
    };


    const renderItem = ({ item }: { item: Movement }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.idmovimiento}</Text>
            <Text style={[styles.cell, styles.cellDate]}>{item.fecha_hora}</Text>
            <Text style={styles.cell}>{item.cantidad}</Text>
            <Text style={styles.cell}>{item.tipomovimiento}</Text>
        </View>
    );

    return (
        <SafeAreaView>
            {product && (
                <View style={styles.main}>
                    <Text style={styles.title}>Producto</Text>
                    <View style={styles.details}>
                        <View style={styles.itemMain}>
                            <Text style={styles.titulo}>Nombre</Text>
                            <Text style={styles.nombre}>{product.nombre}</Text>
                        </View>
                        <View>
                            <Text style={styles.titulo}>Cantidad</Text>
                            <Text style={[styles.itemBadge, product.currentStock < product.minStock && { color: 'red' }]}>{product.currentStock} / {product.maxStock}</Text>
                        </View>
                        <View>
                            <Text style={styles.titulo}>Precio</Text>
                            <Text style={styles.itemBadge}>${product.precio}</Text>
                        </View>
                    </View>
                    <View style={styles.botones}>
                        <TouchableOpacity style={styles.botona} onPress={handleAddPress}>
                            <Text style={styles.txtboton}>Agregar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.botonv} onPress={handleSellPress}>
                            <Text style={styles.txtboton}>Vender</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Modal */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={handleCancel}
                    >
                        <View style={styles.modal}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Ingrese la cantidad</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={text => setQuantity(text)}
                                    value={quantity}
                                    keyboardType="numeric"
                                />
                                <View style={styles.modalButtons}>
                                    <Button title="Confirmar" onPress={handleConfirm} />
                                    <Button title="Cancelar" onPress={handleCancel} color="red" />
                                </View>
                            </View>
                        </View>
                    </Modal>
                    {/* Tabla de Movimientos */}
                    <Text style={styles.txtMovimientos}>Movimientos</Text>
                    {movements && movements.length > 0 ? (
                        <View style={styles.movimientos}>
                            <View style={styles.table}>
                                <View style={styles.header}>
                                    <Text style={styles.headerCell}>ID</Text>
                                    <Text style={[styles.headerCell, styles.cellDate]}>Fecha</Text>
                                    <Text style={styles.headerCell}>Cantidad</Text>
                                    <Text style={styles.headerCell}>Tipo</Text>
                                </View>
                                <View style={styles.flatListContainer}>
                                    <FlatList
                                        data={movements}
                                        renderItem={renderItem}
                                        keyExtractor={item => item.idmovimiento.toString()}
                                    />
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.viewmovimientos}>
                            <Text style={styles.txtNoMovimientos}>No hay movimientos</Text>
                            <Image
                                source={require('../img/vacio.png')}
                                style={styles.imgvacio}
                            />
                        </View>
                    )}

                </View>
            )}

        </SafeAreaView>
    );


}

const styles = StyleSheet.create({
    imgvacio: {
        width: 150,
        height: 150,
        alignSelf: 'center'
    },
    txtNoMovimientos:{
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    viewmovimientos:{
        marginTop:'10%'
    },
    main: {
        display: 'flex',
    },
    details: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    botones: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: '20%'
    },
    nombre: {
        color: 'black',
        fontSize: 22
    },
    botonv: {
        backgroundColor: 'green',
        padding: 10,
        width: '30%',
        borderRadius: 10
    },
    botona: {
        backgroundColor: '#8E42CD',
        padding: 10,
        width: '30%',
        borderRadius: 10
    },
    txtMovimientos: {
        marginTop: 20,
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        paddingLeft: '2%'
    },
    titulo: {
        fontSize: 22,
        color: '#271D6E',
        fontWeight: 'bold'
    },
    txtboton: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
    },
    title: {
        alignSelf: 'center',
        color: 'black',
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    itemMain: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    itemBadge: {
        fontSize: 22,
        color: 'green',
        alignSelf: "center"
    },
    // Estilos del modal
    modal: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        width: "80%",
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: "center",
    },
    input: {
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    flatListContainer: {
        height: '68%',
    },
    movimientos: {
        marginHorizontal: '2%'
    },
    table: {
        marginTop: 16
    },
    header: {
        flexDirection: 'row',
        backgroundColor: '#ccc',
        padding: 8
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    row: {
        flexDirection: 'row',
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    cell: {
        flex: 1,
        textAlign: 'center',
    },
    cellDate: {
        flex: 2,
    },

});

export default ProductDetails;
