// authServices.js
import { apiClient } from "../../helper/commonHelper.js";
import { TRANSACTION } from "../index.js";
import { asyncHandler } from "../../helper/commonHelper.js";


  export const add_transaction_service = asyncHandler(async (payload) => {
    const response = await apiClient.post(`${TRANSACTION}/add_t`, payload);
    return response;
  });

