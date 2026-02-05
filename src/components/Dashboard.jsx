import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';
import { FaPlus, FaMagic, FaFileExport, FaGraduationCap, FaChartLine, FaBookOpen } from 'react-icons/fa';
import { getClassificationDetails } from '../utils/motivationalMessages';
import { MotivationalMessage } from './MotivationalMessage';
import './Dashboard.css';

/**
 * Dashboard - Home screen with GPA overview, trends, and quick actions
 */
export function Dashboard({
    actualGPA,
    forecastedGPA,
    cgpaResult,
    semesters = [],
    hasForecastedCourses,
    onAddCourse,
    onForecast,
    onExport,
}) {
    // Prepare chart data
    const chartData = semesters.map((sem, index) => ({
        name: sem.name || `Sem ${index + 1}`,
        gpa: sem.gpa,
    }));

    // Add current semester if has courses
    if (actualGPA.totalUnits > 0) {
        chartData.push({
            name: 'Current',
            gpa: hasForecastedCourses ? forecastedGPA.gpa : actualGPA.gpa,
            isCurrent: true,
        });
    }

    const classification = getClassificationDetails(cgpaResult.cgpa || actualGPA.gpa);
    const currentGPA = hasForecastedCourses ? forecastedGPA.gpa : actualGPA.gpa;

    return (
        <div className="dashboard">
            {/* Primary GPA Card */}
            <div className="dashboard__card dashboard__card--primary">
                <div className="dashboard__card-icon">
                    <FaGraduationCap />
                </div>
                <div className="dashboard__card-label">Your GPA This Semester</div>
                <div className="dashboard__gpa-display">
                    <span className="dashboard__gpa-value">{actualGPA.gpa.toFixed(2)}</span>
                    {hasForecastedCourses && (
                        <span className="dashboard__gpa-forecast">
                            <FaChartLine className="forecast-icon" />
                            {forecastedGPA.gpa.toFixed(2)}
                            <small>predicted</small>
                        </span>
                    )}
                </div>
                <div className="dashboard__stats-row">
                    <div className="dashboard__stat">
                        <span className="dashboard__stat-value">
                            {hasForecastedCourses ? forecastedGPA.totalUnits : actualGPA.totalUnits}
                        </span>
                        <span className="dashboard__stat-label">units</span>
                    </div>
                    <div className="dashboard__stat">
                        <span className="dashboard__stat-value">
                            {hasForecastedCourses ? forecastedGPA.totalPoints : actualGPA.totalPoints}
                        </span>
                        <span className="dashboard__stat-label">points</span>
                    </div>
                </div>
            </div>

            {/* CGPA Progress Card */}
            <div className="dashboard__card">
                <div className="dashboard__card-header">
                    <span className="dashboard__card-label">Cumulative GPA Progress</span>
                    <span className="dashboard__classification" style={{ color: classification.color }}>
                        {classification.name}
                    </span>
                </div>
                <div className="dashboard__cgpa-display">
                    <span className="dashboard__cgpa-value">{cgpaResult.cgpa.toFixed(2)}</span>
                    <span className="dashboard__cgpa-max">/ 5.00</span>
                </div>
                <div className="dashboard__progress-bar">
                    <div
                        className="dashboard__progress-fill"
                        style={{
                            width: `${(cgpaResult.cgpa / 5) * 100}%`,
                            backgroundColor: classification.color,
                        }}
                    />
                </div>
                <div className="dashboard__progress-labels">
                    <span>0.00</span>
                    <span>2.50</span>
                    <span>5.00</span>
                </div>
            </div>

            {/* Motivational Message */}
            <MotivationalMessage
                gpa={currentGPA}
                forecastChange={hasForecastedCourses ? forecastedGPA.gpa - actualGPA.gpa : 0}
            />

            {/* GPA Trend Chart */}
            {chartData.length > 0 && (
                <div className="dashboard__card">
                    <div className="dashboard__card-label">
                        <FaChartLine className="label-icon" /> GPA Progression
                    </div>
                    <div className="dashboard__chart">
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                                    axisLine={{ stroke: 'var(--border)' }}
                                    tickLine={false}
                                />
                                <YAxis
                                    domain={[0, 5]}
                                    ticks={[1, 2, 3, 4, 5]}
                                    tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    formatter={(value) => [value.toFixed(2), 'GPA']}
                                    contentStyle={{
                                        background: 'var(--bg-card)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 6,
                                        fontSize: 12,
                                        color: 'var(--text-primary)',
                                    }}
                                />
                                <ReferenceLine y={4.5} stroke="#16a34a" strokeDasharray="3 3" strokeOpacity={0.5} />
                                <ReferenceLine y={3.5} stroke="#2563eb" strokeDasharray="3 3" strokeOpacity={0.5} />
                                <ReferenceLine y={2.5} stroke="#ca8a04" strokeDasharray="3 3" strokeOpacity={0.5} />
                                <Bar dataKey="gpa" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="dashboard__legend">
                        <span><span className="dot" style={{ background: '#16a34a' }} /> 1st Class</span>
                        <span><span className="dot" style={{ background: '#2563eb' }} /> 2nd Upper</span>
                        <span><span className="dot" style={{ background: '#ca8a04' }} /> 2nd Lower</span>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="dashboard__actions">
                <button className="dashboard__action-btn" onClick={onAddCourse}>
                    <span className="dashboard__action-icon"><FaPlus /></span>
                    <span>Add Course</span>
                </button>
                <button className="dashboard__action-btn" onClick={onForecast}>
                    <span className="dashboard__action-icon"><FaMagic /></span>
                    <span>Forecast GPA</span>
                </button>
                <button className="dashboard__action-btn" onClick={onExport}>
                    <span className="dashboard__action-icon"><FaFileExport /></span>
                    <span>Export Report</span>
                </button>
            </div>

            {/* Stats Summary */}
            <div className="dashboard__summary">
                <div className="dashboard__summary-item">
                    <span className="dashboard__summary-value">{semesters.length}</span>
                    <span className="dashboard__summary-label">Semesters</span>
                </div>
                <div className="dashboard__summary-item">
                    <span className="dashboard__summary-value">{cgpaResult.totalUnits}</span>
                    <span className="dashboard__summary-label">Total Units</span>
                </div>
                <div className="dashboard__summary-item">
                    <span className="dashboard__summary-value">
                        {typeof cgpaResult.totalPoints === 'number'
                            ? cgpaResult.totalPoints.toFixed(0)
                            : cgpaResult.totalPoints}
                    </span>
                    <span className="dashboard__summary-label">Total Points</span>
                </div>
            </div>
        </div>
    );
}
