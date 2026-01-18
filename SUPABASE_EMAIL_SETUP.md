# Supabase Email Template Setup Guide

## Overview

This guide explains how to set up custom email templates in Supabase to send OTP verification codes with a copy-to-clipboard feature.

## Step 1: Access Supabase Dashboard

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** > **Email Templates**

## Step 2: Configure OTP Email Template

1. In the Email Templates section, you'll see several template types:

   - **Magic Link** (used for OTP codes)
   - **Change Email Address**
   - **Reset Password**
   - etc.

2. Click on **Magic Link** template (this is used for OTP verification)

3. You'll see two tabs:
   - **Subject**: Email subject line
   - **Body**: Email body content

## Step 3: Set Email Subject

In the **Subject** field, enter:

```
Your Bexprot Verification Code
```

## Step 4: Set Email Body (HTML)

In the **Body** field, paste the following HTML template:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verification Code</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          "Helvetica Neue", Arial, sans-serif;
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
        font-family: "Courier New", monospace;
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
        <div
          class="otp-code"
          onclick="navigator.clipboard.writeText('{{ .Token }}'); alert('Code copied!');"
          title="Click to copy"
        >
          {{ .Token }}
        </div>
        <div class="copy-hint">
          👆 Click the code above to copy it to clipboard
        </div>
      </div>

      <div class="info-box">
        <div class="info-text"><strong>⏱️ Expires in:</strong> 10 minutes</div>
        <div class="info-text">
          <strong>🔒 Security:</strong> Never share this code with anyone
        </div>
        <div class="info-text">
          <strong>❓ Didn't request this?</strong> You can safely ignore this
          email
        </div>
      </div>

      <div class="footer">
        <p>This is an automated message from Bexprot.</p>
        <p>If you didn't request this code, please ignore this email.</p>
        <p style="margin-top: 10px;">© 2024 Bexprot. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
```

## Step 5: Important Variables

Supabase provides these variables you can use in templates:

- `{{ .Token }}` - The 6-digit OTP code
- `{{ .Email }}` - User's email address
- `{{ .SiteURL }}` - Your site URL
- `{{ .ConfirmationURL }}` - Confirmation URL (if applicable)

## Step 6: Test the Template

1. Click **Save** to save your template
2. Test by registering a new user or requesting a login code
3. Check your email to verify:
   - The OTP code is displayed clearly
   - The code is selectable/copyable
   - The styling looks correct

## Notes

- **JavaScript in emails**: Most email clients don't support JavaScript, so the `onclick` copy functionality may not work in all email clients. However, the code will be selectable, and users can manually copy it.
- **Mobile clients**: The template is responsive and will look good on mobile devices.
- **Fallback**: If JavaScript doesn't work, users can still select and copy the code manually.

## Alternative: Plain Text Version

If you prefer a plain text version, you can use:

```
Bexprot - Verification Code

Your verification code is: {{ .Token }}

This code expires in 10 minutes.

Enter this code in the verification page to complete your registration/login.

If you didn't request this code, please ignore this email.

© 2024 Bexprot. All rights reserved.
```

## Troubleshooting

- **Code not showing**: Make sure you're using `{{ .Token }}` exactly as shown (with spaces)
- **Styling issues**: Some email clients strip CSS. Test in multiple email clients.
- **Copy not working**: This is expected in most email clients. Users can manually select and copy the code.
