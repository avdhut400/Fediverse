## Ngrok Setup (Required for Federation)

ActivityPub federation requires a public HTTPS URL.  
We use ngrok to expose the local server.

Install ngrok  
https://ngrok.com/download  

Start backend server  
cd backend  
npm run dev  

In a new terminal, run:  
ngrok http 4000  

Copy the HTTPS URL provided by ngrok  
Example: https://abcd1234.ngrok.io  

Update your .env file:

BASE_URL=https://abcd1234.ngrok.io  

⚠️ Note: Do not use localhost for ActivityPub actor URLs.  
Always use the ngrok public HTTPS URL.

---

## Federation Guidelines (Important)

- Always use HTTPS public URL for ActivityPub endpoints.
- Do not change BASE_URL while federation is active.
- Restart the backend after every ngrok URL change.
- All actor, inbox, outbox, and follower URLs are generated using BASE_URL.
- Do not mix localhost and ngrok URLs in the same database.

If BASE_URL changes:
- Clear existing remote followers
- Re-register actor URLs
- Restart federation flow.

---

## Common Federation Mistakes

- Using http instead of https.
- Using localhost in actor URLs.
- Changing ngrok URL without restarting server.
- Storing mixed public and local URLs in database.
- Not restarting Mastodon follow after BASE_URL change.

---

## Federation Tested With

- Mastodon (remote follow tested)
- WebFinger resolution verified
- Inbox follow handling verified
- Accept activity successfully delivered
