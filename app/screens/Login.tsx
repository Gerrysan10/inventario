import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Alert, Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Screen } from 'react-native-screens';
type LoginScreenProps = StackNavigationProp<RootStackParamList, 'Login'>;
type LoginScreenRoute = RouteProp<RootStackParamList, 'Login'>;


const styles = StyleSheet.create({
    Screen:{
        height:'100%',
        backgroundColor:'#323844',
        justifyContent:'center',
        alignItems:'center'
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#c0c0c040',
        width:'100%',
        padding:16,
        
    },
    TextInput: {
        borderWidth:1,
        borderRadius: 8,
        backgroundColor: 'white',
        paddingVertical: 8,
        paddingHorizontal:12,
        width: '80%',
        margin: 8,

    },
});
type RootStackParamList = {
    Home: undefined;
    Login: undefined;
};
type LoginProps = {
    navigation:StackNavigationProp<RootStackParamList, 'Home'>;
}

function Login({navigation}: LoginProps): React.JSX.Element {
    const [usuario,setUsuario] = useState('');
    const [contrasena,setContrasena] = useState('');

    const btnIngresarOnpress = function(){
        if (usuario && contrasena){
            navigation.navigate('Home');
return;
        }
        Alert.alert('Entraste','iniciado sesion...');
    };
    return (
        <SafeAreaView style={styles.Screen}>
            <View style={styles.container} >
                <Text>Iniciar Sesión</Text>
                <TextInput style={styles.TextInput} placeholder='Usuario' placeholderTextColor={'#828894'} onChangeText={u => setUsuario(u)}/>
                <TextInput style={styles.TextInput} placeholder='Contraseña' secureTextEntry={true} placeholderTextColor={'#828894'} onChangeText={p => setContrasena(p)}/>
                <Button title='Iniciar Sesión'  onPress={btnIngresarOnpress}/>
            </View>
        </SafeAreaView>
    );
}

export default Login;