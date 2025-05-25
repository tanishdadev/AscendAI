import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const layout = () => {
    return (
        <View>
            <View
                style={{
                    width: 50,
                    height: 50,
                    backgroundColor: 'powderblue',
                }}
            />
            <View
                style={{
                    width: 50,
                    height: 50,
                    backgroundColor: 'skyblue',
                }}
            />
            <View
                style={{
                    width: 50,
                    height: 50,
                    backgroundColor: 'steelblue',
                }}
            />
        </View>
    );
};

export default layout;