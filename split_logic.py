def expense_owed_amounts(expense):
    """List of {person_id, shares, owed} for one expense, rounded to sum exactly to amount."""
    total_shares = sum(p["shares"] for p in expense["participants"])
    if total_shares <= 0:
        return []

    owed = []
    for p in expense["participants"]:
        owed.append({
            "person_id": p["person_id"],
            "shares": p["shares"],
            "owed": round(expense["amount"] * p["shares"] / total_shares),
        })

    # fix rounding drift so shares sum exactly to amount
    drift = round(expense["amount"]) - sum(o["owed"] for o in owed)
    if drift != 0 and owed:
        biggest = max(range(len(owed)), key=lambda i: owed[i]["shares"])
        owed[biggest]["owed"] += drift

    return owed


def compute_balances(people, expenses):
    """Net balance per person_id: paid - owed. Positive = should receive money."""
    balances = {p["id"]: 0.0 for p in people}

    for e in expenses:
        balances[e["paid_by"]] = balances.get(e["paid_by"], 0.0) + e["amount"]

        for o in expense_owed_amounts(e):
            balances[o["person_id"]] = balances.get(o["person_id"], 0.0) - o["owed"]

    return {pid: round(bal) for pid, bal in balances.items()}


def compute_breakdown(people, expenses):
    """Per-person list of {expense_id, description, shares, owed} for expenses they took part in."""
    breakdown = {p["id"]: [] for p in people}

    for e in expenses:
        for o in expense_owed_amounts(e):
            breakdown.setdefault(o["person_id"], []).append({
                "expense_id": e["id"],
                "description": e["description"],
                "shares": o["shares"],
                "owed": o["owed"],
            })

    return breakdown


def compute_settlements(balances):
    """Greedy debt simplification: minimal list of {from, to, amount} payments."""
    creditors = [[pid, bal] for pid, bal in balances.items() if bal > 0]
    debtors = [[pid, -bal] for pid, bal in balances.items() if bal < 0]

    settlements = []
    while creditors and debtors:
        creditors.sort(key=lambda x: -x[1])
        debtors.sort(key=lambda x: -x[1])

        c_id, c_amt = creditors[0]
        d_id, d_amt = debtors[0]
        amount = min(c_amt, d_amt)

        settlements.append({"from": d_id, "to": c_id, "amount": amount})

        creditors[0][1] -= amount
        debtors[0][1] -= amount

        creditors = [c for c in creditors if c[1] > 0]
        debtors = [d for d in debtors if d[1] > 0]

    return settlements

