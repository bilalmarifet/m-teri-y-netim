import { showMessage, MessageType } from "react-native-flash-message";

export function showSimpleMessage(content : string, type : MessageType,secondMessage?: string)  {
    showMessage({
        message: content,
        description: secondMessage,
        icon : type,
        type: type,

      });
}