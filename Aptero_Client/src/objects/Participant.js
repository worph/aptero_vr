import React from 'react';
import {View, AmbientLight, asset} from 'react-360';
import Entity from 'Entity';

const Participant = props => {
  return (
    <View>
        <Entity
            source={{
                obj: asset('face.obj'),
            }}
            lit={true}
            style={{
                transform: [
                    {translate: [-3, 0, 0]},
                    {rotateY: 0},
                    {scale: 0.002}
                ]
            }}
        />
    </View>
  );
};

export default Participant;
