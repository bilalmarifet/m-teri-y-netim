import axios from 'axios'
import {WATER_GET_NOTIFICATIONS, WATER_GET_CUSTOMER_ORDER_DETAIL,WATER_UPDATE_CUSTOMER_ORDER_STATUS, WATER_ADD_ORDER, WATER_GET_ORDER_LIST, WATER_GET_CUSTOMER_ORDER_DETAIL_NEW,WATER_ADD_CASH,WATER_UPDATE_CARBOY_COUNT, WATER_CANCEL_ORDER} from './../constants'
import { Dispatch } from "react";
import { GET_CUSTOMER_ORDER_DETAIL, GET_CUSTOMER_ORDER_DETAIL_LOADING, GET_CUSTOMER_ORDER_DETAIL_FAILED, UPDATE_ORDER_DETAIL, UPDATE_ORDER_DETAIL_LOADING, UPDATE_ORDER_DETAIL_FAILED, GET_CUSTOMER_ORDER_LIST_LOADING, GET_CUSTOMER_ORDER_LIST_FAILED, GET_CUSTOMER_ORDER_LIST, GET_CUSTOMER_ORDER_LIST_MORE, CANCEL_ORDER_LOADING} from './../types'
import {Action} from '../states'

import {AsyncStorage } from 'react-native'


import { navigate } from '../services/Navigator';
import { reset} from './loginAction';
import { addOrder, sendNotificationFromResponseData } from './addOrderAction';
import { getNotifications } from './notificationAction';
import { showMessage } from 'react-native-flash-message';
import { showSimpleMessage } from '../../components/showMessage';
import { NotificationService } from '../../services/NotificationService';
import NavigationService from '../../services/NavigationService';
import { GetOrders } from './orderAction';

export enum OrderStatus
    {
        null = "0",
        Waiting = "1",
        Exported ="2",
        Cannceled = "3",
        OnTheWay = "4"
    }
export interface orderDetail {
    orderId: number;
    displayTotalPrice: string;
    displayUnitPrice: string;
    count: string;
    customerName: string;
    customerAddress:string;
    customerPhoneNumber: string;
    transportationUserName: string;
    orderStatusText: string;
    productName: string;
    companyName: string;
    createdDate: string;
    orderStatus: OrderStatus;
    orderProducts :IOrderProductItem[];
    isPaid : boolean;
    description : string;
    carboyCount : number;
    customerId : number;
    totalPrice : number;
    paymentText: string;
    courierNameSurname: string;
    courierPhoneNumber: string;
    paymentType: number;

  }


      
export interface IOrderProductItem {
  productId: number;
  productName: string;
  unitPrice: string;
  count: number;
  totalPrice: string;
}




export interface orderListItem {

  orderId: number;
  displayTotalPrice: string;
  displayUnitPrice: string;
  count: string;
  customerName: string;
  transportationUserName: string;
  orderStatusText: string;
  productName: string;
  companyName: string;
  createdDate: string;
  orderStatus: OrderStatus;
}



export function updateCustomerOrderStatus(orderStatus : OrderStatus, orderId : number ,status : number | null, takebyUser :boolean | null) {
  return (dispatch : Any) =>  {
    dispatch(isLoadingStatusUpdate(true,''))
  AsyncStorage.multiGet(['userToken', 'userId']).then((res) => {
    let token = res[0][1];
    let userId = res[1][1];
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
  }
  axios.post(WATER_UPDATE_CUSTOMER_ORDER_STATUS,{
    orderStatus: orderStatus,
    orderId: orderId
  },{
      headers : headers
    }).then((response) =>{
      
  if(response.data.isSuccess){
    

     dispatch(updateOrderStatus("Sipariş Durumunuz Güncellendi."))
     dispatch(reset())
     dispatch(getCustomerOrderDetail(orderId))
     const hastotake: boolean = takebyUser ? true : false;
     dispatch(getCustomerOrders(hastotake,status))

    }else {
        dispatch(isLoadingStatusUpdate(false,"Sipariş durumunuz güncellenemedi daha sonra tekrar deneyim."))
        dispatch(reset())
    }
  })
  .catch(error => {   
    dispatch(isLoadingStatusUpdate(false,"Sipariş durumunuz güncellenemedi daha sonra tekrar deneyim."))
    dispatch(reset())
  });

}).catch(err=> {
  dispatch(isLoadingStatusUpdate(false,"Sipariş durumunuz güncellenemedi daha sonra tekrar deneyim."))
  dispatch(reset())
})


}

}


export function updateCarBoyOrGetPaid(IscarBoyUpdate : boolean , isGetPaidUpdate : boolean , carboyCount : number,paidAmount : number, orderId : number,customerId : number)  {
  return (dispatch : Any) =>  {
    // dispatch(isLoadingStatusUpdate(true,''))
  AsyncStorage.multiGet(['userToken', 'userId']).then((res) => {
    let token = res[0][1];
    let userId = res[1][1];
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
  }
 if(IscarBoyUpdate) {
  axios.post(WATER_UPDATE_CARBOY_COUNT,{
    customerId: customerId,
    carboyCount: carboyCount
  },{
      headers : headers
    }).then((response) =>{
      
  if(response.data.isSuccess){
    showMessage({
      message: "Emanet Damacana Sayısı Güncellendi",
      type:  "success",
      icon: "auto"
  }
  );
  dispatch(getCustomerOrderDetail(orderId))
    }else {
      showMessage({
        message: "Emanet Damacana Sayısı Güncellenemedi",
        type:  "danger",
        icon: "auto"
    }
    );
       
    }
  })
  .catch(error => {   
    showMessage({
      message: "Emanet Damacana Sayısı Güncellenemedi",
      type:  "danger",
      icon: "auto"
  }
  );
   
  });
 }
 if(isGetPaidUpdate) {
  axios.post(WATER_ADD_CASH,{
    orderId: orderId,
    amount: paidAmount
  },{
      headers : headers
    }).then((response) =>{
      
  if(response.data.isSuccess){

    showMessage({
      message: "Ödeme Alındı",
      type:  "success",
      icon: "auto"
  }
  );
  dispatch(getCustomerOrderDetail(orderId))
    }else {
      showMessage({
        message: "Ödeme Alınamadı",
        type:  "danger",
        icon: "auto"
    }
    );
       
    }
  })
  .catch(error => {   

    showMessage({
        message: "Ödeme Alınamadı",
        type:  "danger",
        icon: "auto"
    }
    );
  });
 }

}).catch(err=> {

})


}

}




export function cancelOrder(orderId: number,canceledUsername: string) {
  return (dispatch : Any) =>  {
    dispatch(cancelOrderLoading(true))
  AsyncStorage.multiGet(['userToken', 'userId']).then((res) => {
    let token = res[0][1];
    let userId = res[1][1];
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
  }
  axios.get(WATER_CANCEL_ORDER +`?orderId=${orderId}`,{
      headers : headers
    }).then((response) =>{
    console.log(orderId,response)
  if(response.data.isSuccess){
    let tokenItems: String[] = []
    if (response.data.result && response.data.result.length > 0) {
      response.data.result.forEach((element: String) => {
        tokenItems.push(element)
      });

      let notificationService = new NotificationService(0,1,orderId,tokenItems)
      notificationService.sendPush("Sipariş iptali",`Müşteriniz ${canceledUsername} siparişini iptal etti.`)
    }
    showSimpleMessage("Siparişiniz başarıyla iptal edildi.","success")
    dispatch(GetOrders(global.CUSTOMER_ID, 1, 10))
    NavigationService.navigate('Order')
    dispatch(cancelOrderLoading(false))

    }else {
      dispatch(cancelOrderLoading(false))
      showSimpleMessage("Siparişiniz işleme alındığı için iptal edilemez.","danger")
    }
  })
  .catch(error => {   
    dispatch(cancelOrderLoading(false))
    showSimpleMessage("Siparişiniz iptal edilemedi daha sonra tekrar deneyiniz.","danger")
  });

}).catch(err=> {
  dispatch(cancelOrderLoading(false))
  showSimpleMessage("Siparişiniz iptal edilemedi daha sonra tekrar deneyiniz.","danger")
})}}



export function getCustomerOrderForCheckingPaymentWithCreditCard(orderId : number,notificationResponse?:any,customerName?:string ) {
  return (dispatch : Any) =>  {
    AsyncStorage.multiGet(['userToken', 'userId']).then((res) => {
      let token = res[0][1];
      let userId = res[1][1];
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
    axios.get(WATER_GET_CUSTOMER_ORDER_DETAIL_NEW +`?orderId=${orderId}`,{
        headers : headers
      }).then((response) =>{
        console.log(response, "orderFromafterCardPaymentAfter")
    if(response.data.isSuccess){
      let isPaid = response.data.result.isPaid
      if (isPaid === true) {
          showSimpleMessage("Ödemeniz alındı en kısa sürede size iletilecektir","success")
      }
      }
      else {

      }
    })
    .catch(error => {   
    });

  }).catch(err=> {
  
  })
  

  }

}


export function getCustomerOrderDetail(orderId : number) {
    return (dispatch : Any) =>  {
        dispatch(isLoading(true,''))
      AsyncStorage.multiGet(['userToken', 'userId']).then((res) => {
        let token = res[0][1];
        let userId = res[1][1];
        
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      }
      axios.get(WATER_GET_CUSTOMER_ORDER_DETAIL_NEW +`?orderId=${orderId}`,{
          headers : headers
        }).then((response) =>{
        console.log(response)
        var orderDetail = {} as orderDetail

          var count = 0
      if(response.data.isSuccess){
         let data = response.data.result
         console.log(data,"orderDetayLog")
         orderDetail.companyName = data.companyName;
         orderDetail.count = data.count;
         orderDetail.createdDate = data.createdDate;
         orderDetail.customerAddress = data.customerAddress;
         orderDetail.customerName = data.customerName;
         orderDetail.customerPhoneNumber = data.customerPhoneNumber;
         orderDetail.displayTotalPrice = data.displayTotalPrice;
        orderDetail.displayUnitPrice = data.displayUnitPrice;
        orderDetail.orderId = data.orderId;
        orderDetail.orderStatus = data.orderStatus;
        orderDetail.orderStatusText = data.orderStatusText;
        orderDetail.productName = data.productName;
        orderDetail.transportationUserName = data.transportationUserName;
        orderDetail.isPaid = data.isPaid;
        orderDetail.carboyCount = data.carboyCount;
        orderDetail.description = data.description;
        orderDetail.customerId = data.customerId;
        orderDetail.totalPrice = data.totalPrice;
        orderDetail.paymentText = data.paymentText;
        orderDetail.courierNameSurname = data.courierNameSurname;
        orderDetail.courierPhoneNumber = data.courierPhoneNumber ? (data.courierPhoneNumber.length === 10) ? "0" + data.courierPhoneNumber : data.courierPhoneNumber : ""
        orderDetail.paymentType = data.paymentType;
        var orderProducts : IOrderProductItem[] = [] as IOrderProductItem[];

        data.orderProductItems.map((item:any)=>{
          orderProducts.push({
            count:item.count,
            productId:item.productId,
            productName:item.productName,
            totalPrice:item.totalPrice,
            unitPrice:item.unitPrice
          });
        });
        orderDetail.orderProducts=orderProducts;

         dispatch(getDetail(orderDetail))
         dispatch(reset())
        }else {
            dispatch(isLoading(false,"Sipariş listelenirken bir hata oluştu."))
            dispatch(reset())
        }
      })
      .catch(error => {   
        dispatch(isLoading(false,"Sipariş listelenirken bir hata oluştu."))
        dispatch(reset())
      });
  
    }).catch(err=> {
      dispatch(isLoading(false,"Sipariş listelenirken bir hata oluştu."))
      dispatch(reset())
    })
    
  
    }
  
  }




  

  export function getCustomerOrders(hasToTake:boolean, status:number | null, page? : number) {
    return (dispatch : Any) =>  {
        dispatch(isLoadingOrderList(true,''))
      AsyncStorage.multiGet(['userToken', 'userId']).then((res) => {
        let token = res[0][1];
        let userId = res[1][1];
        
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      }
      console.log(WATER_GET_ORDER_LIST + `?userId=${userId}&page=${page ? page : 1}&pageSize=15&hasToTransport=${hasToTake}&status=${status}`);
      axios.get(WATER_GET_ORDER_LIST + `?userId=${userId}&page=${page ? page : 1}&pageSize=15&hasToTransport=${hasToTake}&status=${status}`,{
          headers : headers
        }).then((response) =>{
          
        var orderList : orderListItem[] = [] 


      if(response.data.isSuccess){
        console.log(response.data.result)
        response.data.result.forEach(element  => {
          orderList.push({
          
    orderId: element.orderId,
    displayTotalPrice: element.displayTotalPrice,
    displayUnitPrice: element.displayUnitPrice,
    count: element.count,
    customerName: element.customerName,
    transportationUserName: element.transportationUserName,
    orderStatusText: element.orderStatusText,
    productName: element.productName,
    companyName: element.companyName,
    createdDate: element.createdDate,
    orderStatus: element.orderStatus,
          })
        });
          if(page){

            dispatch(getOrderListMore(orderList))
            dispatch(reset())
          }
          else {
            dispatch(getOrderList(orderList))
            dispatch(reset())
          }
        
        
        }else {
            dispatch(isLoadingOrderList(false,"Sipariş listelenirken bir hata oluştu."))
            dispatch(reset())
        }
      })
      .catch(error => {   
        dispatch(isLoadingOrderList(false,"Sipariş listelenirken bir hata oluştu."))
        dispatch(reset())
      });
  
    }).catch(err=> {
      dispatch(isLoadingOrderList(false,"Sipariş listelenirken bir hata oluştu."))
      dispatch(reset())
    })
    
  
    }
  
  }




export const isLoadingOrderList = (loading : boolean, message : string) => ({
  type : loading  ? GET_CUSTOMER_ORDER_LIST_LOADING : GET_CUSTOMER_ORDER_LIST_FAILED,
  payload : message
})

export const getOrderListMore = (orderList : orderListItem[]) => ({
  type : GET_CUSTOMER_ORDER_LIST_MORE,
  payload : orderList
})



export const getOrderList = (orderList : orderListItem[]) => ({
  type : GET_CUSTOMER_ORDER_LIST,
  payload : orderList
})


export const isLoading = (loading : boolean,message : string) => ({
  type : loading ? GET_CUSTOMER_ORDER_DETAIL_LOADING : GET_CUSTOMER_ORDER_DETAIL_FAILED,
  payload: message
})


export const getDetail = (orderDetail : orderDetail) => ({
    type : GET_CUSTOMER_ORDER_DETAIL,
    payload : orderDetail
})


export const isLoadingStatusUpdate  = (loading : boolean, message : string ) => ({ 
  type : loading ? UPDATE_ORDER_DETAIL_LOADING : UPDATE_ORDER_DETAIL_FAILED,
  paylaod : message
})

export const updateOrderStatus = (message : string) => ({
  type : UPDATE_ORDER_DETAIL,
  payload : message
})


export const cancelOrderLoading = (loader : boolean) => ({
  type : CANCEL_ORDER_LOADING,
  payload : loader
})