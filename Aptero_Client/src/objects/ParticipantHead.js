import React from 'react';
import {View, asset} from 'react-360';
import Entity from 'Entity';

import {NativeModules} from 'react-360';
const {ControllersModule} = NativeModules;
import {browserBridgeIndex} from '../module/BrowserBridgeIndex';

export default class ParticipantHead extends React.Component<{ id: string, startVisible: boolean}, {
    visible: boolean,
    position: [],
    quaternion: [],
}> {
    state = {
        visible: this.props.startVisible,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
    };

    componentDidMount(): void {
        browserBridgeIndex.onEvent("setHeadTransform",(data: {id: string, position: number[], rotation: number[]}) => {
            if(data.id===this.props.id) {
                if(data.position.length===0 || data.rotation.length===0){
                    this.setState({visible:false});
                }else{
                    this.setTransform(data.position, data.rotation);
                }
            }
        });
    }

    setTransform(position, rotation) {
        this.setState({position: position, rotation: rotation});
    }

    setVisible(state: boolean) {
        this.setState({visible: state});
    }

    render() {
        return (
            <View>
                {this.state.visible &&
                <Entity
                    source={{
                        obj: asset('head.obj'),
                        mtl: asset('head.mtl')
                    }}
                    lit={true}
                    style={{
                        transform: [
                            {translate: this.state.position},
                            {rotateX: this.state.rotation[0]},
                            {rotateY: this.state.rotation[1]},
                            {rotateZ: this.state.rotation[2]},
                            {scale: 0.20}
                        ]
                    }}
                />
                }
            </View>
        );
    }
}
