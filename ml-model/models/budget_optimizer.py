"""
budget_optimizer.py  —  Model 1
Learns category weight splits directly from tourist_registrations.csv
then uses PuLP linear programming to allocate any tourist's budget.
"""
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'data'))

from pulp import LpProblem, LpVariable, LpMinimize, lpSum, value, PULP_CBC_CMD
from preprocess import load_registrations
import warnings; warnings.filterwarnings("ignore")

CATEGORIES = ["accommodation", "transport", "food", "activities", "misc"]

MIN_SPEND_LKR = {
    "accommodation": 2500,
    "transport":     500,
    "food":          800,
    "activities":    300,
    "misc":          200,
}

def learn_weights_from_csv():
    """Reads tourist_registrations.csv and returns mean pct per trip_style."""
    df = load_registrations()
    col_map = {
        "accommodation": "accommodation_pct",
        "transport":     "transport_pct",
        "food":          "food_pct",
        "activities":    "activities_pct",
        "misc":          "misc_pct",
    }
    styles = df.groupby("trip_style")[list(col_map.values())].mean()
    result = {}
    for style, row in styles.iterrows():
        w = {cat: round(row[col], 3) for cat, col in col_map.items()}
        total = sum(w.values())
        result[style] = {k: round(v/total, 3) for k, v in w.items()}
    return result

LEARNED_WEIGHTS = learn_weights_from_csv()

def optimize_budget(total_budget_lkr, num_days, trip_style="balanced", preferences=None):
    """
    Inputs (matching the registration form):
      total_budget_lkr : from budget range slider (converted from USD)
      num_days         : end_date - start_date
      trip_style       : mapped from travel_preferences chips
      preferences      : optional custom dict overriding learned weights

    Returns: full allocation plan dict
    """
    weights = preferences or LEARNED_WEIGHTS.get(trip_style, LEARNED_WEIGHTS["balanced"])
    daily_budget = total_budget_lkr / num_days
    warnings_list = []

    min_required = sum(MIN_SPEND_LKR[c] for c in CATEGORIES)
    if daily_budget < min_required:
        warnings_list.append(
            f"Daily budget LKR {daily_budget:,.0f} is below minimum "
            f"LKR {min_required:,.0f}. Plan may be very tight."
        )

    prob = LpProblem("BudgetAllocation", LpMinimize)
    spend = {c: LpVariable(f"spend_{c}", lowBound=0) for c in CATEGORIES}

    prob += lpSum([spend[c] - weights[c] * daily_budget for c in CATEGORIES])
    prob += lpSum([spend[c] for c in CATEGORIES]) <= daily_budget
    prob += lpSum([spend[c] for c in CATEGORIES]) >= daily_budget * 0.90
    for c in CATEGORIES:
        prob += spend[c] >= MIN_SPEND_LKR[c]
        prob += spend[c] >= weights[c] * daily_budget * 0.70

    prob.solve(PULP_CBC_CMD(msg=0))

    daily  = {c: round(value(spend[c]), 2) for c in CATEGORIES}
    total  = {c: round(daily[c] * num_days, 2) for c in CATEGORIES}

    return {
        "status":           "optimal",
        "trip_style":       trip_style,
        "total_budget_lkr": total_budget_lkr,
        "num_days":         num_days,
        "daily_budget_lkr": round(daily_budget, 2),
        "weights_used":     weights,
        "daily_allocation": daily,
        "total_allocation": total,
        "trip_total_lkr":   round(sum(total.values()), 2),
        "remaining_lkr":    round(total_budget_lkr - sum(total.values()), 2),
        "budget_thresholds":{"warning_at_pct": 70, "critical_at_pct": 90},
        "warnings":         warnings_list,
    }

def check_budget_guardian(total_budget_lkr, spent_so_far_lkr):
    pct  = (spent_so_far_lkr / total_budget_lkr) * 100
    rem  = total_budget_lkr - spent_so_far_lkr
    if   pct >= 90: level, msg = "CRITICAL", f"🚨 {pct:.0f}% used! LKR {rem:,.0f} left. Switch to budget options immediately."
    elif pct >= 70: level, msg = "WARNING",  f"⚠️  {pct:.0f}% used. LKR {rem:,.0f} left. Consider cheaper options."
    elif pct >= 50: level, msg = "INFO",     f"ℹ️  {pct:.0f}% used. LKR {rem:,.0f} left. On track."
    else:           level, msg = "OK",       f"✅ {pct:.0f}% used. LKR {rem:,.0f} left. Great pace!"
    return {"alert_level": level, "percent_used": round(pct,1),
            "spent_lkr": spent_so_far_lkr, "remaining_lkr": round(rem,2),
            "total_budget_lkr": total_budget_lkr, "message": msg}

if __name__ == "__main__":
    print("="*60)
    print("MODEL 1 — BUDGET OPTIMIZER (trained from tourist_registrations.csv)")
    print("="*60)
    print(f"\nLearned weights per trip style:")
    for style, w in LEARNED_WEIGHTS.items():
        print(f"  {style:10}: acc={w['accommodation']*100:.1f}% "
              f"trn={w['transport']*100:.1f}% "
              f"food={w['food']*100:.1f}% "
              f"act={w['activities']*100:.1f}% "
              f"misc={w['misc']*100:.1f}%")

    tests = [
        (160000, 7,  "budget",   "T001 — Adventure 7 days"),
        (384000, 7,  "luxury",   "T002 — Relaxation 7 days"),
        (256000, 7,  "comfort",  "T003 — Cultural 7 days"),
        (640000, 10, "luxury",   "T005 — Relaxation 10 days"),
        (224000, 7,  "balanced", "T021 — Shopping 7 days"),
    ]
    print("\nSample allocations:")
    for budget, days, style, label in tests:
        r = optimize_budget(budget, days, style)
        print(f"\n  {label}")
        print(f"  Budget LKR {budget:,} / {days} days → Daily LKR {r['daily_budget_lkr']:,.0f}")
        for c, v in r["daily_allocation"].items():
            print(f"    {c:15}: LKR {v:>8,.0f}/day")

    print("\nBudget Guardian tests:")
    for spent in [32000, 112000, 148000, 190000]:
        g = check_budget_guardian(224000, spent)
        print(f"  [{g['alert_level']:8}] {g['message']}")