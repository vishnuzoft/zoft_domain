import { environment } from "../config";

export const setCommonQueryParams = (params: any) => {
    return {
      version: environment.API_VERSION,
      type: environment.API_TYPE,
      key: environment.API_KEY,
      ...params
    };
  }