import React, {Component} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Button,
  Text,
  Alert,
} from 'react-native';
import {
  NavigationScreenProp,
  NavigationState,
  SafeAreaView,
} from 'react-navigation';
import {connect} from 'react-redux';
import {Header} from '../../../components';
import styles from '../styles';
import {AvatarItem} from '../../../components';
import {logoutUserService} from '../../../redux/services/user';
import {
  Thumbnail,
  Icon,
  Item,
  Label,
  Input,
  List,
  ListItem,
  Body,
} from 'native-base';
import {fetchImageData, fetchMoreImageData} from '../../../redux/actions/fetch';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {showMessage} from 'react-native-flash-message';
import {colors, fonts} from '../../../constants';
import LinearGradient from 'react-native-linear-gradient';

import * as Yup from 'yup'; // for everything

import {Formik} from 'formik';
import {getUserInfo, UserInfo} from '../../../redux/actions/profileActions';
import {logOut} from '../../../redux/actions/loginAction';

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  logOut: (navigation?: NavigationScreenProp<NavigationState>) => void;
  getUserInfo: () => void;
  userInfo: UserInfo;
}

interface itemProp {}

interface State {}

class CustomerProfileScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      page: 1,
      limit: 20,
      change: false,
    };
  }

  componentDidMount() {
    this.props.getUserInfo();
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Profilim',
      headerTintColor: colors.containerBgThird,
      headerStyle: {
        backgroundColor: colors.headerColor,
      },
    };
  };

  render() {
    return <View style={styles.container}>{this.renderContent()}</View>;
  }
  renderContent() {
    if (this.props.userInfo) {
      return (
        <View>
          <List>
            <ListItem
              style={{backgroundColor: colors.containerBgSecond}}
              itemDivider>
              <Text style={{fontFamily: fonts.primaryFont, fontSize: 20}}>
                Kişisel Bilgiler
              </Text>
            </ListItem>
            <ListItem>
              <Text style={{fontFamily: fonts.primaryFont, fontWeight: '700'}}>
                İsim:{' '}
                <Text style={{fontWeight: 'normal'}}>
                  {this.props.userInfo.nameSurname}
                </Text>
              </Text>
            </ListItem>
            <ListItem>
              <Text style={{fontFamily: fonts.primaryFont, fontWeight: '700'}}>
                Email:{' '}
                <Text style={{fontWeight: 'normal'}}>
                  {this.props.userInfo.email}
                </Text>
              </Text>
            </ListItem>
            <ListItem onPress={() => this.props.logOut(this.props.navigation)}>
              <Text
                style={{
                  fontFamily: fonts.primaryFont,
                  fontWeight: '700',
                  textAlign: 'center',
                  color: colors.accent,
                }}>
                ÇIKIŞ YAP
              </Text>
            </ListItem>
          </List>
        </View>
      );
    }
  }
}

const mapStateToProps = (state: any) => ({
  loading: state.profile.loading,
  userInfo: state.profile.userInfo,
  message: state.profile.message,
});

function bindToAction(dispatch: any) {
  return {
    getUserInfo: () => dispatch(getUserInfo()),
    logOut: (navigation?: NavigationScreenProp<NavigationState>) =>
      dispatch(logOut(navigation)),
  };
}

export default connect(
  mapStateToProps,
  bindToAction,
)(CustomerProfileScreen);
