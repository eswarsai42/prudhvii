# EmailJS setup for the Wedding Time Capsule

Nothing here is pre-configured. You must create these three values yourself in the EmailJS dashboard
and put them in `.env.local` (and in Vercel → Settings → Environment Variables):

| Variable | Where to find it in EmailJS |
|---|---|
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | Account → General → Public Key |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | Email Services → your Gmail/SMTP service → Service ID |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | Email Templates → your template → Template ID |

(The EmailJS public key is designed to be public. Never put your Gmail password or SMTP credentials in the project.)

## Template settings (Email Templates → Create New Template)
- **To Email:** `prudhvikaharshi@gmail.com`  ← typed directly into the template, not a `{{variable}}`. The website never sends a recipient, so visitors cannot change it.
- **Subject:** `❤️ A New Wedding Blessing Has Arrived for Prudhvi & Harshitha!`
- **From Name:** `Wedding Blessings`
- **Content:** switch to the code editor and paste `emailjs/blessing-template.html`.
- Variables the site sends: `guest_name`, `relationship`, `wedding_wish`, `submission_date`.

## Security
- Account → Security: restrict allowed domains/origins to your live site if your plan offers it.
- Turn on EmailJS's own reCAPTCHA / rate limits if available. The site also blocks double clicks, uses a hidden spam trap, and limits each browser to 3 blessings per hour.
- Check your plan's monthly email quota.

## Test before launch
1. `npm run dev`, open the Time Capsule, send one blessing.
2. Confirm it arrives in prudhvikaharshi@gmail.com with name, relationship and the full wish (check Spam too).
3. Click "Seal your blessing" repeatedly: only one email should arrive.
4. Turn off Wi-Fi and send: you should see the friendly error, and your text should stay in the letter.
