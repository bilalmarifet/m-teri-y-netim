import axios from 'axios';
import {
  WATER_ADD_ORDER,
  WATER_ADD_ORDER_MULTIPLE_PRODUCT,
  WATER_GET_LAST_ORDER,
  WATER_ADD_ORDER_AGAIN,
} from './../constants';
import {Dispatch} from 'react';
import {
  ADD_ORDER_SUCCEED,
  ADD_ORDER_FAILED,
  ADD_ORDER_IS_LOADING,
  GET_EMPLOYEE_TOKENS,
  GET_LAST_ORDER_SUCCEED,
  RESET_CART,
} from './../types';
import {Action} from '../states';

import {AsyncStorage, Alert} from 'react-native';

import {GetOrders, GetCustomerDetail} from './orderAction';
import {navigate} from '../services/Navigator';
import {reset, loading} from './loginAction';
import {getCustomerOrders} from './orderDetailActions';
import {product} from '../../screens/AppScreens/Customer/orderAdd';
import {showMessage} from 'react-native-flash-message';
import {NotificationService} from '../../services/NotificationService';
import { user } from './getUserAction';

export function chooseEmployee(userId: string) {}
export interface userWithToken {
  id: number;
  name: string;
  tokens: string[];
}

export interface notificationEmployee {
  orderId: number;
  userWithToken: userWithToken[];
}

interface addOrderInterface {
  orderItems: [{productId: number; unitPrice: number; productCount: number}];
  isPaid: boolean;
  customerId: number;
  userId: number;
}

export interface lastOrderInterface {
  orderId: number;
  orderProducts: [
    {
      productId: number;
      productName: string;
      unitPrice: string;
      count: number;
      totalPrice: number;
    }
  ];
}

export function getLastOrder(customerId: number) {
  return (dispatch: Any) => {
    AsyncStorage.multiGet(['userToken', 'userId'])
      .then(res => {
        let token = res[0][1];
        let userId = res[1][1];

        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };
        console.log(WATER_GET_LAST_ORDER + `?customerId=${customerId}`);
        axios
          .get(WATER_GET_LAST_ORDER + `?customerId=${customerId}`, {
            headers: headers,
          })
          .then(response => {
            var lastOrderItem = {} as lastOrderInterface;
            console.log(response, 'lastorder');
            if (response.data.isSuccess) {
              if (response.data.result) {
                let data = response.data.result;
                lastOrderItem.orderId = data.orderId;
                var orderList = [];
                data.orderProducts.forEach(element => {
                  orderList.push(element);
                });
                lastOrderItem.orderProducts = orderList;
                dispatch(getLastOrderDispatch(lastOrderItem));
              } else {
                dispatch(getLastOrderDispatch(lastOrderItem));
              }
            }
          })
          .catch(error => {
            dispatch(reset());
          });
      })
      .catch(err => {
        dispatch(reset());
      });
  };
}

export function addOrderAgain(orderId: number, customerId: number) {
  return (dispatch: Any) => {
    dispatch(isLoading(true));
    AsyncStorage.multiGet(['userToken', 'userId'])
      .then(res => {
        let token = res[0][1];
        let userId = res[1][1];

        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };
        console.log(
          WATER_ADD_ORDER_AGAIN + `?orderId=${orderId}&userId=${userId}`,
        );
        axios
          .get(WATER_ADD_ORDER_AGAIN + `?orderId=${orderId}&userId=${userId}`, {
            headers: headers,
          })
          .then(response => {
            if (response.data.isSuccess) {
              if (response.data.result) {
                let data = response.data.result.userWithTokenItemResponses;
                var notificationItemList: {
                  id: any;
                  name: any;
                  tokens: any;
                }[] = [];
                data.forEach((element: any) => {
                  notificationItemList.push({
                    id: element.id,
                    name: element.name,
                    tokens: element.tokens,
                  });
                });
                var notificationEmployee = {} as notificationEmployee;
                notificationEmployee.userWithToken = notificationItemList;
                notificationEmployee.orderId = response.data.result.orderId;
                dispatch(getEmployeeList(notificationEmployee));

                dispatch(addOrder(true, 'Sipariş Alındı!'));
                dispatch(reset());
                dispatch(GetOrders(customerId, 1, 10));
                dispatch(GetCustomerDetail(customerId));
                dispatch(getCustomerOrders(false));
              }
            }
          })
          .catch(error => {
            console.log("error",error);
            dispatch(addOrder(false, 'Sipariş eklenirken bir hata oluştu.'));
            dispatch(reset());
          });
      })
      .catch(err => {
        console.log(err);
        dispatch(addOrder(false, 'Bir Hata Meydana Geldi.'));
        dispatch(reset());
      });
  };
}

export function AddOrderMultiple(
  productList: product[],
  isPaid: boolean,
  customerId: number,
  type?: number,
  storeOwnerUserId?: number,
  customerName?: string,
) {
  if (!type) {
    type = 0;
  }

  return (dispatch: Any) => {
    dispatch(isLoading(true));
    AsyncStorage.multiGet(['userToken', 'userId'])
      .then(res => {
        let token = res[0][1];
        var userId = res[1][1];
        if (storeOwnerUserId) {
          userId = storeOwnerUserId.toString();
        }
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };

        var list: {
          productId: number | null;
          unitPrice: string;
          productCount: string;
        }[] = [];
        productList.map(element => {
          let OrderItem = {
            productId: element.productId,
            unitPrice: element.unitPrice,
            productCount: element.productCount,
          };

          list.push(OrderItem);
        });
        console.log(list,isPaid,customerId,userId,type)
        axios
          .post(
            WATER_ADD_ORDER_MULTIPLE_PRODUCT,
            {
              orderItems: list,
              isPaid: isPaid,
              customerId: customerId,
              userId: userId,
              type: type,
            },
            {
              headers: headers,
            },
          )
          .then(response => {
            console.log('addOrderResponse', response);
            console.log(
              'orderItems:',
              list,
              'isPaid:',
              isPaid,
              'customerId:',
              customerId,
              'userId:',
              userId,
              'type:',
              type,
            );
            if (response.data.isSuccess) {
              if (response.data.result) {
                let data = response.data.result.userWithTokenItemResponses;
                var notificationItemList: {
                  id: any;
                  name: any;
                  tokens: any;
                }[] = [];
                data.forEach((element: any) => {
                  notificationItemList.push({
                    id: element.id,
                    name: element.name,
                    tokens: element.tokens,
                  });
                });
                var notificationEmployee = {} as notificationEmployee;
                notificationEmployee.userWithToken = notificationItemList;
                notificationEmployee.orderId = response.data.result.orderId;
                dispatch(getEmployeeList(notificationEmployee));

                dispatch(addOrder(true, 'Sipariş Alındı!'));
                dispatch(reset());
                dispatch(GetOrders(customerId, 1, 10));
                dispatch(GetCustomerDetail(customerId));
                dispatch(getCustomerOrders(false));
                if (type === 1) {
                  dispatch(resetCartValues());

                  showMessage({
                    message: 'Sipariş  gönderildi.',
                    type: 'success',
                    icon: 'auto',
                  });

                  if (
                    response.data.result.userWithTokenItemResponses &&
                    response.data.result.userWithTokenItemResponses[0]
                  ) {
                    let tmpToken =
                      response.data.result.userWithTokenItemResponses[0];

                    const notificationService = new NotificationService(
                      global.STORE_OWNER_USER_ID,
                      1,
                      response.data.result.orderId,
                      response.data.result.userWithTokenItemResponses[0].tokens,
                    );
                    let text = customerName
                      ? `Müşteriniz ${customerName}'den hemen teslim edilmek üzere sipariş alındı`
                      : 'Müşterinizden hemen teslim edilmek üzere sipariş alındı';
                    notificationService.sendPush(text, 'Müşteri Siparişi');
                  }
                }
              }
            }
          })
          .catch(error => {
            console.log(error)
            dispatch(addOrder(false, 'Sipariş eklenirken bir hata oluştu.'));
            dispatch(reset());
          });
      })
      .catch(err => {
        dispatch(addOrder(false, 'Bir Hata Meydana Geldi.'));
        dispatch(reset());
      });
  };
}

export function AddOrder(
  productId: number,
  customerId: number,
  unitPrice: number,
  count: number,
  isPaid: boolean,
) {
  return (dispatch: Any) => {
    dispatch(isLoading(true));
    AsyncStorage.multiGet(['userToken', 'userId'])
      .then(res => {
        let token = res[0][1];
        let userId = res[1][1];

        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };
        axios
          .post(
            WATER_ADD_ORDER,
            {
              productId: productId,
              customerId: customerId,
              unitPrice: unitPrice,
              count: count,
              isPaid: isPaid,
              userId: userId,
            },
            {
              headers: headers,
            },
          )
          .then(response => {
            if (response.data.isSuccess) {
              if (response.data.result) {
                let data = response.data.result.userWithTokenItemResponses;
                var notificationItemList: {
                  id: any;
                  name: any;
                  tokens: any;
                }[] = [];
                data.forEach((element: any) => {
                  notificationItemList.push({
                    id: element.id,
                    name: element.name,
                    tokens: element.tokens,
                  });
                });
                var notificationEmployee = {} as notificationEmployee;
                notificationEmployee.userWithToken = notificationItemList;
                notificationEmployee.orderId = response.data.result.orderId;
                dispatch(getEmployeeList(notificationEmployee));

                dispatch(addOrder(true, 'Sipariş Alındı!'));
                dispatch(reset());
                dispatch(GetOrders(customerId, 1, 10));
                dispatch(GetCustomerDetail(customerId));
                dispatch(getCustomerOrders(false));
              }
            }
          })
          .catch(error => {
            console.log(error)
            dispatch(addOrder(false, 'Sipariş eklenirken bir hata oluştu.'));
            dispatch(reset());
          });
      })
      .catch(err => {
        console.log(err)
        dispatch(addOrder(false, 'Bir Hata Meydana Geldi.'));
        dispatch(reset());
      });
  };
}

export const isLoading = (loading: boolean) => ({
  type: ADD_ORDER_IS_LOADING,
  payload: loading,
});

export const addOrder = (isSuccess: boolean, message: string) => ({
  type: isSuccess ? ADD_ORDER_SUCCEED : ADD_ORDER_FAILED,
  payload: message,
});

export const getEmployeeList = (
  notificationEmployee: notificationEmployee,
) => ({
  type: GET_EMPLOYEE_TOKENS,
  payload: notificationEmployee,
});

export const getLastOrderDispatch = (lastOrder: lastOrderInterface) => ({
  type: GET_LAST_ORDER_SUCCEED,
  payload: lastOrder,
});

export const resetCartValues = () => ({
  type: RESET_CART,
  payload: null,
});
