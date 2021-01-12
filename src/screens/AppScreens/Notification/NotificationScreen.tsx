import React, {Component} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Button,
  Text,
  Alert,
  Image, AsyncStorage, RefreshControl
} from 'react-native';
import {
  NavigationEvents,
  NavigationScreenProp,
  NavigationState,
  SafeAreaView,
} from 'react-navigation';
import {connect} from 'react-redux';
import {Header} from '../../../components';
import {AvatarItem} from '../../../components';
import {logoutUserService} from '../../../redux/services/user';
import {
  Thumbnail,
  Item,
  Label,
  Input,
  List,
  ListItem,
  Body,
  Right,
  Left,
  Spinner,
} from 'native-base';
import {TouchableOpacity,TouchableHighlight, ScrollView} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {colors, fonts} from '../../../constants';
import LinearGradient from 'react-native-linear-gradient';

import * as Yup from 'yup'; // for everything

import {Formik} from 'formik';
import {getUserInfo, UserInfo} from '../../../redux/actions/profileActions';
import {logOut} from '../../../redux/actions/loginAction';
import { AppState } from '../../../redux/store';
import Icon from 'react-native-vector-icons/Ionicons';
import IconNew from 'react-native-vector-icons/Ionicons'
import { InfoItem } from '../../../components/InfoItem';
import { getNotifications, INotificationItem, removeNotification } from '../../../redux/actions/notificationAction';
import { SwipeListView } from 'react-native-swipe-list-view';
import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  getUserInfo: () => void;
  userInfo: UserInfo;
  ProfileLoading:Boolean;
  loading: boolean | null;
    message: string;
    notificationList: INotificationItem[]
    getNotifications: (isUpdate: boolean, page: number, pageSize: number) => void;
    isFinishedMore: boolean;
    removeNotification: (index : number, id : number) => void;
    
}
const PAGE_SIZE: number = 20;
interface itemProp {}

interface State {
  notificationListTmp: INotificationItem[];
  updatStateList: boolean;
  page: number;
  refreshing: boolean;
  deleteRow : boolean;
}

class NotificationScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      page: 1,
      limit: 20,
      change: false,
    };

  }
  _bootstrapAsync = async () => {

    
 
  };
  componentDidMount() {
    this.props.getUserInfo();
    this.props.getNotifications(true, 1, PAGE_SIZE);
  }
  closeRow (rowMap, rowKey){
    if (rowMap[rowKey]) {
        rowMap[rowKey].closeRow();
    }
};

renderHiddenItem(data, rowMap){
  return(
   <View style={styles.rowBack}>
   <Text>Left</Text>
   {/* <TouchableOpacity
       style={[styles.backRightBtn, styles.backRightBtnLeft]}
       onPress={() => this.closeRow(rowMap, data.item.key)}
   >
       <Text style={styles.backTextWhite}>Close</Text>
   </TouchableOpacity> */}
   <TouchableOpacity
       style={[styles.backRightBtn, styles.backRightBtnRight]}
       onPress={() => this.deleteRow(rowMap, data)}
   >
       <Text style={styles.backTextWhite}>Sil</Text>
       <Icon name="trash" style={{color:'white'}} />
   </TouchableOpacity>
</View>
  )
}

renderItem(data){

  var item = {} as INotificationItem
  item = data.item

return(
<TouchableHighlight
onPress={() => console.log()}
style={styles.rowFront}
underlayColor={'#AAA'}
>
<View style={{flexDirection:'row',padding:10}}>
<Image source={require('../../../images/order.png')} style={{ marginRight: 10 }} />

<View style={{marginLeft:10,flex:1,paddingBottom:10}}>
<Text style={{color:colors.textColor}}>{item.value.message}</Text>

<Text style={{color:colors.textColor,marginTop:10,fontSize:12,textAlign:'right'}}>{item.value.createdDate}</Text>
</View>
</View>
</TouchableHighlight>
)
};

deleteRow (rowMap, rowKey){
  // console.log(rowMap)
  console.log(rowKey)
  this.closeRow(rowMap, rowKey);
  this.props.removeNotification(rowKey.index,rowKey.item.value.notificationId);

  // const newData = [...this.state.listData];
  // const prevIndex = this.state.listData.findIndex(item => item.key === rowKey);
  // newData.splice(prevIndex, 1);
  // this.setState({listData : newData});
};

  onRowDidOpen(rowKey) {
  // console.log('This row opened', rowKey);
};

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Bildirimler',
      headerStyle: {
        backgroundColor: colors.headerColorTop,
        
        header:
        {
          shadowColor: 'transparent',
          shadowRadius: 0,
          shadowOffset: {
              height: 0,
          },
       
        },
        elevation: 0,
        borderBottomWidth:0.5,
        borderBottomColor:'#ccc',
       
      },
      headerLeft: <TouchableOpacity onPress={()=> navigation.navigate('HomeBaseWithItemsStack')}><IconNew name="ios-chevron-back-outline" style={{fontSize:30,color:colors.headerTitleColor}} /></TouchableOpacity>,

    };
  };

  render() {
    return <View style={styles.container}>
       <NavigationEvents onDidFocus={()=> {
                    
                    this.props.getNotifications(true, 1, PAGE_SIZE)
                    }} />
      {this.renderContentNew()}</View>;
  }

  renderContent(){
    if(!this.props.loading
       && (!this.props.notificationList || (this.props.notificationList && this.props.notificationList.length < 1))
       ){
      return (
        <FlatList 
      style={{flex:1}}
      contentContainerStyle={{flex:1}}
      data={[1]}
      refreshing  
      refreshControl={
        <RefreshControl
            colors={["#9Bd35A", "#689F38"]}
            refreshing={this.props.loading}
            onRefresh={()=>this.props.getNotifications(false,1,15)}
        />
    }
      
      renderItem={ (e)=> (

               <InfoItem
               style={{justifyContent:'center',paddingTop:'50%'}}
                text=
                'Herhangi bir bildiriminiz bulunamadı!'
                
              />

      )}
      />
      )
    }
    else if(this.props.loading
       &&!(this.props.notificationList && this.props.notificationList.length > 0)
       ){

return(
  <Spinner color={colors.IconColor}/>
)
      


    }
    else {
      return(
        <SwipeListView
        refreshing

        disableRightSwipe
        refreshControl={
            <RefreshControl
                colors={["#9Bd35A", "#689F38"]}
                refreshing={this.props.loading}
                onRefresh={()=>this.props.getNotifications(false,1,20)}
            />
        }
        data={this.props.notificationList}
        renderItem={(data)=>this.renderItem(data)}
        renderHiddenItem={(data,rowMap)=> this.renderHiddenItem(data,rowMap)}
        leftOpenValue={75}
        rightOpenValue={-75}
        previewRowKey={'0'}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        onRowDidOpen={(rowKey)=>this.onRowDidOpen(rowKey)}
    />
      )
    }
  }

  renderContentNew() {
    const userToken = global.TOKEN;
    console.log("profile", userToken);
    if(userToken){
      if(this.props.userInfo) {
        return this.renderContent()
      }
    }
    else{
      return (
      <View style={{flex:1,justifyContent:'center',alignSelf:'center'}}>
       <InfoItem text="Bildirimlere ulaşmak için giriş yapın ya da üye olun" />
      </View>
      );

    }

  }
}

const styles = StyleSheet.create({
  container: {
      backgroundColor: 'white',
      flex: 1,
  },
  standalone: {
      marginTop: 30,
      marginBottom: 30,
  },
  standaloneRowFront: {
      alignItems: 'center',
      backgroundColor: '#CCC',
      justifyContent: 'center',

      height: 50,
  },
  standaloneRowBack: {
      alignItems: 'center',
      backgroundColor: '#8BC645',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',

      padding: 15,
  },
  backTextWhite: {
      color: 'white',
  },
  rowFront: {
      alignItems: 'center',

      paddingHorizontal: 5,

      backgroundColor: 'white',


      borderBottomWidth: 0.5,
      borderBottomColor: '#bfbfbf'

  },
  rowBack: {
      alignItems: 'center',
      backgroundColor: '#DDD',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',

      paddingLeft: 15,
  },
  backRightBtn: {
      alignItems: 'center',
      bottom: 0,
      justifyContent: 'center',
      position: 'absolute',
      top: 0,
      width: 75,
  },
  backRightBtnLeft: {
      backgroundColor: '#EFF3F9',
      right: 75,
  },
  backRightBtnRight: {
      backgroundColor: '#FD0D55',
      right: 0,
  },
  controls: {
      alignItems: 'center',
      marginBottom: 30,
  },
  switchContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 5,
  },
  switch: {
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'black',
      paddingVertical: 10,
      width: Dimensions.get('window').width / 4,
  },
  trash: {
      height: 30,
      width: 30,
  },
});



const mapStateToProps = (state: AppState) => ({
  ProfileLoading: state.profile.loading,
  userInfo: state.profile.userInfo,
  message: state.profile.message,
  loading: state.notification.isLoading,
  messageNew: state.notification.message,
  notificationList: state.notification.notificationListItem,
  isFinishedMore: state.notification.isMoreFinished

});

function bindToAction(dispatch: any) {
  return {
    getUserInfo: () => dispatch(getUserInfo()),
    logOut: (navigation?: NavigationScreenProp<NavigationState>) =>
      dispatch(logOut(navigation)),
      getNotifications: (isUpdate: boolean, page: number, pageSize: number) =>
      dispatch(getNotifications(isUpdate, page, pageSize)),
      removeNotification: (index : number, id : number) => 
      dispatch(removeNotification(index,id))
      
  };
}

export default connect(
  mapStateToProps,
  bindToAction,
)(NotificationScreen);



