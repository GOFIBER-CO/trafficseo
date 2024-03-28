import { checkAuth, signIn, signInWithGoogle, signUp } from "@/api/auth";
import { getInstance } from "@/helper/axios";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const initialValue = {
  user: {},
  accessToken: "",
};

export const AuthContext = createContext(initialValue);

const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState({
    _id: "657140606628a26f047168a3",
    username: "Quang DoanDuc",
    email: "doanducquangvw16@gmail.com",
    telegram: "@doanquang123",
    telegramId: "6882190953",
    online: false,
    avatar:
      "https://lh3.googleusercontent.com/a/ACg8ocIF_8EL9ewSfUYNQtU-Kjt56aWsiE3rifyZitiQ-aQ8=s96-c",
    cmnd: "",
    address: "",
    acceptPost: false,
    cardNumber: "",
    phoneNumber: "",
    postIdBlock: [],
    roleOfUser: {
      _id: "6448f54ae9437aa31191d165",
      name: "user",
      __v: 0,
      slug: "user",
    },
    team: [],
    isAgency: false,
    level: 0,
    point: 0,
    isActivated: true,
    isAccept: 1,
    isDeleted: false,
    isCheckIpLogin: false,
    ipLogin: "103.37.61.6",
    isMission: false,
    isEnable2FaAuthenticate: false,
    refernalUser: "tVsPEIrvc",
    referralCode: "s9NKwd7vf",
    createdAt: "2023-12-07T03:47:44.398Z",
    updatedAt: "2024-03-27T01:42:08.370Z",
    id: "657140606628a26f047168a3",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState();

  // useEffect(() => {
  //   getLoggedinUser();
  //   setToken(JSON.parse(localStorage.getItem("accessToken")));
  // }, []);

  const getLoggedinUser = async () => {
    // try {
    //   if (typeof window !== "undefined") {
    //     setIsLoading(true);
    //     const res = await checkAuth();
    //     setIsLoading(false);
    //     if (res.status === 1) {
    //       setUser(res.user);
    //       setToken(res.accessToken);
    //       if (typeof window !== "undefined") {
    //         localStorage.setItem(
    //           "accessToken",
    //           JSON.stringify(res.accessToken)
    //         );
    //         localStorage.setItem("authUser", JSON.stringify(res.user));
    //       }
    //     } else {
    //       if (typeof window !== "undefined") {
    //         localStorage.removeItem("accessToken");
    //         localStorage.removeItem("authUser");
    //       }
    //       setUser(undefined);
    //       setToken(undefined);
    //     }
    //   }
    // } catch (error) {
    //   if (typeof window !== "undefined") {
    //     localStorage.removeItem("accessToken");
    //     localStorage.removeItem("authUser");
    //   }
    //   setUser(undefined);
    //   setToken(undefined);
    // }
  };

  const login = async ({ email, password }) => {
    try {
      const res = await signIn({
        email,
        password,
      });
      if (res.status === 1) {
        setUser(res.user);
        setToken(res.accessToken);
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", JSON.stringify(res.accessToken));
          localStorage.setItem("authUser", JSON.stringify(res.user));
        }

        // router.push("/");
      } else {
        toast.error(res?.message || "Tài khoản của bạn đã bị khóa");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data);
    }
  };

  const register = async (data) => {
    try {
      const res = await signUp(data);
      if (res.status === 1) {
        toast.success("Đăng ký thành công");

        return router.push("/login");
      } else {
        return toast.error(res?.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const loginWithGoogle = async (idToken, referralCode = "") => {
    try {
      const res = await signInWithGoogle({
        tokenId: idToken,
        referralCode,
      });
      if (res.status === 1) {
        setUser(res.user);
        setToken(res.accessToken);
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", JSON.stringify(res.accessToken));
          localStorage.setItem("authUser", JSON.stringify(res.user));
        }

        // router.push("/");
      } else {
        return toast.error(res.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data);
    }
  };
  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("authUser");
    }
    setUser(undefined);
    setToken(undefined);
    router.replace("/");
  };
  const AuthContextData = {
    user,
    isLoading,
    token,
    login,
    loginWithGoogle,
    getLoggedinUser,
    logout,
    register,
  };
  return (
    <AuthContext.Provider value={AuthContextData}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
