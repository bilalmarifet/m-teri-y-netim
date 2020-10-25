import {AsyncStorage} from "react-native";
import axios from 'axios'
import { WATER_INSERT_NOTIFICATION } from "../redux/constants";



export class NotificationService {


    toUserId: number;
    type: number;
    orderId: number;
    tokenList: string[];


    constructor(toUserId: number, type: number, orderId: number, tokenList: string[]) {


        this.toUserId = toUserId;
        this.type = type;
        this.orderId = orderId;
        this.tokenList = tokenList;
    }


    async sendPush(message1 :string , title : string) {
        const serverKey = 'AAAAzC9koMY:APA91bEKgkLOnm43vVaHm39k9yYJyyMORID-AuigbBrz2MTm5vgm2HhQj0BtKJXfUAtGJete0Q1VglaXabdBG1BddCgrrI7LDuI0dXpGp__TiP-zEFpTogPBswd1H2_7XNwhaDeHa9wQ';
        const FIREBASE_API_KEY = serverKey;
        const message = {
            registration_ids: this.tokenList,
            notification: {
                title: title,
                body: message1,
                "vibrate": 1,
                "sound": 1,
                "show_in_foreground": true,
                "priority": "high",
                "content_available": true,
            },
            data: {
                orderId :this.orderId,
                score: 50,
                wicket: 1,
            }
        }

        let headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": "key=" + FIREBASE_API_KEY
        });

        fetch("https://fcm.googleapis.com/fcm/send", { method: "POST", headers, body: JSON.stringify(message) })
    }



    addNotification() {



        AsyncStorage.multiGet(['userToken', 'userId']).then((res) => {
            let token = res[0][1];
            let userId = res[1][1];

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            console.log("addNotification")
            axios.post(WATER_INSERT_NOTIFICATION,
                {
                    orderId: this.orderId,
                    userId: this.toUserId,
                    notificationType: this.type,
                    fromUserId: userId

                }, {
                headers: headers
            })
                .then((response) => {
                    console.log("addNotification",response)
                    // if (response.data.isSuccess) {
                    //     if (response.data.result) {
                    //         let data = response.data.result;
                    //         this.sendPush(data.message, data.title);


                    //     }
                    // }
                })
                .catch(error => {
                    console.log("addNotification",error)
                });

        }).catch(err => {
            console.log("addNotification",err)
        })





    }
}