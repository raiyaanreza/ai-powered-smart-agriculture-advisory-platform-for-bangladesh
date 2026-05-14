# 🗺️ AgriVision Page Inventory & Priority Map

This document lists all 24 planned pages, classified by User Zone and Priority (P0 = MVP).

## 🌍 Public Zone (Anonymous Visitors)
| ID | Page Name | Priority | Folder Path |
|----|-----------|----------|-------------|
| P1 | Landing Page | P0 | `apps/web/app/page.tsx` |
| P2 | Public Diagnosis | P0 | `apps/web/app/diagnose/page.tsx` |
| P3 | Knowledge Center | P1 | `apps/web/app/knowledge/page.tsx` |
| P4 | Public Alerts | P1 | `apps/web/app/alerts/page.tsx` |
| P5 | About Platform | P2 | `apps/web/app/about/page.tsx` |
| P6 | FAQ | P2 | `apps/web/app/faq/page.tsx` |
| P7 | Contact Support | P2 | `apps/web/app/contact/page.tsx` |

## 👨‍🌾 Farmer Zone (Authenticated Farmers)
| ID | Page Name | Priority | Folder Path |
|----|-----------|----------|-------------|
| F1 | Farmer Dashboard | P0 | `apps/web/app/(dashboard)/farmer/page.tsx` |
| F2 | Diagnosis History | P0 | `apps/web/app/(dashboard)/farmer/history/page.tsx` |
| F3 | AI Assistant | P0 | `apps/web/app/(dashboard)/farmer/assistant/page.tsx` |
| F4 | Advisory Detail | P1 | `apps/web/app/(dashboard)/farmer/advisory/[id]/page.tsx` |
| F5 | My Alerts | P1 | `apps/web/app/(dashboard)/farmer/alerts/page.tsx` |
| F6 | Crop Journal | P2 | `apps/web/app/(dashboard)/farmer/journal/page.tsx` |
| F7 | Profile Settings | P2 | `apps/web/app/(dashboard)/farmer/profile/page.tsx` |

## 🏛️ Admin & Expert Zone (Govt/Specialists)
| ID | Page Name | Priority | Folder Path |
|----|-----------|----------|-------------|
| A1 | Expert Review Queue | P0 | `apps/admin/app/(dashboard)/expert/review/page.tsx` |
| A2 | National Overview | P0 | `apps/admin/app/(dashboard)/national/page.tsx` |
| A3 | AI Governance | P1 | `apps/admin/app/(dashboard)/ai-governance/page.tsx` |
| A4 | Knowledge Manager | P1 | `apps/admin/app/(dashboard)/knowledge/page.tsx` |
| A5 | Regional Analytics | P1 | `apps/admin/app/(dashboard)/regions/page.tsx` |
| A6 | User Management | P2 | `apps/admin/app/(dashboard)/users/page.tsx` |
| A7 | System Monitoring | P2 | `apps/admin/app/(dashboard)/monitoring/page.tsx` |
| A8 | Platform Settings | P2 | `apps/admin/app/(dashboard)/settings/page.tsx` |

---

## 🛠️ Implementation Strategy
1. **Design First**: Generate design in Stitch using the `DESIGN_SYSTEM.md` tokens.
2. **Context**: Create a `PAGE_SPEC.md` for each P0 page.
3. **Agent Build**: Antigravity implements one page at a time.
