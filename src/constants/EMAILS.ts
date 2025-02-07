export const FINISH_CHECKOUT_EMAIL = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="color: #4A90E2; text-align: center;">Welcome to Sassy! 🎉</h2>
    <p>Hello,</p>
    <p>We are thrilled to have you with us! Your subscription to the <strong style="text-transform: uppercase; font-weight: bold;">{plan}</strong> plan has been successfully activated.</p>
    <p>Enjoy all the powerful features Sassy has to offer. If you have any questions, feel free to reach out.</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="https://sassy-hazel.vercel.app/dashboard/subscription" style="background-color: #4A90E2; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
        Go to Dashboard
      </a>
    </div>
    <p>Thank you for choosing Sassy!</p>
    <p style="color: #888;">— The Sassy Team</p>
  </div>
`