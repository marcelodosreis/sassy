export class NewPasswordBridge {
  async execute({ password }: { password: string }) {
    const response = await fetch("/api/v1/auth/new-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password,
      }),
    });

    const { response: jsonResponse } = await response.json();
  
    return jsonResponse;
  }
}
