import { message } from "antd";

export const success = () => {
   message.success("Thành công");
 };
 
 export const error = () => {
   message.error("Có lỗi xảy ra. Vui lòng thử lại!");
 };