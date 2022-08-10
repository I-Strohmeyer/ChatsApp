import React from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
const firebase = require("firebase");
require("firebase/firestore");
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import MapView from "react-native-maps";

import CustomActions from "./CustomActions";

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
        image: null,
        location: null,
      },
      isConnected: false,
      image: null,
      location: null,
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

  // load messages from async storage
  async getMessages() {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  // save messages to async storage
  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  // delete messages from async storage
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
    // display user name at the top of screen
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name || "Unknown" });

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

    // checks if user is online
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        console.log("online");
        this.setState({ isConnected: true });
        this.saveMessages();
      } else {
        console.log("offline");
        this.setState({ isConnected: false });
        // call load messages from async storage
        this.getMessages();
      }
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
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({
      messages,
    });
    this.saveMessages();
  };

  // adds a new message to state
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage(this.state.messages[0]);
        this.saveMessages();
      }
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
      image: message.image || "",
      location: message.location || null,
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

  // disables user from sending message if offline
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  // renders custom actions
  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  // renders map view if the message includes a location
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
    return (
      //set bgColor that user selected
      <ActionSheetProvider>
        <View
          style={{
            flex: 1,
            backgroundColor: this.props.route.params.bgColor,
          }}
        >
          <GiftedChat
            messages={this.state.messages}
            renderBubble={this.renderBubble.bind(this)}
            renderInputToolbar={this.renderInputToolbar.bind(this)}
            renderCustomView={this.renderCustomView}
            renderActions={this.renderCustomActions}
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
      </ActionSheetProvider>
    );
  }
}

const styles = StyleSheet.create({});
