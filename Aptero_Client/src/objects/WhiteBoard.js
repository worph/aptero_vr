import React from 'react';
import {
    View
} from 'react-360';

export default class WhiteBoard extends React.Component<{ id: string, position: { x: number, y: number, z: number, rx: number, ry: number, rz: number }, startVisible: boolean },
    {}> {

    render() {
        return (
            <View>
                <View style={{
                    // Fill the entire surface
                    width: 3,
                    height: 2,
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                </View>
            </View>
        );
    }
};
