import * as React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

const instructions = Platform.select({
  android: `Double tap R on your keyboard to reload,
    Shake or press menu button for dev menu`,
  ios: `Press Cmd+R to reload,
  Cmd+D or shake for dev menu`,
});

export default class App extends React.Component<{}> {
  render(): React.ReactNode {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome} testID={'headingWelcome'}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});