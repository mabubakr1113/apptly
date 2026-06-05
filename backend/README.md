# @apptly/backend

**Not implemented yet - Module 11.**

v1 of Apptly is **local-only**: the extension talks directly to the user's chosen
LLM provider with their own API key. There is no server.

This package is reserved for the future **hosted LLM proxy** (Cloudflare Worker +
Hono): a thin, stateless proxy that holds a server API key and forwards
completion requests, with usage metering, quotas, billing, and optional
end-to-end-encrypted cloud sync layered in later (Module 11).
