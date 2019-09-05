import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    VrButton,
} from 'react-360';

export default class Menu360 extends React.Component {
    render() {
        return (
            <View style={styles.panel}>
                <View style={styles.greetingBox}>
                    <VrButton onClick={() => {
                        console.log("room joined")
                    }}>
                        <Text style={styles.greeting}>
                            Join a meeting room
                        </Text>
                    </VrButton>
                </View>

                <View style={styles.greetingBox}>
                    <VrButton onClick={() => {
                        console.log("room created")
                    }}>
                        <Text style={styles.greeting}>
                            Create a meeting room
                        </Text>
                    </VrButton>
                </View>
            </View>
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

