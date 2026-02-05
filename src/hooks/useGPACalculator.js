import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { calculateGPA, calculateCGPA } from '../utils/gradePoints';

/**
 * Custom hook for GPA calculator state and logic
 * Uses Supabase for persistence when authenticated, falls back to localStorage
 */
export function useGPACalculator() {
    const { user, isAuthenticated } = useAuth();

    // Actual courses for current semester
    const [courses, setCourses] = useState([]);

    // Forecasted/in-progress courses
    const [forecastedCourses, setForecastedCourses] = useState([]);

    // Past semesters for CGPA
    const [semesters, setSemesters] = useState([]);

    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ==========================================
    // DATA FETCHING
    // ==========================================

    const fetchCourses = useCallback(async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true });

            if (error) throw error;

            // Separate actual vs forecasted courses
            const actual = data.filter(c => !c.is_forecasted).map(c => ({
                id: c.id,
                name: c.name,
                creditUnit: c.credit_unit,
                grade: c.grade,
            }));
            const forecasted = data.filter(c => c.is_forecasted).map(c => ({
                id: c.id,
                name: c.name,
                creditUnit: c.credit_unit,
                grade: c.grade,
                forecasted: true,
            }));

            setCourses(actual);
            setForecastedCourses(forecasted);
        } catch (err) {
            console.error('Error fetching courses:', err);
            setError(err.message);
        }
    }, [user]);

    const fetchSemesters = useCallback(async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('semesters')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true });

            if (error) throw error;

            setSemesters(data.map(s => ({
                id: s.id,
                name: s.name,
                units: s.units,
                gpa: parseFloat(s.gpa),
            })));
        } catch (err) {
            console.error('Error fetching semesters:', err);
            setError(err.message);
        }
    }, [user]);

    // Load data when user changes
    useEffect(() => {
        const loadData = async () => {
            if (!isAuthenticated) {
                // Load from localStorage for unauthenticated users
                try {
                    const savedCourses = localStorage.getItem('uniben_gpa_courses');
                    const savedSemesters = localStorage.getItem('uniben_gpa_semesters');
                    const savedForecasted = localStorage.getItem('uniben_gpa_forecasted');

                    if (savedCourses) setCourses(JSON.parse(savedCourses));
                    if (savedSemesters) setSemesters(JSON.parse(savedSemesters));
                    if (savedForecasted) setForecastedCourses(JSON.parse(savedForecasted));
                } catch (err) {
                    console.warn('Failed to load from localStorage:', err);
                }
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            await Promise.all([fetchCourses(), fetchSemesters()]);
            setLoading(false);
        };

        loadData();
    }, [isAuthenticated, fetchCourses, fetchSemesters]);

    // Real-time subscription for authenticated users
    useEffect(() => {
        if (!isAuthenticated || !user) return;

        const coursesSubscription = supabase
            .channel('courses-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'courses',
                    filter: `user_id=eq.${user.id}`,
                },
                () => {
                    fetchCourses();
                }
            )
            .subscribe();

        const semestersSubscription = supabase
            .channel('semesters-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'semesters',
                    filter: `user_id=eq.${user.id}`,
                },
                () => {
                    fetchSemesters();
                }
            )
            .subscribe();

        return () => {
            coursesSubscription.unsubscribe();
            semestersSubscription.unsubscribe();
        };
    }, [isAuthenticated, user, fetchCourses, fetchSemesters]);

    // Save to localStorage for unauthenticated users
    useEffect(() => {
        if (isAuthenticated) return;
        try {
            localStorage.setItem('uniben_gpa_courses', JSON.stringify(courses));
        } catch (err) {
            console.warn('Failed to save courses:', err);
        }
    }, [courses, isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) return;
        try {
            localStorage.setItem('uniben_gpa_semesters', JSON.stringify(semesters));
        } catch (err) {
            console.warn('Failed to save semesters:', err);
        }
    }, [semesters, isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) return;
        try {
            localStorage.setItem('uniben_gpa_forecasted', JSON.stringify(forecastedCourses));
        } catch (err) {
            console.warn('Failed to save forecasted courses:', err);
        }
    }, [forecastedCourses, isAuthenticated]);

    // ==========================================
    // COURSE MANAGEMENT
    // ==========================================

    const addCourse = useCallback(async (course) => {
        if (isAuthenticated && user) {
            try {
                const { error } = await supabase.from('courses').insert({
                    user_id: user.id,
                    name: course.name,
                    credit_unit: course.creditUnit,
                    grade: course.grade,
                    is_forecasted: false,
                });
                if (error) throw error;
                // Real-time subscription will update the state
            } catch (err) {
                console.error('Error adding course:', err);
                setError(err.message);
            }
        } else {
            setCourses((prev) => [...prev, { ...course, id: Date.now() }]);
        }
    }, [isAuthenticated, user]);

    const updateCourse = useCallback(async (id, updates) => {
        if (isAuthenticated && user) {
            try {
                const updateData = {};
                if (updates.name !== undefined) updateData.name = updates.name;
                if (updates.creditUnit !== undefined) updateData.credit_unit = updates.creditUnit;
                if (updates.grade !== undefined) updateData.grade = updates.grade;

                const { error } = await supabase
                    .from('courses')
                    .update(updateData)
                    .eq('id', id)
                    .eq('user_id', user.id);
                if (error) throw error;
            } catch (err) {
                console.error('Error updating course:', err);
                setError(err.message);
            }
        } else {
            setCourses((prev) =>
                prev.map((course) => (course.id === id ? { ...course, ...updates } : course))
            );
        }
    }, [isAuthenticated, user]);

    const deleteCourse = useCallback(async (id) => {
        if (isAuthenticated && user) {
            try {
                const { error } = await supabase
                    .from('courses')
                    .delete()
                    .eq('id', id)
                    .eq('user_id', user.id);
                if (error) throw error;
            } catch (err) {
                console.error('Error deleting course:', err);
                setError(err.message);
            }
        } else {
            setCourses((prev) => prev.filter((course) => course.id !== id));
        }
    }, [isAuthenticated, user]);

    // ==========================================
    // FORECASTED COURSE MANAGEMENT
    // ==========================================

    const addForecastedCourse = useCallback(async (course) => {
        if (isAuthenticated && user) {
            try {
                const { error } = await supabase.from('courses').insert({
                    user_id: user.id,
                    name: course.name,
                    credit_unit: course.creditUnit,
                    grade: course.grade,
                    is_forecasted: true,
                });
                if (error) throw error;
            } catch (err) {
                console.error('Error adding forecasted course:', err);
                setError(err.message);
            }
        } else {
            setForecastedCourses((prev) => [...prev, { ...course, id: Date.now(), forecasted: true }]);
        }
    }, [isAuthenticated, user]);

    const updateForecastedCourse = useCallback(async (id, updates) => {
        if (isAuthenticated && user) {
            try {
                const updateData = {};
                if (updates.name !== undefined) updateData.name = updates.name;
                if (updates.creditUnit !== undefined) updateData.credit_unit = updates.creditUnit;
                if (updates.grade !== undefined) updateData.grade = updates.grade;

                const { error } = await supabase
                    .from('courses')
                    .update(updateData)
                    .eq('id', id)
                    .eq('user_id', user.id);
                if (error) throw error;
            } catch (err) {
                console.error('Error updating forecasted course:', err);
                setError(err.message);
            }
        } else {
            setForecastedCourses((prev) =>
                prev.map((course) => (course.id === id ? { ...course, ...updates } : course))
            );
        }
    }, [isAuthenticated, user]);

    const deleteForecastedCourse = useCallback(async (id) => {
        if (isAuthenticated && user) {
            try {
                const { error } = await supabase
                    .from('courses')
                    .delete()
                    .eq('id', id)
                    .eq('user_id', user.id);
                if (error) throw error;
            } catch (err) {
                console.error('Error deleting forecasted course:', err);
                setError(err.message);
            }
        } else {
            setForecastedCourses((prev) => prev.filter((course) => course.id !== id));
        }
    }, [isAuthenticated, user]);

    // ==========================================
    // SEMESTER MANAGEMENT
    // ==========================================

    const addSemester = useCallback(async (semester) => {
        if (isAuthenticated && user) {
            try {
                const { error } = await supabase.from('semesters').insert({
                    user_id: user.id,
                    name: semester.name,
                    units: semester.units,
                    gpa: semester.gpa,
                });
                if (error) throw error;
            } catch (err) {
                console.error('Error adding semester:', err);
                setError(err.message);
            }
        } else {
            setSemesters((prev) => [...prev, { ...semester, id: Date.now() }]);
        }
    }, [isAuthenticated, user]);

    const updateSemester = useCallback(async (id, updates) => {
        if (isAuthenticated && user) {
            try {
                const { error } = await supabase
                    .from('semesters')
                    .update(updates)
                    .eq('id', id)
                    .eq('user_id', user.id);
                if (error) throw error;
            } catch (err) {
                console.error('Error updating semester:', err);
                setError(err.message);
            }
        } else {
            setSemesters((prev) =>
                prev.map((sem) => (sem.id === id ? { ...sem, ...updates } : sem))
            );
        }
    }, [isAuthenticated, user]);

    const deleteSemester = useCallback(async (id) => {
        if (isAuthenticated && user) {
            try {
                const { error } = await supabase
                    .from('semesters')
                    .delete()
                    .eq('id', id)
                    .eq('user_id', user.id);
                if (error) throw error;
            } catch (err) {
                console.error('Error deleting semester:', err);
                setError(err.message);
            }
        } else {
            setSemesters((prev) => prev.filter((sem) => sem.id !== id));
        }
    }, [isAuthenticated, user]);

    // ==========================================
    // GPA CALCULATIONS (unchanged)
    // ==========================================

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
        loading,
        error,

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
        isAuthenticated,
    };
}
