import os
from fpdf import FPDF

class ContributionPDF(FPDF):
    def header(self):
        # Header title
        self.set_font("Helvetica", "B", 13)
        self.set_text_color(0, 0, 0)
        self.cell(0, 8, "CSE499 - COMPUTER SCIENCE & ENGINEERING CAPSTONE PROJECT", ln=True, align="C")
        self.set_font("Helvetica", "B", 10)
        self.cell(0, 6, "INDIVIDUAL CONTRIBUTION REPORT", ln=True, align="C")
        self.set_draw_color(0, 0, 0)
        self.set_line_width(0.3)
        self.line(15, self.get_y() + 2, 195, self.get_y() + 2)
        self.ln(6)

    def footer(self):
        # Footer page number
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(100, 100, 100)
        self.cell(0, 10, "Page 1 of 1  ·  AgriVision AI Project Documentation", align="C")

def build_pdf():
    pdf = ContributionPDF('P', 'mm', 'A4')
    pdf.set_margins(15, 15, 15)
    pdf.set_auto_page_break(False) # Force single page layout
    pdf.add_page()

    # Meta Section
    pdf.set_font("Helvetica", "B", 9.5)
    pdf.cell(32, 5.5, "Project Title:", 0, 0)
    pdf.set_font("Helvetica", "", 9.5)
    pdf.cell(0, 5.5, "AgriVision AI: Smart Agriculture Advisory Platform for Bangladesh", 0, 1)

    pdf.set_font("Helvetica", "B", 9.5)
    pdf.cell(32, 5.5, "Academic Term:", 0, 0)
    pdf.set_font("Helvetica", "", 9.5)
    pdf.cell(0, 5.5, "Spring 2026", 0, 1)
    
    pdf.ln(3)

    # Member 1
    pdf.set_fill_color(240, 240, 240)
    pdf.set_font("Helvetica", "B", 9.5)
    pdf.cell(0, 5.5, " MEMBER 1: KHAN RAIYAN IBNE REZA (ID: 2221236042) - COMPLETED CONTRIBUTIONS", 0, 1, fill=True)
    pdf.ln(1.5)
    
    m1_bullets = [
        "Multi-Crop YOLOv8 Specialists Integration: Implemented deep-learning inference pipelines utilizing custom trained YOLOv8 models. Managed weight registries (best.pt) across 5 isolated crop-specific services (Rice, Potato, Corn, Wheat, and Brassica) and the main crop-routing-service.",
        "Asynchronous Monorepo API Gateway: Engineered the network integration layer across the 14 FastAPI microservices using asynchronous HTTPX proxy networks. Orchestrated dynamic request routing and payload sanitization at the API gateway layer.",
        "Supabase Security Gateway & Authorization: Secured sensitive administrative and GIS endpoints (/api/admin/* and /api/outbreak-analytics) by intercepting dynamic bearer JWT tokens via supabase.auth.getSession() and passing authorization headers to FastAPI backend services.",
        "Interactive GIS Outbreak Analytics: Designed the responsive geospatial Bangladesh coordinate map on the Admin CommandCenter, loading live telemetry reports and outbreak hotspots dynamically from Supabase.",
        "Advisory Solutions Manual & RAG Integration: Integrated the farmer-facing Multi-Turn Chat (AgriBot) standardizing Gemini LLM routing with local storage session records, localized Bengali queries, and vector-based handbook RAG lookups.",
        "Next.js Dynamic Route Standardization: Mitigated build-time static cache issues on Next.js endpoints by introducing dynamic route declarations (export const dynamic = 'force-dynamic') to ensure live administrative data rendering."
    ]

    pdf.set_font("Helvetica", "", 8.5)
    for bullet in m1_bullets:
        pdf.cell(4, 4.5, "-", 0, 0) # bullet character
        pdf.multi_cell(0, 4.5, bullet)
        pdf.ln(0.5)

    pdf.ln(2)

    # Member 2
    pdf.set_font("Helvetica", "B", 9.5)
    pdf.cell(0, 5.5, " MEMBER 2: [ PENDING ASSIGNMENT ] - COMPLETED CONTRIBUTIONS", 0, 1, fill=True)
    pdf.ln(1.5)
    pdf.set_font("Helvetica", "I", 8.5)
    pdf.cell(0, 4.5, "    No contributions assigned yet.", 0, 1)
    pdf.ln(2)

    # Member 3
    pdf.set_font("Helvetica", "B", 9.5)
    pdf.cell(0, 5.5, " MEMBER 3: [ PENDING ASSIGNMENT ] - COMPLETED CONTRIBUTIONS", 0, 1, fill=True)
    pdf.ln(1.5)
    pdf.set_font("Helvetica", "I", 8.5)
    pdf.cell(0, 4.5, "    No contributions assigned yet.", 0, 1)
    pdf.ln(2)

    # Not Done Parts
    pdf.set_font("Helvetica", "B", 9.5)
    pdf.cell(0, 5.5, " OUTSTANDING DEVELOPMENT & RESEARCH ROADMAP (NOT DONE YET)", 0, 1, fill=True)
    pdf.ln(1.5)

    not_done_bullets = [
        "Specialist YOLOv8 Dataset Expansion: Deployed classifiers are operating on current weight registries; subsequent iteration involves fine-tuning with targeted high-resolution local leaf-pathogen image datasets.",
        "Sentinel-2 Spatial NDVI Feed Integration: Live spatial NDVI vegetation streaming is simulated; actual integration with Sentinel Hub REST API requires registered enterprise production credentials.",
        "Low-Literacy Bengali Voice UI Accessibility: Speech-to-text (STT) and text-to-speech (TTS) systems inside the farmer advisory dashboard are scheduled for future development phases.",
        "Research Publication manuscript: Academic publication evaluating model prediction confidence parameters against variable regional soil profiles is currently under draft compilation."
    ]

    pdf.set_font("Helvetica", "", 8.5)
    for bullet in not_done_bullets:
        pdf.cell(4, 4.5, "-", 0, 0)
        pdf.multi_cell(0, 4.5, bullet)
        pdf.ln(0.5)

    # Output file
    dest_path = os.path.join("docs", "cse499_contribution.pdf")
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    pdf.output(dest_path)
    print(f"Contribution PDF compiled successfully at: {dest_path}")

if __name__ == "__main__":
    build_pdf()
