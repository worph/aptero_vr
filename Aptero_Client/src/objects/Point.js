import React from 'react';
import {View, asset} from 'react-360';
import Entity from 'Entity';
import {BLUE, POINT_RADIUS} from "../Color";

export default class Point extends React.Component<{ id: string, startVisible: boolean,x:number,y:number,z:number,color:string}, {
    position: [],
    color: string,
}> {
    state = {
        position: [0, 0, 0],
        color:BLUE,
    };

    componentDidMount(): void {
        this.setState({position:[this.props.x,this.props.y,this.props.z],color:this.props.color})
    }

    render() {
        return (
            <View>
                <Entity
                    source={{
                        obj: asset('point.obj'),
                        mtl: asset('point.mtl')
                    }}
                    lit={false}
                    style={{
                        transform: [
                            {translate: this.state.position},
                            {scale: POINT_RADIUS*2}
                        ]
                    }}
                />
            </View>
        );
    }
}
