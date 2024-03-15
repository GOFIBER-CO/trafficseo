const { getInstance, getInstanceCheckAuth } = require("@/helper/axios");

export const signIn = async ({ email, password }) => {
  const res = await getInstanceCheckAuth().post("/api/v1/users/login", {
    email,
    password,
  });
  return res?.data;
};

export const signUp = async (data) => {
  const res = await getInstanceCheckAuth().post("/api/v1/users/sign-up", data);
  return res?.data;
};
export const signInWithGoogle = async ({ tokenId, referralCode }) => {
  const res = await getInstanceCheckAuth().post(
    "/api/v1/users/loginWithGoogle",
    {
      tokenId,
      referralCode,
    }
  );
  return res?.data;
};

export const checkAuth = async () => {
  const res = await getInstanceCheckAuth().get("/api/v1/users/authStatus");

  return res?.data;
};

export const startMission = async () => {
  const res = await getInstance().put("/api/v1/users/startMission");

  return res?.data;
};
export const stopMission = async () => {
  const res = await getInstance().put("/api/v1/users/stopMission");

  return res?.data;
};
