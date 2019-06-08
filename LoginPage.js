import * as React from "react";
import { StyleSheet, View, Text, ImageBackground } from "react-native";
import Button from "./components/Button";
import FormTextInput from "./components/FormTextInput";
import colors from "./config/colors";
import strings from "./config/strings";

class LoginScreen extends React.Component {
  state = {
    email: "",
    password: ""
  };

  handleEmailChange = (email) => {
    this.setState({ email: email });
  };

  handlePasswordChange = (password) => {
    this.setState({ password: password });
  };

  handleLoginPress = () => {
    const { navigate } = this.props.navigation;

    navigate('Home')
  };

  render () {
    return (
      <ImageBackground source={require('./content/background.png')} style={styles.backgroundImage}>
        <View style={styles.container}>
          <View style={styles.form}>
            <Text style={styles.logo}>Activity Tracker</Text>
            <FormTextInput
              value={this.state.email}
              onChangeText={this.handleEmailChange}
              placeholder={strings.EMAIL_PLACEHOLDER}
            />
            <FormTextInput
              value={this.state.password}
              onChangeText={this.handlePasswordChange}
              placeholder={strings.PASSWORD_PLACEHOLDER}
              secureTextEntry={true}
            />
            <Button style={styles.button} label={strings.LOGIN} onPress={this.handleLoginPress} />
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between"
  },
  logo: {
    width: "100%",
    marginBottom: 50,
    textAlign: "center",
    alignSelf: "center",
    margin: "auto",
    fontSize: 36
  },
  form: {
    flex: 1,
    justifyContent: "center",
    width: "80%"
  },
  backgroundImage: {
    width: '100%', 
    height: '100%',
  }
});

export default LoginScreen;