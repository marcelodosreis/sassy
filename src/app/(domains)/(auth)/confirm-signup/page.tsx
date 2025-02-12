"use client";

import { useEffect, useReducer } from "react";

import BackLink from "@/components/BackLink";
import Spinner from "@/components/Spinner";
import { useI18n } from '@/hooks/useI18n';
import { supabase } from "@/libs/supabase/client";
import AuthService from "@/services/auth";

type State = {
    isLoading: boolean;
    error: string | null;
    isConfirmed: boolean;
    isConfirmedOAuh: boolean;
};

export type ConfirmSignupAction =
    | { type: "CONFIRMATION_OAUTH" }
    | { type: "CONFIRMATION_SUCCESS" }
    | { type: "CONFIRMATION_FAILURE"; error: string }
    | { type: "SET_LOADING"; isLoading: boolean };

function confirmationReducer(state: State, action: ConfirmSignupAction): State {
    switch (action.type) {
        case "CONFIRMATION_SUCCESS":
            return { ...state, isLoading: false, isConfirmed: true, isConfirmedOAuh: true, error: null };
        case "CONFIRMATION_OAUTH":
            return { ...state, isLoading: false, isConfirmed: false, isConfirmedOAuh: true, error: null };
        case "CONFIRMATION_FAILURE":
            return { ...state, isLoading: false, isConfirmed: false, isConfirmedOAuh: true, error: action.error };
        case "SET_LOADING":
            return { ...state, isLoading: action.isLoading };
        default:
            return state;
    }
}

export default function ConfirmSignUp() {
    const { translate } = useI18n();
    const [state, dispatch] = useReducer(confirmationReducer, {
        isLoading: true,
        error: null,
        isConfirmed: false,
        isConfirmedOAuh: false,
    });

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get("token");
        const oauth = queryParams.get("oauth");

        if (token) {
            handleConfirmSignup(token);
        } else if (!token && oauth) {
            dispatch({ type: "CONFIRMATION_OAUTH" });
        } else {
            dispatch({ type: "CONFIRMATION_FAILURE", error: translate("confirm-signup-error-token-missing") });
        }
    }, []);

    async function handleConfirmSignup(token: string) {
        dispatch({ type: "SET_LOADING", isLoading: true });
        const AuthServiceInstance = new AuthService(supabase);

        try {
            const response = await AuthServiceInstance.confirmEmail(token, 'signup');
            if (response?.id) {
                dispatch({ type: "CONFIRMATION_SUCCESS" });
            } else {
                throw new Error(translate("confirm-signup-error-failed"));
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                dispatch({ type: "CONFIRMATION_FAILURE", error: error.message });
            } else {
                dispatch({ type: "CONFIRMATION_FAILURE", error: translate("confirm-signup-error-unexpected") });
            }
        }
    };

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
    const { translate } = useI18n();
    return (
        <>
            <BackLink href='/signin' label={translate("confirm-signup-back-to-login")} />
            <h2 className="text-2xl font-semibold text-center text-gray-900">{translate("confirm-signup-email-confirmed")}</h2>
            <p className="text-center text-sm text-gray-600">{translate("confirm-signup-success-message")}</p>
        </>
    );
};

const ConfirmationOAuthMessage = () => {
    const { translate } = useI18n();
    return (
        <>
            <BackLink href='/dashboard' label={translate("confirm-signup-go-to-dashboard")} />
            <h2 className="text-2xl font-semibold text-center text-gray-900">{translate("confirm-signup-oauth-success")}</h2>
            <p className="text-center text-sm text-gray-600">{translate("confirm-signup-oauth-success-message")}</p>
        </>
    );
};
