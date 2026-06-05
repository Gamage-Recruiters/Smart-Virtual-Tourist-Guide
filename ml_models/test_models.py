# ══════════════════════════════════════════════════════════════════════════════
# Phase 5: Testing & Evaluation
# Smart Virtual Tourist Guide — Sri Lanka
# Tests: Accuracy, Performance, 50 Mock Tourist Simulations
# ══════════════════════════════════════════════════════════════════════════════

import requests
import time
import random
import json

BASE_URL = 'http://127.0.0.1:5000'

# ── TEST DATA ─────────────────────────────────────────────────────────────────
nationalities  = ['US', 'UK', 'DE', 'FR', 'AU', 'CA', 'IN', 'JP', 'SG', 'MY']
interests      = ['history', 'nature', 'beach', 'adventure', 'culture', 'food', 'wildlife']
budget_levels  = ['low', 'medium', 'high']
preferences    = ['budget', 'mid-range', 'luxury']
locations      = ['Colombo', 'Kandy', 'Ella', 'Sigiriya', 'Mirissa', 'Galle']
activities     = ['sightseeing', 'food', 'transport', 'shopping', 'accommodation']
weathers       = ['sunny', 'cloudy', 'rainy']

# ── HELPER ────────────────────────────────────────────────────────────────────
def print_section(title):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}")

# ══════════════════════════════════════════════════════════════════════════════
# TEST 1 — Health Check
# ══════════════════════════════════════════════════════════════════════════════
def test_health():
    print_section("TEST 1: Health Check")
    try:
        start    = time.time()
        response = requests.get(f"{BASE_URL}/api/health")
        elapsed  = round((time.time() - start) * 1000, 2)
        if response.status_code == 200:
            print(f"  ✅ Server is running — {elapsed}ms")
        else:
            print(f"  ❌ Health check failed — Status {response.status_code}")
    except Exception as e:
        print(f"  ❌ Error: {e}")

# ══════════════════════════════════════════════════════════════════════════════
# TEST 2 — Performance Test (response time < 2 seconds)
# ══════════════════════════════════════════════════════════════════════════════
def test_performance():
    print_section("TEST 2: Performance Test (Target: < 2000ms)")

    endpoints = [
        {
            'name':   'Budget Optimizer',
            'method': 'POST',
            'url':    f"{BASE_URL}/api/itinerary/generate",
            'body':   {'total_budget_lkr': 160000, 'num_days': 7, 'preference': 'budget'},
        },
        {
            'name':   'Recommendation System',
            'method': 'POST',
            'url':    f"{BASE_URL}/api/ml/recommend",
            'body':   {'age': 28, 'nationality': 'US', 'interest': 'history',
                       'budget_level': 'medium', 'trip_duration': 7},
        },
        {
            'name':   'Behaviour Tracking',
            'method': 'POST',
            'url':    f"{BASE_URL}/api/ml/detect-anomaly",
            'body':   {'spending_lkr': 4500, 'cumulative_spend_lkr': 22000,
                       'daily_budget_lkr': 20000, 'dwell_time_minutes': 120,
                       'location': 'Sigiriya', 'activity_type': 'sightseeing',
                       'weather': 'sunny', 'hour': 14, 'trip_day': 3},
        },
    ]

    all_passed = True
    for ep in endpoints:
        times = []
        for _ in range(5):  # Run each 5 times and average
            start   = time.time()
            if ep['method'] == 'POST':
                r = requests.post(ep['url'], json=ep['body'])
            else:
                r = requests.get(ep['url'])
            elapsed = round((time.time() - start) * 1000, 2)
            times.append(elapsed)

        avg_time = round(sum(times) / len(times), 2)
        passed   = avg_time < 2000
        status   = "✅ PASS" if passed else "❌ FAIL"
        if not passed:
            all_passed = False
        print(f"  {status} | {ep['name']:<25} | Avg: {avg_time}ms | Target: <2000ms")

    print(f"\n  Overall Performance: {'✅ ALL PASSED' if all_passed else '❌ SOME FAILED'}")

# ══════════════════════════════════════════════════════════════════════════════
# TEST 3 — 50 Mock Tourist Simulations
# ══════════════════════════════════════════════════════════════════════════════
def test_mock_tourists():
    print_section("TEST 3: 50 Mock Tourist Simulations")

    results = {
        'itinerary_success':    0,
        'itinerary_fail':       0,
        'recommend_success':    0,
        'recommend_fail':       0,
        'anomaly_success':      0,
        'anomaly_fail':         0,
        'overspending_detected':0,
        'replanning_triggered': 0,
        'total_response_time':  0,
    }

    print(f"\n  Running 50 tourist simulations...\n")
    print(f"  {'#':<5} {'Nationality':<12} {'Interest':<12} {'Budget':<10} {'Itinerary':<12} {'Recommend':<12} {'Anomaly':<10} {'Response'}")
    print(f"  {'-'*90}")

    for i in range(1, 51):
        nationality   = random.choice(nationalities)
        interest      = random.choice(interests)
        budget_level  = random.choice(budget_levels)
        preference    = random.choice(preferences)
        age           = random.randint(18, 65)
        num_days      = random.randint(3, 14)
        total_budget  = random.randint(50000, 500000)
        location      = random.choice(locations)
        activity      = random.choice(activities)
        weather       = random.choice(weathers)
        daily_budget  = total_budget // num_days
        cumulative    = random.randint(int(daily_budget * 0.5), int(daily_budget * 1.5))

        start = time.time()

        # Test 1: Generate Itinerary
        try:
            r1 = requests.post(f"{BASE_URL}/api/itinerary/generate", json={
                'total_budget_lkr': total_budget,
                'num_days':         num_days,
                'preference':       preference,
            })
            it_status = "✅" if r1.status_code == 200 else "❌"
            if r1.status_code == 200:
                results['itinerary_success'] += 1
            else:
                results['itinerary_fail'] += 1
        except:
            it_status = "❌"
            results['itinerary_fail'] += 1

        # Test 2: Get Recommendations
        try:
            r2 = requests.post(f"{BASE_URL}/api/ml/recommend", json={
                'age':           age,
                'nationality':   nationality,
                'interest':      interest,
                'budget_level':  budget_level,
                'trip_duration': num_days,
            })
            rec_status = "✅" if r2.status_code == 200 else "❌"
            if r2.status_code == 200:
                results['recommend_success'] += 1
            else:
                results['recommend_fail'] += 1
        except:
            rec_status = "❌"
            results['recommend_fail'] += 1

        # Test 3: Detect Anomaly
        try:
            r3 = requests.post(f"{BASE_URL}/api/ml/detect-anomaly", json={
                'spending_lkr':         random.randint(500, 8000),
                'cumulative_spend_lkr': cumulative,
                'daily_budget_lkr':     daily_budget,
                'dwell_time_minutes':   random.randint(15, 180),
                'location':             location,
                'activity_type':        activity,
                'weather':              weather,
                'hour':                 random.randint(8, 21),
                'trip_day':             random.randint(1, num_days),
                'day_of_week':          random.randint(0, 6),
            })
            an_status = "✅" if r3.status_code == 200 else "❌"
            if r3.status_code == 200:
                results['anomaly_success'] += 1
                data = r3.json()
                if data.get('is_overspending'):
                    results['overspending_detected'] += 1
                if data.get('replanning_triggered'):
                    results['replanning_triggered'] += 1
            else:
                results['anomaly_fail'] += 1
        except:
            an_status = "❌"
            results['anomaly_fail'] += 1

        elapsed = round((time.time() - start) * 1000, 2)
        results['total_response_time'] += elapsed

        print(f"  {i:<5} {nationality:<12} {interest:<12} {budget_level:<10} {it_status:<12} {rec_status:<12} {an_status:<10} {elapsed}ms")

    # ── Summary ───────────────────────────────────────────────────────────────
    avg_response = round(results['total_response_time'] / 50, 2)
    it_accuracy  = round(results['itinerary_success'] / 50 * 100, 1)
    rec_accuracy = round(results['recommend_success'] / 50 * 100, 1)
    an_accuracy  = round(results['anomaly_success'] / 50 * 100, 1)

    print(f"\n{'='*60}")
    print(f"  SIMULATION SUMMARY — 50 Mock Tourists")
    print(f"{'='*60}")
    print(f"  Budget Optimizer Success Rate  : {it_accuracy}%  {'✅' if it_accuracy >= 90 else '❌'}")
    print(f"  Recommendation Success Rate    : {rec_accuracy}%  {'✅' if rec_accuracy >= 90 else '❌'}")
    print(f"  Anomaly Detection Success Rate : {an_accuracy}%  {'✅' if an_accuracy >= 90 else '❌'}")
    print(f"  Overspending Detected          : {results['overspending_detected']}/50 tourists")
    print(f"  Replanning Triggered           : {results['replanning_triggered']}/50 tourists")
    print(f"  Average Response Time          : {avg_response}ms  {'✅' if avg_response < 2000 else '❌'}")
    print(f"{'='*60}")

# ══════════════════════════════════════════════════════════════════════════════
# MAIN — Run all tests
# ══════════════════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    print("=" * 60)
    print("  Smart Virtual Tourist Guide — Phase 5 Testing")
    print("=" * 60)

    test_health()
    test_performance()
    test_mock_tourists()

    print("\n✅ All tests complete!")