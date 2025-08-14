export class GetMeBridge {
  async execute() {
    const response = await fetch("/api/v1/me", {
      method: "get",
      headers: { "Content-Type": "application/json" }
    });

    const jsonResponse = await response.json();
    return jsonResponse;
  }
}
