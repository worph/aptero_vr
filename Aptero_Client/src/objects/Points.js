import React from 'react';
import {View, asset} from 'react-360';
import Point from "./Point";
import {browserBridgeIndex} from "../module/BrowserBridgeIndex";

export default class Points extends React.Component<{}, { points: [], }> {
    state = {
        points:[]
    };

    componentWillMount(): void {
        /*let points = [];
        for(let x=0;x<10;x++){
            for(let y=0;y<10;y++){
                for(let z=0;z<10;z++){
                    points.push({
                        x: x, y: y, z: z
                    });
                }
            }
        }
        this.setState({points:points})*/

        browserBridgeIndex.onEvent("newPoint",(data) => {
            this.addPoint(data);
        });

        browserBridgeIndex.onEvent("removePoint",(data) => {
            this.removePoint(data);
        });
    }

    addPoint(point:{id:string,x:number,y:number,z:number,color:string}){
        this.setState(state => {
            let newPoints = state.points.concat([point]);
            return {points:newPoints}
        })
    }

    removePoint(point:{id:string,x:number,y:number,z:number,color:string}){
        this.setState(state => {
            let newPoints = state.points.filter(value => {
                return value.id!==point.id;
            });
            return {points:newPoints}
        })
    }

    render() {
        return (
            <View>
                {
                    this.state.points.map((item,i) =>{
                        return <Point key={item.id} id={item.id} startVisible={true} x={item.x} y={item.y} z={item.z} color={item.color}/>
                    })
                }
            </View>
        );
    }
}
