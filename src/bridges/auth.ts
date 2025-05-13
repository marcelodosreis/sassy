export default class AuthBridge {
  constructor() {}

  async signIn({ email, password }: { email: string; password: string }) {
    const response = await fetch("/api/v1/auth/signIn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const jsonResponse = await response.json();

    console.log("[DEBUG]", jsonResponse);
  }
}
