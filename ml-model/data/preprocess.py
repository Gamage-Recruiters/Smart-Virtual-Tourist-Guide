"""Helpers for loading ML training data."""

from pathlib import Path

import pandas as pd


def load_registrations():
    """Load tourist registration records as a pandas DataFrame."""
    csv_path = Path(__file__).with_name("tourist_registrations.csv")
    return pd.read_csv(csv_path)


def load_bids():
    """Load service bid records as a pandas DataFrame."""
    csv_path = Path(__file__).with_name("service_bids.csv")
    return pd.read_csv(csv_path)