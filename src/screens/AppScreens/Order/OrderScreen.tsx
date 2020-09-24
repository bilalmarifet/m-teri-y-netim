import React, { Component } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Button,
  Text,
  Alert,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import {
  NavigationScreenProp,
  NavigationState,
  SafeAreaView,
} from 'react-navigation';
import { connect } from 'react-redux';
import { Header } from '../../../components';
import styles from '../styles';
import { AvatarItem } from '../../../components';
import { logoutUserService } from '../../../redux/services/user';
import { Thumbnail, Icon, Item, Label, Input, Spinner } from 'native-base';
import { fetchImageData, fetchMoreImageData } from '../../../redux/actions/fetch';

import FlashMessage, { showMessage } from 'react-native-flash-message';
import { colors, fonts } from '../../../constants';
import LinearGradient from 'react-native-linear-gradient';

import * as Yup from 'yup'; // for everything

import { Formik } from 'formik';
import { GetOrders, GetOrdersMore } from '../../../redux/actions/orderAction';
import { IOrderItem } from '../../../redux/models/orderModel';
import moment from 'moment';
import { AppState } from '../../../redux/store';
import { InfoItem } from '../../../components/InfoItem';
import { stat } from 'fs';

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
    const { navigation } = this.props;
    logoutUserService().then(() => {
      navigation.navigate('AuthStack');
    });
  };

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Siparişlerim',
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: colors.headerColorTop,
        headerTitleStyle: {

          fontFamily: 'Roboto',
          fontSize: 18,

        },
        header:
        {
          shadowColor: 'transparent',
          shadowRadius: 0,
          shadowOffset: {
            height: 0,
          },

        },
        elevation: 0,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc'

      }
    };
  };
  renderStatus(status: number) {
    if (status == 2) {
      return (
        <LinearGradient
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          colors={['#30AE4A', '#7BAD7B']}
          style={{
            borderRadius: 5,
            padding: 5, justifyContent: 'center',
            backgroundColor: colors.buttonBackgroundPrimary,
            flexDirection: 'row',
            paddingTop: 5,
          }}>
          <Text style={{ color: 'white', fontFamily: fonts.primaryFont }}>Teslim Edildi</Text>
        </LinearGradient>

      );

    }
    else if (status == 4) {
      return (
        <LinearGradient
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          colors={['#15ACD6', '#7DB9E8']}
          style={{
            borderRadius: 5,
            padding: 5, justifyContent: 'center',
            backgroundColor: colors.buttonBackgroundPrimary,
            flexDirection: 'row',
            paddingTop: 5,
          }}>
          <Text style={{ color: 'white', fontFamily: fonts.primaryFont }}>Siparişiniz Yolda</Text>
        </LinearGradient>
      );
    }
    else if (status == 1) {
      return (
        <LinearGradient
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          colors={['#FFC107', '#FFDA6D']}
          style={{
            borderRadius: 5,
            padding: 5, justifyContent: 'center',
            backgroundColor: colors.buttonBackgroundPrimary,
            flexDirection: 'row',
            paddingTop: 5,
          }}>
          <Text style={{ color: 'white', fontFamily: fonts.primaryFont }}>Bekliyor</Text>
        </LinearGradient>
      );
    }
    else if (status == 3) {
      return (
        <LinearGradient
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          colors={['##FD7210', '#FFDA6D']}
          style={{
            borderRadius: 5,
            padding: 5, justifyContent: 'center',
            backgroundColor: colors.buttonBackgroundPrimary,
            flexDirection: 'row',
            paddingTop: 5,
          }}>
          <Text style={{ color: 'white', fontFamily: fonts.primaryFont }}>İptal Edildi</Text>
        </LinearGradient>
      );
    }
  }
  onRefresh() {
    this.setState({ page: 1 });
    this.props.GetOrders(global.CUSTOMER_ID, 1, 10);
  }
  renderContent() {
    if (this.props.loading) {
      return (
        <View style={{ flex: 1 }}>
          <Spinner style={{ justifyContent: 'center', alignSelf: 'center' }} />
        </View>
      )
    } else if (!this.props.loading && (!this.props.orders || (this.props.orders && this.props.orders.length < 1))) {
      return (
        <InfoItem
          style={{ marginTop: 30 }}
          imageResource={require('../../../assets/not-found.png')}
          text={
            'Geçmiş Siparişiniz bulunmamaktadır.'
          }
        />

      );
    } else {
      return (
        <FlatList
          refreshing={this.props.loading ?? false}
          onRefresh={() => this.onRefresh()}
          onEndReached={() => {
            if (this.props.orders && this.props.orders.length > 9) {
              var pagenew = this.state.page + 1;
              this.setState({ page: pagenew });
              if (pagenew == 1) {
                pagenew = pagenew + 1;
                this.setState({ page: pagenew });
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
          style={{ paddingTop: 10 }}
          renderItem={({ item, index }) => {
            return (
              <View style={styles.itemOrder}>
                <View style={{ flexDirection: 'row', height: 70, justifyContent: 'space-between' }}>
                  <View style={{ paddingVertical: 10, flex: 0.7 }}>
                    <Text
                      style={{
                        fontFamily: fonts.primaryFont,
                        color: colors.textColor,
                      }}>
                      {item.productName}
                    </Text>
                    <Text
                      style={{
                        fontFamily: fonts.primaryFont,
                        marginTop: 10,
                        color: colors.textColor,
                      }}>

                    </Text>
                    {/* <Text style={{fontFamily:fonts.primaryFont,marginTop:10,color:colors.textColor,fontWeight:'300'}}>
                 Açıklama : 19 litre olarak verilecektir.
               </Text> */}
                  </View>
                  <View style={{ flex: 0.3, flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Icon type="Feather" name="clock" style={{ fontSize: 15, color: '#e1e1e1', marginTop: 12, marginRight: 5 }}></Icon>
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

                  </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ flex: 0.2 }} >
                    <Text style={{ fontFamily: fonts.primaryFont }}>Fiyat</Text>
                    <Text style={{ fontWeight: 'bold', fontFamily: fonts.primaryFont }}>{item.totalPrice} ₺</Text>
                  </View>
                  <View style={{ flex: 0.4 }} >
                    <Text style={{ fontFamily: fonts.primaryFont }}>Ödeme Durumu</Text>
                    <Text style={{ fontWeight: 'bold', fontFamily: fonts.primaryFont }}>Kapıda Kredi Kartı</Text>
                  </View>
                  <View style={{ flex: 0.4 }} >
                    <Text style={{ fontFamily: fonts.primaryFont }}>Durum</Text>
                    {this.renderStatus(item.status)}

                  </View>
                  <View></View>
                </View>
              </View >
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
