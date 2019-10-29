import React from 'react';
import {View, AmbientLight, PointLight, asset} from 'react-360';
import Entity from 'Entity';
import {sceneManager} from "../service/SceneManager";

export default class RoomA extends React.Component<{}, {}> {

    state = {
        active: true,
    };

    componentWillMount(): void {
        sceneManager.eventEmitter.on("change", args => {
            this.setState({active: args.room === "A"});
        })
    }

    render() {
        return (
            <React.Fragment>
                {this.state.active &&
                <View>
                    <Entity
                        source={{
                            obj: asset('room.obj'),
                            mtl: asset('room.mtl')
                        }}
                        lit={true}
                        shadow={{
                            receive: true,
                        }}
                        style={{
                            transform: [
                                {translate: [0, -2, -2]},
                                {rotateY: 0},
                                {scale: 0.01}
                            ]
                        }}
                    />
                </View>
                }
            </React.Fragment>
        );
    }
};
