/**
 * UNIBEN Grading Scale
 * Official grade points for University of Benin
 */
export const GRADE_POINTS = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
    E: 1,
    F: 0,
};

/**
 * Grade options for select inputs
 */
export const GRADE_OPTIONS = [
    { value: 'A', label: 'A', points: 5 },
    { value: 'B', label: 'B', points: 4 },
    { value: 'C', label: 'C', points: 3 },
    { value: 'D', label: 'D', points: 2 },
    { value: 'E', label: 'E', points: 1 },
    { value: 'F', label: 'F', points: 0 },
];

/**
 * Credit unit options
 */
export const CREDIT_OPTIONS = [1, 2, 3, 4, 5, 6];

/**
 * Get grade point for a given grade
 * @param {string} grade - Letter grade (A-F)
 * @returns {number} Grade point value
 */
export function getGradePoint(grade) {
    return GRADE_POINTS[grade] ?? 0;
}

/**
 * Calculate GPA from courses
 * @param {Array} courses - Array of course objects with creditUnit and grade
 * @returns {Object} GPA, total units, and total points
 */
export function calculateGPA(courses) {
    if (!courses || courses.length === 0) {
        return { gpa: 0, totalUnits: 0, totalPoints: 0 };
    }

    let totalUnits = 0;
    let totalPoints = 0;

    courses.forEach((course) => {
        const gradePoint = getGradePoint(course.grade);
        const qualityPoints = course.creditUnit * gradePoint;
        totalUnits += course.creditUnit;
        totalPoints += qualityPoints;
    });

    const gpa = totalUnits > 0 ? totalPoints / totalUnits : 0;

    return { gpa, totalUnits, totalPoints };
}

/**
 * Calculate CGPA from semesters
 * @param {Array} semesters - Array of semester objects with units and gpa
 * @returns {Object} CGPA, total units, and total points
 */
export function calculateCGPA(semesters) {
    if (!semesters || semesters.length === 0) {
        return { cgpa: 0, totalUnits: 0, totalPoints: 0 };
    }

    let totalUnits = 0;
    let totalPoints = 0;

    semesters.forEach((semester) => {
        totalUnits += semester.units;
        totalPoints += semester.units * semester.gpa;
    });

    const cgpa = totalUnits > 0 ? totalPoints / totalUnits : 0;

    return { cgpa, totalUnits, totalPoints };
}

/**
 * Get classification based on GPA
 * @param {number} gpa - GPA value
 * @returns {Object} Classification name and color
 */
export function getClassification(gpa) {
    if (gpa >= 4.5) return { name: 'First Class', color: '#16a34a' };
    if (gpa >= 3.5) return { name: 'Second Class Upper', color: '#2563eb' };
    if (gpa >= 2.5) return { name: 'Second Class Lower', color: '#ca8a04' };
    if (gpa >= 1.5) return { name: 'Third Class', color: '#ea580c' };
    if (gpa >= 1.0) return { name: 'Pass', color: '#dc2626' };
    return { name: 'Fail', color: '#7f1d1d' };
}
