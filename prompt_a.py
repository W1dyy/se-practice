def analyze_student_marks(marks):
    if not marks:
        return "No marks provided."
    
    average = sum(marks) / len(marks)
    highest = max(marks)
    lowest = min(marks)
    
    return {
        "average": average,
        "highest": highest,
        "lowest": lowest
    }

marks = [75, 88, 92, 60, 54]
print(analyze_student_marks(marks))