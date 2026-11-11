# Júlia · 1 aninho — RSVP

A static RSVP page (GitHub Pages). Each confirmation is saved to the Google Sheet
**"Confirmações – Aniversário Júlia (1 aninho)"** through a small Apps Script.

```
index.html            the page guests see
julia.jpg             photo used at the bottom
apps-script/Code.gs   receiver that writes rows into the Sheet
```

## 1. Connect the Sheet (about 3 min)

1. Open the Sheet → **Extensions → Apps Script**.
2. Delete the sample code, paste the contents of `apps-script/Code.gs`, then save.
3. **Deploy → New deployment** → gear icon → **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Authorize it. When Google says "unverified app", click **Advanced → Go to …**. This is your own script.
5. Copy the **Web app URL**. It ends in `/exec`.

## 2. Point the page at it

In `index.html`, find this line and paste the URL in:

```js
const SCRIPT_URL = 'PASTE_YOUR_APPS_SCRIPT_URL_HERE';
```

## 3. Publish on GitHub Pages

1. Create a public repo (for example `julia-1-aninho`) and push these files to `main`.
2. Go to **Settings → Pages** → Source: *Deploy from a branch* → `main` / `(root)`.
3. Wait about 1 minute. The site will be at `https://<user>.github.io/julia-1-aninho/`.

To use your own subdomain, add a `CNAME` file containing e.g. `julia.yourdomain.com`
and create a DNS CNAME record pointing to `<user>.github.io`.

## Notes

- **If you edit `Code.gs` later**, go to Deploy → Manage deployments → edit → *New version*.
  That keeps the same URL.
- The summary in J1:K4 counts confirmed families, adults and kids.
- To download a spreadsheet file: **File → Download → Microsoft Excel (.xlsx)**.
- The repo is public, so anyone who finds it can see the photo. To remove it, delete
  `julia.jpg` and the `<img class="photo">` line.
