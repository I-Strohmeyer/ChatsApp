import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TextInput,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
//import { LinearGradient } from "expo-linear-gradient";

const image = require("../assets/new_bg_pic.png");

const colors = ["#5d0979", "#4b2f92", "#4047a2", "#00d4ff"];

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "", bgColor: "#4b2f92" };

    //this.state = { selectedColor: "red" };
  }

  // update bgColor - will be passed to chat.js
  updateBgColor = (c) => {
    this.setState({ bgColor: c });
  };

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={image}
          resizeMode="cover"
          style={styles.bgImage}
        >
          <View style={styles.wrapper}>
            {/* Logo/Title */}
            <View style={styles.titleWrapper}>
              <Text style={styles.title}>ChatsApp</Text>
            </View>

            {/* Main */}
            <View style={styles.contentWrapper}>
              <View style={styles.content}>
                <View style={styles.nameWrapper}>
                  <FontAwesome5 name="user" size={16} style={styles.icon} />
                  <TextInput
                    style={[styles.input, styles.colorText]}
                    onChangeText={(name) => this.setState({ name })}
                    value={this.state.name}
                    placeholder="Your Name"
                  />
                </View>
                <View style={styles.colorWrapper}>
                  <Text style={styles.colorText}>Choose Background Color:</Text>
                  <View style={styles.colorCircleWrapper}>
                    {colors.map((color) => (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        key={color}
                        onPress={() => this.updateBgColor(color)}
                        style={[
                          {
                            backgroundColor: color,
                            /*borderWidth: 1,
                            borderColor:
                              this.bgColor === this.selectedColor
                                ? "red"
                                : "transparent", */
                          },
                          styles.colorCircle,
                        ]}
                      />
                    ))}
                  </View>
                </View>

                <Pressable
                  style={styles.button}
                  onPress={() =>
                    this.props.navigation.navigate("Chat", {
                      name: this.state.name,
                      bgColor: this.state.bgColor,
                    })
                  }
                >
                  <Text style={styles.btnText}>Start Chatting</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    flex: 1,
    width: "100%",
  },
  wrapper: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "6%",
    paddingTop: "6%",
  },
  titleWrapper: {
    width: "88%",
    height: "44%",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 45,
    fontWeight: "600",
    textAlign: "center",
  },
  contentWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: "88%",
    height: "44%",
    backgroundColor: "#fff",
    borderRadius: 24,
  },
  content: {
    width: "88%",
    height: "88%",
    justifyContent: "space-between",
  },
  nameWrapper: {
    borderColor: "#5d0979",
    borderWidth: 2,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12,
    borderRadius: 8,
  },
  icon: {
    opacity: 0.5,
    marginRight: 12,
  },
  input: {
    opacity: 0.5,
  },
  colorText: {
    fontSize: 16,
    fontWeight: "300",
    color: "#4b2f92",
  },
  colorCircleWrapper: {
    flexDirection: "row",
    marginTop: 12,
  },
  colorCircle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 20,
  },
  button: {
    backgroundColor: "#5d0979",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 8,
  },
  btnText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
