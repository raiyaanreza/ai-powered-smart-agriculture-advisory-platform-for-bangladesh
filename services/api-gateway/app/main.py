"""API Gateway Service - Entry Point"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AgriVision API Gateway",
    description="API Gateway for AgriVision AI Agriculture Platform",
    version="0.1.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "api-gateway"}

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "AgriVision API Gateway",
        "version": "0.1.0",
        "status": "operational"
    }