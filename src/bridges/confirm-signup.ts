export class ConfirmSignUpBridge {
  async execute({ token }: { token: string }) {
    const response = await fetch("/api/v1/auth/confirm-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
      }),
    });

    const { response: jsonResponse } = await response.json();
  
    return jsonResponse;
  }
}
