"use client";

import { useReducer } from "react";

import BackLinkComponent from "@/components/BackLink";
import ButtonComponent from "@/components/Button";
import FooterAuthScreenComponent from "@/components/FooterAuthScreen";
import InputComponent from "@/components/Input";
import OAuth from "@/components/OAuth";
import PasswordStrengthIndicator from "@/components/PasswordStrength";
import { useI18n } from '@/hooks/useI18n';
import { supabase } from "@/libs/supabase/client";
import SupabaseService from "@/services/supabase";
import { isValidEmail } from "@/utils/isValidEmail";

const initialState = {
  isLoading: false,
  isTermsAccepted: false,
  isRegistrationComplete: false,
  inputValue: {
    email: "",
    password: "",
    confirmPassword: "",
  },
  errors: {
    email: "",
    password: "",
    confirmPassword: "",
    terms: "",
    general: "",
  },
};

export type SignUpStateType = typeof initialState;

export type SignUpAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_INPUT_VALUE"; payload: { email?: string; password?: string; confirmPassword?: string } }
  | { type: "SET_ERRORS"; payload: { email?: string; password?: string; confirmPassword?: string; general?: string; terms?: string } }
  | { type: "SET_TERMS_ACCEPTED"; payload: boolean }
  | { type: "SET_REGISTRATION_COMPLETE"; payload: boolean };

function reducer(state: SignUpStateType, action: SignUpAction) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_INPUT_VALUE":
      return { ...state, inputValue: { ...state.inputValue, ...action.payload } };
    case "SET_ERRORS":
      return { ...state, errors: { ...state.errors, ...action.payload } };
    case "SET_TERMS_ACCEPTED":
      return { ...state, isTermsAccepted: action.payload };
    case "SET_REGISTRATION_COMPLETE":
      return { ...state, isRegistrationComplete: action.payload };
    default:
      return state;
  }
}

export default function SignUp() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { translate } = useI18n("pages.signup");

  async function handleSignUp() {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERRORS", payload: { email: "", password: "", confirmPassword: "", general: "", terms: "" } });

      const isValidEmailResponse = isValidEmail(state.inputValue.email);
      const isPasswordValid = state.inputValue.password.length >= 6;
      const isPasswordsMatch = state.inputValue.password === state.inputValue.confirmPassword;

      if (!isValidEmailResponse || !isPasswordValid || !isPasswordsMatch) {
        dispatch({
          type: "SET_ERRORS",
          payload: {
            email: isValidEmailResponse ? "" : translate("errors.email"),
            password: isPasswordValid ? "" : translate("errors.password"),
            confirmPassword: isPasswordsMatch ? "" : translate("errors.confirm-password"),
          },
        });
      }

      if (!state.isTermsAccepted) {
        dispatch({
          type: "SET_ERRORS",
          payload: { terms: translate("errors.terms") },
        });
        throw new Error("Terms not accepted");
      }

      const SupabaseServiceInstance = new SupabaseService(supabase);
      const response = await SupabaseServiceInstance.signUp(state.inputValue.email, state.inputValue.password);

      if (response?.id) {
        dispatch({ type: "SET_REGISTRATION_COMPLETE", payload: true });
      } else {
        dispatch({ type: "SET_ERRORS", payload: { general: translate("general-error") } });
      }
    } catch (err) {
      console.error("Error", err);
      if (err instanceof Error && err.message !== "Validation Error" && err.message !== "Terms not accepted") {
        dispatch({ type: "SET_ERRORS", payload: { general: translate("errors.error") } });
      }
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  return (
    <>
      {state.isRegistrationComplete ? (
        <>
          <BackLinkComponent href='/signin' label={translate("back-to-login")} />
          <div className="text-center">
            <p className="text-lg text-gray-700">{translate("actions.success")}</p>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold text-center text-gray-900">{translate("title")}</h2>
          <p className="text-center text-sm text-gray-600">{translate("description")}</p>
          <form
            className="mt-8 space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSignUp();
            }}>

            <div>
              <InputComponent
                type="email"
                name="email"
                label={translate("inputs.email")}
                placeholder=""
                value={state.inputValue.email}
                onChange={(e) =>
                  dispatch({ type: "SET_INPUT_VALUE", payload: { email: e.target.value } })
                }
              />
              {state.errors.email && (
                <p className="text-sm text-red-500 mt-1">{state.errors.email}</p>
              )}
            </div>

            <div>
              <InputComponent
                type="password"
                name="password"
                label={translate("inputs.password")}
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
                label={translate("inputs.confirm-password")}
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

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={state.isTermsAccepted}
                onChange={(e) =>
                  dispatch({ type: "SET_TERMS_ACCEPTED", payload: e.target.checked })
                }
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                {translate("inputs.terms")}
              </label>
            </div>
            {state.errors.terms && (
              <p className="text-sm text-red-500 mt-1">{state.errors.terms}</p>
            )}

            <ButtonComponent isLoading={state.isLoading} type="submit" className="w-full">
              {translate("actions.submit")}
            </ButtonComponent>
          </form>
        </>
      )}
      <OAuth />
      <FooterAuthScreenComponent screen="signup" />
    </>
  );
}
