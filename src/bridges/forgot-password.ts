export class ForgotPasswordBridge {
  async execute({ email }: { email: string }) {
    const response = await fetch("/api/v1/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
      }),
    });

    const { response: jsonResponse } = await response.json();
  
    return jsonResponse;
  }
}
