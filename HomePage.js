import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Animated,
  TouchableOpacity,
} from 'react-native';
import Pedometer from '@asserdata/react-native-universal-pedometer';
import { accelerometer, setUpdateIntervalForType, SensorTypes } from "react-native-sensors";
import { map, filter } from "rxjs/operators";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: null,
      endDate: null,
      numberOfSteps: 0,
      distance: 0,
      floorsAscended: 0,
      floorsDescended: 0,
      currentPace: 0,
      currentCadence: 0,
      motionData: 0,
      x: 0,
      y: 0,
      z: 0
    }
    this.animated = new Animated.Value(0);

    var range = 1, snapshot = 50, radius = 100;
    /// translateX
    var inputRange = [], outputRange = [];
    for (var i = 0; i <= snapshot; ++i) {
      var value = i / snapshot;
      var move = Math.sin(value * Math.PI * 2) * radius;
      inputRange.push(value);
      outputRange.push(move);
    }
    this.translateX = this.animated.interpolate({ inputRange, outputRange });

    /// translateY
    var inputRange = [], outputRange = [];
    for (var i = 0; i <= snapshot; ++i) {
      var value = i / snapshot;
      var move = -Math.cos(value * Math.PI * 2) * radius;
      inputRange.push(value);
      outputRange.push(move);
    }
    this.translateY = this.animated.interpolate({ inputRange, outputRange });

    // accelerometer({
    //   updateInterval: 400 // defaults to 100ms
    // })
    //   .then(observable => {
    //     observable.subscribe(({ x, y, z }) => this.setState({ x, y, z }));
    //   })
    //   .catch(error => {
    //     console.log("The sensor is not available");
    //   });

    // this.state = { x: 0, y: 0, z: 0 };
  }

  animate () {
    this.animated.setValue(0)
    Animated.timing(this.animated, {
      toValue: 1,
      duration: 1000,
    }).start();
  }

  componentDidMount () {
    this._startUpdates();
    this.updateSteps();
  }

  updateSteps = async () => {
    fetch('http://2d7fe7bc.ngrok.io/api/Steps', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        numberOfSteps: this.state.numberOfSteps,
        applicationUserID: '1',
        day: new Date(),
      })
    }).then((responseJson) => {
      this.setState({ numberOfSteps: 0 })
    })
      .catch((error) => {
        console.error(error);
      });
    setTimeout(this.updateSteps, 300000);
  }

  updateRawData = async () => {
    fetch('http://2d7fe7bc.ngrok.io/api/RawData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        x: this.state.x,
        y: this.state.y,
        z: this.state.z,
        applicationUserID: '1',
        day: new Date(),
      })
    }).then((responseJson) => {
      this.setState({ numberOfSteps: 0 })
    })
      .catch((error) => {
        console.error(error);
      });
  }

  _startUpdates () {
    const today = new Date();
    Pedometer.startPedometerUpdatesFromDate(today.getTime(), motionData => {
      this.setState(motionData)
      this.animate();
      this.updateRawData();
    });
    setUpdateIntervalForType(SensorTypes.accelerometer, 60000);
    accelerometer
      .pipe(map(({ x, y, z }) => this.setState({x,y,z})))
      .subscribe(
        x => x,
      );
  }

  render () {
    const transform = [{ translateY: this.translateY }, { translateX: this.translateX }];
    return (
      <ImageBackground source={require('./content/background.png')} style={styles.backgroundImage}>
        <View style={styles.container}>
          <View style={styles.steps}>
            <Animated.View style={[{ transform }]}>
              <TouchableOpacity style={styles.btn}>
                <View style={styles.dot}></View>
              </TouchableOpacity>
            </Animated.View>
            <Text style={styles.largeNotice}>
              {this.state.numberOfSteps}
            </Text>
          </View>
          <Text style={styles.status}>
            You went up {this.state.floorsAscended} floor{this.state.floorsAscended == 1 ? '' : 's'},
             and down {this.state.floorsDescended}.
        </Text>
        </View>
      </ImageBackground>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  status: {
    marginTop: 150,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  steps: {
    borderWidth: 5,
    borderColor: "#41caf4",
    alignItems: 'center',
    height: 200,
    width: 200,
    borderRadius: 300,
  },
  dot: {
    borderWidth: 2,
    borderColor: "white",
    height: 20,
    borderRadius: 20,
    width: 20,
    backgroundColor: '#2d8daa',
    marginTop: 85,
  },
  largeNotice: {
    marginTop: -40,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2d8daa',
    textShadowColor: 'rgba(105,105,105, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  }
});

export default HomePage;
