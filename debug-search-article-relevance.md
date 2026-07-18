# [OPEN] Debug Session: search-article-relevance

## Symptom
- Need to verify whether search still shows irrelevant articles.

## Hypotheses
1. Breed-like queries such as `Retriever` no longer return articles.
2. Article-title queries such as `Parkinson` and `Tucker` still return the correct posts.
3. Mixed or broad tokens may still surface marginally relevant posts if title matching is too loose.
4. Dropdown API and full search page may diverge in results if they use different data paths.

## Plan
- Query the current search endpoints with representative breed and article terms.
- Inspect the rendered search page for a breed-like query.
- Report any remaining irrelevant article matches without changing code.
