# Source classification v0.2

Classifier version: 2.

## Priority

1. explicit paid click identifiers (presence only, raw values discarded)
2. UTM campaign fields
3. known external referrer
4. Direct

## Paid

- `gclid`, `gbraid`, `wbraid` presence -> Google Ads
- `msclkid` presence -> Microsoft Ads
- raw click-id values are never stored

## AI

Known AI sources are grouped under `channel_group=ai`:

- ChatGPT
- Gemini
- Perplexity
- Copilot
- Claude
- Poe
- Meta AI
- Grok
- DeepSeek
- You.com
- Other AI can be added by classifier version update

`bing.com/chat` is treated as Copilot.

## Search

- Google Organic
- Bing Organic
- Other Search: DuckDuckGo, Yahoo, Ecosia, Yandex, Baidu

## Social

- Instagram
- Facebook
- Other Social: TikTok, X/t.co, LinkedIn, Pinterest

## Other

- Direct
- Referral
- Internal (diagnostic only)

For a new session, same-site referrer is mapped to Direct. Internal navigation never becomes an acquisition source.

## Direct and attribution

Direct is preserved as a real last touch. We also store `last_non_direct_touch_id`, so reports can answer both:

- what was the actual last entry source?
- what was the most recent attributable non-direct source?

This avoids silently overwriting Direct while retaining useful acquisition history.
