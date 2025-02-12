"use client";

import { useSearchParams } from "next/navigation";

import { useReducer, useEffect } from "react";

import BackLinkComponent from "@/components/BackLink";
import ButtonComponent from "@/components/Button";
import InputComponent from "@/components/Input";
import PasswordStrengthIndicator from "@/components/PasswordStrength";
import { useI18n } from '@/hooks/useI18n';
import { supabase } from "@/libs/supabase/client";
import AuthService from "@/services/auth";

const initialState = {
    isLoading: false,
    isSuccess: false,
    tokenValue: "",
    tokenError: "",
    inputValue: {
        password: "",
        confirmPassword: "",
    },
    errors: {
        password: "",
        confirmPassword: "",
        general: "",
    },
};

export type NewPasswordStateType = typeof initialState;

export type NewPasswordAction =
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_INPUT_VALUE"; payload: { password?: string; confirmPassword?: string } }
    | { type: "SET_ERRORS"; payload: { password?: string; confirmPassword?: string; general?: string } }
    | { type: "SET_PASSWORD_CHANGED"; payload: boolean }
    | { type: "SET_TOKEN_VALUE"; payload: string }
    | { type: "SET_TOKEN_ERROR"; payload: string };

function reducer(state: NewPasswordStateType, action: NewPasswordAction) {
    switch (action.type) {
        case "SET_LOADING":
            return { ...state, isLoading: action.payload };
        case "SET_INPUT_VALUE":
            return { ...state, inputValue: { ...state.inputValue, ...action.payload } };
        case "SET_ERRORS":
            return { ...state, errors: { ...state.errors, ...action.payload } };
        case "SET_PASSWORD_CHANGED":
            return { ...state, isSuccess: action.payload };
        case "SET_TOKEN_VALUE":
            return { ...state, tokenValue: action.payload };
        case "SET_TOKEN_ERROR":
            return { ...state, tokenError: action.payload };
        default:
            return state;
    }
}

export default function NewPassword() {
    const { translate } = useI18n();
    const [state, dispatch] = useReducer(reducer, initialState);
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams?.get("code");
        if (!token) {
            dispatch({ type: "SET_TOKEN_ERROR", payload: translate("new-password-error-token-missing") });
        } else {
            dispatch({ type: "SET_TOKEN_VALUE", payload: token });
        }
    }, [searchParams]);

    async function handleNewPassword() {
        try {
            dispatch({ type: "SET_LOADING", payload: true });
            dispatch({ type: "SET_ERRORS", payload: { password: "", confirmPassword: "", general: "" } });

            const isPasswordValid = state.inputValue.password.length >= 6;
            const isPasswordsMatch = state.inputValue.password === state.inputValue.confirmPassword;

            if (!isPasswordValid || !isPasswordsMatch) {
                dispatch({
                    type: "SET_ERRORS",
                    payload: {
                        password: isPasswordValid ? "" : translate("new-password-error-password-valid"),
                        confirmPassword: isPasswordsMatch ? "" : translate("new-password-error-password-match"),
                    },
                });
                throw new Error("Validation Error");
            }

            const AuthServiceInstance = new AuthService(supabase);

            const response = await AuthServiceInstance.updatePassword(state.inputValue.password);

            if (response) {
                dispatch({ type: "SET_PASSWORD_CHANGED", payload: true });
            } else {
                dispatch({ type: "SET_ERRORS", payload: { general: translate("new-password-error-general") } });
            }
        } catch (err) {
            console.error("Error", err);
            if (err instanceof Error && err.message !== "Validation Error") {
                dispatch({ type: "SET_ERRORS", payload: { general: translate("new-password-error-unexpected") } });
            }
        } finally {
            dispatch({ type: "SET_LOADING", payload: false });
        }
    }

    return (
        <>
            {state.tokenError ? (
                <div className="text-center text-red-500">
                    <p>{state.tokenError}</p>
                </div>
            ) : state.isSuccess ? (
                <>
                    <BackLinkComponent href='/signin' label={translate("new-password-back-to-login")} />
                    <div className="text-center">
                        <p className="text-lg text-gray-700">{translate("new-password-success-message")}</p>
                    </div>
                </>
            ) : (
                <>
                    <h2 className="text-2xl font-semibold text-center text-gray-900">{translate("new-password-create-title")}</h2>
                    <p className="text-center text-sm text-gray-600">{translate("new-password-subtitle")}</p>
                    <form
                        className="mt-8 space-y-6"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleNewPassword();
                        }}>
                        <div>
                            <InputComponent
                                type="password"
                                name="password"
                                label={translate("new-password-password-label")}
                                placeholder=""
                                value={state.inputValue.password}
                                onChange={(e) =>
                                    dispatch({ type: "SET_INPUT_VALUE", payload: { password: e.target.value } })
                                }
                            />
                            <PasswordStrengthIndicator password={state.inputValue.password} />
                            {state.errors.password && (
                                <p className="text-sm text-red-500 mt-1">{state.errors.password}</p>
                            )}
                        </div>

                        <div>
                            <InputComponent
                                type="password"
                                name="confirmPassword"
                                label={translate("new-password-confirm-password-label")}
                                placeholder=""
                                value={state.inputValue.confirmPassword}
                                onChange={(e) =>
                                    dispatch({ type: "SET_INPUT_VALUE", payload: { confirmPassword: e.target.value } })
                                }
                            />
                            {state.errors.confirmPassword && (
                                <p className="text-sm text-red-500 mt-1">{state.errors.confirmPassword}</p>
                            )}
                        </div>

                        {state.errors.general && (
                            <p className="text-sm text-red-500 text-center mt-1">{state.errors.general}</p>
                        )}

                        <ButtonComponent isLoading={state.isLoading} type="submit" className="w-full">
                            {translate("new-password-submit-button")}
                        </ButtonComponent>
                    </form>
                </>
            )}
        </>
    );
}
