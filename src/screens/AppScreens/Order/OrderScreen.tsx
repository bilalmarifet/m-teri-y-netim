import React, {Component} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Button,
  Text,
  Alert,
  RefreshControl,
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
import {Thumbnail, Icon, Item, Label, Input, Spinner} from 'native-base';
import {fetchImageData, fetchMoreImageData} from '../../../redux/actions/fetch';
import {TouchableOpacity} from 'react-native-gesture-handler';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import {colors, fonts} from '../../../constants';
import LinearGradient from 'react-native-linear-gradient';

import * as Yup from 'yup'; // for everything

import {Formik} from 'formik';
import {GetOrders, GetOrdersMore} from '../../../redux/actions/orderAction';
import {IOrderItem} from '../../../redux/models/orderModel';
import moment from 'moment';
import {AppState} from '../../../redux/store';
import { InfoItem } from '../../../components/InfoItem';

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  GetOrders: (customerId: number, pageIndex: number, pageSize: number) => void;
  GetOrdersMore: (
    customerId: number,
    pageIndex: number,
    pageSize: number,
  ) => void;
  loading: boolean;
  orders: IOrderItem[];
  isOrderLoading: boolean;
  isOrderLoadingMore: boolean;
}

interface itemProp {
  item: any;
}

interface State {
  page: number;
  limit: number;
  change: boolean;
}

class OrderScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      page: 1,
    };
  }

  componentDidMount() {
    this.props.GetOrders(global.CUSTOMER_ID, 1, 10);
  }

  handleLogout = () => {
    const {navigation} = this.props;
    logoutUserService().then(() => {
      navigation.navigate('AuthStack');
    });
  };

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Siparişlerim',
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: colors.headerColor,
        headerTitleStyle: {
          fontWeight: '600',
          fontFamily: 'Avenir Next',
          fontSize: 18,
        },
      },
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Icon
            name="ios-settings"
            style={{marginRight: 10, color: colors.containerBgThird}}
          />
        </TouchableOpacity>
      ),
    };
  };

  onRefresh() {
    this.setState({page: 1});
    this.props.GetOrders(global.CUSTOMER_ID, 1, 10);
  }
  renderContent() {
    if(this.props.loading) {
      return (
        <View style={{flex:1}}>
            <Spinner style={{justifyContent:'center',alignSelf:'center'}} />
        </View>
      )
    }else if (!this.props.loading && (!this.props.orders || (this.props.orders && this.props.orders.length < 1)))
    {
      return(
            <InfoItem
              style={{marginTop: 30}}
              imageResource={require('../../../assets/not-found-2.png')}
              text={
                'Siparişiniz bulunmamaktadır.'
              }
            />

      ); 
      }else {
        return(
          <FlatList
          refreshing={this.props.loading ?? false}
          onRefresh={() => this.onRefresh()}
          onEndReached={() => {
           if(this.props.orders && this.props.orders.length > 9) {
            var pagenew = this.state.page + 1;
            this.setState({page: pagenew});
            if (pagenew == 1) {
              pagenew = pagenew + 1;
              this.setState({page: pagenew});
            }
            this.props.GetOrdersMore(global.CUSTOMER_ID, pagenew, 10);
          
           }
          }
        
        }
          ListFooterComponent={
            this.props.isOrderLoadingMore ? (
              <View>
                <ActivityIndicator />
              </View>
            ) : null
          }

        initialNumToRender={5}
          onEndReachedThreshold={0.5}
          style={{paddingTop: 20}}
          renderItem={({item, index}) => {
            return (
              <View style={styles.item}>
                <View style={{paddingVertical: 10, width: '60%'}}>
                  <Text
                    style={{
                      fontFamily: fonts.primaryFont,
                      color: colors.textColor,
                      fontWeight: 'bold',
                    }}>
                    {item.productName}
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.primaryFont,
                      marginTop: 10,
                      color: colors.textColor,
                    }}>
                    {item.totalPrice} TL
                  </Text>
                  {/* <Text style={{fontFamily:fonts.primaryFont,marginTop:10,color:colors.textColor,fontWeight:'300'}}>
                 Açıklama : 19 litre olarak verilecektir.
               </Text> */}
                </View>

                <Text
                  style={{
                    fontFamily: fonts.primaryFont,
                    color: colors.textColor,
                    fontWeight: '600',
                    opacity: 0.3,
                    marginRight: 5,
                    marginTop: 12,
                    fontSize: 12,
                  }}>
                  {item.dateTime.slice(8, 10) +
                    '/' +
                    item.dateTime.slice(5, 7) +
                    '/' +
                    item.dateTime.slice(0, 4) +
                    ' ' +
                    item.dateTime.slice(11, 16)}
                </Text>
              </View>
            );
          }}
          data={this.props.orders ?? []}
        />
        )
      }
    
  }

  render() {
    return (
      <View style={styles.container}>
       {this.renderContent()}
      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  isOrderLoading: state.orders.isOrderLoading,
  orders: state.orders.orders,
  isOrderLoadingMore: state.orders.loadingMore,
});

function bindToAction(dispatch: any) {
  return {
    GetOrders: (customerId: number, pageIndex: number, pageSize: number) =>
      dispatch(GetOrders(customerId, pageIndex, pageSize)),
    GetOrdersMore: (customerId: number, pageIndex: number, pageSize: number) =>
      dispatch(GetOrdersMore(customerId, pageIndex, pageSize)),
  };
}

export default connect(
  mapStateToProps,
  bindToAction,
)(OrderScreen);
