import React from 'react';
import {View, AmbientLight,PointLight, asset} from 'react-360';
import Entity from 'Entity';

const Room = props => {
  return (
    <View>
        <AmbientLight intensity={ 0.4 } />
        <PointLight
            intensity={0.5}
            style={{transform: [{translate: [0, 4, -1]}]}}
            shadow={{
                cast: true,
            }}
        />
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
  );
};

export default Room;
