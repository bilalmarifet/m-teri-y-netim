import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import { Provider } from "react-redux";
import {View} from 'react-native'
import AppContainer from "./src/navigation/AppNavigation";
import configureStore from "./src/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import FlashMessage from "react-native-flash-message";
import NavigationService from "./src/services/NavigationService";

export default class App extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Provider store={configureStore().store}>
          <PersistGate loading={null} persistor={configureStore().persistor}>
            <AppContainer ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }} />
          </PersistGate>
        </Provider>
        <FlashMessage style={{marginBottom:30,marginHorizontal:20,paddingRight:60,borderRadius:5,opacity:.8}} position="bottom" animated={true} />
      </View>
    );
  }
}
