"use client";

import { useRouter } from "next/navigation";

import { useEffect, useReducer } from "react";

import BackLink from "@/components/v1/BackLink";
import Spinner from "@/components/v1/Spinner";
import { useI18n } from "@/contexts/i18nContext";

type State = {
  isLoading: boolean;
  error: string | null;
};

const initialState: State = {
  isLoading: true,
  error: null,
};

type ConfirmSignupAction =
  | { type: "SUCCESS" }
  | { type: "FAILURE"; error: string }
  | { type: "SET_LOADING"; isLoading: boolean };

function reducer(state: State, action: ConfirmSignupAction): State {
  switch (action.type) {
    case "SUCCESS":
      return { ...state, isLoading: false, error: null };
    case "FAILURE":
      return { ...state, isLoading: false, error: action.error };
    case "SET_LOADING":
      return { ...state, isLoading: action.isLoading };
    default:
      return state;
  }
}

export default function ConfirmSignUp() {
  const { translate } = useI18n("pages.confirm-signup");
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");
    const code = queryParams.get("code");

    if (token) {
      handleConfirmEmail(token);
    } else if (code) {
      handleOAuthCode(code);
    } else {
      dispatch({
        type: "FAILURE",
        error: translate("errors.missing-token"),
      });
    }
  }, []);

  async function handleConfirmEmail(token: string) {
    dispatch({ type: "SET_LOADING", isLoading: true });
    try {
      const res = await fetch("/api/v1/auth/confirm-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const { response, error } = await res.json();
      if (error) throw new Error(error);
      if (response?.id) {
        dispatch({ type: "SUCCESS" });
        router.push("/dashboard");
      } else {
        throw new Error(translate("errors.failed"));
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        dispatch({ type: "FAILURE", error: err.message });
      } else {
        dispatch({ type: "FAILURE", error: translate("errors.unexpected") });
      }
    }
  }

  async function handleOAuthCode(code: string) {
    dispatch({ type: "SET_LOADING", isLoading: true });
    try {
      const res = await fetch("/api/v1/auth/oauth/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const { error } = await res.json();
      if (error) throw new Error(error);
      dispatch({ type: "SUCCESS" });
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        dispatch({ type: "FAILURE", error: err.message });
      } else {
        dispatch({ type: "FAILURE", error: translate("errors.unexpected") });
      }
    }
  }

  const { isLoading, error } = state;

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <SuccessMessage />
      )}
    </>
  );
}

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="text-red-600">
    <h2 className="text-2xl font-semibold text-center">{message}</h2>
  </div>
);

const SuccessMessage = () => {
  const { translate } = useI18n("pages.confirm-signup");
  return (
    <>
      <BackLink href="/dashboard" label={translate("actions.dashboard")} />
      <h2 className="text-2xl font-semibold text-center text-gray-900">
        {translate("messages.success.title")}
      </h2>
      <p className="text-center text-sm text-gray-600">
        {translate("messages.success.description")}
      </p>
    </>
  );
};
