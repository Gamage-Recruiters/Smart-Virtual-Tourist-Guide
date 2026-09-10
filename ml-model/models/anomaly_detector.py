"""
anomaly_detector.py  —  Model 2
Trains Isolation Forest on service_bids.csv (labelled anomaly data).
Detects overpriced bids submitted through the marketplace.
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'data'))

import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import classification_report, confusion_matrix
import joblib, warnings; warnings.filterwarnings("ignore")

from preprocess import load_bids

SAVE_DIR     = os.path.join(os.path.dirname(__file__), '..', 'saved_models')
MODEL_PATH   = os.path.join(SAVE_DIR, 'anomaly_detector.pkl')
ENCODER_PATH = os.path.join(SAVE_DIR, 'label_encoder.pkl')
SCALER_PATH  = os.path.join(SAVE_DIR, 'scaler.pkl')
STATS_PATH   = os.path.join(SAVE_DIR, 'service_stats.pkl')

def train_model():
    os.makedirs(SAVE_DIR, exist_ok=True)
    df = load_bids()

    # Encode service type
    le = LabelEncoder()
    df["service_enc"] = le.fit_transform(df["service_type"])

    # Compute per-service price stats for rule-based fallback
    stats = df[df["is_anomaly"]==0].groupby("service_type")["bid_price_lkr"].agg(
        avg_price="mean", max_price="max", min_price="min", std_price="std"
    ).fillna(0)
    stats["threshold"] = stats["avg_price"] + 2 * stats["std_price"].clip(lower=100)

    # Features
    X = df[["service_enc","bid_price_lkr"]].values
    y = df["is_anomaly"].values

    scaler = StandardScaler()
    X_sc   = scaler.fit_transform(X)

    contamination = round(float(y.mean()), 2)
    model = IsolationForest(
        n_estimators=300,
        contamination=contamination,
        random_state=42
    )
    model.fit(X_sc)

    joblib.dump(model,  MODEL_PATH)
    joblib.dump(le,     ENCODER_PATH)
    joblib.dump(scaler, SCALER_PATH)
    joblib.dump(stats,  STATS_PATH)

    # Evaluation
    preds = (model.predict(X_sc) == -1).astype(int)
    print(f"\n[Anomaly Detector] Trained on {len(df)} bids "
          f"({contamination*100:.0f}% anomalies)")
    print("\nClassification report:")
    print(classification_report(y, preds, target_names=["normal","anomaly"]))
    print("Confusion matrix (rows=actual, cols=predicted):")
    print(confusion_matrix(y, preds))
    print(f"\nService stats learned from {len(stats)} service types:")
    print(stats[["avg_price","threshold"]].round(0).to_string())

    return model, le, scaler, stats

def load_model():
    if not os.path.exists(MODEL_PATH):
        print("[Anomaly Detector] No saved model — training now...")
        return train_model()
    return (joblib.load(MODEL_PATH), joblib.load(ENCODER_PATH),
            joblib.load(SCALER_PATH), joblib.load(STATS_PATH))

def predict_anomaly(service_type, price_lkr):
    """
    Input  : service_type (e.g. 'van_full_day'), price_lkr (bid amount)
    Output : dict with is_anomaly, alert_message, market benchmark
    """
    model, le, scaler, stats = load_model()

    # Encode
    known = list(le.classes_)
    enc   = le.transform([service_type])[0] if service_type in known else 0

    X_in = np.array([[enc, price_lkr]])
    X_sc = scaler.transform(X_in)
    ml_flag   = (model.predict(X_sc)[0] == -1)
    score     = model.decision_function(X_sc)[0]

    # Rule-based check from training data stats
    rule_flag = False
    benchmark = None
    if service_type in stats.index:
        row = stats.loc[service_type]
        rule_flag = price_lkr > row["threshold"]
        benchmark = {
            "avg_price_lkr":   round(row["avg_price"], 0),
            "max_normal_lkr":  round(row["max_price"], 0),
            "threshold_lkr":   round(row["threshold"], 0),
            "price_vs_avg_pct": round((price_lkr/row["avg_price"] - 1)*100, 1)
                                if row["avg_price"] > 0 else None,
        }

    is_anomaly  = bool(ml_flag or rule_flag)
    confidence  = round(max(0, min(1, 0.5 - score)), 2)
    alert       = None
    recommendation = None

    if is_anomaly:
        alert = (f"⚠️  {service_type.replace('_',' ')} bid of "
                 f"LKR {price_lkr:,.0f} looks overpriced.")
        if benchmark:
            alert += (f" Market avg: LKR {benchmark['avg_price_lkr']:,.0f} "
                      f"({benchmark['price_vs_avg_pct']:+.0f}%).")
        recommendation = "Request another bid or negotiate to market rate."
    else:
        recommendation = (f"✅ Price looks fair."
                         + (f" Market avg: LKR {benchmark['avg_price_lkr']:,.0f}."
                            if benchmark else ""))

    return {
        "is_anomaly":     is_anomaly,
        "ml_flagged":     bool(ml_flag),
        "rule_flagged":   bool(rule_flag),
        "confidence":     confidence,
        "service_type":   service_type,
        "price_lkr":      price_lkr,
        "benchmark":      benchmark,
        "alert_message":  alert,
        "recommendation": recommendation,
    }

if __name__ == "__main__":
    print("="*60)
    print("MODEL 2 — ANOMALY DETECTOR (trained from service_bids.csv)")
    print("="*60)
    train_model()

    tests = [
        ("tuk_tuk_per_km",  75,     "normal  — T001 B001"),
        ("tuk_tuk_per_km",  420,    "ANOMALY — T001 B002"),
        ("hotel_luxury",    28000,  "normal  — T002 B003"),
        ("hotel_luxury",    95000,  "ANOMALY — T002 B004"),
        ("van_full_day",    12000,  "normal  — T003 B005"),
        ("van_full_day",    58000,  "ANOMALY — T003 B006"),
        ("meal_local",      350,    "normal  — T004 B008"),
        ("meal_local",      2800,   "ANOMALY — T004 B009"),
        ("guide_per_day",   5500,   "normal  — T006 B014"),
        ("guide_per_day",   38000,  "ANOMALY — T006 B015"),
        ("activity_surf",   4500,   "normal  — T005 B011"),
        ("activity_surf",   22000,  "ANOMALY — T005 B012"),
    ]
    print("\n── Test results against actual bid data ──")
    print(f"{'Service':25} {'Price LKR':>10}  {'Result':12}  {'Expected'}")
    print("-"*72)
    for svc, price, expected in tests:
        r = predict_anomaly(svc, price)
        status = "🚨 ANOMALY" if r["is_anomaly"] else "✅ Normal  "
        print(f"{svc:25} {price:>10,}  {status}  ← {expected}")