export const useSignIn = () => {
  const handleLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
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

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {}
  };

  return { handleLogin };
};
