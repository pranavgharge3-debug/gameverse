export async function sendPasswordResetEmail(email: string, token: string) {
  // Placeholder for email service integration.
  // In production, connect to SMTP or email delivery provider to send reset links.
  console.info(`Password reset requested for ${email}: token=${token}`);
}
