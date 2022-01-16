import { UserData, UserPatchData } from "./types";
import { fetchGetData, init, validateString } from "api/utils";

const baseUrl = `${process.env.REACT_APP_API_URL}/users`;

export const fetchAllUsers = async () => {
  return await fetchGetData({
    url: baseUrl,
  });
};

export const fetchUser = async (userId: string) => {
  validateString(userId, 'userId')
  return await fetchGetData({
    url: `${baseUrl}/${userId}`,
  });
};

export const fetchUserFromAuthId = async (authId: string) => {
  validateString(authId, 'authId')
  return await fetchGetData({
    url: `${baseUrl}?authId=${authId}`,
  });
};

export const fetchCreateUser = async (authId: string) => {
  //authId is the id given by auth service provider
  validateString(authId, 'authId')
  const user = await fetchUserFromAuthId(authId)
  console.log('user from authId', user)
  if (user !== null) {
    return
  }
  return await fetchGetData({
    url         : baseUrl,
    initParams  : init("POST", { authId }),
  });
};

export const fetchUpdateUserPUT = async (userId: string, userData: UserData) => {
  validateString(userId, 'userId')
  return await fetchGetData({
    url         : `${baseUrl}/${userId}`,
    initParams  : init("PUT", userData),
  });
};

export const fetchUpdateUserPATCH = async (userId: string, userPatchData: UserPatchData) => {
  validateString(userId, 'userId')
  return await fetchGetData({
    url         : `${baseUrl}/${userId}`,
    initParams  : init("PATCH", userPatchData),
  });
};

export const fetchDeleteUser = async (userId: string) => {
  validateString(userId, 'userId')
  return await fetchGetData({
    url         : `${baseUrl}/${userId}`,
    initParams  : init("DELETE"),
  });
};

//***********************************************************
//**********************   FOLLOWING   **********************
//***********************************************************

export const fetchAddFollowedToUser = async (userId: string, followedId: string) => {
  validateString(userId, 'userId')
  validateString(followedId, 'followedId')
  return await fetchGetData({
    url         : `${baseUrl}/${userId}/following`,
    initParams  : init("POST", { followedId }),
  });
}

export const fetchDeleteFollowedFromUser = async (userId: string, followedId: string) => {
  validateString(userId, 'userId')
  validateString(followedId, 'followedId')
  return await fetchGetData({
    url         : `${baseUrl}/${userId}/following`,
    initParams  : init("DELETE", { followedId }),
  });
}
