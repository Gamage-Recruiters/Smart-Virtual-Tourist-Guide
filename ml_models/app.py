# ══════════════════════════════════════════════════════════════════════════════
# Flask API Server
# Smart Virtual Tourist Guide — Sri Lanka
# Connects all 3 ML models as REST API endpoints
# ══════════════════════════════════════════════════════════════════════════════

from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from sklearn.model_selection import train_test_split
from pulp import *
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)

# ── GLOBAL MODELS (loaded once at startup) ────────────────────────────────────
budget_model       = None
recommendation_df  = None
rec_encoders       = None
rec_scaler         = None
os_model           = None
os_scaler          = None
rp_model           = None
rp_scaler          = None
behaviour_encoders = None

# ══════════════════════════════════════════════════════════════════════════════
# STARTUP — Load & Train all models
# ══════════════════════════════════════════════════════════════════════════════
def load_and_train_models():
    global recommendation_df, rec_encoders, rec_scaler
    global os_model, os_scaler, rp_model, rp_scaler, behaviour_encoders

    print("Loading and training all ML models...")

    # ── Recommendation System ─────────────────────────────────────────────────
    df_rec = pd.read_csv('data/location_metadata.csv')
    le_nat  = LabelEncoder()
    le_int  = LabelEncoder()
    le_bud  = LabelEncoder()
    le_dest = LabelEncoder()
    scaler_rec = MinMaxScaler()

    df_rec['nationality_enc']  = le_nat.fit_transform(df_rec['nationality'])
    df_rec['interest_enc']     = le_int.fit_transform(df_rec['interest'])
    df_rec['budget_level_enc'] = le_bud.fit_transform(df_rec['budget_level'])
    df_rec['destination_enc']  = le_dest.fit_transform(df_rec['destination'])
    df_rec[['age_scaled', 'duration_scaled']] = scaler_rec.fit_transform(
        df_rec[['age', 'trip_duration']]
    )

    recommendation_df = df_rec
    rec_encoders = {'nationality': le_nat, 'interest': le_int,
                    'budget_level': le_bud, 'destination': le_dest}
    rec_scaler = scaler_rec

    # ── Behaviour Tracking ────────────────────────────────────────────────────
    df_beh = pd.read_csv('data/user_behavior_logs.csv')
    df_beh['timestamp']     = pd.to_datetime(df_beh['timestamp'])
    df_beh['hour']          = df_beh['timestamp'].dt.hour
    df_beh['day_of_week']   = df_beh['timestamp'].dt.dayofweek
    df_beh['budget_usage_pct'] = (df_beh['cumulative_spend_lkr'] / df_beh['daily_budget_lkr'] * 100).round(2)
    df_beh['spending_rate'] = (df_beh['spending_lkr'] / df_beh['dwell_time_minutes']).round(2)

    le_loc = LabelEncoder()
    le_act = LabelEncoder()
    le_wea = LabelEncoder()
    df_beh['location_enc'] = le_loc.fit_transform(df_beh['location'])
    df_beh['activity_enc'] = le_act.fit_transform(df_beh['activity_type'])
    df_beh['weather_enc']  = le_wea.fit_transform(df_beh['weather'])
    behaviour_encoders = {'location': le_loc, 'activity': le_act, 'weather': le_wea}

    os_features = ['hour','day_of_week','trip_day','spending_lkr',
                   'budget_usage_pct','spending_rate','dwell_time_minutes',
                   'daily_budget_lkr','location_enc','activity_enc','weather_enc']
    X_os = df_beh[os_features]
    y_os = df_beh['is_overspending']
    X_tr, X_te, y_tr, y_te = train_test_split(X_os, y_os, test_size=0.2, random_state=42)
    sc_os = MinMaxScaler()
    os_model_clf = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    os_model_clf.fit(sc_os.fit_transform(X_tr), y_tr)
    os_model  = os_model_clf
    os_scaler = sc_os

    rp_features = ['hour','trip_day','spending_lkr','budget_usage_pct',
                   'spending_rate','dwell_time_minutes','is_overspending',
                   'location_enc','weather_enc']
    X_rp = df_beh[rp_features]
    y_rp = df_beh['replanning_triggered']
    X_tr2, X_te2, y_tr2, y_te2 = train_test_split(X_rp, y_rp, test_size=0.2, random_state=42)
    sc_rp = MinMaxScaler()
    rp_model_clf = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    rp_model_clf.fit(sc_rp.fit_transform(X_tr2), y_tr2)
    rp_model  = rp_model_clf
    rp_scaler = sc_rp

    print("All models loaded and trained successfully! ✅")

# ══════════════════════════════════════════════════════════════════════════════
# API ENDPOINT 1 — Budget Optimizer
# POST /api/itinerary/generate
# ══════════════════════════════════════════════════════════════════════════════
@app.route('/api/itinerary/generate', methods=['POST'])
def generate_itinerary():
    try:
        data           = request.get_json()
        total_budget   = data.get('total_budget_lkr', 160000)
        num_days       = data.get('num_days', 7)
        preference     = data.get('preference', 'mid-range')

        preference_ranges = {
            'budget':    {'transport':(0.15,0.25),'food':(0.25,0.35),'stay':(0.30,0.40),'activity':(0.10,0.20),'emergency':(0.05,0.05)},
            'mid-range': {'transport':(0.18,0.28),'food':(0.22,0.32),'stay':(0.32,0.42),'activity':(0.12,0.22),'emergency':(0.05,0.05)},
            'luxury':    {'transport':(0.20,0.30),'food':(0.20,0.30),'stay':(0.35,0.45),'activity':(0.10,0.20),'emergency':(0.05,0.05)},
        }
        ranges     = preference_ranges.get(preference, preference_ranges['mid-range'])
        categories = ['transport','food','stay','activity','emergency']

        prob  = LpProblem("Budget_Optimization", LpMaximize)
        alloc = {c: LpVariable(f"alloc_{c}", lowBound=ranges[c][0], upBound=ranges[c][1]) for c in categories}
        prob += alloc['activity'] + alloc['food']
        prob += lpSum(alloc[c] for c in categories) == 1.0
        prob += alloc['emergency'] == 0.05
        prob += alloc['stay'] >= alloc['transport']
        prob.solve(PULP_CBC_CMD(msg=0))

        allocations   = {c: round(value(alloc[c]), 4) for c in categories}
        travel_days   = [1, num_days]
        day_weights   = [1.3 if d+1 in travel_days else (1.1 if (d+1)%3==0 else 1.0) for d in range(num_days)]
        total_weight  = sum(day_weights)
        daily_budgets = [round((w/total_weight)*total_budget) for w in day_weights]

        daily_plan = []
        for day in range(num_days):
            dt = daily_budgets[day]
            daily_plan.append({
                'day':           day + 1,
                'is_travel_day': day + 1 in travel_days,
                'total_lkr':     dt,
                'transport_lkr': round(dt * allocations['transport']),
                'food_lkr':      round(dt * allocations['food']),
                'stay_lkr':      round(dt * allocations['stay']),
                'activity_lkr':  round(dt * allocations['activity']),
                'emergency_lkr': round(dt * allocations['emergency']),
            })

        return jsonify({
            'status':      'success',
            'preference':  preference,
            'total_budget_lkr': total_budget,
            'num_days':    num_days,
            'allocations': allocations,
            'daily_plan':  daily_plan,
        }), 200

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


# ══════════════════════════════════════════════════════════════════════════════
# API ENDPOINT 2 — Recommendation System
# POST /api/ml/recommend
# ══════════════════════════════════════════════════════════════════════════════
@app.route('/api/ml/recommend', methods=['POST'])
def recommend():
    try:
        data          = request.get_json()
        age           = data.get('age', 30)
        nationality   = data.get('nationality', 'US')
        interest      = data.get('interest', 'history')
        budget_level  = data.get('budget_level', 'medium')
        trip_duration = data.get('trip_duration', 7)
        top_n         = data.get('top_n', 5)

        try:
            nat_enc = rec_encoders['nationality'].transform([nationality])[0]
        except:
            nat_enc = 0
        try:
            int_enc = rec_encoders['interest'].transform([interest])[0]
        except:
            int_enc = 0
        try:
            bud_enc = rec_encoders['budget_level'].transform([budget_level])[0]
        except:
            bud_enc = 1

        scaled = rec_scaler.transform(pd.DataFrame([{'age': age, 'trip_duration': trip_duration}]))[0]

        profile_vector = np.array([nat_enc, int_enc, bud_enc, scaled[0], scaled[1]]).reshape(1, -1)

        feature_cols = ['nationality_enc','interest_enc','budget_level_enc','age_scaled','duration_scaled']
        similarities = cosine_similarity(profile_vector, recommendation_df[feature_cols].values)[0]

        df_copy = recommendation_df.copy()
        df_copy['similarity_score'] = similarities
        df_copy['weighted_score']   = df_copy['similarity_score'] * df_copy['rating']

        recs = (df_copy.groupby('destination')
                .agg(avg_score=('weighted_score','mean'), avg_rating=('rating','mean'),
                     category=('category','first'), tags=('tags','first'),
                     entry_fee_lkr=('entry_fee_lkr','first'))
                .reset_index()
                .sort_values('avg_score', ascending=False)
                .head(top_n))

        return jsonify({
            'status':          'success',
            'tourist_profile': data,
            'recommendations': recs.to_dict(orient='records'),
        }), 200

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


# ══════════════════════════════════════════════════════════════════════════════
# API ENDPOINT 3 — Behaviour Tracking
# POST /api/ml/detect-anomaly
# ══════════════════════════════════════════════════════════════════════════════
@app.route('/api/ml/detect-anomaly', methods=['POST'])
def detect_anomaly():
    try:
        data = request.get_json()

        try:
            loc_enc = behaviour_encoders['location'].transform([data.get('location','Colombo')])[0]
        except:
            loc_enc = 0
        try:
            act_enc = behaviour_encoders['activity'].transform([data.get('activity_type','sightseeing')])[0]
        except:
            act_enc = 0
        try:
            wea_enc = behaviour_encoders['weather'].transform([data.get('weather','sunny')])[0]
        except:
            wea_enc = 0

        budget_usage_pct = (data['cumulative_spend_lkr'] / data['daily_budget_lkr'] * 100)
        spending_rate    = (data['spending_lkr'] / data['dwell_time_minutes'])

        os_input = pd.DataFrame([{
            'hour': data.get('hour', 12), 'day_of_week': data.get('day_of_week', 1),
            'trip_day': data.get('trip_day', 1), 'spending_lkr': data['spending_lkr'],
            'budget_usage_pct': budget_usage_pct, 'spending_rate': spending_rate,
            'dwell_time_minutes': data['dwell_time_minutes'],
            'daily_budget_lkr': data['daily_budget_lkr'],
            'location_enc': loc_enc, 'activity_enc': act_enc, 'weather_enc': wea_enc,
        }])
        os_pred = int(os_model.predict(os_scaler.transform(os_input))[0])
        os_prob = float(os_model.predict_proba(os_scaler.transform(os_input))[0][1])

        rp_input = pd.DataFrame([{
            'hour': data.get('hour', 12), 'trip_day': data.get('trip_day', 1),
            'spending_lkr': data['spending_lkr'], 'budget_usage_pct': budget_usage_pct,
            'spending_rate': spending_rate, 'dwell_time_minutes': data['dwell_time_minutes'],
            'is_overspending': os_pred, 'location_enc': loc_enc, 'weather_enc': wea_enc,
        }])
        rp_pred = int(rp_model.predict(rp_scaler.transform(rp_input))[0])
        rp_prob = float(rp_model.predict_proba(rp_scaler.transform(rp_input))[0][1])

        alert = None
        if os_pred:
            alert = f"Budget Guardian: You have used {budget_usage_pct:.1f}% of today's budget. Switch to cheaper options!"

        return jsonify({
            'status':                'success',
            'budget_usage_pct':      round(budget_usage_pct, 2),
            'is_overspending':       os_pred,
            'overspend_probability': round(os_prob, 4),
            'replanning_triggered':  rp_pred,
            'replan_probability':    round(rp_prob, 4),
            'alert':                 alert,
        }), 200

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


# ══════════════════════════════════════════════════════════════════════════════
# API ENDPOINT 4 — Health Check
# GET /api/health
# ══════════════════════════════════════════════════════════════════════════════
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status':  'running',
        'message': 'Smart Virtual Tourist Guide ML API is running!',
        'endpoints': [
            'POST /api/itinerary/generate',
            'POST /api/ml/recommend',
            'POST /api/ml/detect-anomaly',
            'GET  /api/health',
        ]
    }), 200


# ── RUN SERVER ────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    load_and_train_models()
    print("\nStarting Flask server on http://localhost:5001 ...")
    app.run(debug=True, host='0.0.0.0', port=5001)