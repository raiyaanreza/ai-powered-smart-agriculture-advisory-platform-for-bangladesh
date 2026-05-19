# AGENTS.md - Local Rules for disease-brassica-service

> **Role**: AI Local Coding Guidelines

1. **Service Boundaries**:
   - This service detects diseases in Brassica crops (cabbage, cauliflower, mustard) using YOLO.
2. **Model Loading**:
   - Model loaded at startup from `../../models/brassica-disease/best.pt`. Service degrades to 500 if model is missing.
3. **File Handling**:
   - Uploaded images are written to temp and deleted in `finally`. Never leave temp files on disk.
4. **Schema Validity**:
   - Response schema: `{"predictions": [{"class": str, "confidence": float}], "summary": {...}}`.
