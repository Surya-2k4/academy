const DataManager = {
    init() {
        const defaultCourses = [
            { id: 1, title: 'Corporate Finance Essentials', description: 'Master the fundamentals of financial management and investment analysis.', instructor: 'Dr. Sarah Wilson', videoUrl: 'https://www.youtube.com/embed/q6t8_gq7r_Q' },
            { id: 2, title: 'Strategic Business Leadership', description: 'Advanced strategies for managing teams and driving organizational growth.', instructor: 'Marcus Chen', videoUrl: 'https://www.youtube.com/embed/52C3W-8x3-c' }
        ];

        if (!localStorage.getItem('dora_courses')) {
            localStorage.setItem('dora_courses', JSON.stringify(defaultCourses));
        } else {
            // Migration: Update default courses if they have old broken links
            const currentCourses = JSON.parse(localStorage.getItem('dora_courses'));
            const migrated = currentCourses.map(c => {
                const def = defaultCourses.find(d => d.id === c.id);
                if (def && (c.videoUrl.includes('fA-mC17x07o') || c.videoUrl.includes('W6NZfCO5SIk'))) {
                    return { ...c, videoUrl: def.videoUrl };
                }
                return c;
            });
            localStorage.setItem('dora_courses', JSON.stringify(migrated));
        }

        if (!localStorage.getItem('dora_students')) {
            localStorage.setItem('dora_students', JSON.stringify([{ email: 'student@success.com', password: 'student', name: 'Demo Student' }]));
        }
        if (!localStorage.getItem('dora_admins')) {
            localStorage.setItem('dora_admins', JSON.stringify([{ email: 'admin@success.com', password: 'admin', name: 'Super Admin' }]));
        }
        if (!localStorage.getItem('dora_enrollments')) {
            localStorage.setItem('dora_enrollments', JSON.stringify([]));
        }
    },

    getCourses() { return JSON.parse(localStorage.getItem('dora_courses')); },
    saveCourse(course) {
        const courses = this.getCourses();
        if (course.id) {
            const idx = courses.findIndex(c => c.id === course.id);
            courses[idx] = course;
        } else {
            course.id = Date.now();
            courses.push(course);
        }
        localStorage.setItem('dora_courses', JSON.stringify(courses));
    },
    deleteCourse(id) {
        const courses = this.getCourses().filter(c => c.id !== id);
        localStorage.setItem('dora_courses', JSON.stringify(courses));
    },

    getStudents() { return JSON.parse(localStorage.getItem('dora_students')); },

    // Logic updated: Admin adds students
    addStudent(name, email, password) {
        const students = this.getStudents();
        if (students.find(s => s.email === email)) return { success: false, message: 'Student email already exists' };
        students.push({ name, email, password, id: Date.now() });
        localStorage.setItem('dora_students', JSON.stringify(students));
        return { success: true };
    },

    getEnrollments() { return JSON.parse(localStorage.getItem('dora_enrollments')); },

    enrollStudent(studentEmail, courseId) {
        const enrollments = this.getEnrollments();
        if (!enrollments.find(e => e.studentEmail === studentEmail && e.courseId === courseId)) {
            enrollments.push({ studentEmail, courseId, date: new Date().toISOString() });
            localStorage.setItem('dora_enrollments', JSON.stringify(enrollments));
            return true;
        }
        return false;
    },

    // Video Progress Tracking
    saveProgress(studentEmail, courseId, time, percentage) {
        const key = `progress_${studentEmail}_${courseId}`;
        localStorage.setItem(key, JSON.stringify({ time, percentage, lastUpdated: new Date().toISOString() }));
    },

    getProgress(studentEmail, courseId) {
        const key = `progress_${studentEmail}_${courseId}`;
        return JSON.parse(localStorage.getItem(key)) || { time: 0, percentage: 0 };
    },

    unenrollStudent(studentEmail, courseId) {
        let enrollments = this.getEnrollments();
        enrollments = enrollments.filter(e => !(e.studentEmail === studentEmail && e.courseId === courseId));
        localStorage.setItem('dora_enrollments', JSON.stringify(enrollments));
    }
};

DataManager.init();
