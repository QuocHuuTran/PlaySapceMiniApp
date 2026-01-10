import React, { useEffect, useRef, useState } from "react";
import {
  openWebview,
  closeApp,
  getRouteParams,
  getAccessToken,
  getPhoneNumber,
  getSetting,
  authorize,
  getUserInfo,
  login,
  followOA,
  showOAWidget,
  events,
} from "zmp-sdk/apis";
import { Button, Page, Spinner, Text } from "zmp-ui";
import background from "@/static/bg.svg";
export default function HomePage() {
  const isCalled = useRef(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Khi người dùng bấm Back từ Webview, Mini App sẽ Visible trở lại
      if (document.visibilityState === "visible" && isCalled.current) {
        // TẮT LOADING để hiển thị giao diện Logo/Button của Mini App
        setLoading(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    const handleAppShow = () => {
      if (isCalled.current) {
        closeApp();
      }
    };
    events.on("appShow", handleAppShow);
    const initApp = async () => {
      try {
        const { authSetting } = await getSetting();
        const hasUserInfo = authSetting["scope.userInfo"];
        const hasPhone = authSetting["scope.userPhonenumber"];
        if (!hasUserInfo && !hasPhone) {
          await authorize({
            scopes: ["scope.userInfo", "scope.userPhonenumber"],
          });
        }
        const token = await getAccessToken();
        const tokenPhone = await getPhoneNumber();
        const phone = tokenPhone.token;
        if (token && phone) {
          sessionStorage.setItem("zalo_token", token);
          sessionStorage.setItem("zalo_token_phone", phone);
        }
        const params = await getRouteParams();
        const code = params?.code;
        let finalPath = "";
        if (code) {
          finalPath = `s/${code}`;
          sessionStorage.setItem("launch_path", finalPath);
        }
        const targetUrl = finalPath
          ? `https://b.datlich.net/${finalPath}?tokenName=${token}&tokenPhone=${phone}`
          : `https://b.datlich.net?tokenName=${token}&tokenPhone=${phone}`;
          console.log("hhh", targetUrl)
        openWebview({
          url: targetUrl,
          config: { style: "normal" },
          fail: (err) => {
            console.error("Mở webview thất bại:", err);
            closeApp();
            setLoading(false);
          },
        });
      } catch (error) {
        console.error("Lỗi khởi tạo:", error);
        closeApp();
      }
    };
    
    if (!isCalled.current) {
      initApp();
      isCalled.current = true;
    }
   
    return () => {
      events.off("appShow", handleAppShow);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const openBooking = () => {
    
    const tokenZalo = sessionStorage.getItem("zalo_token");
    const tokenPhone = sessionStorage.getItem("zalo_token_phone");
    const url = `https://b.datlich.net?tokenName=${tokenZalo}&tokenPhone=${tokenPhone}`;
    openWebview({
      url,
      config: { style: "normal" },
    });
  };
  const logoUrl = "https://app.playspace.vn/playspace_assets/img/PlaySpace.png";
  if (loading) {
    return (
      <Page
        className="flex items-center justify-center h-screen"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover", // Phủ kín màn hình
          backgroundPosition: "center", // Căn giữa ảnh
          backgroundRepeat: "no-repeat",
        }}
      >
        <Spinner />
      </Page>
    );
  }
  return (
    <Page
      className="flex flex-col items-center justify-center h-screen space-y-4 text-center"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover", // Phủ kín màn hình
        backgroundPosition: "center", // Căn giữa ảnh
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="px-16 py-4">
        <img src={logoUrl} alt="Logo" />
      </div>
      <div className="flex flex-col space-y-2 w-full px-8">
        <Button className="bg-green-600" onClick={openBooking} fullWidth>
          Mở ứng dụng
        </Button>

        <Button variant="secondary" onClick={() => closeApp()} fullWidth>
          Thoát
        </Button>
      </div>
    </Page>
  );
}
