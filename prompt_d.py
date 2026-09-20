def analyze_marks(marks, pass_mark=50):
    """
    Analyzes student marks and returns statistical summary metrics.
    
    Validation:
    - marks must be a non-empty list.
    - Every mark must be an int or float (booleans and string numbers raise ValueError).
    - Every mark must be within range [0, 100].
    - pass_mark must be an int or float.
    
    Returns:
    - dict with keys: 'average', 'highest', 'lowest', 'pass_rate'
    - A mark passes when mark >= pass_mark.
    - pass_rate is a float rounded to 2 decimal places.
    """
    if not isinstance(marks, list) or len(marks) == 0:
        raise ValueError("Input 'marks' must be a non-empty list.")
    
    if type(pass_mark) not in (int, float):
        raise ValueError("pass_mark must be a numeric value.")
        
    for m in marks:
        if type(m) not in (int, float):
            raise ValueError(f"Mark must be numeric (int or float), got {type(m).__name__}: {m}")
        if m < 0 or m > 100:
            raise ValueError(f"Mark must be between 0 and 100, got {m}")
            
    avg = sum(marks) / len(marks)
    hi = max(marks)
    lo = min(marks)
    passed_count = sum(1 for m in marks if m >= pass_mark)
    pass_rate = round((passed_count / len(marks)) * 100, 2)
    
    return {
        "average": avg,
        "highest": hi,
        "lowest": lo,
        "pass_rate": pass_rate
    }