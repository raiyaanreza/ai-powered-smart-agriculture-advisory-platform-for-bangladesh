"""
AgriVision Platform - Database Seed Script (matching actual Supabase schema)
"""
import sys, os, random, uuid
from datetime import datetime, timedelta

sys.stdout.reconfigure(encoding='utf-8')

from supabase import create_client, Client

SUPABASE_URL = "https://lhnucgxjultsrkjvsjrz.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobnVjZ3hqdWx0c3JranZzanJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc4Mjg4OSwiZXhwIjoyMDk0MzU4ODg5fQ.ohLFbWBtaXkf8V-vTV_8kN38vpi6dv9Y7A0S98cvi14"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

DISTRICTS = [
    {"name": "Dhaka",      "lat": 23.8103, "lon": 90.4125},
    {"name": "Chittagong", "lat": 22.3569, "lon": 91.7832},
    {"name": "Rajshahi",   "lat": 24.3745, "lon": 88.6042},
    {"name": "Sylhet",     "lat": 24.8949, "lon": 91.8687},
    {"name": "Khulna",     "lat": 22.8456, "lon": 89.5403},
    {"name": "Barisal",    "lat": 22.7010, "lon": 90.3535},
    {"name": "Rangpur",    "lat": 25.7439, "lon": 89.2752},
    {"name": "Mymensingh", "lat": 24.7471, "lon": 90.4203},
    {"name": "Comilla",    "lat": 23.4607, "lon": 91.1809},
    {"name": "Jessore",    "lat": 23.1664, "lon": 89.2191},
    {"name": "Bogra",      "lat": 24.8510, "lon": 89.3697},
    {"name": "Dinajpur",   "lat": 25.6279, "lon": 88.6338},
    {"name": "Tangail",    "lat": 24.2513, "lon": 89.9167},
    {"name": "Noakhali",   "lat": 22.8696, "lon": 91.0995},
    {"name": "Pabna",      "lat": 24.0064, "lon": 89.2372},
]

DISEASES = [
    {"id": "rice-blb",           "name": "Bacterial Leaf Blight", "nameBn": "ব্যাকটেরিয়াজনিত পাতা পোড়া", "crop": "Rice",     "type": "Bacterial",   "severity": "High"},
    {"id": "rice-brown-spot",    "name": "Brown Spot",            "nameBn": "বাদামী দাগ রোগ",              "crop": "Rice",     "type": "Fungal",      "severity": "Medium"},
    {"id": "rice-leaf-blast",    "name": "Leaf Blast",            "nameBn": "পাতা ব্লাস্ট",                "crop": "Rice",     "type": "Fungal",      "severity": "High"},
    {"id": "rice-hispa",         "name": "Rice Hispa",            "nameBn": "ধানের পামরি পোকা",            "crop": "Rice",     "type": "Pest",        "severity": "High"},
    {"id": "rice-sheath-blight", "name": "Sheath Blight",        "nameBn": "খোল পচা রোগ",                 "crop": "Rice",     "type": "Fungal",      "severity": "High"},
    {"id": "rice-leaf-scald",    "name": "Leaf Scald",            "nameBn": "পাতা পোড়া (Leaf Scald)",     "crop": "Rice",     "type": "Fungal",      "severity": "Medium"},
    {"id": "rice-narrow-brown",  "name": "Narrow Brown Leaf Spot","nameBn": "সংকীর্ণ বাদামী দাগ",         "crop": "Rice",     "type": "Fungal",      "severity": "Low"},
    {"id": "rice-healthy",       "name": "Healthy Rice",          "nameBn": "সুস্থ ধান গাছ",               "crop": "Rice",     "type": "Healthy",     "severity": "Low"},
    {"id": "cabbage-alternaria", "name": "Alternaria Spot",       "nameBn": "বাঁধাকপির অল্টারনারিয়া",    "crop": "Brassica", "type": "Fungal",      "severity": "Medium"},
    {"id": "cabbage-black-rot",  "name": "Black Rot",             "nameBn": "কালো পচা রোগ",                "crop": "Brassica", "type": "Bacterial",   "severity": "High"},
    {"id": "cabbage-downy-mildew","name": "Downy Mildew",         "nameBn": "বাঁধাকপির ডাউনি মিলডিউ",    "crop": "Brassica", "type": "Fungal",      "severity": "Medium"},
    {"id": "cauliflower-soft-rot","name": "Bacterial Soft Rot",   "nameBn": "নরম পচা রোগ",                 "crop": "Brassica", "type": "Bacterial",   "severity": "High"},
]

FARMER_PROFILES = [
    {"name": "Abdur Rahman",     "email": "abdur.rahman@agrivision.bd",    "district": "Rajshahi",   "crop": "Rice",     "acres": 5.5},
    {"name": "Mohammad Ali",     "email": "mohammad.ali@agrivision.bd",    "district": "Rangpur",    "crop": "Rice",     "acres": 8.0},
    {"name": "Karim Uddin",      "email": "karim.uddin@agrivision.bd",     "district": "Dinajpur",   "crop": "Rice",     "acres": 3.5},
    {"name": "Rahim Miah",       "email": "rahim.miah@agrivision.bd",      "district": "Bogra",      "crop": "Wheat",    "acres": 6.2},
    {"name": "Jalal Ahmed",      "email": "jalal.ahmed@agrivision.bd",     "district": "Mymensingh", "crop": "Rice",     "acres": 4.8},
    {"name": "Nurul Islam",      "email": "nurul.islam@agrivision.bd",     "district": "Tangail",    "crop": "Rice",     "acres": 7.1},
    {"name": "Selim Hossain",    "email": "selim.hossain@agrivision.bd",   "district": "Khulna",     "crop": "Rice",     "acres": 2.5},
    {"name": "Faruk Sheikh",     "email": "faruk.sheikh@agrivision.bd",    "district": "Jessore",    "crop": "Brassica", "acres": 3.0},
    {"name": "Anwar Hussain",    "email": "anwar.hussain@agrivision.bd",   "district": "Pabna",      "crop": "Rice",     "acres": 9.0},
    {"name": "Siddiqur Rahman",  "email": "siddiqur.rahman@agrivision.bd", "district": "Comilla",    "crop": "Rice",     "acres": 5.0},
    {"name": "Mokbul Hossain",   "email": "mokbul.hossain@agrivision.bd",  "district": "Noakhali",   "crop": "Brassica", "acres": 4.0},
    {"name": "Zahurul Islam",    "email": "zahurul.islam@agrivision.bd",   "district": "Sylhet",     "crop": "Rice",     "acres": 6.5},
    {"name": "Abul Kalam",       "email": "abul.kalam@agrivision.bd",      "district": "Barisal",    "crop": "Rice",     "acres": 3.8},
    {"name": "Motahar Hossain",  "email": "motahar.hossain@agrivision.bd", "district": "Chittagong", "crop": "Rice",     "acres": 7.5},
    {"name": "Nazrul Islam",     "email": "nazrul.islam@agrivision.bd",    "district": "Dhaka",      "crop": "Brassica", "acres": 2.2},
]

ADMIN_PROFILES = [
    {"name": "System Admin", "email": "admin@agrivision.bd", "district": "Dhaka", "role": "admin"}
]

def rdate(days_back=60):
    return datetime.utcnow() - timedelta(
        days=random.randint(0, days_back),
        hours=random.randint(0, 23),
        minutes=random.randint(0, 59)
    )

def iso(dt): return dt.isoformat() + "Z"


# ── 1. Upsert diseases ─────────────────────────────────────────────────────
def seed_diseases():
    print("Seeding diseases...")
    records = []
    for d in DISEASES:
        records.append({
            "id": d["id"],
            "name": d["name"],
            "namebn": d["nameBn"],
            "crop": d["crop"],
            "type": d["type"],
            "severity": d["severity"],
            "image": f"/models/{d['crop']}__{d['name'].replace(' ', '_')}/0001.jpg",
            "symptoms": ["Visible leaf damage", "Discoloration of leaves", "Reduced crop yield"],
            "management": ["Apply recommended treatment", "Use resistant varieties", "Proper field hygiene"],
        })
    for r in records:
        supabase.table("diseases").upsert(r, on_conflict="id").execute()
    print(f"  Done: {len(records)} diseases")


# ── 2. Seed farmer profiles via Auth Admin API ───────────────────────────
def seed_profiles():
    print("Seeding profiles (via auth admin)...")
    
    existing = supabase.table("profiles").select("id").eq("role", "farmer").eq("is_verified", True).execute()
    if existing.data and len(existing.data) >= 10:
        print(f"  Skipped: {len(existing.data)} farmer profiles already exist (but proceeding to check admin)")
        # return [p["id"] for p in existing.data]

    inserted_ids = []
    all_profiles = list(FARMER_PROFILES) + [
        {"name": f"Pending Farmer {j+1}", "email": f"pending.farmer.{j+1}@agrivision.bd",
         "district": DISTRICTS[j]["name"], "crop": "Rice", "acres": 2.0, "pending": True}
        for j in range(4)
    ]

    for p in all_profiles:
        is_pending = p.get("pending", False)
        try:
            auth_res = supabase.auth.admin.create_user({
                "email": p["email"],
                "password": "AgriVision@2026!",
                "email_confirm": True,
                "user_metadata": {"full_name": p["name"], "role": "farmer"}
            })
            uid = auth_res.user.id
        except Exception as ex:
            msg = str(ex)
            if "already been registered" in msg or "already exists" in msg:
                # fetch existing uid
                try:
                    users_page = supabase.auth.admin.list_users()
                    uid = next((u.id for u in users_page if getattr(u, 'email', '') == p["email"]), None)
                    if not uid:
                        print(f"    Could not find existing user: {p['email']}")
                        continue
                except Exception:
                    print(f"    Skip (list failed): {p['email']}")
                    continue
            else:
                print(f"    Auth create failed for {p['name']}: {ex}")
                continue

        # Upsert profile
        supabase.table("profiles").upsert({
            "id": uid,
            "full_name": p["name"],
            "role": "farmer",
            "is_verified": not is_pending,
            "district": p["district"],
            "upazila": f"{p['district']} Sadar",
            "language": "bn",
            "onboarding_completed": True,
            "application_data": {
                "phone": f"+8801{random.randint(700000000, 999999999)}",
                "farm_size_acres": p["acres"],
                "primary_crop": p["crop"],
                "experience_years": random.randint(2, 30),
                "nid_number": f"BD{random.randint(1000000000, 9999999999)}",
            }
        }, on_conflict="id").execute()

        if not is_pending:
            inserted_ids.append(uid)
            print(f"    Created: {p['name']}")

    # Seed admins
    for p in ADMIN_PROFILES:
        try:
            auth_res = supabase.auth.admin.create_user({
                "email": p["email"],
                "password": "AgriVision@2026!",
                "email_confirm": True,
                "user_metadata": {"full_name": p["name"], "role": "admin"}
            })
            uid = auth_res.user.id
        except Exception as ex:
            msg = str(ex)
            if "already been registered" in msg or "already exists" in msg:
                try:
                    users_page = supabase.auth.admin.list_users()
                    uid = next((u.id for u in users_page if getattr(u, 'email', '') == p["email"]), None)
                    if not uid: continue
                except Exception:
                    continue
            else:
                continue
                
        supabase.table("profiles").upsert({
            "id": uid,
            "full_name": p["name"],
            "role": "admin",
            "is_verified": True,
            "district": p["district"],
            "language": "en"
        }, on_conflict="id").execute()
        print(f"    Created Admin: {p['name']}")

    print(f"  Done: {len(inserted_ids)} verified + 4 pending farmers + {len(ADMIN_PROFILES)} admins")
    return inserted_ids


# ── 3. Seed diagnoses ──────────────────────────────────────────────────────
def seed_diagnoses(farmer_ids):
    print("Seeding diagnoses...")
    if not farmer_ids:
        print("  Skipped: no farmer_ids")
        return

    existing = supabase.table("diagnoses").select("id", count="exact").execute()
    if existing.count and existing.count >= 80:
        print(f"  Skipped: {existing.count} diagnoses already exist")
        return

    # Build per-disease realistic counts (Rice Leaf Blast most common)
    disease_weights = [3, 2, 5, 4, 3, 2, 1, 1, 2, 3, 2, 2]  # matches DISEASES list
    
    diagnoses = []
    for i in range(130):
        disease = random.choices(DISEASES, weights=disease_weights[:len(DISEASES)], k=1)[0]
        farmer_id = random.choice(farmer_ids)
        district = random.choice(DISTRICTS)
        dt = rdate(45)
        conf = round(random.uniform(0.72, 0.98), 3)
        
        recommendations = {
            "Bacterial": "Apply Copper Oxychloride + Streptomycin Sulphate spray immediately.",
            "Fungal":    "Apply Tricyclazole or Carbendazim as per label dose.",
            "Pest":      "Deploy light traps. Apply Chlorpyrifos if population exceeds threshold.",
            "Healthy":   "No treatment required. Maintain proper field hygiene.",
            "Nutritional":"Conduct soil test and apply balanced fertilizers including micronutrients.",
        }
        
        diagnoses.append({
            "id": str(uuid.uuid4()),
            "farmer_id": farmer_id,
            "image_url": f"/models/{disease['crop']}__{disease['name'].replace(' ', '_')}/0001.jpg",
            "disease_detected": f"{disease['crop']} - {disease['name']}",
            "confidence_score": conf,
            "severity": disease["severity"],
            "expert_reviewed": random.random() > 0.35,
            "expert_notes": recommendations.get(disease["type"], "Consult local agriculture office."),
            "created_at": iso(dt),
        })
    
    # Batch insert in chunks of 20
    chunk_size = 20
    for i in range(0, len(diagnoses), chunk_size):
        chunk = diagnoses[i:i+chunk_size]
        supabase.table("diagnoses").insert(chunk).execute()
    
    print(f"  Done: {len(diagnoses)} diagnoses inserted")


# ── 4. Seed outbreak reports ───────────────────────────────────────────────
def seed_reports():
    print("Seeding outbreak reports...")
    
    existing = supabase.table("reports").select("id", count="exact").execute()
    if existing.count and existing.count >= 20:
        print(f"  Skipped: {existing.count} reports already exist")
        return

    high_risk = [d for d in DISEASES if d["severity"] == "High"]
    reports = []
    
    for i in range(40):
        disease = random.choice(high_risk if i < 25 else DISEASES)
        district = random.choice(DISTRICTS)
        dt = rdate(30)
        reports.append({
            "id": str(uuid.uuid4()),
            "disease_name": disease["name"],
            "latitude": round(district["lat"] + random.uniform(-0.5, 0.5), 6),
            "longitude": round(district["lon"] + random.uniform(-0.5, 0.5), 6),
            "severity": disease["severity"],
            "location_name": district["name"],
            "created_at": iso(dt),
        })
    
    supabase.table("reports").insert(reports).execute()
    print(f"  Done: {len(reports)} outbreak reports inserted")


# ── 5. Seed notifications ──────────────────────────────────────────────────
def seed_notifications():
    print("Seeding notifications...")
    
    existing = supabase.table("notifications").select("id", count="exact").execute()
    if existing.count and existing.count >= 5:
        print(f"  Skipped: {existing.count} notifications already exist")
        return

    alerts = [
        {"title": "Leaf Blast Outbreak - Sylhet Division",       "message": "High severity Leaf Blast detected across 12 upazilas in Sylhet. Farmers advised to apply Tricyclazole immediately.", "type": "critical", "target_role": "farmer"},
        {"title": "Cyclone Alert - Coastal Districts",           "message": "Cyclone REMAL expected to make landfall near Barisal and Khulna. Harvest early-ripening crops within 48 hours.",    "type": "warning",  "target_role": "all"},
        {"title": "New Resistant Rice Variety Released",         "message": "BRRI dhan102 - a BLB-resistant high-yield variety now available from DAE offices nationwide.",                       "type": "info",     "target_role": "farmer"},
        {"title": "Sheath Blight Alert - Rajshahi",             "message": "Rapid spread of Sheath Blight reported in Rajshahi and Chapainawabganj. Apply Hexaconazole immediately.",             "type": "critical", "target_role": "farmer"},
        {"title": "Pest Surge - Rice Hispa - Rangpur",          "message": "Rice Hispa population exceeding economic threshold in Rangpur division. Deploy light traps.",                         "type": "warning",  "target_role": "farmer"},
        {"title": "AgriVision AI Model Updated to v3.2",        "message": "Diagnosis accuracy improved to 94.2% with the latest model update covering 15 new disease categories.",                "type": "info",     "target_role": "all"},
        {"title": "Brown Planthopper - Emergency Advisory",     "message": "BPH outbreak confirmed in 8 districts. Imidacloprid or Buprofezin spraying recommended urgently.",                    "type": "critical", "target_role": "farmer"},
        {"title": "Flash Flood Warning - Sylhet & Sunamganj",   "message": "Unexpected rainfall may cause flash floods. Avoid field operations and secure irrigation equipment.",                  "type": "warning",  "target_role": "all"},
        {"title": "Government Subsidy Scheme - Fertilizer 2026","message": "DAE has announced subsidized urea and DAP allocation for registered farmers. Visit local agriculture office.",        "type": "info",     "target_role": "farmer"},
        {"title": "Bacterial Leaf Blight Alert - Khulna",       "message": "BLB detected in 5 upazilas of Khulna. Avoid excessive nitrogen fertilizer and drain fields promptly.",                "type": "critical", "target_role": "farmer"},
    ]
    
    records = []
    for i, a in enumerate(alerts):
        records.append({
            "id": str(uuid.uuid4()),
            **a,
            "created_at": iso(rdate(15)),
        })
    
    supabase.table("notifications").insert(records).execute()
    print(f"  Done: {len(records)} notifications inserted")


# ── Main ───────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("\n[AgriVision] Database Seeder Starting...\n")
    try:
        seed_diseases()
        farmer_ids = seed_profiles()
        seed_diagnoses(farmer_ids)
        seed_reports()
        seed_notifications()
        print("\n[OK] All seed data inserted successfully!\n")
        print("Summary:")
        for table in ["diseases", "profiles", "diagnoses", "reports", "notifications"]:
            res = supabase.table(table).select("id", count="exact").execute()
            print(f"  {table}: {res.count} records")
    except Exception as e:
        print(f"\n[ERROR] {e}")
        import traceback; traceback.print_exc()
