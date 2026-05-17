// @agri-packages/config
export const API_PORTS = {
  GATEWAY: 8000,
  ADVISORY_SERVICE: 8001,
  CROP_ROUTING_SERVICE: 8002,
  AGENT_ORCHESTRATOR: 8003,
};

export const API_BASE_URLS = {
  GATEWAY: "http://localhost:8000",
  ADVISORY_SERVICE: "http://localhost:8001",
  CROP_ROUTING_SERVICE: "http://localhost:8002",
  AGENT_ORCHESTRATOR: "http://localhost:8003",
};

export const APP_CONFIG = {
  BRAND_NAME: "AgriVision AI",
  DEFAULT_LANGUAGE: "bn",
  SUPPORTED_LANGUAGES: ["en", "bn"],
  DB_TIMEZONE: "UTC",
};
