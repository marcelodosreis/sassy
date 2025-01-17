"use client";

import { useSearchParams } from "next/navigation";

import { useReducer, useEffect } from "react";

import BackLinkComponent from "@/components/BackLink";
import ButtonComponent from "@/components/Button";
import InputComponent from "@/components/Input";
import PasswordStrengthIndicator from "@/components/PasswordStrength";
import { supabase } from "@/libs/supabase/client";
import SupabaseService from "@/services/supabase";

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
    const [state, dispatch] = useReducer(reducer, initialState);
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams?.get("code");
        if (!token) {
            dispatch({ type: "SET_TOKEN_ERROR", payload: "Invalid or missing token." });
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
                        password: isPasswordValid ? "" : "Password must be at least 6 characters long.",
                        confirmPassword: isPasswordsMatch ? "" : "Passwords do not match.",
                    },
                });
                throw new Error("Validation Error");
            }
    
            const SupabaseServiceInstance = new SupabaseService(supabase);
    
            const response = await SupabaseServiceInstance.newPassword(state.inputValue.password);
    
            if (response) {
                dispatch({ type: "SET_PASSWORD_CHANGED", payload: true });
            } else {
                dispatch({ type: "SET_ERRORS", payload: { general: "Failed to change the password. Please try again." } });
            }
        } catch (err) {
            console.log("Error", err);
            if (err instanceof Error && err.message !== "Validation Error") {
                dispatch({ type: "SET_ERRORS", payload: { general: "Something went wrong. Please try again." } });
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
                    <BackLinkComponent href='/signin' label='Back To Login' />
                    <div className="text-center">
                        <p className="text-lg text-gray-700">Your password has been changed successfully!</p>
                    </div>
                </>
            ) : (
                <>
                    <h2 className="text-2xl font-semibold text-center text-gray-900">Create a New Password</h2>
                    <p className="text-center text-sm text-gray-600">Set your new password to continue</p>
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
                                label="Password"
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
                                label="Confirm Password"
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
                            Change Password
                        </ButtonComponent>
                    </form>
                </>
            )}
        </>
    );
}
