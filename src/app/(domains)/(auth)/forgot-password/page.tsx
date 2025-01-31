"use client";

import { useReducer } from "react";

import BackLinkComponent from "@/components/BackLink";
import ButtonComponent from "@/components/Button";
import InputComponent from "@/components/Input";
import { useI18n } from "@/hooks/useI18n";
import { supabase } from "@/libs/supabase/client";
import SupabaseService from "@/services/supabase";
import { isValidEmail } from "@/utils/isValidEmail";

const initialState = {
    isLoading: false,
    isSuccess: false,
    inputValue: {
        email: "",
    },
    errors: {
        email: "",
        general: "",
    },
};

export type ForgotPasswordStateType = typeof initialState;

export type ForgotPasswordAction =
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_INPUT_VALUE"; payload: { email?: string } }
    | { type: "SET_ERRORS"; payload: { email?: string; general?: string } }
    | { type: "SET_SUCCESS"; payload: boolean };

function reducer(state: ForgotPasswordStateType, action: ForgotPasswordAction) {
    switch (action.type) {
        case "SET_LOADING":
            return { ...state, isLoading: action.payload };
        case "SET_INPUT_VALUE":
            return { ...state, inputValue: { ...state.inputValue, ...action.payload } };
        case "SET_ERRORS":
            return { ...state, errors: { ...state.errors, ...action.payload } };
        case "SET_SUCCESS":
            return { ...state, isSuccess: action.payload };
        default:
            return state;
    }
}

export default function ForgotPassword() {
    const { translate } = useI18n();
    const [state, dispatch] = useReducer(reducer, initialState);

    async function handleForgotPassword() {
        try {
            dispatch({ type: "SET_LOADING", payload: true });
            dispatch({ type: "SET_ERRORS", payload: { email: "", general: "" } });

            const isValidEmailResponse = isValidEmail(state.inputValue.email);

            if (!isValidEmailResponse) {
                dispatch({
                    type: "SET_ERRORS",
                    payload: {
                        email: translate("forgot-password-invalid-email"),
                    },
                });
                throw new Error("Validation Error");
            }

            const SupabaseServiceInstance = new SupabaseService(supabase);
            const response = await SupabaseServiceInstance.forgotPassword(state.inputValue.email);

            if (response) {
                dispatch({ type: "SET_SUCCESS", payload: true });
            } else {
                dispatch({ type: "SET_ERRORS", payload: { general: translate("forgot-password-general-error") } });
            }
        } catch (err) {
            if (err instanceof Error && err.message !== "Validation Error") {
                dispatch({ type: "SET_ERRORS", payload: { general: translate("forgot-password-general-error") } });
            }
        } finally {
            dispatch({ type: "SET_LOADING", payload: false });
        }
    }

    if (state.isSuccess) {
        return (
            <>
                <BackLinkComponent href='/signin' label={translate("forgot-password-back-to-login")} />
                <h2 className="text-2xl font-semibold text-center text-gray-900">{translate("forgot-password-check-inbox-title")}</h2>
                <p className="text-center text-sm text-gray-600">{translate("forgot-password-check-inbox-description")}</p>
            </>
        );
    }

    return (
        <>
            <BackLinkComponent href='/signin' label={translate("forgot-password-back-to-login")} />
            <h2 className="text-2xl font-semibold text-center text-gray-900">{translate("forgot-password-title")}</h2>
            <p className="text-center text-sm text-gray-600">{translate("forgot-password-description")}</p>
            <form
                className="mt-8 space-y-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleForgotPassword();
                }}>
                <div>
                    <InputComponent
                        type="email"
                        name="email"
                        label={translate("forgot-password-email-label")}
                        placeholder={translate("forgot-password-email-placeholder")}
                        value={state.inputValue.email}
                        onChange={(e) =>
                            dispatch({ type: "SET_INPUT_VALUE", payload: { email: e.target.value } })
                        }
                    />
                    {state.errors.email && (
                        <p className="text-sm text-red-500 mt-1">{state.errors.email}</p>
                    )}
                </div>

                {state.errors.general && (
                    <p className="text-sm text-red-500 text-center mt-1">{state.errors.general}</p>
                )}

                <ButtonComponent isLoading={state.isLoading} type="submit" className="w-full">
                    {translate("forgot-password-button-text")}
                </ButtonComponent>
            </form>
        </>
    );
}
