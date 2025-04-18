"use client";

import { useRouter } from 'next/navigation';

import { useReducer } from "react";

import BackLinkComponent from "@/components/BackLink";
import ButtonComponent from "@/components/Button";
import FooterAuthScreenComponent from "@/components/FooterAuthScreen";
import InputComponent from "@/components/Input";
import OAuth from "@/components/OAuth";
import { ROUTES } from '@/constants/routes-constants';
import { useI18n } from '@/hooks/useI18n'; 
import { supabase } from '@/libs/supabase/client';
import AuthService from '@/services/auth';
import { isValidEmail } from '@/utils/isValidEmail';

const initialState = {
  isLoading: false,
  inputValue: {
    email: "",
    password: "",
  },
  errors: {
    email: "",
    password: "",
    general: "",
  },
};

export type SignInStateType = typeof initialState;

export type SignInAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_INPUT_VALUE"; payload: { email?: string; password?: string } }
  | { type: "SET_ERRORS"; payload: { email?: string; password?: string; general?: string } };

function reducer(state: SignInStateType, action: SignInAction) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_INPUT_VALUE":
      return { ...state, inputValue: { ...state.inputValue, ...action.payload } };
    case "SET_ERRORS":
      return { ...state, errors: { ...state.errors, ...action.payload } };
    default:
      return state;
  }
}

export default function SignIn() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();
  const { translate } = useI18n("pages.signin");

  async function handleSignIn() {
      try {
          dispatch({ type: "SET_LOADING", payload: true });
          dispatch({ type: "SET_ERRORS", payload: { email: "", password: "", general: "" } });
  
          const isValidEmailResponse = isValidEmail(state.inputValue.email);
          const isPasswordValid = state.inputValue.password.length >= 6;
  
          if (!isValidEmailResponse || !isPasswordValid) {
              dispatch({
                  type: "SET_ERRORS",
                  payload: {
                      email: isValidEmailResponse ? "" : translate("errors.email"),
                      password: isPasswordValid ? "" : translate("errors.password"),
                  },
              });
              throw new Error("Validation Error");
          }
  
          const AuthServiceInstance = new AuthService(supabase);
          const response = await AuthServiceInstance.signIn(state.inputValue.email, state.inputValue.password);
  
          if (response?.id) {
              router.push(ROUTES.dashboard);
          } else {
              dispatch({ type: "SET_ERRORS", payload: { general: translate("errors.credentials") } });
          }
      } catch (err) {
          console.error("Error", err);
          if (err instanceof Error && err.message !== "Validation Error") {
              dispatch({ type: "SET_ERRORS", payload: { general: translate("errors.error") } });
          }
          dispatch({ type: "SET_LOADING", payload: false });
      }
  }

  return (
    <>
      <BackLinkComponent href={ROUTES.home} label={translate('actions.back')} />
      <h2 className="text-2xl font-semibold text-center text-gray-900">{translate('title')}</h2>
      <p className="text-center text-sm text-gray-600">{translate('description')}</p>
      <form
        className="mt-8 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSignIn();
        }}>
        <div>
          <InputComponent
            type="email"
            name="email"
            label={translate('inputs.email')}
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
            label={translate('inputs.password')}
            placeholder=""
            value={state.inputValue.password}
            onChange={(e) =>
              dispatch({ type: "SET_INPUT_VALUE", payload: { password: e.target.value } })
            }
          />
          {state.errors.password && (
            <p className="text-sm text-red-500 mt-1">{state.errors.password}</p>
          )}
        </div>

        <div className="text-right mt-0">
          <a href={ROUTES.forgotPassword} className="text-sm text-blue-600 hover:text-blue-800">
            {translate('actions.forgot-password')}
          </a>
        </div>

        {state.errors.general && (
          <p className="text-sm text-red-500 text-center mt-1">{state.errors.general}</p>
        )}

        <ButtonComponent isLoading={state.isLoading} type="submit" className="w-full">
          {translate('actions.submit')}
        </ButtonComponent>
      </form>
      <OAuth />
      <FooterAuthScreenComponent screen="signin" />
    </>
  );
}
