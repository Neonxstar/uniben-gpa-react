import { useRef, useState } from 'react';
import { exportAsPDF, exportAsImage, shareReport, generateReportText } from '../utils/exportUtils';
import { GRADE_POINTS, GRADE_OPTIONS } from '../utils/gradePoints';
import { getClassificationDetails } from '../utils/motivationalMessages';
import './ExportReport.css';

/**
 * ExportReport - Export GPA results with UNIBEN branding
 */
export function ExportReport({
    courses = [],
    semesters = [],
    gpa = 0,
    cgpa = 0,
    totalUnits = 0,
    totalPoints = 0,
    onClose,
}) {
    const reportRef = useRef(null);
    const [exporting, setExporting] = useState(false);
    const [message, setMessage] = useState('');
    const [studentName, setStudentName] = useState('');

    const classification = getClassificationDetails(cgpa || gpa);

    const showMessage = (text) => {
        setMessage(text);
        setTimeout(() => setMessage(''), 3000);
    };

    const handleExportPDF = async () => {
        if (!reportRef.current) return;
        setExporting(true);
        const success = await exportAsPDF(reportRef.current, 'uniben-gpa-report.pdf');
        setExporting(false);
        showMessage(success ? 'PDF downloaded!' : 'Export failed');
    };

    const handleExportImage = async () => {
        if (!reportRef.current) return;
        setExporting(true);
        const success = await exportAsImage(reportRef.current, 'uniben-gpa-report.png');
        setExporting(false);
        showMessage(success ? 'Image saved!' : 'Export failed');
    };

    const handleShare = async (platform) => {
        const text = generateReportText({
            courses,
            semesters,
            gpa,
            cgpa,
            totalUnits,
            totalPoints,
            studentName,
        });

        if (platform === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
            return;
        }

        if (platform === 'email') {
            window.open(`mailto:?subject=My UNIBEN GPA Report&body=${encodeURIComponent(text)}`, '_blank');
            return;
        }

        // Default: copy to clipboard
        const success = await shareReport({ title: 'UNIBEN GPA Report', text });
        showMessage(success ? 'Copied to clipboard!' : 'Share failed');
    };

    return (
        <div className="export-report">
            {/* Student Name Input */}
            <div className="export-report__name-input">
                <label>Student Name (optional)</label>
                <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter your name"
                />
            </div>

            {/* Export Actions */}
            <div className="export-report__actions">
                <button className="export-btn" onClick={handleExportPDF} disabled={exporting}>
                    📄 PDF
                </button>
                <button className="export-btn" onClick={handleExportImage} disabled={exporting}>
                    🖼️ Image
                </button>
            </div>

            {/* Share Actions */}
            <div className="export-report__share">
                <span className="export-report__share-label">Share via:</span>
                <div className="export-report__share-buttons">
                    <button
                        className="share-btn share-btn--whatsapp"
                        onClick={() => handleShare('whatsapp')}
                    >
                        WhatsApp
                    </button>
                    <button
                        className="share-btn share-btn--email"
                        onClick={() => handleShare('email')}
                    >
                        Email
                    </button>
                    <button
                        className="share-btn"
                        onClick={() => handleShare('copy')}
                    >
                        Copy
                    </button>
                </div>
            </div>

            {message && <div className="export-report__message">{message}</div>}

            {/* Report Preview */}
            <div className="export-report__preview" ref={reportRef}>
                <div className="report-card">
                    {/* Header with Logo */}
                    <div className="report-header">
                        <img
                            src="/uniben-logo.png"
                            alt="UNIBEN Logo"
                            className="report-logo"
                        />
                        <h2>University of Benin</h2>
                        <h3>GPA Report</h3>
                    </div>

                    {/* Student Info */}
                    {studentName && (
                        <div className="report-student">
                            <span className="report-student-label">Student:</span>
                            <span className="report-student-name">{studentName}</span>
                        </div>
                    )}

                    {/* Date */}
                    <div className="report-date">
                        {new Date().toLocaleDateString('en-NG', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </div>

                    {/* GPA Summary */}
                    <div className="report-summary">
                        {gpa > 0 && (
                            <div className="report-gpa-block">
                                <span className="report-gpa-label">Semester GPA</span>
                                <span className="report-gpa-value">{gpa.toFixed(2)}</span>
                            </div>
                        )}
                        {cgpa > 0 && (
                            <div className="report-gpa-block">
                                <span className="report-gpa-label">Cumulative GPA</span>
                                <span className="report-gpa-value">{cgpa.toFixed(2)}</span>
                                <span className="report-classification" style={{ color: classification.color }}>
                                    {classification.name}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="report-stats">
                        <div className="report-stat">
                            <span className="report-stat-value">{totalUnits}</span>
                            <span className="report-stat-label">Total Units</span>
                        </div>
                        <div className="report-stat">
                            <span className="report-stat-value">{totalPoints}</span>
                            <span className="report-stat-label">Quality Points</span>
                        </div>
                    </div>

                    {/* Courses Table */}
                    {courses.length > 0 && (
                        <div className="report-courses">
                            <h4>Course Results</h4>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Course</th>
                                        <th>Grade</th>
                                        <th>Units</th>
                                        <th>Points</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map((course) => (
                                        <tr key={course.id}>
                                            <td>{course.name}</td>
                                            <td className="report-grade">{course.grade}</td>
                                            <td>{course.creditUnit}</td>
                                            <td>{GRADE_POINTS[course.grade] * course.creditUnit}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Grading Scale Reference */}
                    <div className="report-grading-scale">
                        <h4>UNIBEN Grading Scale</h4>
                        <div className="report-scale-grid">
                            {GRADE_OPTIONS.map((g) => (
                                <div key={g.value} className="report-scale-item">
                                    <span className="report-scale-grade">{g.label}</span>
                                    <span className="report-scale-points">{g.points} pts</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="report-footer">
                        <p>Generated by UNIBEN GPA Calculator</p>
                        <p className="report-disclaimer">
                            This is an unofficial student-generated report.
                        </p>
                    </div>
                </div>
            </div>

            <button className="export-close" onClick={onClose}>
                Close
            </button>
        </div>
    );
}
