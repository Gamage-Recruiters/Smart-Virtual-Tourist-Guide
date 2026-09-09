from flask import Flask, request, jsonify
import sys
import os

# Add the models directory to the path so we can import the ML logic
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'models'))

try:
    from budget_optimizer import optimize_budget, check_budget_guardian
except ImportError as e:
    print(f"Error importing ML model: {e}")
    print("Please make sure you have installed requirements: pip install flask pulp pandas")
    sys.exit(1)

app = Flask(__name__)

@app.route('/api/budget/optimize', methods=['POST'])
def optimize():
    data = request.json or {}
    total_budget_lkr = data.get('total_budget_lkr')
    num_days = data.get('num_days')
    trip_style = data.get('trip_style', 'balanced')
    preferences = data.get('preferences')

    if total_budget_lkr is None or num_days is None:
        return jsonify({"success": False, "error": "Missing required parameters: total_budget_lkr, num_days"}), 400

    try:
        result = optimize_budget(total_budget_lkr, num_days, trip_style, preferences)
        return jsonify({"success": True, "data": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/budget/check-guardian', methods=['POST'])
def guardian():
    data = request.json or {}
    total_budget_lkr = data.get('total_budget_lkr')
    spent_so_far_lkr = data.get('spent_so_far_lkr')

    if total_budget_lkr is None or spent_so_far_lkr is None:
        return jsonify({"success": False, "error": "Missing required parameters: total_budget_lkr, spent_so_far_lkr"}), 400

    try:
        result = check_budget_guardian(total_budget_lkr, spent_so_far_lkr)
        return jsonify({"success": True, "data": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    print("Starting ML Service API on port 5001...")
    app.run(host='0.0.0.0', port=5001, debug=True)
