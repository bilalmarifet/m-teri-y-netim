import React, { Component } from "react";
import {  connect } from "react-redux";
import AppContainer from "./src/navigation/AppNavigation";
import { getNotificationCount, getNotifications } from "./src/redux/actions/notificationAction";
import { AppState } from "./src/redux/store";
import NavigationService from "./src/services/NavigationService";
interface State{
  badgeCount:number;
}

interface Props{
  notCount:number;
  loading:boolean;
  getNotificationCount : () => void;
}
 class AppBase extends Component<Props, {}> {

  constructor(props:Props) {
    super(props);

  }
  componentDidMount(){
    this.props.getNotificationCount();
    
  }
  render() {
    var count = this.props.notCount
    if(typeof count == "boolean") {
      count = 0
    }
    return (
      <AppContainer ref={navigatorRef => {
        NavigationService.setTopLevelNavigator(navigatorRef);
      }} screenProps={{badgeCount:count ? count:"0"}}  />
    );
    }
 }
const mapStateToProps = (state: AppState) => ({
  loading : state.notification.isLoadingCount,
  notCount : state.notification.notCount
  
  });
  
  function bindToAction(dispatch: any) {
    return {
      getNotificationCount : () => 
      dispatch(getNotificationCount()),
  
    };
  }

export default connect(
  mapStateToProps,
  bindToAction
)(AppBase);




