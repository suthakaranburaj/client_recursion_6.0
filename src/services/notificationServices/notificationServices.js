// authServices.js
import { apiClient } from "../../helper/commonHelper.js";
import { NOTIFICATION } from "../index.js";
import { asyncHandler } from "../../helper/commonHelper.js";

export const get_current_notification_service = asyncHandler(async () => {
  const response = await apiClient.get(`${NOTIFICATION}/get`);
  // console.log(response);
    return response;
});

export const update_notification_service = asyncHandler(async (payload) => {
    return await apiClient.post(`${NOTIFICATION}/update`, payload);
  });
