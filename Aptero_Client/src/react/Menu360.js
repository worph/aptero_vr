import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    VrButton,
    NativeModules,
} from 'react-360';

export default class Menu360 extends React.Component {

    state = {
        open: true,
    };

    render() {
        return (
            <React.Fragment>
                {
                    this.state.open &&
                    <View style={styles.panel}>
                        <View style={styles.greetingBox}>
                                <Text style={styles.greeting}>
                                    Welcome to Aptero Virtual Meeting Room.
                                    Share the url of this page to allow someone to connect.
                                    Please use Oculus Quest or Firefox with Oculus Rift for a full VR experience.
                                </Text>
                        </View>
                        <View style={styles.greetingBox}>
                            <VrButton onClick={() => {
                                this.setState({open:false})
                            }}>
                                <Text style={styles.greeting}>
                                    Close
                                </Text>
                            </VrButton>
                        </View>
                    </View>
                }
            </React.Fragment>
        );
    }
};

const styles = StyleSheet.create({
    panel: {
        // Fill the entire surface
        width: 1000,
        height: 600,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    greetingBox: {
        padding: 20,
        backgroundColor: '#000000',
        borderColor: '#639dda',
        borderWidth: 2,
    },
    greeting: {
        fontSize: 30,
    },
});

