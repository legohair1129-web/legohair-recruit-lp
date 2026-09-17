# Recruit LP revision — factual follow-up before production

Base: main 17d0b2e4877c210685e6a7bd5b7f49dc6937391e.

## Implemented
- Preserve existing photographs, font families, soft color washes and narrow editorial layout.
- Bring existing salary/holiday/leaving-time figures to the top; add section navigation.
- Condense overlapping value/education content; promote semi-private salon photos and add an accessible scroll gallery.
- Add recruitment, locations/map-search links, proposed visit flow and FAQ sections.
- Keep existing LINE destination, secondary pages and existing Meta Pixel / Lead / RecruitLineClick behavior.
- Add RecruitSectionView once per section per page load. This is reach, not an application.
- Remove unsupported qualification percentages pending denominators/dates. Describe 150万円 as an aim, not a promised result.

## Confirm before completing / merging
1. Stylist salary and fixed overtime resolved by user confirmation: use the supplied HOT PEPPER listing. Commission formulas and income examples remain omitted until supplied; assistant/semi-regular amounts are retained from their existing LP sections.
2. Holidays resolved by user confirmation: 111 annual days off, complete two-day weekly rest, annual paid leave 10 days. Average leaving time 18:30 remains the existing LP figure, not a new measured claim.
3. Resolved: the user provided an existing Google Forms visit form; four CTAs now link directly to it. No new form backend or recipient email is needed. See source review below.
4. Validate proposed visit process; actual response target, duration, clothing/items, selection procedure. No duration or response SLA is promised.
5. Training stages/time allocation/company-funded scope; actual staff interview text and publication consent; qualification rates with date/denominator.
6. Store-specific current recruitment, placement policy, qualifications, commuting and customer-unit-price data. Do not assume all stores have identical terms.

## Measurement
The legacy `Lead` event fires on LINE click. It is NOT a completed inquiry, visit booking or hire. Retained for campaign compatibility; changing optimization semantics requires a separate coordinated update. No new success event is invented. Section events carry only section/page identifiers.

## Validation
Browser verification at widths 320, 390, 430, 1440: no document horizontal overflow or broken anchor targets. Single H1; no JavaScript errors; all displayed images load. Verified visit jump, FAQ expand and gallery next. Advertising requests blocked during local QA. No outbound message or form submission performed.

## User-provided source review (2026-09-18 JST)
- Job: https://work.beauty.hotpepper.jp/WC00003400/WS0000024772/JP0000012969/?initial_employment_pattern=EP1&initial_recruitment_target=2
- Form: https://forms.gle/HdJJZuKUT4ScFmDP7
- Source job is salon LH / full-time stylist, updated 2026-07-09. Do not generalize its terms across all stores or roles.
- Resolved: user explicitly confirmed the HOT PEPPER conditions are correct. All main LP occurrences now use 244,000–420,000 yen including allowances/fixed overtime and 111 annual holidays.
- Source base salary 222,500–255,000 yen; fixed overtime 6,500–15,000 yen for 5–10 hours (source also says statutory-within 10 hours), excess separately paid. These figures do not by themselves reconcile the 244,000/245,000 minimum; do not fabricate a breakdown or combine with a different scheme.
- Source says complete two-day weekly rest, annual paid leave 10 days. Replaced the old five-day-consumption message with the published annual entitlement figure; no claim of 100% consumption. Source 2022 corporate average paid leave data was not reused.
- Added narrowly scoped uncontested fields: qualifications/experience, social insurance, 8 working hours plus 1-hour break under variable hours system, trial period, leave categories, raises/bonuses, and station access.
- Form requires full name in kanji and hiragana, school name, contact, preferred store and date(s). Its introduction requests Gmail and states a reply within one week. The LP exposes this restriction and offers LINE for questions. We did not change the form or submit a test response.
- Recommended later form improvement: make school optional or label it school/alma mater; add role; accept ordinary email. Requires access to edit the form, not part of this patch.
- RecruitFormClick only records opening the external form; it does not emit Lead or report submission success. Existing LINE events remain unchanged.

## Latest user confirmation
The user confirmed that HOT PEPPER conditions are correct. Updated salary range, basic pay, fixed overtime and excess payment, holiday system, annual holiday count, and paid leave. Gmail recommendation was acknowledged; the Google Form itself has not been edited, so LP continues to describe its actual Gmail requirement. No new approval question about confirmed conditions is needed.
