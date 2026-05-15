import sys
import os
import importlib.util


def verify():
    # Load module
    script_dir = os.path.dirname(os.path.abspath(__file__))
    main_path = os.path.join(
        script_dir, "..", "services", "agent-orchestrator", "app", "main.py"
    )

    spec = importlib.util.spec_from_file_location("main", main_path)
    main = importlib.util.module_from_spec(spec)
    sys.modules["main"] = main
    spec.loader.exec_module(main)

    test_image_dir = os.path.join(script_dir, "..", "models", "test images")
    test_groups = ["Rice__Leaf_Blast", "Rice__Healthy_Leaf", "Potato__Early_Blight"]

    print("--- VERIFYING ORCHESTRATOR PIPELINE ---")
    for g in test_groups:
        d = os.path.join(test_image_dir, g)
        if not os.path.exists(d):
            continue

        imgs = [f for f in os.listdir(d) if f.endswith(".jpg") or f.endswith(".jpeg")]
        if imgs:
            img_path = os.path.join(d, imgs[0])
            print(f"\nTESTING: {g}")
            print(f"IMAGE: {imgs[0]}")

            res = main.orchestrator_app.invoke(
                {"image_path": img_path, "crop_type": None, "disease_prediction": None}
            )
            crop = res.get("crop_type")
            disease = res.get("disease_prediction")

            print(f"RESULT: Crop -> {crop}")
            print(f"RESULT: Disease -> {disease}")


if __name__ == "__main__":
    verify()
