import os
from celery import Celery

redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "agrivision_tasks",
    broker=redis_url,
    backend=redis_url
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Dhaka",
    enable_utc=True,
)

@celery_app.task
def generate_pdf_report_task(report_data: dict):
    """
    Mock task for generating PDF report asynchronously.
    In a real implementation, this would compile LaTeX or PDF files
    and upload to S3 or a blob store.
    """
    import time
    print(f"Starting PDF report generation for {report_data.get('id', 'unknown')}...")
    time.sleep(5)
    print("PDF generated successfully.")
    return {"status": "completed", "report_url": "http://localhost:8000/reports/download/demo.pdf"}
