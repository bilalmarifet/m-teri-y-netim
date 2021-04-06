import axios from 'axios';
import {
  WATER_ADD_ORDER,
  WATER_ADD_ORDER_MULTIPLE_PRODUCT,
  WATER_GET_LAST_ORDER,
  WATER_ADD_ORDER_AGAIN,WATER_GET_SELECT_PAYMET_METHOD
} from './../constants';
import {Dispatch} from 'react';
import {
  ADD_ORDER_SUCCEED,
  ADD_ORDER_FAILED,
  ADD_ORDER_IS_LOADING,
  GET_EMPLOYEE_TOKENS,
  GET_LAST_ORDER_SUCCEED,
  RESET_CART, PAYMENT_METHODS_LOADING, GET_PAYMENT_METHODS, CHANGE_PAYMENT_METHODS
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
import { BasestoreId } from '../../services/AppConfig';
import { showSimpleMessage } from '../../components/showMessage';
import NavigationService from '../../services/NavigationService';
import { getUserInfo } from './profileActions';
import {NetworkInfo} from 'react-native-network-info';
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

interface userWithTokenItemResponses {
id: number;
isOwner: boolean;
name: string;
tokens: string[]
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
interface notificationInsertReponseModel  {
  message : string;
  title: string;
}

export interface PaymentMethod {
  paymentType: number,
  paymentTypeName: string;
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

export function changePaymentMehtod(index: number) {
  return(dispatch: any) => {
    dispatch(paymentMethodChange(index))
  }
}

export function getPaymentMethod() {
  return(dispatch:any) => {
    console.log("girdi")
    dispatch(isLoadingPaymentMethods(true))
    AsyncStorage.multiGet(['userToken', 'userId'])
      .then(res => {
        let token = res[0][1];
        var userId = res[1][1];
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };
        axios
          .get(
            WATER_GET_SELECT_PAYMET_METHOD + `?storeId=${BasestoreId}`,
            {
              headers: headers,
            },
          )
          .then(response => {
            console.log(response)
            var paymentMethods: PaymentMethod[] = []
            if (response.data.isSuccess) {
                response.data.result.map((element:PaymentMethod) => {
                  paymentMethods.push(element)
                })
                dispatch(PaymentMethodsGet(paymentMethods))
            }else {
              showSimpleMessage("Bir hata meydana geldi. Daha sonra tekrar deneyiniz","success")
            }
            dispatch(isLoadingPaymentMethods(false))
          })
          .catch(error => {
            showSimpleMessage("Bir hata meydana geldi. Daha sonra tekrar deneyiniz","success")
            dispatch(isLoadingPaymentMethods(false))
          });
      })
      .catch(err => {
        showSimpleMessage("Bir hata meydana geldi. Daha sonra tekrar deneyiniz","success")
            
        dispatch(isLoadingPaymentMethods(false))
      });
  }
}

export function AddOrderMultiple(
  productList: product[],
  isPaid: boolean,
  customerId: number,
  paymentType: number,
  paymentInfoText: string,
  addressId: number,
  type?: number,
  storeOwnerUserId?: number,
  customerName?: string,
  
) {
  if (!type) {
    type = 0;
  }
  
    console.log("paymentInfoText",paymentInfoText)

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
        var freePoints = 0
        productList.map(element => {
          let OrderItem = {
            productId: element.productId,
            unitPrice: element.unitPrice,
            productCount: element.productCount,
          };
          let productCount = element.productCount ? Number(element.productCount) : 0
          let freePoint = element.freePoint ?? 0
          freePoints += (productCount * freePoint)
          console.log(productCount," ", freePoint)
          list.push(OrderItem);
        });
        console.log(freePoints,"freee points")
        console.log("order addd",paymentType,list,isPaid,customerId,userId,type)
        axios
          .post(
            WATER_ADD_ORDER_MULTIPLE_PRODUCT,
            {
              orderItems: list,
              isPaid: isPaid,
              customerId: customerId,
              userId: userId,
              orderNote: paymentInfoText,
              type: type,
              addressId: addressId,
              paymentType: paymentType,
            },
            {
              headers: headers,
            },
          )
          .then(async response => {
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
                dispatch(reset());
                dispatch(GetOrders(customerId, 1, 10));
                dispatch(resetCartValues());
                console.log(paymentType, "paymentTypee")
                if(paymentType === 4) {
                  let ipAdress = await NetworkInfo.getIPV4Address()
                  let data = response.data.result
                  let orderId = Number(response.data.result.orderId) ?? 0
                  console.log(orderId, "orderId", ipAdress , "ipAdress")
                  if (orderId > 0 && ipAdress != null) {
                    let webUri = `http://apiv2.baglarsu.com/payment/pay?OrderId=${orderId}&userIpAdress=${ipAdress}`
                    console.log("data from credit card",data)
                    NavigationService.navigate('WebView',{webUri:webUri, notificationResponse: data,orderId:orderId,customerName:customerName})
                  }
                  else {
                    showSimpleMessage("Sipariş oluşturulurken bir hata meydana geldi.","danger","Daha sonra sipariş verebilirsiniz.")
                  }
                }else {
                  dispatch(sendNotificationFromResponseData(response.data.result,paymentType,customerName,freePoints))
                }
                
                
              }else {
                dispatch(addOrder(false))
                dispatch(getUserInfo())
              } 
            }else {
              if (response.data.message ===  "Order.Post.MinumumAmount.Error")
              {showSimpleMessage("Minimum sipariş üstünde sipariş verebiirsiniz.","danger")
              dispatch(isLoading(false));
            }
              else if(response.data.message == "Order.Post.WorkingHour.Error") {
                showSimpleMessage("Çalışma saatleri dışındasınız.","danger","Daha sonra sipariş verebilirsiniz.")
                dispatch(isLoading(false));
              }
            }
            dispatch(addOrder(false))
            
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


export function sendNotificationFromResponseData(result: any,paymentType: number,customerName?:string,freePoints?:number) {
  return (dispatch: Any) => {
    let data = result.userWithTokenItemResponses;
    var notificationItemResponsesList: userWithTokenItemResponses[] = []
    data.forEach((element: userWithTokenItemResponses) => {
      var notificationItemResponse = {} as userWithTokenItemResponses
      notificationItemResponse.id = element.id
      notificationItemResponse.isOwner = element.isOwner
      notificationItemResponse.name = element.name
      var tokenList : String[] = []
      element.tokens.forEach((e:string) => {
        tokenList.push(e)
      })
      notificationItemResponse.tokens = tokenList
      notificationItemResponsesList.push(notificationItemResponse)
    });
    
    if (paymentType !== 4) {
      NavigationService.navigate('Cart')
      NavigationService.navigate('Order')
    }
      if (paymentType !== 5 ) {
        if (paymentType !== 4) {
          showSimpleMessage("Şiparişiniz alındı en kısa sürede size iletilecektir","success",`Siparişiniz onaylandıktan sonra ${freePoints} puan kazanacaksınız puanlarınızı biriktirip bedava ürün kazanabilirsiniz.`)
    
        }
        else {
           showSimpleMessage("Şiparişiniz alındı en kısa sürede size iletilecektir. Ödeme ekranına yönlendiriliyorsunuz","success",`Siparişiniz onaylandıktan sonra ${freePoints} puan kazanacaksınız puanlarınızı biriktirip bedava ürün kazanabilirsiniz.`)
        }
          }else {
        showSimpleMessage("Şiparişiniz alındı en kısa sürede size iletilecektir","success")
      }
           
      let tmpEmployee = notificationItemResponsesList.find(e=> e.isOwner === false);
      let notificationInsertReponse: notificationInsertReponseModel = result.notificationInsertReponseModel
      if(notificationInsertReponse && notificationInsertReponse.message ) {
        console.log(tmpEmployee, "tmpEmployee")
        if(tmpEmployee) {
          const notificationService = new NotificationService(
            tmpEmployee.id,
            1,
            result.orderId,
            tmpEmployee.tokens,
          );
          console.log(notificationService.orderId,notificationService.toUserId,notificationService.tokenList)
          notificationService.sendPush(notificationInsertReponse.message, notificationInsertReponse.title);
          notificationService.addNotification();
        }
          
      }
        let tmpBase = notificationItemResponsesList.find(e => e.isOwner === true)
        console.log(tmpBase, "tmpBase")
        if(tmpBase) {
          const notificationServiceForBase = new NotificationService(
            global.STORE_OWNER_USER_ID,
            1,
            result.orderId,
            tmpBase.tokens,
          );
          console.log(paymentType, " paymenttt type")
            if (paymentType === 4) {
             let text = customerName
            ? `Müşteriniz ${customerName}'den hemen teslim edilmek üzere sipariş alındı `
            : 'Müşterinizden hemen teslim edilmek üzere sipariş alındı';
            let textUnder = tmpEmployee ? `Gelen sipariş ${tmpEmployee.name} adlı çalışana atandı. Kredi kartı ile sipariş alındı` : 
            "Hemen teslim edilmek üzere kredi kartı ile siparişiniz alındı."
            notificationServiceForBase.sendPush(textUnder, text);
            }else {
              let text = customerName
              ? `Müşteriniz ${customerName}'den hemen teslim edilmek üzere sipariş alındı`
              : 'Müşterinizden hemen teslim edilmek üzere sipariş alındı';
              let textUnder = tmpEmployee ? `Gelen sipariş ${tmpEmployee.name} adlı çalışana atandı` : 
              "Teslim edilmek üzere siparişiniz alındı."  
              notificationServiceForBase.sendPush(textUnder, text);
            }
        }

  }
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


export const paymentMethodChange = (index: number) => ({
  type: CHANGE_PAYMENT_METHODS,
  payload: index
})
export const isLoadingPaymentMethods = (loading: boolean) => ({
  type: PAYMENT_METHODS_LOADING,
  payload: loading,
});
export const PaymentMethodsGet = (list: PaymentMethod[]) => ({
  type: GET_PAYMENT_METHODS,
  payload: list,
});


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
