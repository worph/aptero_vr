import React from 'react';
import {View, AmbientLight,PointLight, asset} from 'react-360';
import Entity from 'Entity';

const Env = props => {
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
    </View>
  );
};

export default Env;
