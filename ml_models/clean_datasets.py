import pandas as pd
import random
from datetime import datetime, timedelta

# ── EXCHANGE RATE ──────────────────────────────────────────────────────────────
USD_TO_LKR = 320

# ══════════════════════════════════════════════════════════════════════════════
# DATASET 1 — pricing_market_rates.csv
# Used for: Budget Optimization Model (PuLP)
# Rows: 1000
# ══════════════════════════════════════════════════════════════════════════════
def generate_budget_dataset(num_records=1000):
    print("Generating Dataset 1: pricing_market_rates.csv...")

    cities = ['Colombo', 'Kandy', 'Ella', 'Sigiriya', 'Mirissa',
              'Galle', 'Nuwara Eliya', 'Trincomalee', 'Anuradhapura', 'Polonnaruwa']

    hotel_types = ['Budget', 'Mid-range', '5-star']

    city_price_ranges = {
        'Colombo':      {'budget': (3000,6000),  'mid': (6000,12000),  'luxury': (12000,30000)},
        'Kandy':        {'budget': (2500,5000),  'mid': (5000,10000),  'luxury': (10000,25000)},
        'Ella':         {'budget': (2000,4500),  'mid': (4500,9000),   'luxury': (9000,20000)},
        'Sigiriya':     {'budget': (2500,5000),  'mid': (5000,11000),  'luxury': (11000,28000)},
        'Mirissa':      {'budget': (2000,4000),  'mid': (4000,8000),   'luxury': (8000,18000)},
        'Galle':        {'budget': (2200,4500),  'mid': (4500,9000),   'luxury': (9000,22000)},
        'Nuwara Eliya': {'budget': (2000,4000),  'mid': (4000,8000),   'luxury': (8000,18000)},
        'Trincomalee':  {'budget': (1800,3500),  'mid': (3500,7000),   'luxury': (7000,15000)},
        'Anuradhapura': {'budget': (1500,3000),  'mid': (3000,6000),   'luxury': (6000,12000)},
        'Polonnaruwa':  {'budget': (1500,3000),  'mid': (3000,6000),   'luxury': (6000,12000)},
    }

    transport_rates = {
        'Colombo':      {'tuk_tuk': 100, 'bus': 60,  'train': 0,   'taxi': 800},
        'Kandy':        {'tuk_tuk': 120, 'bus': 80,  'train': 350, 'taxi': 900},
        'Ella':         {'tuk_tuk': 150, 'bus': 100, 'train': 400, 'taxi': 1200},
        'Sigiriya':     {'tuk_tuk': 200, 'bus': 150, 'train': 0,   'taxi': 1500},
        'Mirissa':      {'tuk_tuk': 180, 'bus': 120, 'train': 500, 'taxi': 1100},
        'Galle':        {'tuk_tuk': 160, 'bus': 100, 'train': 450, 'taxi': 1000},
        'Nuwara Eliya': {'tuk_tuk': 170, 'bus': 110, 'train': 380, 'taxi': 1300},
        'Trincomalee':  {'tuk_tuk': 190, 'bus': 130, 'train': 0,   'taxi': 1400},
        'Anuradhapura': {'tuk_tuk': 210, 'bus': 140, 'train': 420, 'taxi': 1600},
        'Polonnaruwa':  {'tuk_tuk': 200, 'bus': 130, 'train': 410, 'taxi': 1550},
    }

    meal_ranges = {
        'Budget':    (300, 800),
        'Mid-range': (800, 2000),
        '5-star':    (2000, 6000),
    }

    data = []
    for _ in range(num_records):
        city      = random.choice(cities)
        h_type    = random.choice(hotel_types)
        tier      = {'Budget': 'budget', 'Mid-range': 'mid', '5-star': 'luxury'}[h_type]
        price_rng = city_price_ranges[city][tier]
        trans     = transport_rates[city]
        meal_rng  = meal_ranges[h_type]

        data.append({
            'city':                city,
            'hotel_type':          h_type,
            'price_lkr':           random.randint(*price_rng),
            'transport_lkr':       random.randint(500, 3000),
            'meal_lkr':            random.randint(*meal_rng),
            'tuk_tuk_lkr_per_km':  trans['tuk_tuk'],
            'bus_lkr':             trans['bus'],
            'train_lkr':           trans['train'],
            'taxi_lkr':            trans['taxi'],
            'season':              random.choice(['peak', 'off-peak']),
            'tourist_rating':      round(random.uniform(3.0, 5.0), 1),
        })

    df = pd.DataFrame(data)
    df.to_csv('data/pricing_market_rates.csv', index=False)
    print(f"  Done! pricing_market_rates.csv saved — {len(df)} rows, {len(df.columns)} columns")
    print(f"  Columns: {list(df.columns)}\n")


# ══════════════════════════════════════════════════════════════════════════════
# DATASET 2 — location_metadata.csv
# Used for: Recommendation System (scikit-learn Collaborative Filtering)
# Rows: 1000
# ══════════════════════════════════════════════════════════════════════════════
def generate_recommendation_dataset(num_records=1000):
    print("Generating Dataset 2: location_metadata.csv...")

    destinations = ['Sigiriya', 'Ella', 'Galle', 'Mirissa', 'Kandy',
                    'Nuwara Eliya', 'Anuradhapura', 'Colombo', 'Trincomalee', 'Polonnaruwa']

    nationalities = ['US', 'UK', 'DE', 'FR', 'AU', 'CA', 'IN',
                     'JP', 'SG', 'MY', 'CN', 'RU', 'IT', 'ES', 'NL']

    interests = ['history', 'nature', 'beach', 'adventure', 'culture',
                 'food', 'wildlife', 'relaxation', 'photography', 'hiking']

    place_tags = {
        'Sigiriya':     {'tags': 'history,nature,adventure', 'category': 'Heritage',  'entry_fee_lkr': 4500},
        'Ella':         {'tags': 'nature,adventure,scenic',  'category': 'Nature',    'entry_fee_lkr': 0},
        'Galle':        {'tags': 'history,culture,beach',    'category': 'Heritage',  'entry_fee_lkr': 0},
        'Mirissa':      {'tags': 'beach,nature,relaxation',  'category': 'Beach',     'entry_fee_lkr': 0},
        'Kandy':        {'tags': 'culture,history,temple',   'category': 'Cultural',  'entry_fee_lkr': 1500},
        'Nuwara Eliya': {'tags': 'nature,scenic,tea',        'category': 'Nature',    'entry_fee_lkr': 0},
        'Anuradhapura': {'tags': 'history,heritage,culture', 'category': 'Heritage',  'entry_fee_lkr': 3500},
        'Colombo':      {'tags': 'urban,culture,food',       'category': 'City',      'entry_fee_lkr': 0},
        'Trincomalee':  {'tags': 'beach,nature,diving',      'category': 'Beach',     'entry_fee_lkr': 0},
        'Polonnaruwa':  {'tags': 'history,heritage,ruins',   'category': 'Heritage',  'entry_fee_lkr': 3000},
    }

    data = []
    for i in range(num_records):
        destination  = random.choice(destinations)
        interest     = random.choice(interests)
        nationality  = random.choice(nationalities)
        age          = random.randint(18, 65)
        trip_cost    = random.randint(15000, 500000)
        rating       = round(random.uniform(1.0, 5.0), 1)
        place_info   = place_tags[destination]

        budget_level = 'low' if trip_cost < 50000 else ('medium' if trip_cost < 150000 else 'high')

        data.append({
            'user_id':        f'user_{1000+i}',
            'destination':    destination,
            'age':            age,
            'nationality':    nationality,
            'interest':       interest,
            'trip_cost_lkr':  trip_cost,
            'rating':         rating,
            'tags':           place_info['tags'],
            'category':       place_info['category'],
            'entry_fee_lkr':  place_info['entry_fee_lkr'],
            'budget_level':   budget_level,
            'trip_duration':  random.randint(1, 14),
            'travel_month':   random.randint(1, 12),
            'group_size':     random.randint(1, 6),
        })

    df = pd.DataFrame(data)
    df.to_csv('data/location_metadata.csv', index=False)
    print(f"  Done! location_metadata.csv saved — {len(df)} rows, {len(df.columns)} columns")
    print(f"  Columns: {list(df.columns)}\n")


# ══════════════════════════════════════════════════════════════════════════════
# DATASET 3 — user_behavior_logs.csv
# Used for: Behaviour Tracking Model (TensorFlow Time-Series)
# Rows: 90,000+
# ══════════════════════════════════════════════════════════════════════════════
def generate_behavior_dataset(num_records=1000):
    print("Generating Dataset 3: user_behavior_logs.csv...")

    locations = {
        'Colombo':      {'lat': 6.9271,  'lon': 79.8612},
        'Kandy':        {'lat': 7.2906,  'lon': 80.6337},
        'Sigiriya':     {'lat': 7.9570,  'lon': 80.7603},
        'Ella':         {'lat': 6.8667,  'lon': 81.0466},
        'Mirissa':      {'lat': 5.9483,  'lon': 80.4716},
        'Galle':        {'lat': 6.0535,  'lon': 80.2210},
        'Nuwara Eliya': {'lat': 6.9497,  'lon': 80.7891},
        'Trincomalee':  {'lat': 8.5874,  'lon': 81.2152},
    }

    location_names = list(locations.keys())
    data = []

    for i in range(num_records):
        user_id          = f"tourist_{random.randint(1000, 9999)}"
        trip_days        = random.randint(3, 10)
        daily_budget_lkr = random.randint(5000, 25000)
        start_date       = datetime(2024, 1, 1) + timedelta(days=random.randint(0, 364))

        for day in range(trip_days):
            current_location = random.choice(location_names)
            loc_coords       = locations[current_location]
            current_date     = start_date + timedelta(days=day)
            cumulative_spend = 0

            for hour in range(8, 22):
                timestamp        = current_date.replace(hour=hour, minute=0)
                spending         = round(random.uniform(200, 3000), 2)
                cumulative_spend += spending
                is_overspending  = cumulative_spend > daily_budget_lkr

                data.append({
                    'user_id':              user_id,
                    'trip_day':             day + 1,
                    'timestamp':            timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                    'location':             current_location,
                    'latitude':             round(loc_coords['lat'] + random.uniform(-0.01, 0.01), 6),
                    'longitude':            round(loc_coords['lon'] + random.uniform(-0.01, 0.01), 6),
                    'spending_lkr':         spending,
                    'cumulative_spend_lkr': round(cumulative_spend, 2),
                    'daily_budget_lkr':     daily_budget_lkr,
                    'dwell_time_minutes':   random.randint(15, 180),
                    'is_overspending':      int(is_overspending),
                    'activity_type':        random.choice(['sightseeing', 'food', 'transport', 'shopping', 'accommodation']),
                    'weather':              random.choice(['sunny', 'cloudy', 'rainy']),
                    'replanning_triggered': int(is_overspending and random.random() > 0.5),
                })

    df = pd.DataFrame(data)
    df.to_csv('data/user_behavior_logs.csv', index=False)
    print(f"  Done! user_behavior_logs.csv saved — {len(df)} rows, {len(df.columns)} columns")
    print(f"  Columns: {list(df.columns)}\n")


# ══════════════════════════════════════════════════════════════════════════════
# RUN ALL 3
# ══════════════════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    print("=" * 60)
    print("Smart Virtual Tourist Guide — Data Generation Script")
    print("=" * 60)
    print()
    generate_budget_dataset(num_records=1000)
    generate_recommendation_dataset(num_records=1000)
    generate_behavior_dataset(num_records=1000)
    print("=" * 60)
    print("All 3 datasets ready!")
    print("  pricing_market_rates.csv  → Budget Optimizer (PuLP)")
    print("  location_metadata.csv     → Recommendation System (scikit-learn)")
    print("  user_behavior_logs.csv    → Behaviour Tracking (TensorFlow)")
    print("=" * 60)