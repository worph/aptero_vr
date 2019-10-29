import React from 'react';
import {View, AmbientLight, PointLight, asset} from 'react-360';
import Entity from 'Entity';
import {sceneManager} from "../service/SceneManager";

export default class RoomB extends React.Component<{}, {}> {
    state = {
        active: false,
    };

    componentWillMount(): void {
        sceneManager.eventEmitter.on("change", args => {
            this.setState({active: args.room === "B"});
        })
    }

    render() {
        return (
            <React.Fragment>
                {this.state.active && <View>
                    <Entity
                        source={{
                            obj: asset('room2.obj'),
                            mtl: asset('room2.mtl')
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
