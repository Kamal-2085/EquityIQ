import json
import os
import numpy as np
from concurrent.futures import ProcessPoolExecutor, as_completed
from sklearn.ensemble import RandomForestRegressor
import time


def _import_and_get_score(module_names, attr_candidates, default):
    """Import one of module_names (string or list) and return the first matching attribute value.

    Returns a tuple: (module_name_used_or_None, value_or_None, error_or_None)
    """
    if isinstance(module_names, str):
        module_names = [module_names]

    for module_name in module_names:
        try:
            mod = __import__(module_name)
        except Exception:
            continue

        for attr in attr_candidates:
            if hasattr(mod, attr):
                try:
                    return (module_name, float(getattr(mod, attr)), None)
                except Exception as e:
                    return (module_name, None, f"attribute '{attr}' found but conversion failed: {e}")

        return (module_name, None, f"no attributes {attr_candidates} in module")

    return (None, None, f"couldn't import any of {module_names}")


def _collect_scores(specs, timeout_per=180, verbose=True):
    scores = {}
    errors = {}
    with ProcessPoolExecutor(max_workers=len(specs)) as ex:
        future_to_spec = {
            ex.submit(_import_and_get_score, spec['modules'], spec['attrs'], spec['default']): spec
            for spec in specs
        }

        for future in as_completed(future_to_spec):
            spec = future_to_spec[future]
            name = spec['name']
            try:
                module_name, value, error = future.result(timeout=timeout_per)
            except Exception as e:
                module_name, value, error = (None, None, f"Execution error: {e}")

            if value is not None:
                scores[name] = value
                if verbose:
                    print(f"{spec['name']} score from {module_name}: {value}")
            else:
                scores[name] = float(spec['default'])
                errors[name] = error
                if verbose:
                    print(
                        f"Warning: {spec['name']} failed ({error}); using default {spec['default']}"
                    )

    return scores, errors


def _compute_final_score(scores):
    X_input = np.array([
        scores['Graph'],
        scores['Profile'],
        scores['PriceMarket'],
        scores['Valuation'],
        scores['News']
    ]).reshape(1, -1)

    np.random.seed(42)
    X_train = np.random.uniform(1, 10, (500, 5))
    y_train = (
        0.30 * X_train[:, 0] +
        0.20 * X_train[:, 1] +
        0.15 * X_train[:, 2] +
        0.20 * X_train[:, 3] +
        0.15 * X_train[:, 4]
    )

    model = RandomForestRegressor(n_estimators=300, random_state=42)
    model.fit(X_train, y_train)

    final_score = float(model.predict(X_input)[0])
    final_score = max(1, min(10, final_score))
    final_score = round(final_score, 2)
    return final_score


def _recommendation_from_score(score):
    if score < 2.5:
        return "STRONG SELL"
    if score < 5:
        return "SELL / WAIT"
    if score < 7.5:
        return "HOLD / MAY BUY"
    if score < 9:
        return "BUY"
    return "STRONG BUY"


if __name__ == '__main__':
    output_json = os.getenv("EQUITYIQ_OUTPUT", "").lower() == "json"
    specs = [
        {
            'name': 'Graph',
            'modules': ['GraphAnalyzer'],
            'attrs': ['trend_score', 'graph_score', 'final_score', 'score'],
            'default': 8.0
        },
        {
            'name': 'Profile',
            'modules': ['CompanyProfileAnalyzer'],
            'attrs': ['final_score', 'profile_score', 'company_score', 'score'],
            'default': 7.9
        },
        {
            'name': 'PriceMarket',
            'modules': ['PriceAndMarketDataAnalyzer', 'PeiceAndMarketDataAnalyzer', 'MarketAnalyzer'],
            'attrs': ['score', 'market_score', 'final_score'],
            'default': 6.5
        },
        {
            'name': 'Valuation',
            'modules': ['ValuationMetricsAnalyzer', 'ValuationAnalyzer'],
            'attrs': ['score', 'valuation_score', 'final_score'],
            'default': 7.3
        },
        {
            'name': 'News',
            'modules': ['NewsAnalyzer'],
            'attrs': ['news_score', 'sentiment_score', 'final_score', 'score'],
            'default': 5.9
        }
    ]

    if not output_json:
        print("Running analyzers in parallel (each analyzer runs in its own process)...")
    start = time.time()
    scores, errors = _collect_scores(specs, timeout_per=180, verbose=not output_json)
    elapsed = time.time() - start
    if not output_json:
        print(f"All analyzers finished (elapsed {elapsed:.1f}s).\n")

    if not output_json:
        print("Analyzer results:")
        for k, v in scores.items():
            print(f"- {k}: {v}")

    final_score = _compute_final_score(scores)
    recommendation = _recommendation_from_score(final_score)

    if output_json:
        payload = {
            "scores": scores,
            "errors": errors,
            "finalScore": final_score,
            "recommendation": recommendation,
            "elapsed": round(elapsed, 1),
        }
        print(f"__EQUITYIQ_JSON__{json.dumps(payload)}")
    else:
        print("\nFinal EquityIQ Score:", final_score)
        print("Recommendation:", recommendation)
