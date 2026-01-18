/**
 * Email template for OTP verification codes
 * This template should be used in Supabase Dashboard > Authentication > Email Templates
 * 
 * Instructions:
 * 1. Go to Supabase Dashboard
 * 2. Navigate to Authentication > Email Templates
 * 3. Select "Magic Link" or "OTP" template
 * 4. Replace the HTML content with the output from generateOtpEmailTemplate()
 * 5. Use {{ .Token }} for the OTP code (Supabase variable)
 */

export const generateOtpEmailTemplate = () => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Code</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: #ffffff;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #6366f1;
            margin-bottom: 10px;
        }
        .title {
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #6b7280;
            font-size: 16px;
        }
        .otp-container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
            position: relative;
        }
        .otp-label {
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #ffffff;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
            background-color: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 8px;
            display: inline-block;
            user-select: all;
            -webkit-user-select: all;
            -moz-user-select: all;
            -ms-user-select: all;
            cursor: text;
            margin: 10px 0;
        }
        .copy-hint {
            color: rgba(255, 255, 255, 0.8);
            font-size: 12px;
            margin-top: 10px;
        }
        .copy-button {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background-color: rgba(255, 255, 255, 0.2);
            color: #ffffff;
            padding: 10px 20px;
            border-radius: 6px;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            margin-top: 15px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            transition: background-color 0.2s;
        }
        .copy-button:hover {
            background-color: rgba(255, 255, 255, 0.3);
        }
        .info-box {
            background-color: #f3f4f6;
            border-left: 4px solid #6366f1;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .info-text {
            color: #4b5563;
            font-size: 14px;
            margin: 5px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #9ca3af;
            font-size: 12px;
        }
        .button {
            display: inline-block;
            background-color: #6366f1;
            color: #ffffff;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 500;
            margin-top: 20px;
        }
        @media only screen and (max-width: 600px) {
            .container {
                padding: 20px;
            }
            .otp-code {
                font-size: 28px;
                letter-spacing: 4px;
                padding: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Bexprot</div>
            <div class="title">Verification Code</div>
            <div class="subtitle">Enter this code to verify your account</div>
        </div>

        <div class="otp-container">
            <div class="otp-label">Your Verification Code</div>
            <div class="otp-code" onclick="this.select(); document.execCommand('copy');" title="Click to copy">{{ .Token }}</div>
            <div class="copy-hint">👆 Click the code above to copy it</div>
            <a href="#" class="copy-button" onclick="navigator.clipboard.writeText('{{ .Token }}'); return false;">
                📋 Copy Code
            </a>
        </div>

        <div class="info-box">
            <div class="info-text"><strong>⏱️ Expires in:</strong> 10 minutes</div>
            <div class="info-text"><strong>🔒 Security:</strong> Never share this code with anyone</div>
            <div class="info-text"><strong>❓ Didn't request this?</strong> You can safely ignore this email</div>
        </div>

        <div style="text-align: center;">
            <a href="{{ .ConfirmationURL }}" class="button">Verify Account</a>
        </div>

        <div class="footer">
            <p>This is an automated message from Bexprot.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <p style="margin-top: 10px;">© 2024 Bexprot. All rights reserved.</p>
        </div>
    </div>

    <script>
        // Fallback copy functionality for older browsers
        document.addEventListener('DOMContentLoaded', function() {
            const otpCode = document.querySelector('.otp-code');
            if (otpCode) {
                otpCode.addEventListener('click', function() {
                    const text = this.textContent.trim();
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(text).then(function() {
                            alert('Code copied to clipboard!');
                        });
                    } else {
                        // Fallback for older browsers
                        const textArea = document.createElement('textarea');
                        textArea.value = text;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        alert('Code copied to clipboard!');
                    }
                });
            }
        });
    </script>
</body>
</html>
  `.trim();
};

/**
 * Plain text version for email clients that don't support HTML
 */
export const generateOtpEmailText = () => {
  return `
Bexprot - Verification Code

Your verification code is: {{ .Token }}

This code expires in 10 minutes.

Enter this code in the verification page to complete your registration/login.

If you didn't request this code, please ignore this email.

© 2024 Bexprot. All rights reserved.
  `.trim();
};

