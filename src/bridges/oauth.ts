export class OAuthBridge {
  async execute(provider: 'google' | 'facebook' | 'twitter') {
    const response = await fetch('/api/v1/auth/oauth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider }),
    });

    const data = await response.json();
    return data;
  }
}
