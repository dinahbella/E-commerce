export const getResetPasswordToken = (user, resetUrl) => {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Password Reset</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            padding: 30px;
            color: #333;
          }
          .container {
            background-color: #ffffff;
            padding: 40px;
            max-width: 600px;
            margin: auto;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #eaeaea;
          }
          .button {
            display: inline-block;
            background-color: #007bff;
            color: #ffffff;
            padding: 12px 20px;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 20px;
          }
          .footer {
            margin-top: 30px;
            font-size: 0.9em;
            color: #888;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>We received a request to reset your password. Click the button below to proceed:</p>
          <p style="text-align: center;">
            <a class="button" href="${resetUrl}" target="_blank">Reset Password</a>
          </p>
          <p>If you did not make this request, you can safely ignore this email.</p>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;
};
