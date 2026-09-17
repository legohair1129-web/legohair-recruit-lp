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
1. Current role-specific salary breakdown, fixed overtime amount/hours or absence, commission calculation, treatment of nomination fees, free/new clients and product sales, trial period, insurance and transport allowance. Supply current salary table if available. No income examples are invented.
2. Holiday breakdown (monthly rest, fixed days, summer/winter), paid leave policy and recorded average leaving-time period. Existing 110日 / 18:30 / 年5日 remain unchanged pending verification.
3. Approved receiving email and existing form service/account for a non-LINE visit form, and applicable privacy policy. No fake submission or unconnected form is exposed.
4. Validate proposed visit process; actual response target, duration, clothing/items, selection procedure. No duration or response SLA is promised.
5. Training stages/time allocation/company-funded scope; actual staff interview text and publication consent; qualification rates with date/denominator.
6. Store-specific current recruitment, placement policy, qualifications, commuting and customer-unit-price data. Do not assume all stores have identical terms.

## Measurement
The legacy `Lead` event fires on LINE click. It is NOT a completed inquiry, visit booking or hire. Retained for campaign compatibility; changing optimization semantics requires a separate coordinated update. No new success event is invented. Section events carry only section/page identifiers.

## Validation
Browser verification at widths 320, 390, 430, 1440: no document horizontal overflow or broken anchor targets. Single H1; no JavaScript errors; all displayed images load. Verified visit jump, FAQ expand and gallery next. Advertising requests blocked during local QA. No outbound message or form submission performed.
