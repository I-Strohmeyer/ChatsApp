import React from "react";
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
const firebase = require("firebase");
require("firebase/firestore");

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: "",
        name: "",
        avatar: "https://placeimg.com/140/140/any",
      },
    };

    // firebase config
    const firebaseConfig = {
      apiKey: "AIzaSyBIm5gdFeJux3bYTJde2n1JixxaJs9s0DA",
      authDomain: "chatsapp-be01d.firebaseapp.com",
      projectId: "chatsapp-be01d",
      storageBucket: "chatsapp-be01d.appspot.com",
      messagingSenderId: "359326984659",
      appId: "1:359326984659:web:568ced045a994d4ccbe726",
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    //reference to firestore collection
    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  componentDidMount() {
    // display user name at the top of screen
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name } || "Unknown");

    // user authentication via firebase
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user?.uid || "0",
          name: user.name,
          avatar: "https://placeimg.com/140/140/any",
        },
      });
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    // unsubscribe from listener
    this.unsubscribe();
  }

  // messages got updated /onsnapshot is fired
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
      });
    });
    this.setState({
      messages,
    });
  };

  // adds a new message to state
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => this.addMessage(this.state.messages[0])
    );
  }

  // adds message to firebase
  addMessage(message) {
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
    });
  }

  // changes to default chat bubbles
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#c9c9c9",
          },
        }}
      />
    );
  }

  render() {
    return (
      //set bgColor that user selected
      <View
        style={{
          flex: 1,
          backgroundColor: this.props.route.params.bgColor,
        }}
      >
        <GiftedChat
          messages={this.state.messages}
          renderBubble={this.renderBubble.bind(this)}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: this.state.user._id,
            name: this.props.route.params.name,
            avatar: this.state.user.avatar,
          }}
          showUserAvatar={true}
          showAvatarForEveryMessage={true}
        />
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({});
