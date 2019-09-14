import React from 'react';
import {View, asset} from 'react-360';
import Entity from 'Entity';
import {BLACK, BLUE, CYAN, GREEN, PINK, POINT_RADIUS, RED, WHITE, YELLOW} from "../common/Color";

export default class Point extends React.Component<{ id: string, startVisible: boolean, x: number, y: number, z: number, color: string }, {
    position: [],
    color: string,
}> {
    state = {
        position: [0, 0, 0],
        color: "point/pointRed.mtl",
    };

    componentWillMount(): void {
        console.log(this.props.color);
        let color = "point/pointRed.mtl";
        if (this.props.color === RED) {
            color = "point/pointRed.mtl";
        }
        if (this.props.color === GREEN) {
            color = "point/pointGreen.mtl";
        }
        if (this.props.color === BLUE) {
            color = "point/pointBlue.mtl";
        }
        if (this.props.color === PINK) {
            color = "point/pointPink.mtl";
        }
        if (this.props.color === CYAN) {
            color = "point/pointCyan.mtl";
        }
        if (this.props.color === YELLOW) {
            color = "point/pointYellow.mtl";
        }
        if (this.props.color === BLACK) {
            color = "point/pointBlack.mtl";
        }
        if (this.props.color === WHITE) {
            color = "point/pointWhite.mtl";
        }
        this.setState({position: [this.props.x, this.props.y, this.props.z], color: color})
    }

    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        return false;
    }

    render() {
        return (
            <Entity
                source={{
                    obj: asset('point/point.obj'),
                    mtl: asset(this.state.color)
                }}
                lit={false}
                style={{
                    transform: [
                        {translate: this.state.position},
                        {scale: POINT_RADIUS * 2}
                    ]
                }}
            />
        );
    }
}
