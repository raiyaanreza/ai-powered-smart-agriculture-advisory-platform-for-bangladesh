"""
Generate PDF version of the QA Audit Reverification Report
Usage: python scripts/generate_pdf_report.py
"""

import os
import re
import io
import urllib.request
from fpdf import FPDF


# Unicode font URL for Windows compatibility
# Using NotoSans which supports wide Unicode range incl symbols used in report
FONT_URL = "https://github.com/notofonts/noto-fonts/raw/main/hinted/ttf/NotoSans/NotoSans-Regular.ttf"
FONT_BOLD_URL = "https://github.com/notofonts/noto-fonts/raw/main/hinted/ttf/NotoSans/NotoSans-Bold.ttf"


def download_font(url, dest):
    """Download a font file if not already present."""
    if not os.path.exists(dest):
        print(f"   Downloading {os.path.basename(dest)}...")
        try:
            urllib.request.urlretrieve(url, dest)
        except Exception:
            return False
    return True


def strip_emoji(text):
    """Remove emoji characters that can't render in the font."""
    # Emoji pattern covering most common emojis
    emoji_pattern = re.compile("["
        u"\U0001F600-\U0001F64F"  # emoticons
        u"\U0001F300-\U0001F5FF"  # symbols & pictographs
        u"\U0001F680-\U0001F6FF"  # transport & map
        u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
        u"\U00002702-\U000027B0"  # dingbats
        u"\U000024C2-\U0001F251"  # misc
        u"\U0001F900-\U0001F9FF"  # supplemental symbols
        u"\U0001FA00-\U0001FA6F"  # chess symbols
        u"\U0001FA70-\U0001FAFF"  # symbols extended-A
        u"\U00002600-\U000026FF"  # misc symbols
        u"\U00002B05-\U00002B07"  # arrows
        u"\U00002764\U0000FE0F"   # heart
        u"\U0000200D"             # zero width joiner
        "]+", flags=re.UNICODE)
    return emoji_pattern.sub(r'', text)


def strip_markdown_bold(text):
    """Remove **bold** markers from text."""
    return re.sub(r'\*\*(.*?)\*\*', r'\1', text)


def strip_md_links(text):
    """Remove [text](url) markdown links."""
    return re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)


def clean_text(text):
    """Clean text for PDF rendering: strip emoji, bold markers, links."""
    text = strip_emoji(text)
    text = strip_markdown_bold(text)
    text = strip_md_links(text)
    return text.strip()


class AuditReportPDF(FPDF):
    """Custom PDF class for the audit report."""

    def __init__(self, font_path, font_bold_path):
        super().__init__('P', 'mm', 'A4')
        self.set_auto_page_break(auto=True, margin=20)
        self.add_font("ReportFont", "", font_path, uni=True)
        self.add_font("ReportFont", "B", font_bold_path, uni=True)
        self.chapter_count = 0

    def cover_page(self):
        """Generate professional cover page."""
        self.add_page()
        self.ln(60)
        self.set_font("ReportFont", "B", 28)
        self.set_text_color(26, 82, 118)
        self.cell(0, 15, "AgriVision AI", align="C")
        self.ln(18)
        self.set_font("ReportFont", "", 16)
        self.set_text_color(100, 100, 100)
        self.cell(0, 10, "Full QA Audit Reverification Report", align="C")
        self.ln(15)
        self.set_draw_color(26, 82, 118)
        self.set_line_width(0.5)
        line_x = 60
        self.line(line_x, self.get_y(), 210 - line_x, self.get_y())
        self.ln(15)

        self.set_font("ReportFont", "", 11)
        self.set_text_color(80, 80, 80)
        self.cell(0, 8, "Reverified by: DeepSeek (via AI Agent)", align="C")
        self.ln(8)
        self.cell(0, 8, "Date: 2026-05-16", align="C")
        self.ln(8)
        self.cell(0, 8, "Method: 10 parallel subagent investigations, 208 tool calls, 100+ files", align="C")
        self.ln(8)
        self.cell(0, 8, "Compared against: Claude 4.6 Original Audit (qa_audit_report_1.md)", align="C")
        self.ln(20)

        self.set_font("ReportFont", "B", 48)
        self.set_text_color(192, 57, 43)
        self.cell(0, 20, "4.2 / 10", align="C")
        self.ln(15)
        self.set_font("ReportFont", "", 12)
        self.set_text_color(100, 100, 100)
        self.cell(0, 8, "Overall Readiness Score (down from 4.8/10)", align="C")
        self.ln(30)
        self.set_font("ReportFont", "", 9)
        self.set_text_color(150, 150, 150)
        self.cell(0, 8, "AgriVision AI Agriculture Platform -- Confidential", align="C")

    def section_title(self, title):
        """Add a section title (H1)."""
        self.chapter_count += 1
        self.ln(8)
        self.set_font("ReportFont", "B", 16)
        self.set_text_color(26, 82, 118)
        if self.chapter_count > 1:
            self.add_page()
        self.cell(0, 10, clean_text(title))
        self.ln(5)
        self.set_draw_color(26, 82, 118)
        self.set_line_width(0.8)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(8)

    def sub_title(self, title):
        """Add a sub-title (H2)."""
        self.ln(5)
        self.set_font("ReportFont", "B", 13)
        self.set_text_color(44, 62, 80)
        self.cell(0, 8, clean_text(title))
        self.ln(5)
        self.set_draw_color(189, 195, 199)
        self.set_line_width(0.3)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(6)

    def sub_sub_title(self, title):
        """Add a sub-sub-title (H3)."""
        self.ln(3)
        self.set_font("ReportFont", "B", 11)
        self.set_text_color(52, 73, 94)
        self.cell(0, 7, clean_text(title))
        self.ln(7)

    def bullet_list(self, items):
        """Add a bulleted list."""
        self.set_font("ReportFont", "", 10)
        self.set_text_color(26, 26, 26)
        for item in items:
            self.cell(5)
            self.cell(3, 5.5, "-")
            self.multi_cell(0, 5.5, clean_text(item))
            self.ln(1)

    def add_table(self, headers, data, col_widths=None):
        """Add a table with headers and data rows."""
        if col_widths is None:
            col_widths = [190 / len(headers)] * len(headers)

        self.set_font("ReportFont", "B", 8)
        self.set_fill_color(26, 82, 118)
        self.set_text_color(255, 255, 255)
        for i, header in enumerate(headers):
            self.cell(col_widths[i], 7, clean_text(header), border=1, fill=True, align="C")
        self.ln()

        self.set_font("ReportFont", "", 8)
        self.set_text_color(26, 26, 26)
        fill = False
        for row in data:
            cleaned_row = [clean_text(c) for c in row]
            max_lines = 1
            for i, cell_text in enumerate(cleaned_row):
                lines = self.multi_cell(col_widths[i], 5, cell_text, split_only=True)
                if len(lines) > max_lines:
                    max_lines = len(lines)
            row_height = max(7, max_lines * 5)

            if self.get_y() + row_height > 270:
                self.add_page()
                self.set_font("ReportFont", "B", 8)
                self.set_fill_color(26, 82, 118)
                self.set_text_color(255, 255, 255)
                for i, header in enumerate(headers):
                    self.cell(col_widths[i], 7, clean_text(header), border=1, fill=True, align="C")
                self.ln()
                self.set_font("ReportFont", "", 8)
                self.set_text_color(26, 26, 26)
                fill = not fill

            if fill:
                self.set_fill_color(248, 249, 250)
            else:
                self.set_fill_color(255, 255, 255)

            y_start = self.get_y()
            x_start = self.get_x()

            for i, cell_text in enumerate(cleaned_row):
                x = x_start + sum(col_widths[:i])
                self.set_xy(x, y_start)
                self.rect(x, y_start, col_widths[i], row_height, 'D' if not fill else 'FD')
                self.set_xy(x + 1, y_start + 1)
                self.multi_cell(col_widths[i] - 2, 5, cell_text)

            self.set_xy(x_start, y_start + row_height)
            fill = not fill
        self.ln(5)


def build_pdf(md_path, pdf_path, font_path, font_bold_path):
    """Convert markdown to PDF."""
    with open(md_path, 'r', encoding='utf-8') as f:
        md_content = f.read()

    pdf = AuditReportPDF(font_path, font_bold_path)
    pdf.cover_page()

    lines = md_content.split('\n')
    i = 0
    in_code = False
    code_block = []
    in_table = False
    table_data = []
    in_list = False
    list_items = []

    while i < len(lines):
        line = lines[i]

        # Code blocks
        if line.strip().startswith('```'):
            if in_code:
                pdf.set_font("ReportFont", "", 8)
                pdf.set_text_color(39, 174, 96)
                for cl in code_block:
                    if cl.strip():
                        pdf.cell(10)
                        pdf.cell(0, 4, clean_text(cl))
                        pdf.ln(4)
                pdf.ln(3)
                code_block = []
                in_code = False
            else:
                in_code = True
            i += 1
            continue

        if in_code:
            code_block.append(line.rstrip())
            i += 1
            continue

        # Tables
        if line.strip().startswith('|') and '|' in line[1:]:
            if not in_table:
                in_table = True
                table_data = [line.strip()]
            else:
                table_data.append(line.strip())
            i += 1
            if i < len(lines) and not (lines[i].strip().startswith('|') and '|' in lines[i][1:]):
                if len(table_data) >= 2:
                    header_row = [h.strip() for h in table_data[0].split('|')[1:-1]]
                    data_rows = []
                    for row in table_data[2:]:
                        cells = [c.strip() for c in row.split('|')[1:-1]]
                        data_rows.append(cells)
                    if header_row:
                        col_width = min(50, 180 / max(len(header_row), 1))
                        col_widths = [col_width] * len(header_row)
                        if len(col_widths) > 1:
                            col_widths[0] = min(70, col_width * 1.5)
                            remaining = 190 - col_widths[0]
                            for j in range(1, len(col_widths)):
                                col_widths[j] = remaining / (len(col_widths) - 1)
                        pdf.add_table(header_row, data_rows, col_widths)
                in_table = False
                table_data = []
            continue

        if line.strip().startswith('|---'):
            i += 1
            continue

        if not line.strip():
            if in_list and list_items:
                pdf.bullet_list(list_items)
                list_items = []
                in_list = False
            i += 1
            continue

        if line.strip() == '---':
            pdf.ln(3)
            pdf.set_draw_color(26, 82, 118)
            pdf.set_line_width(0.5)
            pdf.line(10, pdf.get_y(), 200, pdf.get_y())
            pdf.ln(5)
            i += 1
            continue

        # Headers
        if line.startswith('# '):
            pdf.section_title(line[2:].strip())
        elif line.startswith('## '):
            pdf.sub_title(line[2:].strip())
        elif line.startswith('### '):
            pdf.sub_sub_title(line[2:].strip())
        elif line.startswith('#### '):
            pdf.sub_sub_title(line[4:].strip())
        elif line.strip().startswith('- []') or line.strip().startswith('- [x]') or line.strip().startswith('- [') or line.strip().startswith('- ') or line.strip().startswith('* '):
            in_list = True
            item_text = line.strip()
            if item_text.startswith('- ['):
                item_text = item_text[6:] if item_text[3:5] == 'x ' else item_text[5:]
            elif item_text.startswith('- '):
                item_text = item_text[2:]
            elif item_text.startswith('* '):
                item_text = item_text[2:]
            list_items.append(item_text)
        elif line.strip().startswith(('1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.')):
            item_text = line.strip()[3:].strip()
            pdf.cell(5)
            pdf.set_font("ReportFont", "", 10)
            pdf.set_text_color(26, 26, 26)
            pdf.multi_cell(0, 5.5, clean_text(item_text))
            pdf.ln(1)
        else:
            clean = line.strip()
            if '|' not in clean or clean.count('|') <= 2:
                if len(clean) > 5 or any(c.isalpha() for c in clean):
                    severity_text = clean_text(clean)
                    pdf.set_font("ReportFont", "", 10)
                    pdf.set_text_color(26, 26, 26)
                    pdf.multi_cell(0, 5.5, severity_text)
                    pdf.ln(1)

        i += 1

    if list_items:
        pdf.bullet_list(list_items)

    pdf.output(pdf_path)
    size_kb = os.path.getsize(pdf_path) / 1024
    print(f"PDF generated: {pdf_path}")
    print(f"File size: {size_kb:.1f} KB")
    print(f"Total pages: {pdf.page_no()}")


if __name__ == "__main__":
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    script_dir = os.path.dirname(os.path.abspath(__file__))
    md_file = os.path.join(repo_root, "docs", "testing reports", "qa_audit_report_1_reverification_deepseek.md")
    pdf_file = os.path.join(repo_root, "docs", "testing reports", "qa_audit_report_1_reverification_deepseek.pdf")

    # Download fonts locally
    font_path = os.path.join(script_dir, "NotoSans-Regular.ttf")
    font_bold_path = os.path.join(script_dir, "NotoSans-Bold.ttf")

    print("Setting up Unicode fonts for PDF...")
    if not (download_font(FONT_URL, font_path) and download_font(FONT_BOLD_URL, font_bold_path)):
        print("ERROR: Could not download fonts. PDF may have encoding issues.")
        print("Attempting with font stripping only...")

    build_pdf(md_file, pdf_file, font_path, font_bold_path)