import React from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View, VrButton,
} from 'react-360';

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
            <View>
                <View style={{
                    // Fill the entire surface
                    width: 0.5,
                    height: 0.5,
                    backgroundColor: 'rgba(255, 255, 0, 1)',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Text style={styles.greeting}>
                        Push the button and speak to add text {this.props.id}
                    </Text>
                    <VrButton onClick={(event) => {
                        console.log("edit");
                    }}><Text>Edit</Text></VrButton>
                </View>
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

