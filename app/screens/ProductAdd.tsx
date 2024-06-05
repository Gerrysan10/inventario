import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { SafeAreaView, Text, TextInput, View,StyleSheet,TouchableOpacity,Alert} from "react-native";
import { RootStackParamList } from "../../App";
import LocalDB from "../persistance/localdb";

export default function ProductAdd(): React.JSX.Element {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [nombre, setNombre] = useState<string>('');
    const [precio, setPrecio] = useState<string>('0');
    const [minStock, setMinStock] = useState<string>('0');
    const [maxStock, setMaxStock] = useState<string>('0');

    const btnGuardarOnPress = async () => {
        if (!nombre || !precio || !minStock || !maxStock) {
            // Mostrar un mensaje de error o tomar alguna otra acción apropiada
            Alert.alert('Error','Todos los campos son requeridos')
            return;
        }
        const db = await LocalDB.connect();
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO productos (nombre, precio, minStock, maxStock) VALUES (?, ?, ?, ?)',
                [nombre, precio, minStock, maxStock], 
                (_, result) => {
                    console.log(`Nuevo producto agregado con ID: ${result.insertId}`);
                    navigation.goBack();
                },
                error => console.error(error)
            );
        });
    };

    return (
        <SafeAreaView>
            <View>
                <Text  style={styles.title}>Guardar materiales</Text>
                <TextInput style={styles.input} placeholder='Nombre' placeholderTextColor={'#828894'} onChangeText={u => setNombre(u)} />
                <TextInput style={styles.input} placeholder='Precio' placeholderTextColor={'#828894'} onChangeText={p => setPrecio(p)} />
                <TextInput style={styles.input} placeholder='Cantidad Mínima' placeholderTextColor={'#828894'} onChangeText={min => setMinStock(min)} />
                <TextInput style={styles.input} placeholder='Cantidad Máxima' placeholderTextColor={'#828894'} onChangeText={max => setMaxStock(max)} />
                <TouchableOpacity style={styles.button} onPress={btnGuardarOnPress}><Text style={styles.txtbutton} >Guardar</Text></TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color:'#271D6E',
        textAlign: 'center',
        margin: 10,
    },
    input:{
        height: 40,
        margin: 14,
        borderWidth: 1,
        borderRadius:10
    },
    button:{
        height: 40,
        width: '60%',
        margin: 14,
        borderWidth: 1,
        borderRadius:10,
        alignSelf:'center',
        display:'flex',
        textAlignVertical:'center',
        backgroundColor:'#604FD8'
    },
    txtbutton:{
        textAlign: 'center',  
        color:'white' ,
        fontSize:22
    }
});
