export class SignInBridge {
  async execute({ email, password }: { email: string; password: string }) {
    const response = await fetch("/api/v1/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const { response: jsonResponse } = await response.json();
  
    return jsonResponse;
  }
}
