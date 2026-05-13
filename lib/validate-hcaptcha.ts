/**
 * hCaptcha verification utility
 * Validates hCaptcha token server-side
 */

interface HCaptchaVerifyResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  score?: number;
  score_reason?: string;
  error_codes?: string[];
}

/**
 * Verify hCaptcha token with the hCaptcha API
 * @param token - The hCaptcha response token from client
 * @returns { valid: boolean, error?: string }
 */
export async function validateHCaptcha(
  token: string
): Promise<{ valid: boolean; error?: string }> {
  if (!token || token.trim().length === 0) {
    return { valid: false, error: 'hCaptcha token is empty' };
  }

  const secretKey = process.env.HCAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.error('HCAPTCHA_SECRET_KEY not set in environment');
    // In development without key, allow for testing
    if (process.env.NODE_ENV === 'development') {
      console.warn('Skipping hCaptcha verification in development mode');
      return { valid: true };
    }
    return { valid: false, error: 'Captcha verification unavailable' };
  }

  try {
    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }).toString(),
    });

    if (!response.ok) {
      return { valid: false, error: 'hCaptcha API error' };
    }

    const data = (await response.json()) as HCaptchaVerifyResponse;

    if (!data.success) {
      const errorMessage =
        data.error_codes?.join(', ') || 'hCaptcha verification failed';
      return { valid: false, error: errorMessage };
    }

    return { valid: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('hCaptcha verification error:', message);
    return {
      valid: false,
      error: `Verification error: ${message}`,
    };
  }
}
