import React from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View, VrButton,
} from 'react-360';
import {MODE_NOTE} from "../common/Color";

export default class Note extends React.Component<{ id: string, position: { x: number, y: number, z: number, rx: number, ry: number, rz: number }, startVisible: boolean },
    {}> {
    id: string = this.props.id;
    state = {
        position: {}
    };

    componentWillMount(): void {
        this.setState({
            position: this.props.position
        })
    }

    render() {
        return (
            <View style={{
                // Fill the entire surface
                width: 0.5,
                height: 0.5,
                backgroundColor: 'rgba(255, 255, 0, 0.95)',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                transform: [
                    {translateX: this.props.position.x},
                    {translateY: this.props.position.y},
                    {translateZ: this.props.position.z},
                    {rotateX: this.props.position.rx},
                    {rotateY: this.props.position.ry},
                    {rotateZ: this.props.position.rz},
                ]
            }}>
                <Text style={styles.greeting}>
                    Push the button and speak to add text {this.props.id}
                </Text>
                <VrButton onClick={(event) => {
                }}><Text>Move</Text></VrButton>
                <VrButton onClick={(event) => {
                }}><Text>Edit</Text></VrButton>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    editBox: {
        flex: 1, flexDirection: 'row',
        marginTop: 0,
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20
    },
    greetingBox: {
        padding: 20,
        backgroundColor: '#000000',
        borderColor: '#639dda',
        borderWidth: 2,
    },
    greeting: {
        fontSize: 0.051,
        color: '#000000'
    },
});

