// authServices.js
import { apiClient } from "../../helper/commonHelper.js";
import { GOAL } from "../index.js";
import { asyncHandler } from "../../helper/commonHelper.js";

export const get_goal_service = asyncHandler(async () => {
  const response = await apiClient.get(`${GOAL}/get`);
  return response;
});

export const add_goal_service = asyncHandler(async (payload) => {
  return await apiClient.post(`${GOAL}/add`, payload);
});