# AGENTS.md - Local Rules for notification-service

> **Role**: AI Local Coding Guidelines

1. **Service Boundaries**:
   - This service broadcasts agricultural alerts. No inference or diagnosis logic.
2. **Schema Validity**:
   - `BroadcastRequest` in `main.py` defines the alert contract (title, message, type, target_role, trigger_sms).
3. **Broadcast Channels**:
   - Current implementation logs to stdout. Future channels: WebSocket push, SMS gateway (Twilio/local), Redis pub/sub.
4. **Internal Token**:
   - All requests must pass `X-Internal-Token` validation. Only the API Gateway should call this service.
