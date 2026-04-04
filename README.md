# SecureWatch Dashboard

Project for WDD 330.

## APIs
- NVD as the main vulnerability source
- CIRCL as the enrichment source

## Features
- fetch recent CVEs from NVD
- search NVD by keyword
- filter by severity
- sort results
- view extra detail from CIRCL
- view NVD change history
- simple risk score
- severity chart
- localStorage for saved settings
- mobile-friendly layout

## Rubric criteria
- JavaScript: modular code, dynamic rendering, filtering, sorting, risk score, details panel
- Third-party APIs: NVD CVE endpoint, NVD change history endpoint, CIRCL CVE endpoint
- JSON: each vulnerability object includes many attributes
- Advanced CSS: hover effects, transitions, animations, progress bar, responsive layout
- Events: submit, click, change, input, refresh, clear, toggle view, row select
- LocalStorage: search text, severity filter, sort setting, view setting, last updated time