export const welcomeEmail = (email) => ({
    to: email,
    subject: 'Welcome to GolfCharity 🏌️',
    html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;
    background: #0f172a; color: #fff; padding: 40px; border-radius: 16px;">
      <h1 style="color: #4ade80; margin-bottom: 8px;">Welcome to GolfCharity</h1>
      <p style="color: #94a3b8;">You're now part of a community that plays golf
      and gives back.</p>
      <hr style="border-color: #1e293b; margin: 24px 0;">
      <p style="color: #94a3b8;">Here's how to get started:</p>
      <ol style="color: #94a3b8; line-height: 2;">
        <li>Subscribe to a plan</li>
        <li>Enter your last 5 golf scores</li>
        <li>Select a charity to support</li>
        <li>Wait for the monthly draw!</li>
      </ol>
      <a href="${process.env.CLIENT_URL}/dashboard"
      style="display: inline-block; margin-top: 24px; background: #4ade80;
      color: #000; font-weight: bold; padding: 12px 24px; border-radius: 8px;
      text-decoration: none;">
        Go to Dashboard
      </a>
    </div>
  `
})

export const drawResultsEmail = (email, draw, hasWon) => ({
    to: email,
    subject: hasWon
        ? '🎉 You won in this month\'s draw!'
        : 'This month\'s draw results are in',
    html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;
    background: #0f172a; color: #fff; padding: 40px; border-radius: 16px;">
      <h1 style="color: #4ade80;">
        ${hasWon ? '🎉 Congratulations!' : 'Draw Results'}
      </h1>
      <p style="color: #94a3b8;">
        ${hasWon
            ? 'You matched numbers in this month\'s draw!'
            : 'The monthly draw has been completed.'}
      </p>
      <div style="background: #1e293b; padding: 20px; border-radius: 12px;
      margin: 24px 0;">
        <p style="color: #94a3b8; margin: 0 0 8px;">Winning Numbers</p>
        <p style="color: #4ade80; font-size: 24px; font-weight: bold; margin: 0;">
          ${draw.drawn_numbers?.join(' · ')}
        </p>
      </div>
      ${hasWon ? `
        <p style="color: #94a3b8;">
          Log in to your dashboard to submit your proof and claim your prize.
        </p>
        <a href="${process.env.CLIENT_URL}/dashboard"
        style="display: inline-block; margin-top: 16px; background: #4ade80;
        color: #000; font-weight: bold; padding: 12px 24px; border-radius: 8px;
        text-decoration: none;">
          Claim Prize
        </a>
      ` : ''}
    </div>
  `
})

export const winnerVerifiedEmail = (email, amount) => ({
    to: email,
    subject: '✅ Your prize has been verified',
    html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;
    background: #0f172a; color: #fff; padding: 40px; border-radius: 16px;">
      <h1 style="color: #4ade80;">Prize Verified ✅</h1>
      <p style="color: #94a3b8;">
        Your prize of <strong style="color: #fff;">£${amount?.toFixed(2)}</strong>
        has been verified and will be processed shortly.
      </p>
      <p style="color: #94a3b8;">
        You'll receive another email once payment has been sent.
      </p>
    </div>
  `
})