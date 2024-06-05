import { StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

type Props = {
    title: string;
};



const RoundButton = ({title}:Props): React.JSX.Element => (
    <TouchableOpacity>
        <Text>{title}</Text>
    </TouchableOpacity>
);

const style = StyleSheet.create({
    button:{

    }
})

export default RoundButton;