"use client";

import { useEffect, useReducer } from "react";

import { ConfirmSignUpBridge } from "@/bridges/confirm-signup";
import BackLink from "@/components/v1/BackLink";
import Spinner from "@/components/v1/Spinner";
import { useI18n } from "@/contexts/i18nContext";

type State = {
  isLoading: boolean;
  error: string | null;
  isConfirmed: boolean;
  isConfirmedOAuh: boolean;
};

const initialState: State = {
  isLoading: true,
  error: null,
  isConfirmed: false,
  isConfirmedOAuh: false,
};

export type ConfirmSignupAction =
  | { type: "CONFIRMATION_OAUTH" }
  | { type: "CONFIRMATION_SUCCESS" }
  | { type: "CONFIRMATION_FAILURE"; error: string }
  | { type: "SET_LOADING"; isLoading: boolean };

function confirmationReducer(state: State, action: ConfirmSignupAction): State {
  switch (action.type) {
    case "CONFIRMATION_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isConfirmed: true,
        isConfirmedOAuh: true,
        error: null,
      };
    case "CONFIRMATION_OAUTH":
      return {
        ...state,
        isLoading: false,
        isConfirmed: false,
        isConfirmedOAuh: true,
        error: null,
      };
    case "CONFIRMATION_FAILURE":
      return {
        ...state,
        isLoading: false,
        isConfirmed: false,
        isConfirmedOAuh: true,
        error: action.error,
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.isLoading };
    default:
      return state;
  }
}

export default function ConfirmSignUp() {
  const { translate } = useI18n("pages.confirm-signup");
  const [state, dispatch] = useReducer(confirmationReducer, initialState);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");
    const oauth = queryParams.get("oauth");

    if (token) {
      handleConfirmSignup(token);
    } else if (!token && oauth) {
      dispatch({ type: "CONFIRMATION_OAUTH" });
    } else {
      dispatch({
        type: "CONFIRMATION_FAILURE",
        error: translate("errors.missing-token"),
      });
    }
  }, []);

  async function handleConfirmSignup(token: string) {
    dispatch({ type: "SET_LOADING", isLoading: true });
    const confirmSignUpBridge = new ConfirmSignUpBridge();

    try {
      const response = await confirmSignUpBridge.execute({ token });
      if (response?.id) {
        dispatch({ type: "CONFIRMATION_SUCCESS" });
      } else {
        throw new Error(translate("errors.failed"));
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        dispatch({ type: "CONFIRMATION_FAILURE", error: error.message });
      } else {
        dispatch({
          type: "CONFIRMATION_FAILURE",
          error: translate("errors.unexpected"),
        });
      }
    }
  }

  const { isLoading, error, isConfirmed, isConfirmedOAuh } = state;

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : isConfirmed ? (
        <ConfirmationMessage />
      ) : isConfirmedOAuh ? (
        <ConfirmationOAuthMessage />
      ) : null}
    </>
  );
}

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="text-red-600">
    <h2 className="text-2xl font-semibold text-center">{message}</h2>
  </div>
);

const ConfirmationMessage = () => {
  const { translate } = useI18n("pages.confirm-signup");
  return (
    <>
      <BackLink href="/dashboard" label={translate("actions.dashboard")} />
      <h2 className="text-2xl font-semibold text-center text-gray-900">
        {translate("messages.email.title")}
      </h2>
      <p className="text-center text-sm text-gray-600">
        {translate("messages.email.description")}
      </p>
    </>
  );
};

const ConfirmationOAuthMessage = () => {
  const { translate } = useI18n("pages.confirm-signup");
  return (
    <>
      <BackLink href="/dashboard" label={translate("actions.dashboard")} />
      <h2 className="text-2xl font-semibold text-center text-gray-900">
        {translate("messages.oauth.title")}
      </h2>
      <p className="text-center text-sm text-gray-600">
        {translate("messages.oauth.description")}
      </p>
    </>
  );
};
