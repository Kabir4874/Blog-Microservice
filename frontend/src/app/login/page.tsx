"use client";

import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppData, user_service } from "@/context/AppContext";
import { CodeResponse, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import toast from "react-hot-toast";

type ErrorResponse = Pick<
  CodeResponse,
  "error" | "error_description" | "error_uri"
>;

type ExtractState<S> = S extends Dispatch<SetStateAction<infer T>> ? T : never;

interface LoginResponse<TUser> {
  token: string;
  message: string;
  user: TUser;
}

const LoginPage = () => {
  const { isAuth, loading, setIsAuth, setLoading, setUser } = useAppData();
  type AppUser = ExtractState<typeof setUser>;

  const router = useRouter();

  const onGoogleSuccess = async (res: CodeResponse) => {
    setLoading(true);
    try {
      const result = await axios.post<LoginResponse<AppUser>>(
        `${user_service}/api/v1/login`,
        { code: res.code }
      );

      Cookies.set("token", result.data.token, {
        expires: 5,
        secure: true,
        path: "/",
      });

      toast.success(result.data.message);
      setUser(result.data.user);
      setIsAuth(true);
    } catch (error) {
      console.error("Login exchange failed:", error);
      toast.error("Problem while logging in with Google");
    } finally {
      setLoading(false);
    }
  };

  const onGoogleError = (err: ErrorResponse) => {
    console.error("Google login failed:", err);
    const msg =
      err.error_description ||
      err.error ||
      "Problem while logging in with Google";
    toast.error(msg);
  };

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: onGoogleSuccess,
    onError: onGoogleError,
  });

  // Client-side redirect when authenticated
  useEffect(() => {
    if (isAuth) {
      router.replace("/");
    }
  }, [isAuth, router]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="w-[350px] m-auto mt-[200px]">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                Login To The Readers Hub
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={googleLogin} disabled={loading}>
                Login With Google{" "}
                <Image
                  src={"/google.webp"}
                  width={24}
                  height={24}
                  alt="google icon"
                  className="ml-2"
                />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default LoginPage;
