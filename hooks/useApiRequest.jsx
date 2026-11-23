"use client";
import { useLocale } from "next-intl";

import { axiosInstance } from "@/axiosConfig";
import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";
import { setTokens } from "@/services/authService";
import usePersistData from "@/hooks/usePersistData";

const useApiRequest = () => {
  const { redirectTo, showToast } = useGlobalActions();
  const { removePersistentData } = usePersistData();
  const locale = useLocale();

  const refreshTokens = async () => {
    /**
     * post refresh token to refresh authentication tokens
     * It does not take any parameters.
     * @return {void}
     */
    try {
      const response = await axiosInstance.post("/auth/refresh/", {
        refresh: localStorage.getItem("refresh_token"),
      });
      if (response.status === 200) {
        const { access, refresh } = response.data;
        setTokens(access, refresh);
        window.location.reload();
      }
    } catch (error) {
      if (error.response) {
        redirectTo(`/${locale}/auth/login`);
        localStorage.setItem("auth_status", "false");
        removePersistentData();
      } else {
        showToast("system");
      }
    }
  };

  const makeRequest = async (
    config,
    onSuccess,
    onBadRequest = () => {},
    onServerError = () => {},
    onNotFound = () => {},
    headers = {},
  ) => {
    /**
     * make api call according to given configs and headers and then execute onSuccess or onBadRequest or onServerError
     * @param {Object} config ex: { method: "GET", url: "/endpoint" }
     * @param {Function} onSuccess
     * @param {Function} onBadRequest
     * @param {Function} onServerError
     * @param {Object} headers
     * @return {void}
     */
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await axiosInstance({
        ...config,
        headers: {
          ...axiosInstance.defaults.headers,
          Authorization: `Bearer ${accessToken}`,
          ...headers,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        onSuccess(response.data);
      }
    } catch (error) {
      if (error.response) {
        const { status } = error.response;

        if (status === 401) {
          await refreshTokens();
        } else if (status === 400) {
          onBadRequest(error.response.data);
        } else if (status === 404) {
          onNotFound();
        }
        if (status >= 500 && status < 600) {
          showToast("system");
          onServerError();
        }
      } else {
        onServerError();
        showToast("system");
      }
    }
  };

  return { makeRequest };
};

export default useApiRequest;
