# ══════════════════════════════════════════════════════════════════════════════
# Recommendation System
# Smart Virtual Tourist Guide — Sri Lanka
# Technique: Collaborative Filtering (scikit-learn)
# Input:  Tourist profile (age, nationality, interests)
# Output: Ranked list of places, activities, events
# ══════════════════════════════════════════════════════════════════════════════

import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import LabelEncoder, MinMaxScaler

# ── STEP 1: Load Data ─────────────────────────────────────────────────────────
def load_data():
    df = pd.read_csv('data/location_metadata.csv')
    print("Location metadata loaded!")
    print(f"Total records : {len(df)}")
    print(f"Destinations  : {list(df['destination'].unique())}")
    print()
    return df

# ── STEP 2: Encode & Prepare Data ─────────────────────────────────────────────
def prepare_data(df):
    df_enc = df.copy()

    le_nat  = LabelEncoder()
    le_int  = LabelEncoder()
    le_bud  = LabelEncoder()
    le_dest = LabelEncoder()

    df_enc['nationality_enc']  = le_nat.fit_transform(df_enc['nationality'])
    df_enc['interest_enc']     = le_int.fit_transform(df_enc['interest'])
    df_enc['budget_level_enc'] = le_bud.fit_transform(df_enc['budget_level'])
    df_enc['destination_enc']  = le_dest.fit_transform(df_enc['destination'])

    scaler = MinMaxScaler()
    df_enc[['age_scaled', 'duration_scaled']] = scaler.fit_transform(
        df_enc[['age', 'trip_duration']]
    )

    encoders = {
        'nationality':  le_nat,
        'interest':     le_int,
        'budget_level': le_bud,
        'destination':  le_dest,
        'scaler':       scaler,
    }

    return df_enc, encoders

# ── STEP 3: Build Tourist Flavor Profile ──────────────────────────────────────
def build_flavor_profile(age, nationality, interest, budget_level, trip_duration, encoders, scaler):
    """
    Builds a numeric Flavor Profile vector for a new tourist.
    """
    try:
        nat_enc  = encoders['nationality'].transform([nationality])[0]
    except ValueError:
        nat_enc  = 0   # unknown nationality fallback

    try:
        int_enc  = encoders['interest'].transform([interest])[0]
    except ValueError:
        int_enc  = 0

    try:
        bud_enc  = encoders['budget_level'].transform([budget_level])[0]
    except ValueError:
        bud_enc  = 1   # default mid

    scaled = scaler.transform([[age, trip_duration]])[0]

    profile_vector = np.array([
        nat_enc,
        int_enc,
        bud_enc,
        scaled[0],   # age scaled
        scaled[1],   # duration scaled
    ]).reshape(1, -1)

    return profile_vector

# ── STEP 4: Collaborative Filtering Recommendation ────────────────────────────
def recommend_places(tourist_profile_vector, df_enc, encoders, top_n=5):
    """
    Uses cosine similarity to find similar tourists and recommend their destinations.

    Input : Tourist Flavor Profile vector
    Output: Ranked list of top N recommended destinations
    """

    feature_cols = [
        'nationality_enc',
        'interest_enc',
        'budget_level_enc',
        'age_scaled',
        'duration_scaled',
    ]

    user_matrix = df_enc[feature_cols].values

    # Calculate cosine similarity between new tourist and all existing tourists
    similarities = cosine_similarity(tourist_profile_vector, user_matrix)[0]

    df_enc = df_enc.copy()
    df_enc['similarity_score'] = similarities

    # Weight by rating as well
    df_enc['weighted_score'] = df_enc['similarity_score'] * df_enc['rating']

    # Group by destination and get average weighted score
    recommendations = (
        df_enc.groupby('destination')
        .agg(
            avg_score     = ('weighted_score', 'mean'),
            avg_rating    = ('rating', 'mean'),
            visit_count   = ('destination', 'count'),
            category      = ('category', 'first'),
            tags          = ('tags', 'first'),
            entry_fee_lkr = ('entry_fee_lkr', 'first'),
        )
        .reset_index()
        .sort_values('avg_score', ascending=False)
        .head(top_n)
    )

    return recommendations

# ── STEP 5: Cold Start Fallback ───────────────────────────────────────────────
def cold_start_recommendations(df, top_n=5):
    """
    If tourist has no history, recommend the most popular Sri Lankan places.
    """
    popular = (
        df.groupby('destination')
        .agg(
            avg_rating    = ('rating', 'mean'),
            visit_count   = ('destination', 'count'),
            category      = ('category', 'first'),
            tags          = ('tags', 'first'),
            entry_fee_lkr = ('entry_fee_lkr', 'first'),
        )
        .reset_index()
        .sort_values(['avg_rating', 'visit_count'], ascending=False)
        .head(top_n)
    )
    return popular

# ── STEP 6: Print Recommendations ─────────────────────────────────────────────
def print_recommendations(recommendations, title="Recommended Places"):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}")
    print(f"{'Rank':<5} {'Destination':<16} {'Category':<12} {'Rating':<8} {'Entry Fee (LKR)':<16} {'Tags'}")
    print("-" * 80)
    for i, row in enumerate(recommendations.itertuples(), 1):
        print(f"{i:<5} {row.destination:<16} {row.category:<12} {row.avg_rating:<8.2f} {row.entry_fee_lkr:<16} {row.tags}")
    print("=" * 60)

# ── MAIN: Run Test Cases ───────────────────────────────────────────────────────
if __name__ == "__main__":

    print("=" * 60)
    print("Smart Virtual Tourist Guide — Recommendation System")
    print("=" * 60)

    # Load and prepare data
    df        = load_data()
    df_enc, encoders = prepare_data(df)
    scaler    = encoders['scaler']

    # ── TEST CASE 1: History lover from US, 7 days, medium budget ─────────────
    print("\nTEST CASE 1: History lover from US")
    profile1 = build_flavor_profile(
        age=28, nationality='US', interest='history',
        budget_level='medium', trip_duration=7,
        encoders=encoders, scaler=scaler
    )
    rec1 = recommend_places(profile1, df_enc, encoders, top_n=5)
    print_recommendations(rec1, "Top 5 Recommendations — History Lover (US, 7 days)")

    # ── TEST CASE 2: Beach lover from UK, 5 days, high budget ─────────────────
    print("\nTEST CASE 2: Beach lover from UK")
    profile2 = build_flavor_profile(
        age=35, nationality='UK', interest='beach',
        budget_level='high', trip_duration=5,
        encoders=encoders, scaler=scaler
    )
    rec2 = recommend_places(profile2, df_enc, encoders, top_n=5)
    print_recommendations(rec2, "Top 5 Recommendations — Beach Lover (UK, 5 days)")

    # ── TEST CASE 3: Nature lover from DE, 10 days, low budget ────────────────
    print("\nTEST CASE 3: Nature lover from DE")
    profile3 = build_flavor_profile(
        age=45, nationality='DE', interest='nature',
        budget_level='low', trip_duration=10,
        encoders=encoders, scaler=scaler
    )
    rec3 = recommend_places(profile3, df_enc, encoders, top_n=5)
    print_recommendations(rec3, "Top 5 Recommendations — Nature Lover (DE, 10 days)")

    # ── TEST CASE 4: Cold Start (new tourist, no history) ─────────────────────
    print("\nTEST CASE 4: Cold Start — New Tourist (no history)")
    cold = cold_start_recommendations(df, top_n=5)
    print_recommendations(cold, "Top 5 Most Popular Places in Sri Lanka")

    # Save recommendations to CSV
    rec1.to_csv('data/recommendations_output.csv', index=False)
    print("\nRecommendations saved to data/recommendations_output.csv")
    print("\nRecommendation System complete! ✅")