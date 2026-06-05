# ══════════════════════════════════════════════════════════════════════════════
# Behaviour Tracking Model
# Smart Virtual Tourist Guide — Sri Lanka
# Technique: Time-Series Analysis (scikit-learn)
# Input:  GPS location, spending patterns, timestamps
# Output: Overspending alerts, replanning triggers
# ══════════════════════════════════════════════════════════════════════════════

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
import warnings
warnings.filterwarnings('ignore')

# ── STEP 1: Load Behaviour Data ───────────────────────────────────────────────
def load_data():
    df = pd.read_csv('data/user_behavior_logs.csv')
    print("Behaviour data loaded!")
    print(f"Total records : {len(df)}")
    print(f"Columns       : {list(df.columns)}")
    print()
    return df

# ── STEP 2: Feature Engineering ───────────────────────────────────────────────
def prepare_features(df):
    """
    Extracts time-series features from the behaviour logs.
    """
    df = df.copy()

    # Extract time features from timestamp
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df['hour']      = df['timestamp'].dt.hour
    df['day_of_week']= df['timestamp'].dt.dayofweek

    # Budget usage percentage
    df['budget_usage_pct'] = (
        df['cumulative_spend_lkr'] / df['daily_budget_lkr'] * 100
    ).round(2)

    # Spending rate (spending per minute of dwell time)
    df['spending_rate'] = (
        df['spending_lkr'] / df['dwell_time_minutes']
    ).round(2)

    # Encode categorical columns
    le_location = LabelEncoder()
    le_activity = LabelEncoder()
    le_weather  = LabelEncoder()

    df['location_enc'] = le_location.fit_transform(df['location'])
    df['activity_enc'] = le_activity.fit_transform(df['activity_type'])
    df['weather_enc']  = le_weather.fit_transform(df['weather'])

    encoders = {
        'location': le_location,
        'activity': le_activity,
        'weather':  le_weather,
    }

    return df, encoders

# ── STEP 3: Train Overspending Detection Model ────────────────────────────────
def train_overspending_model(df):
    """
    Trains a Random Forest classifier to detect overspending.
    Target: is_overspending (0 = normal, 1 = overspending)
    """

    feature_cols = [
        'hour',
        'day_of_week',
        'trip_day',
        'spending_lkr',
        'budget_usage_pct',
        'spending_rate',
        'dwell_time_minutes',
        'daily_budget_lkr',
        'location_enc',
        'activity_enc',
        'weather_enc',
    ]

    X = df[feature_cols]
    y = df['is_overspending']

    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Scale features
    scaler = MinMaxScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled  = scaler.transform(X_test)

    # Train Random Forest
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train_scaled, y_train)

    # Evaluate
    y_pred    = model.predict(X_test_scaled)
    accuracy  = accuracy_score(y_test, y_pred)

    print("=" * 60)
    print("Overspending Detection Model — Training Results")
    print("=" * 60)
    print(f"Training samples : {len(X_train)}")
    print(f"Testing samples  : {len(X_test)}")
    print(f"Model Accuracy   : {accuracy * 100:.2f}%")
    print()
    print("Classification Report:")
    print(classification_report(y_test, y_pred,
          target_names=['Normal', 'Overspending']))

    return model, scaler, feature_cols

# ── STEP 4: Train Replanning Trigger Model ────────────────────────────────────
def train_replanning_model(df):
    """
    Trains a model to predict when replanning should be triggered.
    Target: replanning_triggered (0 = no replan, 1 = replan needed)
    """

    feature_cols = [
        'hour',
        'trip_day',
        'spending_lkr',
        'budget_usage_pct',
        'spending_rate',
        'dwell_time_minutes',
        'is_overspending',
        'location_enc',
        'weather_enc',
    ]

    X = df[feature_cols]
    y = df['replanning_triggered']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    scaler = MinMaxScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled  = scaler.transform(X_test)

    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=8,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train_scaled, y_train)

    y_pred   = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)

    print("=" * 60)
    print("Replanning Trigger Model — Training Results")
    print("=" * 60)
    print(f"Training samples : {len(X_train)}")
    print(f"Testing samples  : {len(X_test)}")
    print(f"Model Accuracy   : {accuracy * 100:.2f}%")
    print()
    print("Classification Report:")
    print(classification_report(y_test, y_pred,
          target_names=['No Replan', 'Replan Needed']))

    return model, scaler, feature_cols

# ── STEP 5: Real-Time Prediction ──────────────────────────────────────────────
def predict_behaviour(
    overspend_model, overspend_scaler, overspend_features,
    replan_model,    replan_scaler,    replan_features,
    df, encoders, tourist_data
):
    """
    Predicts overspending and replanning for a real-time tourist activity.

    tourist_data: dict with current activity details
    """

    print("\n" + "=" * 60)
    print("Real-Time Behaviour Prediction")
    print("=" * 60)
    print(f"Tourist Data: {tourist_data}")

    # Encode location, activity, weather
    try:
        loc_enc = encoders['location'].transform([tourist_data['location']])[0]
    except:
        loc_enc = 0
    try:
        act_enc = encoders['activity'].transform([tourist_data['activity_type']])[0]
    except:
        act_enc = 0
    try:
        wea_enc = encoders['weather'].transform([tourist_data['weather']])[0]
    except:
        wea_enc = 0

    budget_usage_pct = (tourist_data['cumulative_spend_lkr'] /
                        tourist_data['daily_budget_lkr'] * 100)
    spending_rate    = (tourist_data['spending_lkr'] /
                        tourist_data['dwell_time_minutes'])

    # Overspending prediction
    os_input = pd.DataFrame([{
        'hour':               tourist_data['hour'],
        'day_of_week':        tourist_data['day_of_week'],
        'trip_day':           tourist_data['trip_day'],
        'spending_lkr':       tourist_data['spending_lkr'],
        'budget_usage_pct':   budget_usage_pct,
        'spending_rate':      spending_rate,
        'dwell_time_minutes': tourist_data['dwell_time_minutes'],
        'daily_budget_lkr':   tourist_data['daily_budget_lkr'],
        'location_enc':       loc_enc,
        'activity_enc':       act_enc,
        'weather_enc':        wea_enc,
    }])

    os_scaled    = overspend_scaler.transform(os_input)
    os_pred      = overspend_model.predict(os_scaled)[0]
    os_prob      = overspend_model.predict_proba(os_scaled)[0][1]

    # Replanning prediction
    rp_input = pd.DataFrame([{
        'hour':               tourist_data['hour'],
        'trip_day':           tourist_data['trip_day'],
        'spending_lkr':       tourist_data['spending_lkr'],
        'budget_usage_pct':   budget_usage_pct,
        'spending_rate':      spending_rate,
        'dwell_time_minutes': tourist_data['dwell_time_minutes'],
        'is_overspending':    int(os_pred),
        'location_enc':       loc_enc,
        'weather_enc':        wea_enc,
    }])

    rp_scaled = replan_scaler.transform(rp_input)
    rp_pred   = replan_model.predict(rp_scaled)[0]
    rp_prob   = replan_model.predict_proba(rp_scaled)[0][1]

    # Results
    print(f"\nBudget Usage       : {budget_usage_pct:.1f}%")
    print(f"Overspending       : {'⚠ YES' if os_pred else '✅ NO'} (confidence: {os_prob*100:.1f}%)")
    print(f"Replanning Needed  : {'🔄 YES' if rp_pred else '✅ NO'} (confidence: {rp_prob*100:.1f}%)")

    if os_pred:
        print(f"\n🔔 Budget Guardian Alert!")
        print(f"   You have used {budget_usage_pct:.1f}% of today's budget.")
        print(f"   Suggestion: Switch to cheaper meal options to save LKR.")

    if rp_pred:
        print(f"\n🔄 Replanning Triggered!")
        print(f"   Itinerary will be adjusted for remaining activities.")

    print("=" * 60)

    return {
        'is_overspending':       int(os_pred),
        'overspend_probability': round(os_prob, 4),
        'replanning_triggered':  int(rp_pred),
        'replan_probability':    round(rp_prob, 4),
        'budget_usage_pct':      round(budget_usage_pct, 2),
    }

# ── MAIN ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":

    print("=" * 60)
    print("Smart Virtual Tourist Guide — Behaviour Tracking Model")
    print("=" * 60)

    # Load and prepare data
    df, encoders = prepare_features(load_data())

    # Train models
    print("\nTraining Overspending Detection Model...")
    os_model, os_scaler, os_features = train_overspending_model(df)

    print("\nTraining Replanning Trigger Model...")
    rp_model, rp_scaler, rp_features = train_replanning_model(df)

    # ── TEST CASE 1: Tourist overspending at Sigiriya ─────────────────────────
    predict_behaviour(
        os_model, os_scaler, os_features,
        rp_model, rp_scaler, rp_features,
        df, encoders,
        tourist_data={
            'hour':               14,
            'day_of_week':        2,
            'trip_day':           3,
            'location':           'Sigiriya',
            'activity_type':      'sightseeing',
            'weather':            'sunny',
            'spending_lkr':       4500,
            'cumulative_spend_lkr': 22000,
            'daily_budget_lkr':   20000,
            'dwell_time_minutes': 120,
        }
    )

    # ── TEST CASE 2: Tourist on track at Ella ─────────────────────────────────
    predict_behaviour(
        os_model, os_scaler, os_features,
        rp_model, rp_scaler, rp_features,
        df, encoders,
        tourist_data={
            'hour':               10,
            'day_of_week':        1,
            'trip_day':           2,
            'location':           'Ella',
            'activity_type':      'hiking',
            'weather':            'cloudy',
            'spending_lkr':       1200,
            'cumulative_spend_lkr': 8000,
            'daily_budget_lkr':   15000,
            'dwell_time_minutes': 90,
        }
    )

    # ── TEST CASE 3: Tourist overspending in Colombo ──────────────────────────
    predict_behaviour(
        os_model, os_scaler, os_features,
        rp_model, rp_scaler, rp_features,
        df, encoders,
        tourist_data={
            'hour':               19,
            'day_of_week':        5,
            'trip_day':           1,
            'location':           'Colombo',
            'activity_type':      'food',
            'weather':            'rainy',
            'spending_lkr':       6000,
            'cumulative_spend_lkr': 28000,
            'daily_budget_lkr':   25000,
            'dwell_time_minutes': 60,
        }
    )

    print("\nBehaviour Tracking Model complete! ✅")