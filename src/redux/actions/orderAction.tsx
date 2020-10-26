import axios from 'axios';
import {
  WATER_CUSTOMER_ORDERS_GET,
  WATER_CUSTOMER_ORDERS_GET_DETAIL,
  WATER_DO_BULK_PAYMENTS,
} from './../constants';
import {Dispatch} from 'react';
import {
  ORDERS_GET,
  ORDER_LOADING,
  GET_TAKE_TOTAL_AMOUNT,
  GET_TOOK_TOTAL_AMOUNT,
  GET_REST_TOTAL_AMOUNT,
  ORDERS_GET_MORE,
  ORDER_LOADING_MORE,
  CUSTOMER_DETAIL,
  CUSTOMER_DETAIL_LOADING,
  DO_BULK_PAYMENT_LOADING,
  DO_BULK_PAYMENT_FAILED,
  DO_BULK_PAYMENT_SUCCEED,
} from './../types';
import {Action} from '../states';
import {IOrderItem} from '../models/orderModel';
import {NavigationScreenProp, NavigationState} from 'react-navigation';
import {ICustomerDetailItem} from '../models/homeModel';
import {AsyncStorage} from 'react-native';
import {reset} from './loginAction';

export function GetOrders(
  customerId: number,
  pageIndex: number,
  pageSize: number,
) {
  return (dispatch: Dispatch<Action>) => {
    dispatch(loading(true, 'list'));
  AsyncStorage.multiGet(['userToken', 'userId']).then((res) => {
      let token = res[0][1];
      let userId = res[1][1];
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }

    var WATER_CUSTOMER_ORDERS_GET_CUSTOMER =
      WATER_CUSTOMER_ORDERS_GET +
      customerId +
      '&pageIndex=' +
      pageIndex +
      '&pageSize=' +
      pageSize;
    console.log(WATER_CUSTOMER_ORDERS_GET_CUSTOMER)
    axios
      .get(WATER_CUSTOMER_ORDERS_GET_CUSTOMER, {headers:headers})
      .then(response => {
        if (response.data.isSuccess) {
          var takeTotal: number = response.data.result.takeTotalAmount;
          var tookTotal: number = response.data.result.tookTotalAmount;
          var restTotal: number = response.data.result.restTotalAmount;
          var orderModel: IOrderItem[] = [];
          response.data.result.orderItems.forEach((order: any) => {
            var orderItem: IOrderItem = {
              orderId: order.orderId,
              productId: order.productId,
              unitPrice: order.unitPrice,
              totalPrice: order.totalPrice,
              tookTotalPrice: order.tookTotalPrice,
              restAmount: order.restAmount,
              count: order.count,
              productName: order.productName,
              productCode: order.productCode,
              dateTime: order.dateTime,
              isPaid: order.isPaid,
              status : order.status,
              paymentText : order.paymentText
            };
            orderModel.push(orderItem);
          });

          dispatch(orders(orderModel));
          dispatch(loading(false, 'list'));
        } else {
          dispatch(loading(false, 'list'));
        }
      })
      .catch(err => {
        console.log(err);
        dispatch(loading(false, 'list'));
      });
    });
  };
  
}

export function GetOrdersMore(
  customerId: number,
  pageIndex: number,
  pageSize: number,
) {
  return (dispatch: Dispatch<Action>) => {
    dispatch(loadingMore(true));

    var WATER_CUSTOMER_ORDERS_GET_CUSTOMER =
      WATER_CUSTOMER_ORDERS_GET +
      customerId +
      '&pageIndex=' +
      pageIndex +
      '&pageSize=' +
      pageSize;
      AsyncStorage.multiGet(['userToken', 'userId']).then((res) => {
        let token = res[0][1];
        let userId = res[1][1];
        
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      }
 
    axios
      .get(WATER_CUSTOMER_ORDERS_GET_CUSTOMER)
      .then(response => {
        loadingMore(false);

        if (response.data.isSuccess) {
          var takeTotal: number = response.data.result.takeTotalAmount;
          var tookTotal: number = response.data.result.tookTotalAmount;
          var restTotal: number = response.data.result.restTotalAmount;
          var orderModel: IOrderItem[] = [];
          response.data.result.orderItems.forEach((order: any) => {
            var orderItem: IOrderItem = {
              orderId: order.orderId,
              productId: order.productId,
              unitPrice: order.unitPrice,
              totalPrice: order.totalPrice,
              tookTotalPrice: order.tookTotalPrice,
              restAmount: order.restAmount,
              count: order.count,
              productName: order.productName,
              productCode: order.productCode,
              dateTime: order.dateTime,
              isPaid: order.isPaid,
              status : order.status,
              paymentText : order.paymentText
            };
            orderModel.push(orderItem);
          });

          dispatch(ordersMore(orderModel));
        } else {
        }
      })
      .catch(err => {});
    });
  };
}

export function doBultPayment(value: string, customerId: number) {
  return (dispatch: Any) => {
    dispatch(loadingDoBulkPaymnet(true, ''));
    AsyncStorage.multiGet(['userToken', 'userId'])
      .then(res => {
        let token = res[0][1];
        let userId = res[1][1];

        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };
        let valueTmp = Number(value);

        axios
          .post(
            WATER_DO_BULK_PAYMENTS,
            {
              customerId: customerId,
              amount: valueTmp,
            },
            {
              headers: headers,
            },
          )
          .then(response => {
            if (response.data.result) {
              dispatch(
                succedDoBulkPayment('Çoklu ödeme başarıyla tamamlandı.'),
              );
              dispatch(reset());
              dispatch(GetCustomerDetail(customerId));
              dispatch(GetOrders(customerId, 1, 10));
            } else {
              if (
                response.data.message ===
                'Error.AddCashTotal.ValueCannotBeMoreThanRestAmount'
              ) {
                dispatch(
                  loadingDoBulkPaymnet(
                    false,
                    'Alınacak ödeme var olan ödemeden büyük olamaz.',
                  ),
                );
                dispatch(reset());
              } else {
                dispatch(
                  loadingDoBulkPaymnet(false, 'Bir hata meydana geldi.'),
                );
                dispatch(reset());
              }
            }
          })
          .catch(error => {
            dispatch(loadingDoBulkPaymnet(false, 'Bir hata meydana geldi.'));
            dispatch(reset());
          });
      })
      .catch(err => {
        dispatch(loadingDoBulkPaymnet(false, 'Bir hata meydana geldi.'));
        dispatch(reset());
      });
  };
}

export function GetCustomerDetail(customerId: number) {
  return (dispatch: Dispatch<Action>) => {
    dispatch(loading(true, 'customerDetail'));
    console.log(customerId);
    axios
      .get(WATER_CUSTOMER_ORDERS_GET_DETAIL + customerId)
      .then(response => {
        if (response.data.isSuccess) {
          var customer = response.data.result;
          const customerDetailModel: ICustomerDetailItem = {
            customerId: customer.customerId,
            companyName: customer.companyName,
            nameSurname: customer.nameSurname,
            displayTotalAmount: customer.displayTotalAmount,
            totalAmount: customer.totalAmount,
            displayRestTotalAmount: customer.displayRestTotalAmount,
            restTotalAmount: customer.restTotalAmount,
            displayTookTotalAmount: customer.displayTookTotalAmount,
            dayOfWeek: customer.dayOfWeek,
            fountainCount: customer.fountainCount,
            dayOfWeeks: customer.dayOfWeeks,
            adress: customer.address,
            phoneNumber: customer.phoneNumber,
            totalOrderCount:
              customer.totalOrderCount == 0
                ? '0'
                : customer.totalOrderCount.toString(),
            carboyCount: customer.carboyCount,
            description: customer.description,
          };
          console.log(customerDetailModel);
          dispatch(customerDetail(customerDetailModel));
        } else {
          dispatch(loading(false, 'customerDetail'));
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
}

export const loading = (loader: boolean, type: string) => ({
  type: type == 'list' ? ORDER_LOADING : CUSTOMER_DETAIL_LOADING,
  payload: loader,
});
export const loadingMore = (loader: boolean) => ({
  type: ORDER_LOADING_MORE,
  payload: loader,
});
export const orders = (orders: IOrderItem[]) => ({
  type: ORDERS_GET,
  payload: orders,
});
export const customerDetail = (customerDetail: ICustomerDetailItem) => ({
  type: CUSTOMER_DETAIL,
  payload: customerDetail,
});
export const ordersMore = (orders: IOrderItem[]) => ({
  type: ORDERS_GET_MORE,
  payload: orders,
});
export const takeTotalAmount = (takeTotalAmount: number) => ({
  type: GET_TAKE_TOTAL_AMOUNT,
  payload: takeTotalAmount,
});

export const tookTotalAmount = (tookTotalAmount: number) => ({
  type: GET_TOOK_TOTAL_AMOUNT,
  payload: tookTotalAmount,
});

export const restTotalAmount = (restTotalAmount: number) => ({
  type: GET_REST_TOTAL_AMOUNT,
  payload: restTotalAmount,
});

export const loadingDoBulkPaymnet = (loading: boolean, message: string) => ({
  type: loading ? DO_BULK_PAYMENT_LOADING : DO_BULK_PAYMENT_FAILED,
  payload: message,
});

export const succedDoBulkPayment = (message: string) => ({
  type: DO_BULK_PAYMENT_SUCCEED,
  payload: message,
});
