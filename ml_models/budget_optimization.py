# ══════════════════════════════════════════════════════════════════════════════
# Budget Optimization Model
# Smart Virtual Tourist Guide — Sri Lanka
# Technique: Linear Programming (PuLP)
# Input:  Total budget, trip duration, preferences
# Output: Day-by-day cost allocation plan
# ══════════════════════════════════════════════════════════════════════════════

import pandas as pd
from pulp import *

# ── STEP 1: Load pricing data ─────────────────────────────────────────────────
def load_pricing_data():
    df = pd.read_csv('data/pricing_market_rates.csv')
    print("Pricing data loaded successfully!")
    print(df[['city', 'price_lkr', 'transport_lkr', 'meal_lkr']].to_string(index=False))
    print()
    return df

# ── STEP 2: Budget Optimization Model ─────────────────────────────────────────
def optimize_budget(total_budget_lkr, num_days, preference='mid-range'):
    """
    Allocates total budget across days and categories using Linear Programming.

    Inputs:
        total_budget_lkr : Total budget in LKR (e.g. 160000)
        num_days         : Number of travel days (e.g. 7)
        preference       : 'budget', 'mid-range', or 'luxury'

    Output:
        Day-by-day cost allocation plan
    """

    print(f"\nOptimizing budget for {num_days} days with LKR {total_budget_lkr:,} ({preference})...")
    print("=" * 60)

    # Category percentage ranges based on preference
    preference_ranges = {
        'budget': {
            'transport': (0.15, 0.25),
            'food':      (0.25, 0.35),
            'stay':      (0.30, 0.40),
            'activity':  (0.10, 0.20),
            'emergency': (0.05, 0.05),
        },
        'mid-range': {
            'transport': (0.18, 0.28),
            'food':      (0.22, 0.32),
            'stay':      (0.32, 0.42),
            'activity':  (0.12, 0.22),
            'emergency': (0.05, 0.05),
        },
        'luxury': {
            'transport': (0.20, 0.30),
            'food':      (0.20, 0.30),
            'stay':      (0.35, 0.45),
            'activity':  (0.10, 0.20),
            'emergency': (0.05, 0.05),
        },
    }

    ranges = preference_ranges.get(preference, preference_ranges['mid-range'])
    categories = ['transport', 'food', 'stay', 'activity', 'emergency']

    # ── Define the LP Problem ──────────────────────────────────────────────────
    prob = LpProblem("Budget_Optimization", LpMaximize)

    # Decision variables: allocation per category (as fraction of total budget)
    alloc = {
        cat: LpVariable(f"alloc_{cat}", lowBound=ranges[cat][0], upBound=ranges[cat][1])
        for cat in categories
    }

    # Objective: Maximize activity + food allocation (maximize experience quality)
    prob += alloc['activity'] + alloc['food'], "Maximize_Experience"

    # Constraint 1: All allocations must sum to 1.0 (100% of budget)
    prob += lpSum(alloc[cat] for cat in categories) == 1.0, "Total_Budget"

    # Constraint 2: Emergency fund fixed at 5%
    prob += alloc['emergency'] == 0.05, "Emergency_Fund"

    # Constraint 3: Stay should be >= transport (accommodation priority)
    prob += alloc['stay'] >= alloc['transport'], "Stay_Priority"

    # Solve
    prob.solve(PULP_CBC_CMD(msg=0))

    if LpStatus[prob.status] != 'Optimal':
        print("Could not find optimal solution. Using default allocation.")
        allocations = {'transport': 0.20, 'food': 0.25, 'stay': 0.40,
                       'activity': 0.10, 'emergency': 0.05}
    else:
        allocations = {cat: round(value(alloc[cat]), 4) for cat in categories}

    # ── Generate Day-by-Day Plan ───────────────────────────────────────────────
    daily_budget = total_budget_lkr / num_days

    # Special days get more budget (travel days cost more)
    travel_days = [1, num_days]  # First and last days are travel days
    day_weights = []
    for day in range(1, num_days + 1):
        if day in travel_days:
            day_weights.append(1.3)   # 30% more for travel days
        elif day % 3 == 0:
            day_weights.append(1.1)   # 10% more every 3rd day (long trip day)
        else:
            day_weights.append(1.0)

    total_weight = sum(day_weights)
    adjusted_daily_budgets = [
        round((w / total_weight) * total_budget_lkr) for w in day_weights
    ]

    # ── Print Results ──────────────────────────────────────────────────────────
    print(f"\nOptimal Budget Allocation ({preference}):")
    print(f"{'Category':<15} {'Percentage':>10} {'Total LKR':>12} {'Per Day LKR':>12}")
    print("-" * 52)
    for cat in categories:
        pct   = allocations[cat] * 100
        total = allocations[cat] * total_budget_lkr
        per_day = total / num_days
        print(f"{cat.capitalize():<15} {pct:>9.1f}% {total:>12,.0f} {per_day:>12,.0f}")
    print("-" * 52)
    print(f"{'TOTAL':<15} {'100.0%':>10} {total_budget_lkr:>12,} {total_budget_lkr/num_days:>12,.0f}")

    print(f"\nDay-by-Day Budget Plan:")
    print(f"{'Day':<6} {'Total LKR':>10} {'Transport':>10} {'Food':>10} {'Stay':>10} {'Activity':>10}")
    print("-" * 60)

    daily_plan = []
    for day in range(num_days):
        day_total     = adjusted_daily_budgets[day]
        day_transport = round(day_total * allocations['transport'])
        day_food      = round(day_total * allocations['food'])
        day_stay      = round(day_total * allocations['stay'])
        day_activity  = round(day_total * allocations['activity'])

        label = f"Day {day+1}"
        if day + 1 in travel_days:
            label += " (travel)"

        print(f"{label:<14} {day_total:>8,} {day_transport:>10,} {day_food:>10,} {day_stay:>10,} {day_activity:>10,}")

        daily_plan.append({
            'day':           day + 1,
            'total_lkr':     day_total,
            'transport_lkr': day_transport,
            'food_lkr':      day_food,
            'stay_lkr':      day_stay,
            'activity_lkr':  day_activity,
            'emergency_lkr': round(day_total * allocations['emergency']),
        })

    print("=" * 60)

    # Save results
    result_df = pd.DataFrame(daily_plan)
    result_df.to_csv('data/optimized_budget_plan.csv', index=False)
    print(f"\nBudget plan saved to data/optimized_budget_plan.csv")

    return daily_plan, allocations


# ── STEP 3: Run the model ──────────────────────────────────────────────────────
if __name__ == "__main__":

    print("=" * 60)
    print("Smart Virtual Tourist Guide — Budget Optimizer")
    print("=" * 60)

    # Load pricing data
    df = load_pricing_data()

    # ── Test Case 1: Budget tourist, 7 days, $500 (LKR 160,000) ───────────────
    print("\nTEST CASE 1: Budget Tourist")
    optimize_budget(
        total_budget_lkr=160000,
        num_days=7,
        preference='budget'
    )

    # ── Test Case 2: Mid-range tourist, 5 days, $800 (LKR 256,000) ────────────
    print("\nTEST CASE 2: Mid-Range Tourist")
    optimize_budget(
        total_budget_lkr=256000,
        num_days=5,
        preference='mid-range'
    )

    # ── Test Case 3: Luxury tourist, 10 days, $2000 (LKR 640,000) ─────────────
    print("\nTEST CASE 3: Luxury Tourist")
    optimize_budget(
        total_budget_lkr=640000,
        num_days=10,
        preference='luxury'
    )
    