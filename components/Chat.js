import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";

export default class Chat extends React.Component {
  componentDidMount() {
    // display user name at the top of scren
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name } || "Unknown");
  }

  render() {
    return (
      //set bgColor that user selected
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: this.props.route.params.bgColor,
        }}
      >
        <Text>Hello Chat!</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({});
