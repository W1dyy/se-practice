# Assumptions:
# 1. Inputs must strictly be int or float instances (booleans and string representations are rejected).
# 2. pass_rate is expressed as a percentage rounded to 2 decimal places.

def analyze_marks(marks, pass_mark=50):
    """
    Analyzes a list of student marks and returns summary statistics.
    """
    if not isinstance(marks, list) or len(marks) == 0:
        raise ValueError("Input marks must be a non-empty list.")
    
    for m in marks:
        if type(m) not in (int, float):
            raise ValueError(f"Non-numeric value detected: {m}")
        if m < 0 or m > 100:
            raise ValueError(f"Mark out of range [0, 100]: {m}")
            
    avg = sum(marks) / len(marks)
    hi = max(marks)
    lo = min(marks)
    passed = sum(1 for m in marks if m >= pass_mark)
    rate = round((passed / len(marks)) * 100, 2)
    
    return {
        "average": avg,
        "highest": hi,
        "lowest": lo,
        "pass_rate": rate
    }

def test_analyze_marks():
    res1 = analyze_marks([100], 50)
    assert res1 == {"average": 100.0, "highest": 100, "lowest": 100, "pass_rate": 100.0}
    
    res2 = analyze_marks([49.5, 50], 50)
    assert res2 == {"average": 49.75, "highest": 50, "lowest": 49.5, "pass_rate": 50.0}
    
    res3 = analyze_marks([40, 60, 80], 70)
    assert res3 == {"average": 60.0, "highest": 80, "lowest": 40, "pass_rate": 33.33}
    
    try:
        analyze_marks([], 50)
        assert False
    except ValueError:
        pass

    try:
        analyze_marks([40, "60"], 50)
        assert False
    except ValueError:
        pass

    try:
        analyze_marks([-1, 50, 101], 50)
        assert False
    except ValueError:
        pass

if __name__ == "__main__":
    test_analyze_marks()
    print("All AI self-tests passed!")