import { useState, useEffect, useCallback } from 'react';
import { calculateGPA, calculateCGPA } from '../utils/gradePoints';

const STORAGE_KEYS = {
    COURSES: 'uniben_gpa_courses',
    SEMESTERS: 'uniben_gpa_semesters',
    FORECASTED: 'uniben_gpa_forecasted',
};

/**
 * Custom hook for GPA calculator state and logic
 * Manages courses, semesters, forecasting, and localStorage persistence
 */
export function useGPACalculator() {
    // Actual courses for current semester
    const [courses, setCourses] = useState([]);

    // Forecasted/in-progress courses
    const [forecastedCourses, setForecastedCourses] = useState([]);

    // Past semesters for CGPA
    const [semesters, setSemesters] = useState([]);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const savedCourses = localStorage.getItem(STORAGE_KEYS.COURSES);
            const savedSemesters = localStorage.getItem(STORAGE_KEYS.SEMESTERS);
            const savedForecasted = localStorage.getItem(STORAGE_KEYS.FORECASTED);

            if (savedCourses) setCourses(JSON.parse(savedCourses));
            if (savedSemesters) setSemesters(JSON.parse(savedSemesters));
            if (savedForecasted) setForecastedCourses(JSON.parse(savedForecasted));
        } catch (error) {
            console.warn('Failed to load from localStorage:', error);
        }
    }, []);

    // Save to localStorage when data changes
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
        } catch (error) {
            console.warn('Failed to save courses:', error);
        }
    }, [courses]);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEYS.SEMESTERS, JSON.stringify(semesters));
        } catch (error) {
            console.warn('Failed to save semesters:', error);
        }
    }, [semesters]);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEYS.FORECASTED, JSON.stringify(forecastedCourses));
        } catch (error) {
            console.warn('Failed to save forecasted courses:', error);
        }
    }, [forecastedCourses]);

    // Course management
    const addCourse = useCallback((course) => {
        setCourses((prev) => [...prev, { ...course, id: Date.now() }]);
    }, []);

    const updateCourse = useCallback((id, updates) => {
        setCourses((prev) =>
            prev.map((course) => (course.id === id ? { ...course, ...updates } : course))
        );
    }, []);

    const deleteCourse = useCallback((id) => {
        setCourses((prev) => prev.filter((course) => course.id !== id));
    }, []);

    // Forecasted course management
    const addForecastedCourse = useCallback((course) => {
        setForecastedCourses((prev) => [...prev, { ...course, id: Date.now(), forecasted: true }]);
    }, []);

    const updateForecastedCourse = useCallback((id, updates) => {
        setForecastedCourses((prev) =>
            prev.map((course) => (course.id === id ? { ...course, ...updates } : course))
        );
    }, []);

    const deleteForecastedCourse = useCallback((id) => {
        setForecastedCourses((prev) => prev.filter((course) => course.id !== id));
    }, []);

    // Semester management
    const addSemester = useCallback((semester) => {
        setSemesters((prev) => [...prev, { ...semester, id: Date.now() }]);
    }, []);

    const updateSemester = useCallback((id, updates) => {
        setSemesters((prev) =>
            prev.map((sem) => (sem.id === id ? { ...sem, ...updates } : sem))
        );
    }, []);

    const deleteSemester = useCallback((id) => {
        setSemesters((prev) => prev.filter((sem) => sem.id !== id));
    }, []);

    // GPA calculations
    const actualGPA = calculateGPA(courses);
    const forecastedGPA = calculateGPA([...courses, ...forecastedCourses]);
    const cgpaResult = calculateCGPA(semesters);

    // Predicted CGPA including current semester forecast
    const predictedCGPA = calculateCGPA([
        ...semesters,
        {
            id: 'predicted',
            name: 'Current (Predicted)',
            units: forecastedGPA.totalUnits,
            gpa: forecastedGPA.gpa,
        },
    ]);

    return {
        // State
        courses,
        forecastedCourses,
        semesters,

        // Course actions
        addCourse,
        updateCourse,
        deleteCourse,

        // Forecasted actions
        addForecastedCourse,
        updateForecastedCourse,
        deleteForecastedCourse,

        // Semester actions
        addSemester,
        updateSemester,
        deleteSemester,

        // Calculated values
        actualGPA,
        forecastedGPA,
        cgpaResult,
        predictedCGPA,

        // Convenience
        hasForecastedCourses: forecastedCourses.length > 0,
    };
}
