# AI Usage Log

This file is my diary of the AI conversations I used while doing the CRUD assignment. I mostly asked for **explanations, small examples and code reviews**, then typed and adapted the code myself, because the teacher said every line has to be explainable during the oral check.

Tools I used: ChatGPT (mostly) and Gemini (a couple of questions about Tailwind).

**How I used the answers**

- I never pasted a whole file from the AI into the project. I asked for one small piece at a time.
- I tested every suggestion in the browser with the Console open and with `npm run build`.
- When the AI suggested something that the assignment forbids (zod, react-hook-form, `any`, `window.confirm()`, `alert()`), I did not use it.
- For the API questions I checked the answers with `curl` / `Invoke-RestMethod` against my own json-server before trusting them.

---

## 1. Setting up the project

**My question:** "What is the correct way to create a React + TypeScript project with Vite in 2026, and how should I run it?"

**Summary of the answer:** Use `npm create vite@latest` with the `react-ts` template, then `npm install` and `npm run dev`. The AI also explained the difference between the dev server and the production build (`npm run build` + `npm run preview`).

**What I learned / changed:** It worked, but the template only had `src/App.tsx`, so I had to create the folder structure (`components`, `layouts`, `pages`, `services`, `utils`, `types`) myself. The AI suggested putting pages directly in `src/`, which would not match the assignment, so I moved them into `pages/`.

## 2. Tailwind CSS installation (the AI gave me the old version)

**My question:** "How do I install Tailwind CSS in Vite?"

**Summary of the answer:** The AI gave me the Tailwind v3 steps: install `tailwindcss postcss autoprefixer`, run `npx tailwindcss init -p`, create `tailwind.config.js`, add `@tailwind base; @tailwind components; @tailwind utilities;` to the CSS.

**What I learned / changed:** My `npm install tailwindcss` installed **v4**, and the v4 docs say to use the `@tailwindcss/vite` plugin and only `@import "tailwindcss";` in the CSS — no `tailwind.config.js` and no `postcss.config.js`. I deleted the config files the AI told me to create and followed the v4 style. Lesson: check the installed version before copying a tutorial.

## 3. Running json-server

**My question:** "How do I run json-server with a database in `server/db.json` on port 4000 and keep the file updated?"

**Summary of the answer:** `npx json-server --watch server/db.json --port 4000`. The AI said `--watch` is needed so the API reloads when the file changes.

**What I learned / changed:** My installed version (json-server `1.0.0-beta.15`) does not accept `--watch` — it printed the help text with only `-p`, `-h` and `-s`. I removed the flag and used `json-server --port 4000 server/db.json`. I tested a `POST` and `DELETE` and json-server wrote the changes into `server/db.json` by itself, so the "watch" part was not needed.

## 4. axios instance and the services folder

**My question:** "Where should I create the axios instance so that components do not call axios directly, and how do I handle errors?"

**Summary of the answer:** Create `src/services/api.ts` with `axios.create({ baseURL })`, export it, and put one function per endpoint in `eventsService.ts`. For errors, check `axios.isAxiosError(error)` and look at `error.response`.

**What I learned / changed:** I used the idea, but the AI's example used `error.response.data` and showed it directly in the UI. That gave ugly messages like `{ error: "Not Found" }`. I wrote two helpers instead:

- `getApiErrorMessage()` – one friendly message when there is no response ("Cannot reach the API server. Make sure json-server is running...") and a different one for 404 and for other status codes.
- `isNotFoundError()` – used by the detail and edit pages to show the "Event not found" screen instead of a generic error.

I tested the network message by stopping json-server on purpose.

## 5. One form component for create and edit

**My question:** "How should I share the form between the create page and the edit page?"

**Summary of the answer:** The AI recommended `react-hook-form` with a zod schema, because "it removes all the boilerplate".

**What I learned / changed:** The assignment does not allow zod or react-hook-form, so I ignored that part. I kept only the props idea: `EventForm` receives `mode` (`'create' | 'edit'`), `initialValues`, `submitLabel`, `isSubmitting`, `cancelTo` and `onSubmit`. The create page passes empty values, the edit page passes `eventToFormValues(event)` from the API. The date rule is the only thing that changes with `mode`.

## 6. Validating when leaving a field

**My question:** "How do I show validation errors when the user leaves an input, not only when they press submit?"

**Summary of the answer:** The AI's first version validated only in `onSubmit` and stored the errors in state. When I asked again it suggested a `touched` object and validating on `onBlur`.

**What I learned / changed:** I used a `touched` object (`Partial<Record<EventFormField, boolean>>`) plus `hasSubmitted`. I also changed how errors are kept: instead of storing them in state, I call `validateEvent(values, mode)` on every render and only **show** an error if the field was touched or the form was submitted. That way an error disappears immediately when I fix the field. I checked it manually: 0 error messages before blur, 1 after leaving the name field with "abc".

## 7. One validate function in `utils/`

**My question:** "How do I write a validate function that returns an object of errors and is used by both pages?"

**Summary of the answer:** Return `Partial<Record<field, string>>`, add one `if` per rule, and keep the messages short. The AI also suggested separating the rules into many small functions.

**What I learned / changed:** I kept one exported function, `validateEvent(values, mode)`, exactly as the assignment asks, but I extracted two tiny helpers inside the file (`isValidHttpUrl`, plus the date helpers in `utils/date.ts`). The type `EventFormErrors` is in `types/form.ts`. For the URL rule the AI first gave me a long regular expression; I replaced it with `new URL(value)` inside `try/catch` and checked `http:` / `https:`, which is easier for me to explain.

## 8. The "no past date" rule (a bug in the AI answer)

**My question:** "Why does my form say today's date is in the past?"

**Summary of the answer:** The AI's example was `if (new Date(values.date) < new Date())`. It said I could add `setHours(0,0,0,0)`.

**What I learned / changed:** `new Date('2026-11-20')` is midnight, so **today** is already "in the past" compared to the current time. Even with `setHours` I had time zone doubts. I changed the rule to compare `YYYY-MM-DD` strings: `getTodayISO()` builds today's local date string, and the rule is `date < today` — so today is allowed and yesterday is not. The same helper is used by the Upcoming/Past grouping. I also added a check that rejects impossible dates like `2026-02-31` (the round trip through `Date` gives a different day).

## 9. "End time must be after the start time"

**My question:** "How do I compare two `<input type="time">` values?"

**Summary of the answer:** Convert both to `Date` objects and compare them, or use `dayjs`.

**What I learned / changed:** I did not want another library. Time values are always `HH:mm` with two digits, so comparing the strings (`endTime <= startTime`) works and is one line. I added a small format check (`/^([01]\d|2[0-3]):[0-5]\d$/`) before comparing. I tested `10:00` → `09:00` (error) and `10:00` → `10:30` (no error).

## 10. Switching between "In person" and "Online"

**My question:** "How should the form show either the Location field or the Join link field?"

**Summary of the answer:** Use a radio group and render one field conditionally. The AI's example kept both values in state and only validated the visible one.

**What I learned / changed:** That version sent a hidden old value to the API (for example a location on an online event). I clear the field that does not belong to the selected format when the format changes, and `formValuesToEventInput()` also clears it before the request. I also wrote the hint under each field ("Required because this event is in person." / "A full URL starting with http:// or https://.") so the user knows why the field appeared.

## 11. Number input for capacity

**My question:** "How do I keep a number input controlled and validate that it is a whole number between 1 and 500?"

**Summary of the answer:** Use `type="number"` and `parseInt`, and check `isNaN`.

**What I learned / changed:** `parseInt('12.5')` returns `12`, so "12.5" would pass silently. I keep the value as a **string** in the form and test `/^\d+$/` first (this rejects `12.5`, `-5`, `abc`), then `Number(...)` for the 1–500 range. Empty gets its own message. The form also has `noValidate` so the browser's own bubble does not hide my error messages.

## 12. Search on the server (the AI's `q` parameter did not work)

**My question:** "How do I search events through json-server instead of filtering in React?"

**Summary of the answer:** "Send `?q=keyword`, json-server does a full text search."

**What I learned / changed:** `?q=workshop` returned an empty array, and so did `?name_like=workshop` (the old v0.17 style). I looked at the json-server `lib` folder and found the operators `contains`, `startsWith`, etc., so I tested `?name:contains=work` and it returned the workshop event. The service now sends `'name:contains': keyword`. I also added a 350 ms debounce in `hooks/useDebouncedValue.ts` (the AI's first debounce example did not clear the timeout, so every keystroke still sent a request). In the Network tab I confirmed the request contains `name:contains=coding` and that typing resets the page to 1.

## 13. Pagination with `_page` / `_per_page`

**My question:** "How does pagination work in json-server 1.x and what does the response look like?"

**Summary of the answer:** Use `_page` and `_per_page`. The AI said the response is still an array.

**What I learned / changed:** It is **not** an array; with `_per_page` the response is an object `{ first, prev, next, last, pages, items, data }`. I created `types/api.ts` with `PaginatedResponse<T>` and read `data.data`, `data.pages`, `data.items`. The AI also suggested sorting only by date; I use `_sort=-date,-startTime` and then sort each group in the page (soonest first for Upcoming, most recent first for Past) so the two sections read naturally.

## 14. Delete confirmation without `window.confirm()`

**My question:** "How can I ask for confirmation before deleting?"

**Summary of the answer:** "Just use `if (window.confirm('Delete?'))`."

**What I learned / changed:** `confirm()` and `alert()` are not allowed (and the dialog has to show the record name), so I built `ConfirmDialog`: a fixed overlay, `role="dialog"`, `aria-modal`, Escape to cancel, focus on the Cancel button, page scroll locked while it is open, and a "Deleting..." button that is disabled during the request. `deleteEvent` is called from `DeleteEventButton`, which is reused on the list cards and on the detail page. It shows a toast with the event name when it succeeds and a friendly error toast when the API fails.

## 15. Success messages after navigating away

**My question:** "How do I show 'Event created' after I navigate to another page?"

**Summary of the answer:** Show `alert()` before `navigate(...)`, or pass the message in `navigate` state.

**What I learned / changed:** `alert()` is banned, and the AI's state example needed extra code in every page to read and clear the message. I put `ToastProvider` **above** the routes in `App.tsx`, so the toast keeps living while the page under it changes. Each toast removes itself with a `setTimeout` that is cleared in the `useEffect` cleanup, and the list is rendered with `role="status"`.

## 16. Handling ids that do not exist

**My question:** "How do I detect a 404 from json-server in axios, and how do I stop React from setting state after the page changed?"

**Summary of the answer:** Use `axios.isAxiosError(error) && error.response?.status === 404`, and use an `isCancelled` flag in the effect cleanup.

**What I learned / changed:** I added `isNotFoundError()` and used it in the detail and edit pages, so `/events/does-not-exist` shows the "Event not found" card instead of "Cannot reach the API server". I also used the `let isCancelled = false` pattern in the list, detail and edit effects, because in React StrictMode the effect runs twice in development and an older response could otherwise overwrite a newer one. The AI's first version just did `setEvent(...)` in `.then()` with no cleanup.

## 17. Code review: where the AI found real problems in my code

**My question:** "Can you review my EventForm and event list page for React and TypeScript mistakes?"

**Summary of the answer:** It pointed out three things:

1. My first version stored `errors` in state and recalculated them only on blur/submit, so a message could stay after the value was fixed. → I now derive errors from `values` and only filter which ones are visible.
2. `catch (error: any)` → I changed every catch to `catch (error)` and use `getApiErrorMessage(error, ...)`, so there is no `any` in the project.
3. I recreated `formatOptions` inside the component. → Moved it outside the component (it never changes).

**What I learned / changed:** All three were correct and are fixed. The same review also suggested `useMemo` for the visible errors; I skipped it because the validation is cheap and I would rather keep the code readable.

## 18. Console warnings and small UI fixes

**My question:** "My Console shows 'Failed to load resource: 404' but I cannot see which file. How do I find it?"

**Summary of the answer:** Open the Network tab, look at the failing request; it is usually `favicon.ico`.

**What I learned / changed:** It was the missing favicon. I added `public/favicon.svg` and `<link rel="icon" ...>` in `index.html`. After that the Console only had the React DevTools info message in dev mode (and nothing at all in the production build). I also added `aria-invalid`, `aria-describedby`, `aria-current` on the active menu link and `role="alert"` for the form summary, which the AI suggested when I asked about accessibility.

## 19. Things I checked myself (not from the AI)

- Stopped json-server and reloaded `/events` → the friendly error message and the "Try again" button appear.
- Started json-server again and clicked "Try again" → the list loads.
- Created an event, reloaded the page, restarted `npm run api` → the event is still there in `server/db.json`.
- Deleted the event I created → the confirm dialog shows the name, Cancel does nothing, Delete removes it and shows a toast.
- Searched "zzzz" → "No matching events" (different from "No events yet").
- Opened `/events/999` and `/events/999/edit` → "Event not found".
- Opened `/some/random/page` → 404 page.
- Made the window narrow (and used the browser device mode) → the layout stacks in one column, the menu still fits, and the form is usable on the phone.
- Ran `npm run lint` and `npm run build` before submitting.

## Where I did **not** follow the AI

| AI suggestion | Why I did not use it |
| --- | --- |
| zod + react-hook-form | Not allowed by the assignment; validation has to be hand-written |
| `window.confirm()` / `alert()` | Not allowed; I wrote `ConfirmDialog` and a toast provider |
| `catch (error: any)` | `any` is not allowed; `unknown` + `axios.isAxiosError` is safer |
| `?q=` search | Not supported by json-server `1.0.0-beta.15` in my test; I used `name:contains` |
| `--watch` for json-server | The CLI of my version has no such flag |
| `tailwind.config.js` (v3 setup) | I installed Tailwind v4, which uses the Vite plugin |
| Filtering the list in the browser | The bonus asks for server-side search |

## Things I would still like to improve

- Pagination currently uses Previous/Next only; numbered page buttons would be nicer.
- The form does not warn when the capacity is lower than the number of registered people (there is no registration data yet).
- I would like to add a "duplicate event" action.
- I could move the repeated `isCancelled` fetch logic into a small custom hook, but I left it explicit so I can explain it during the oral check.

## Note about the video and screenshots

The screenshots in `docs/screenshots/` were taken from my own running app (Chrome, desktop and mobile emulation). The demo video was recorded by me following the same flow: list → search/pagination → detail → create with errors → edit → delete → list, plus a short look at the folder structure. The Google Drive link is in `README.md`.
