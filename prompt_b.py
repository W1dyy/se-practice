def analyze_marks(marks, pass_mark=50):
    if not marks:
        raise ValueError("List of marks cannot be empty.")
    
    validated_marks = []
    for m in marks:
        try:
            val = float(m)
            if val < 0 or val > 100:
                raise ValueError(f"Mark {val} out of range [0, 100]")
            validated_marks.append(val)
        except (ValueError, TypeError):
            raise ValueError(f"Invalid non-numeric mark: {m}")
            
    avg = sum(validated_marks) / len(validated_marks)
    hi = max(validated_marks)
    lo = min(validated_marks)
    passed = sum(1 for m in validated_marks if m >= pass_mark)
    rate = (passed / len(validated_marks)) * 100
    
    return {
        "average": avg,
        "highest": hi,
        "lowest": lo,
        "pass_rate": rate
    }