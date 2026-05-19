# AGENTS.md - Local Rules for crop-routing-service

> **Role**: AI Local Coding Guidelines

1. **Service Boundaries**:
   - This service classifies crop type from images using the `crop-classifier` YOLO model. Disease detection is handled by the disease-* services.
2. **Model Loading**:
   - Model loaded at startup from `../../models/crop-classifier/best.pt`. If model is missing, service starts in degraded mode (returns 500 on `/predict`).
3. **File Handling**:
   - Uploaded files are written to temp location and deleted in a `finally` block. Never leave temp files on disk.
4. **Internal Token**:
   - All requests must pass `X-Internal-Token` validation. Only the API Gateway should call this service.
