# Apple App Store Listing — Little Brain Games

This document holds all the listing copy and metadata for App Store Connect. Review and edit before submission.

---

## Basics

| Field | Value |
|-------|-------|
| App name | Little Brain Games |
| Bundle ID | app.kidlearn.tinygenius |
| Developer name (Individual account) | Warren Lim *(Apple shows your legal name for Individual accounts — see DBA note below)* |
| Primary language | English (US) |
| Platform | iOS |
| Free or paid | Paid — **$2.99 USD** *(set in App Store Connect → Pricing and Availability)* |
| Contact email | learnerOne250@gmail.com |
| Support URL | https://traaa1234.github.io/little-brain-games/privacy-policy.html *(reuse privacy policy page)* |
| Marketing URL | *(optional — leave blank or add later)* |
| Privacy policy URL | https://traaa1234.github.io/little-brain-games/privacy-policy.html |
| SKU | little-brain-games-ios-1 *(internal only, never shown to users)* |

> **DBA note:** Apple Individual accounts display your legal name as the developer. To show "KidLearn" instead, you would need to either (a) enroll as an Organisation under a registered business name, or (b) live with your name showing. This does not affect App Store functionality.

---

## Categorisation

| Field | Value |
|-------|-------|
| Primary category | Education |
| Secondary category | Games → Family |
| Kids category placement | Ages 5 and Under + Ages 6–8 *(selects "Made for Kids")* |

> Selecting a Kids category age band automatically enrolls the app in Apple's Made for Kids programme and restricts what SDKs, ad networks, and analytics are permitted — all of which we comply with since we use none.

---

## App Name (30 characters max)

```
Little Brain Games
```
*(18 characters — well under the limit)*

---

## Subtitle (30 characters max)

```
Brain Games for Young Learners
```
*(30 characters exactly)*

Alternates if you prefer:
- `Learning Games for Ages 5–7` — (27 chars)
- `Memory, Puzzles & Logic for Kids` — (32 chars, too long)
- `Gentle Fun for Curious Kids` — (27 chars)

---

## Promotional Text (170 characters max)

> This field can be updated at any time **without submitting a new app version** — useful for seasonal messaging or announcements.

```
No ads. No tracking. No internet. Four gentle learning games — memory, patterns, jigsaws, and logic — designed for curious kids ages 5 to 7. Works offline, anywhere.
```
*(165 characters)*

Alternates:
- `Four mini-games for ages 5–7: memory, patterns, jigsaws, and logic. No ads, no tracking, no internet needed. Works anywhere, even without Wi-Fi.` (145 chars)
- `A warm, colourful learning playground for young kids. Memory cards, pattern sequences, jigsaw puzzles, and logic games — all offline, all ad-free.` (147 chars)

---

## Description (4000 characters max)

```
Little Brain Games is a colourful, gentle learning app made for children aged 5 to 7. Four bite-sized mini-games help your child practise memory, pattern recognition, problem-solving, and early reasoning — all in one warmly-designed app, with no ads, no tracking, and no internet required.

🧠 Memory — match pairs of cards to find pictures that go together. A "words mode" pairs picture cards with their written word, building reading recognition.

🎨 Pattern — figure out what comes next in a sequence. Choose between shapes (triangle, circle, hexagon, star), letters and numbers, or repeating words. At higher difficulty, two pieces are missing — a gentle stretch for puzzle-loving brains.

🧩 Jigsaw Puzzle — drag colourful pieces onto the board to build a picture. Five difficulty levels (10, 25, 50, 75, and 100 pieces) grow with your child. Use the built-in scenes — butterfly, sun, fish, flower, house — or pick a family photo from your Camera Roll to turn into a puzzle.

🦉 Odd One Out — find the one item that doesn't belong. Easy categories like "animals vs vehicles" build up to subtler distinctions like "things that fly vs things that swim."

DESIGNED FOR YOUNG KIDS

✓ Warm and inviting visuals — soft creams, coral, and sage green. Easy on young eyes.
✓ Tap and drag friendly. Drag-and-drop only in the puzzle game.
✓ Gentle audio feedback for correct and incorrect answers. Mute toggle for quiet times.
✓ Difficulty levels that grow with your child — three for memory, pattern, and logic; five for the jigsaw.
✓ Fully offline — no internet needed once installed. Works on a plane, in a car, anywhere.

PRIVACY BY DESIGN

✓ No ads. No tracking. No data collection.
✓ No analytics SDKs. No third-party trackers.
✓ No internet access requested or used.
✓ Photos selected for the puzzle stay entirely on the device — never sent anywhere.
✓ No accounts, no logins, no usernames.

MADE BY KIDLEARN

A small team building games we'd want our own kids to play. Questions or feedback? learnerOne250@gmail.com
```

*(1,889 characters — well under the 4,000 limit)*

---

## Keywords (100 characters max, comma-separated, no spaces after commas)

```
kids learning,memory game,puzzle,jigsaw,pattern,logic,brain games,educational,family,no ads
```
*(91 characters)*

> Apple's keyword field is separate from the description. Keywords here boost search visibility. Do not repeat words that are already in the app name or subtitle — Apple ignores duplicates.

Backup keywords (swap in if you want to test different search terms):
```
children,ages 5 6 7,matching game,shapes,learning app,offline,toddler,kindergarten,preschool
```
*(91 characters)*

---

## What's New — Version 1.0.0 (500 characters max)

```
First release! Little Brain Games launches with four learning mini-games: Memory, Pattern, Jigsaw Puzzle, and Odd One Out. Designed for ages 5–7 with warm, inviting visuals and zero ads or tracking.
```
*(199 characters)*

---

## Screenshots Required

Apple requires screenshots at specific device sizes. Minimum required sets:

| Device | Resolution | Required? |
|--------|------------|-----------|
| iPhone 6.7" (iPhone 15 Pro Max / 16 Pro Max) | 1290 × 2796 px | ✅ Required |
| iPhone 5.5" (iPhone 8 Plus) | 1242 × 2208 px | ✅ Required |
| iPad Pro 12.9" (6th gen) | 2048 × 2732 px | Optional (recommended) |

> Screenshot mockups for iPhone 6.7" are saved at:
> `android-app/store-assets/screenshots/ios/`
>
> **To get real screenshots:** Run the app in Xcode's iPhone 16 Pro Max simulator → take screenshots with `Cmd+S` (saves to Desktop). Crop to 1290×2796 if needed.

Recommended 5 screenshots to submit (in order):
1. **Home screen** — shows all 4 game buttons
2. **Memory game** — cards face-up/face-down grid
3. **Pattern game** — sequence with missing piece
4. **Jigsaw puzzle** — partially assembled puzzle
5. **Odd One Out** — question with 4 answer items

---

## App Review Information

When submitting for review, add a note for Apple's reviewers:

```
This is a children's educational game for ages 5–7. It contains four mini-games: memory card matching, pattern sequences, jigsaw puzzle, and odd-one-out logic.

Photo access: The app uses iOS's standard PHPickerViewController (system photo picker). It is triggered only when the user taps "Upload picture" in the Jigsaw Puzzle game. The selected image stays on device and is never transmitted.

No account or login is required. No internet connection is used. No in-app purchases.

Test account: None required — the app launches directly into the game selector.
```

---

## Privacy Nutrition Label (App Store Connect → App Privacy)

Apple's "nutrition label" appears on your App Store listing page. Since we collect nothing:

| Section | Answer |
|---------|--------|
| Do you collect data? | **No** |

That's it. Selecting "No" produces the "Data Not Collected" label — the cleanest possible outcome and the most reassuring signal to parents.

---

## Age Rating Questionnaire (IARC / Apple)

Answer honestly in App Store Connect → App Information → Age Rating:

| Question | Answer |
|----------|--------|
| Cartoon or Fantasy Violence | None |
| Realistic Violence | None |
| Sexual Content or Nudity | None |
| Profanity or Crude Humor | None |
| Alcohol, Tobacco, or Drug Use | None |
| Simulated Gambling | None |
| Horror or Fear Themes | None |
| Medical / Treatment Information | None |
| User-Generated Content | None *(photos stay local, never shared)* |

Expected rating: **4+** — the lowest possible on the App Store.

---

## Made for Kids Enrollment

In App Store Connect → App Information → Kids Category:

| Field | Answer |
|-------|--------|
| Is this app primarily designed for kids? | Yes |
| Age band | Ages 5 and Under AND Ages 6–8 *(select both to cover 5–7)* |

> Selecting a Kids age band is permanent — you cannot remove the Kids category designation after the app is approved. Only do this if you intend the app to stay kid-focused.

Requirements you already satisfy:
- ✅ No third-party analytics
- ✅ No advertising
- ✅ No social features
- ✅ No external links (other than support email)
- ✅ Privacy policy hosted and linked

---

## Pricing and Availability

| Field | Value |
|-------|-------|
| Price | $2.99 USD (Apple's Tier 3) |
| Availability | All countries and regions |
| Pre-order | No |
| Educational discount | Apple sets this automatically for Education Store |

> Apple automatically converts $2.99 USD to local currencies in each storefront. You can review the price matrix in App Store Connect → Pricing and Availability → All Prices and Currencies.

> **TestFlight testers always install for free** regardless of your production price — no extra configuration needed.

---

## Paid Applications Agreement

Before Apple will distribute a paid app you must sign the **Paid Applications Agreement**:

1. App Store Connect → Agreements, Tax, and Banking
2. Under "Paid Applications" — click Request
3. Fill in banking information (where Apple sends your payments)
4. Fill in tax information (W-8BEN form for non-US developers, or W-9 for US)
5. Sign the agreement

> This can take 24–48 hours to activate. Do it as soon as you enroll in the Apple Developer Program — you can upload and TestFlight the app before this is complete, but you cannot submit for production review until the agreement is signed and active.

---

## Review Process Expectations

- Kids' apps are reviewed by humans, not just automated systems.
- Typical wait: **1–3 business days** for most apps.
- Common rejection reasons for kids' apps:
  - Missing or inadequate privacy policy URL
  - Photo permission string (NSPhotoLibraryUsageDescription) not descriptive enough
  - Screenshots don't match the actual app
  - Missing Kids category age band selection
- After approval, the app appears in the App Store within ~1 hour.
