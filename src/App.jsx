import { useState, useEffect } from 'react';
import { FaHome, FaBookOpen, FaChartBar, FaSun, FaMoon, FaPlus, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from './contexts/AuthContext';
import { useGPACalculator } from './hooks/useGPACalculator';
import { GPAResult } from './components/GPAResult';
import { CourseInput } from './components/CourseInput';
import { CourseList } from './components/CourseList';
import { SemesterInput } from './components/SemesterInput';
import { SemesterList } from './components/SemesterList';
import { Dashboard } from './components/Dashboard';
import { ExportReport } from './components/ExportReport';
import { ForecastTool } from './components/ForecastTool';
import { Modal } from './components/Modal';
import { AuthModal } from './components/Auth';
import './App.css';

/**
 * UNIBEN GPA Calculator - Main Application
 * Features: Dashboard, GPA/CGPA, forecasting, export, dark mode
 */
function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('uniben_dark_mode');
    return saved === 'true';
  });

  // Tab state
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modal states
  const [courseModal, setCourseModal] = useState({ open: false, editing: null, isForecasted: false });
  const [semesterModal, setSemesterModal] = useState({ open: false, editing: null });
  const [exportModal, setExportModal] = useState(false);
  const [forecastModal, setForecastModal] = useState(false);
  const [authModal, setAuthModal] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Auth state
  const { user, isAuthenticated, signOut, loading: authLoading } = useAuth();

  // Apply dark mode
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('uniben_dark_mode', darkMode);
  }, [darkMode]);

  // GPA calculator hook
  const {
    courses,
    forecastedCourses,
    semesters,
    addCourse,
    updateCourse,
    deleteCourse,
    addForecastedCourse,
    updateForecastedCourse,
    deleteForecastedCourse,
    addSemester,
    updateSemester,
    deleteSemester,
    actualGPA,
    forecastedGPA,
    cgpaResult,
    predictedCGPA,
    hasForecastedCourses,
    loading: dataLoading,
  } = useGPACalculator();

  // Course modal handlers
  const openAddCourse = (isForecasted = false) => {
    setCourseModal({ open: true, editing: null, isForecasted });
  };

  const openEditCourse = (course) => {
    setCourseModal({ open: true, editing: course, isForecasted: course.forecasted || false });
  };

  const handleSaveCourse = (data) => {
    if (courseModal.isForecasted) {
      if (courseModal.editing) {
        updateForecastedCourse(courseModal.editing.id, data);
      } else {
        addForecastedCourse(data);
      }
    } else {
      if (courseModal.editing) {
        updateCourse(courseModal.editing.id, data);
      } else {
        addCourse(data);
      }
    }
    setCourseModal({ open: false, editing: null, isForecasted: false });
  };

  const handleDeleteCourse = (id, isForecasted) => {
    if (isForecasted) {
      deleteForecastedCourse(id);
    } else {
      deleteCourse(id);
    }
  };

  // Semester modal handlers
  const openAddSemester = () => setSemesterModal({ open: true, editing: null });
  const openEditSemester = (semester) => setSemesterModal({ open: true, editing: semester });

  const handleSaveSemester = (data) => {
    if (semesterModal.editing) {
      updateSemester(semesterModal.editing.id, data);
    } else {
      addSemester(data);
    }
    setSemesterModal({ open: false, editing: null });
  };

  // Calculate display values for sticky footer
  const displayGPA = hasForecastedCourses ? forecastedGPA : actualGPA;

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header__content">
          <h1>UNIBEN GPA Calculator</h1>
          <div className="header__actions">
            <button
              className="header__theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            {/* Auth Button / User Menu */}
            {isAuthenticated ? (
              <div className="user-menu">
                <button
                  className="user-menu__trigger"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="user-menu__avatar">
                    {user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="user-menu__email">
                    {user?.email?.split('@')[0]}
                  </span>
                </button>
                {userMenuOpen && (
                  <div className="user-menu__dropdown">
                    <div className="user-menu__item" style={{ opacity: 0.7, cursor: 'default' }}>
                      <FaUser />
                      {user?.email}
                    </div>
                    <button
                      className="user-menu__item user-menu__item--danger"
                      onClick={() => {
                        signOut();
                        setUserMenuOpen(false);
                      }}
                    >
                      <FaSignOutAlt />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="header__auth-btn"
                onClick={() => setAuthModal(true)}
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="tab-nav">
        <button
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <FaHome /> Dashboard
        </button>
        <button
          className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          <FaBookOpen /> Courses
        </button>
        <button
          className={`tab-btn ${activeTab === 'cgpa' ? 'active' : ''}`}
          onClick={() => setActiveTab('cgpa')}
        >
          <FaChartBar /> CGPA
        </button>
      </nav>

      {/* Main Content */}
      <main className="main">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="tab-content">
            <Dashboard
              actualGPA={actualGPA}
              forecastedGPA={forecastedGPA}
              cgpaResult={cgpaResult}
              semesters={semesters}
              hasForecastedCourses={hasForecastedCourses}
              onAddCourse={() => openAddCourse(false)}
              onForecast={() => setForecastModal(true)}
              onExport={() => setExportModal(true)}
            />
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="tab-content tab-content--with-footer">
            <GPAResult
              label="Your GPA this semester"
              value={actualGPA.gpa}
              forecastedValue={hasForecastedCourses ? forecastedGPA.gpa : null}
              units={displayGPA.totalUnits}
              points={displayGPA.totalPoints}
            />

            {/* Courses section */}
            <section className="section">
              <div className="section__header">
                <h2>Your courses</h2>
                <button className="add-btn" onClick={() => openAddCourse(false)}>
                  <FaPlus /> Add
                </button>
              </div>
              <CourseList
                courses={courses}
                onEdit={openEditCourse}
                onDelete={(id) => handleDeleteCourse(id, false)}
              />
            </section>

            {/* Forecasted courses section */}
            <section className="section">
              <div className="section__header">
                <h2>Forecasted</h2>
                <button className="add-btn add-btn--secondary" onClick={() => openAddCourse(true)}>
                  <FaPlus /> Add
                </button>
              </div>
              <CourseList
                courses={forecastedCourses}
                onEdit={openEditCourse}
                onDelete={(id) => handleDeleteCourse(id, true)}
                emptyMessage="No forecasted courses"
                emptyHint="Add expected grades for GPA prediction"
              />
            </section>

            {/* Floating Add Button */}
            <button className="fab" onClick={() => openAddCourse(false)} aria-label="Add course">
              <FaPlus />
            </button>

            {/* Sticky Footer Summary */}
            <div className="sticky-footer">
              <div className="sticky-footer__item">
                <span className="sticky-footer__value">{displayGPA.gpa.toFixed(2)}</span>
                <span className="sticky-footer__label">GPA</span>
              </div>
              <div className="sticky-footer__item">
                <span className="sticky-footer__value">{displayGPA.totalUnits}</span>
                <span className="sticky-footer__label">Units</span>
              </div>
              <div className="sticky-footer__item">
                <span className="sticky-footer__value">{displayGPA.totalPoints}</span>
                <span className="sticky-footer__label">Points</span>
              </div>
            </div>
          </div>
        )}

        {/* CGPA Tab */}
        {activeTab === 'cgpa' && (
          <div className="tab-content">
            <GPAResult
              label="Your cumulative GPA"
              value={cgpaResult.cgpa}
              forecastedValue={hasForecastedCourses ? predictedCGPA.cgpa : null}
              units={cgpaResult.totalUnits}
              points={cgpaResult.totalPoints}
              showClassification
            />

            {/* Semesters section */}
            <section className="section">
              <div className="section__header">
                <h2>Your semesters</h2>
                <button className="add-btn" onClick={openAddSemester}>
                  <FaPlus /> Add
                </button>
              </div>
              <SemesterList
                semesters={semesters}
                onEdit={openEditSemester}
                onDelete={deleteSemester}
              />
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Built for UNIBEN students</p>
      </footer>

      {/* Course Modal */}
      <Modal
        isOpen={courseModal.open}
        onClose={() => setCourseModal({ open: false, editing: null, isForecasted: false })}
        title={courseModal.editing ? 'Edit course' : courseModal.isForecasted ? 'Add forecasted course' : 'Add course'}
      >
        <CourseInput
          initialData={courseModal.editing}
          isForecasted={courseModal.isForecasted}
          onSubmit={handleSaveCourse}
          onCancel={() => setCourseModal({ open: false, editing: null, isForecasted: false })}
        />
      </Modal>

      {/* Semester Modal */}
      <Modal
        isOpen={semesterModal.open}
        onClose={() => setSemesterModal({ open: false, editing: null })}
        title={semesterModal.editing ? 'Edit semester' : 'Add semester'}
      >
        <SemesterInput
          initialData={semesterModal.editing}
          onSubmit={handleSaveSemester}
          onCancel={() => setSemesterModal({ open: false, editing: null })}
        />
      </Modal>

      {/* Forecast Modal */}
      <Modal
        isOpen={forecastModal}
        onClose={() => setForecastModal(false)}
        title="GPA Forecasting Tool"
      >
        <ForecastTool
          courses={courses}
          forecastedCourses={forecastedCourses}
          onUpdateForecast={updateForecastedCourse}
          onAddForecast={() => {
            setForecastModal(false);
            openAddCourse(true);
          }}
          onClose={() => setForecastModal(false)}
        />
      </Modal>

      {/* Export Modal */}
      <Modal
        isOpen={exportModal}
        onClose={() => setExportModal(false)}
        title="Export Report"
      >
        <ExportReport
          courses={[...courses, ...forecastedCourses]}
          semesters={semesters}
          gpa={hasForecastedCourses ? forecastedGPA.gpa : actualGPA.gpa}
          cgpa={cgpaResult.cgpa}
          totalUnits={hasForecastedCourses ? forecastedGPA.totalUnits : actualGPA.totalUnits}
          totalPoints={hasForecastedCourses ? forecastedGPA.totalPoints : actualGPA.totalPoints}
          onClose={() => setExportModal(false)}
        />
      </Modal>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal}
        onClose={() => setAuthModal(false)}
      />
    </div>
  );
}

export default App;
