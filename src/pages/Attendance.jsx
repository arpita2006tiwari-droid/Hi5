import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { MapPin, ShieldCheck, WifiOff, RefreshCcw, Search, Calendar, Users, Clock, Plus, ChevronDown, Camera, Building, Trophy, Activity, CheckCircle, XCircle, Edit2 } from 'lucide-react';
import { cn } from '../utils/utils';

// Replace this with your Google Apps Script Web App URL after deployment
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyDITMvkvrNb7pZLZXi-YN5B1dIgyHrD_mH3ibdARDZheiCuKxao_2xfYMgeMI46u3e/exec";

const initialStudents = [
  // Motilal
  { id: 1, name: 'Liam Johnson', status: 'pending', centre: 'Motilal' },
  { id: 2, name: 'Emma Williams', status: 'pending', centre: 'Motilal' },
  { id: 3, name: 'Noah Brown', status: 'pending', centre: 'Motilal' },
  { id: 4, name: 'Olivia Jones', status: 'pending', centre: 'Motilal' },
  { id: 5, name: 'William Garcia', status: 'pending', centre: 'Motilal' },
  { id: 6, name: 'James Smith', status: 'pending', centre: 'Motilal' },
  { id: 7, name: 'Isabella Taylor', status: 'pending', centre: 'Motilal' },
  { id: 8, name: 'Mason White', status: 'pending', centre: 'Motilal' },
  { id: 9, name: 'Sophia Harris', status: 'pending', centre: 'Motilal' },
  { id: 10, name: 'Elijah Clark', status: 'pending', centre: 'Motilal' },
  // Poonam Nagar
  { id: 11, name: 'Ava Lewis', status: 'pending', centre: 'Poonam Nagar' },
  { id: 12, name: 'Lucas Robinson', status: 'pending', centre: 'Poonam Nagar' },
  { id: 13, name: 'Mia Walker', status: 'pending', centre: 'Poonam Nagar' },
  { id: 14, name: 'Ethan Hall', status: 'pending', centre: 'Poonam Nagar' },
  { id: 15, name: 'Amelia Young', status: 'pending', centre: 'Poonam Nagar' },
  { id: 16, name: 'Alexander Allen', status: 'pending', centre: 'Poonam Nagar' },
  { id: 17, name: 'Harper King', status: 'pending', centre: 'Poonam Nagar' },
  { id: 18, name: 'Benjamin Wright', status: 'pending', centre: 'Poonam Nagar' },
  { id: 19, name: 'Evelyn Scott', status: 'pending', centre: 'Poonam Nagar' },
  { id: 20, name: 'Henry Green', status: 'pending', centre: 'Poonam Nagar' },
];

const Attendance = () => {
  const [isInsideRadius, setIsInsideRadius] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [students, setStudents] = useState(initialStudents);
  const [coachName, setCoachName] = useState("");
  const [sessionHours, setSessionHours] = useState("");
  
  const [availableCentres, setAvailableCentres] = useState(["Motilal", "Poonam Nagar"]);
  const [selectedCentre, setSelectedCentre] = useState("All Centres");

  const [schoolMapping, setSchoolMapping] = useState({
    "Motilal": ["St. Mary's", "Don Bosco"],
    "Poonam Nagar": ["Podar International"]
  });
  const [selectedSchool, setSelectedSchool] = useState("All Schools");

  const displayedSchools = selectedCentre === "All Centres" 
    ? Object.values(schoolMapping).flat() 
    : (schoolMapping[selectedCentre] || []);

  // Facility Addition State
  const [addFacilityType, setAddFacilityType] = useState(null); // 'centre' or 'school'
  const [newFacilityName, setNewFacilityName] = useState("");

  // Add Student State
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "", age: "", joiningDate: "", centre: "Motilal", school: "",
    parentNumber: "", parentEmail: "", parentAddress: "", schoolIdPic: null, aadharPic: null
  });

  // Modal State
  const [submitCentre, setSubmitCentre] = useState("Motilal");
  const [coaches, setCoaches] = useState(["Kevin", "Rahul"]);
  const [isAddingCoach, setIsAddingCoach] = useState(false);
  const [newCoachName, setNewCoachName] = useState("");

  // Tab State
  const [activeTab, setActiveTab] = useState('Attendance');
  const [explorerMode, setExplorerMode] = useState('coaches'); // 'coaches' | 'facilities'
  const [selectedExplorerCoach, setSelectedExplorerCoach] = useState(null);
  const [selectedExplorerFacility, setSelectedExplorerFacility] = useState(null);

  // Editable Dashboards State
  const [tournamentStats, setTournamentStats] = useState({});
  const [coachStats, setCoachStats] = useState({});
  const [isEditTournamentOpen, setIsEditTournamentOpen] = useState(false);
  const [isEditCoachOpen, setIsEditCoachOpen] = useState(false);
  const [tempTournamentStats, setTempTournamentStats] = useState({ played: 0, won: 0, lost: 0 });
  const [tempCoachStats, setTempCoachStats] = useState({ hours: 0, sessions: 0, centres: "" });

  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
  });
  const [sessionType, setSessionType] = useState("Morning");
  const [sessionTime, setSessionTime] = useState(() => {
    const d = new Date();
    return d.toTimeString().slice(0, 5); // HH:MM
  });

  const dateObj = new Date(selectedDate);
  const dateString = dateObj.toLocaleDateString('en-GB'); // DD/MM/YYYY
  const dayString = dateObj.toLocaleDateString('en-GB', { weekday: 'long' });
  const isToday = new Date().toISOString().split('T')[0] === selectedDate;

  const handleStatusChange = (id, newStatus) => {
    setStudents(students.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setNewStudent({ ...newStudent, [field]: URL.createObjectURL(file) });
    }
  };

  const handleSaveStudent = () => {
    if (!newStudent.name || !newStudent.centre) {
      alert("Name and Centre are required!");
      return;
    }
    const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
    const studentToAdd = {
      id: newId,
      name: newStudent.name,
      status: 'pending',
      centre: newStudent.centre
    };
    setStudents([...students, studentToAdd]);
    setIsAddStudentOpen(false);
    setNewStudent({
      name: "", age: "", joiningDate: "", centre: "Motilal", school: "",
      parentNumber: "", parentEmail: "", parentAddress: "", schoolIdPic: null, aadharPic: null
    });
  };

  const displayedStudents = selectedCentre === 'All Centres' 
    ? students 
    : students.filter(s => s.centre === selectedCentre);

  const submitToGoogleSheets = async () => {
    if (!coachName || !sessionHours) {
      alert("Please fill in both Coach Name and Session Hours.");
      return;
    }
    if (GOOGLE_SCRIPT_URL === "YOUR_WEBAPP_URL_HERE") {
      alert("Please set your GOOGLE_SCRIPT_URL in the code first!");
      setIsModalOpen(false);
      return;
    }

    setIsSubmitting(true);

    const studentsToSubmit = students.filter(s => s.centre === submitCentre);
    const attendanceSummary = studentsToSubmit.map(s => `${s.name}: ${s.status}`).join(', ');

    const payload = {
      date: dateString,
      day: dayString,
      time: `${sessionType} - ${sessionTime}`,
      centre: submitCentre,
      coach: coachName,
      hours: parseFloat(sessionHours),
      students: studentsToSubmit.map(s => ({ name: s.name, status: s.status }))
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      alert("Attendance and Coach Hours logged successfully to Google Sheets!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting to Sheets:", error);
      alert("Failed to submit. Please check your connection and URL.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const groupedStudents = displayedStudents.reduce((acc, student) => {
    if (!acc[student.centre]) acc[student.centre] = [];
    acc[student.centre].push(student);
    return acc;
  }, {});

  return (
    <div className="space-y-6">

      {/* Top Filtering & Tabs Section */}
      <div className="space-y-3 mb-6">
        {/* Tabs */}
        <div className="flex w-full bg-muted/50 p-1 rounded-xl mb-4">
          {['Attendance', 'Timeline', 'Insights', 'Explorer'].map(tab => (
            <button 
              key={tab}
              onClick={() => { 
                setActiveTab(tab); 
                if(tab !== 'Explorer') {
                  setSelectedExplorerCoach(null); 
                  setSelectedExplorerFacility(null);
                }
              }}
              className={cn(
                "flex-1 py-2 text-sm transition-all",
                activeTab === tab 
                  ? "font-semibold bg-background text-primary rounded-lg shadow-sm border border-border/50" 
                  : "font-medium text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'Attendance' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="space-y-3 mb-6">
          {/* Row 1: Centres, Schools, Add Student */}
          <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center px-4 py-2.5 bg-background border border-border rounded-xl hover:border-primary/50 transition-colors">
            <MapPin className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
            <select 
              className="bg-transparent border-none outline-none text-sm font-medium w-full text-foreground appearance-none cursor-pointer"
              value={selectedCentre}
              onChange={(e) => setSelectedCentre(e.target.value)}
            >
              <option value="All Centres">All Centres</option>
              {availableCentres.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={() => setAddFacilityType('centre')} className="ml-2 text-primary hover:bg-primary/10 p-1 rounded transition-colors" title="Add Centre">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex-1 flex items-center px-4 py-2.5 bg-background border border-border rounded-xl hover:border-primary/50 transition-colors">
            <Users className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
            <select 
              className="bg-transparent border-none outline-none text-sm font-medium w-full text-foreground appearance-none cursor-pointer"
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
            >
              <option value="All Schools">All Schools</option>
              {displayedSchools.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={() => setAddFacilityType('school')} className="ml-2 text-primary hover:bg-primary/10 p-1 rounded transition-colors" title="Add School">
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <Button 
            onClick={() => setIsAddStudentOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 h-auto py-2.5 shadow-md shadow-primary/20 shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Student
          </Button>
        </div>

        {/* Row 2: Search */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-10 h-11 bg-background border-border rounded-xl w-full text-sm" placeholder="Search by name, ID, school, sport..." />
        </div>

        {/* Row 3: Date */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-background border border-border rounded-xl hover:border-primary/50 transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 relative cursor-pointer">
          <div className="flex items-center gap-3 text-foreground font-medium w-full">
            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="relative flex-1 flex items-center">
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-medium w-full text-foreground cursor-pointer absolute inset-0 opacity-0"
              />
              <span className="text-sm pointer-events-none">{dateString} ({dayString})</span>
            </div>
          </div>
          {isToday && <span className="text-sm font-bold text-primary shrink-0 ml-2">Today</span>}
        </div>

        {/* Row 4: Session / Time */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-background border border-border rounded-xl px-4 py-2.5 hover:border-primary/50 transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
          <div className="flex items-center justify-between w-full sm:w-auto sm:flex-1 cursor-pointer">
            <div className="flex items-center gap-3 text-foreground font-medium w-full">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-medium w-full text-foreground appearance-none cursor-pointer p-0"
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
                <option value="Tournament">Tournament</option>
              </select>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 ml-2 pointer-events-none" />
          </div>
          <div className="hidden sm:block w-px h-4 bg-border"></div>
          <div className="w-full sm:w-auto flex items-center">
             <input 
               type="time" 
               value={sessionTime}
               onChange={(e) => setSessionTime(e.target.value)}
               className="bg-transparent border-none outline-none text-sm font-medium text-foreground cursor-pointer p-0 w-full"
             />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pb-2">
        {isOffline && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 text-warning text-sm border border-warning/20">
            <WifiOff className="h-4 w-4" /> Offline Mode
          </div>
        )}
        <Button variant="outline" className="gap-2 rounded-xl">
          <RefreshCcw className="h-4 w-4" /> Sync
        </Button>
        <Button
          onClick={() => {
            setSubmitCentre(selectedCentre === 'All Centres' ? 'Motilal' : selectedCentre);
            setIsModalOpen(true);
          }}
          className="gap-2 bg-success hover:bg-success/90 text-white rounded-xl shadow-lg shadow-success/20"
        >
          Submit Attendance
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Geolocation Security Card */}
        <Card className="col-span-1 glass border-border/50 relative overflow-hidden h-fit">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-primary" /> Location Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={cn(
              "p-4 rounded-xl border flex flex-col items-center justify-center text-center gap-2",
              isInsideRadius
                ? "bg-success/10 border-success/20 text-success"
                : "bg-destructive/10 border-destructive/20 text-destructive"
            )}>
              <ShieldCheck className="h-8 w-8" />
              <div className="font-semibold">
                {isInsideRadius ? "Inside Allowed Zone" : "Outside Allowed Zone"}
              </div>
              <div className="text-xs opacity-80">
                Current Distance: 42m / 100m radius
              </div>
            </div>

            <div className="h-48 w-full rounded-xl bg-muted/50 border border-border/50 overflow-hidden relative flex items-center justify-center">
              {/* Fake Map UI */}
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, var(--color-primary) 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
              <div className="h-32 w-32 rounded-full border border-primary/50 bg-primary/5 flex items-center justify-center relative">
                <div className="h-3 w-3 rounded-full bg-primary animate-ping absolute" />
                <div className="h-3 w-3 rounded-full bg-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student List Grouped by Centre */}
        <div className="col-span-2 space-y-6">
          {Object.entries(groupedStudents).map(([centreName, centreStudents]) => (
            <Card key={centreName} className="glass border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  {centreName}
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md border border-border/50">
                    {centreStudents.length} Students
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {centreStudents.map((student) => (
                    <div key={student.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/50 transition-colors gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {student.status === 'pending' ? 'Not Marked' : 'Marked'}
                          </p>
                        </div>
                      </div>

                      <div className="flex bg-muted rounded-lg p-1">
                        <button
                          onClick={() => handleStatusChange(student.id, 'present')}
                          className={cn(
                            "px-4 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer",
                            student.status === 'present' ? "bg-success text-white shadow" : "text-muted-foreground hover:bg-background"
                          )}>
                          Present
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.id, 'absent')}
                          className={cn(
                            "px-4 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer",
                            student.status === 'absent' ? "bg-destructive text-white shadow" : "text-muted-foreground hover:bg-background"
                          )}>
                          Absent
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      </div>
      )}

      {activeTab === 'Explorer' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Mode Toggle */}
          {!selectedExplorerCoach && !selectedExplorerFacility && (
            <div className="flex w-full max-w-sm mx-auto bg-muted/50 p-1 rounded-xl mb-6">
              <button 
                onClick={() => setExplorerMode('coaches')}
                className={cn(
                  "flex-1 py-2 text-sm transition-all",
                  explorerMode === 'coaches' ? "font-semibold bg-background text-primary rounded-lg shadow-sm border border-border/50" : "font-medium text-muted-foreground hover:text-foreground"
                )}
              >
                Coaches
              </button>
              <button 
                onClick={() => setExplorerMode('facilities')}
                className={cn(
                  "flex-1 py-2 text-sm transition-all",
                  explorerMode === 'facilities' ? "font-semibold bg-background text-primary rounded-lg shadow-sm border border-border/50" : "font-medium text-muted-foreground hover:text-foreground"
                )}
              >
                Centres & Schools
              </button>
            </div>
          )}

          {explorerMode === 'coaches' && (
            <>
              {!selectedExplorerCoach ? (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-foreground">Coaches Directory</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {coaches.map(coach => (
                      <Card key={coach} className="glass hover:border-primary/50 cursor-pointer transition-all hover:scale-[1.02]" onClick={() => setSelectedExplorerCoach(coach)}>
                        <CardContent className="p-6 flex flex-col items-center justify-center gap-3">
                          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                            {coach.charAt(0)}
                          </div>
                          <h3 className="font-semibold text-lg">{coach}</h3>
                          <p className="text-sm text-muted-foreground">Tap to view dashboard</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <Button variant="outline" className="mb-4 rounded-xl" onClick={() => setSelectedExplorerCoach(null)}>
                    ← Back to Directory
                  </Button>
                  
                  <div className="flex items-center justify-between mb-6 bg-background border border-border p-4 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold shrink-0">
                        {selectedExplorerCoach.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">{selectedExplorerCoach}'s Dashboard</h2>
                        <p className="text-muted-foreground">Performance Overview</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl" onClick={() => {
                      setTempCoachStats(coachStats[selectedExplorerCoach] || { hours: 0, sessions: 0, centres: "None" });
                      setIsEditCoachOpen(true);
                    }}>
                      <Edit2 className="h-4 w-4 mr-2" /> Edit Metrics
                    </Button>
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    {(() => {
                      const currentCoach = coachStats[selectedExplorerCoach] || { hours: 0, sessions: 0, centres: "None" };
                      return (
                        <>
                          <Card className="glass border-border/50">
                            <CardContent className="p-6 flex flex-col gap-2">
                              <Clock className="h-6 w-6 text-primary mb-2" />
                              <p className="text-sm text-muted-foreground">Total Working Hours</p>
                              <h3 className="text-3xl font-bold text-foreground">{currentCoach.hours}h</h3>
                            </CardContent>
                          </Card>
                          <Card className="glass border-border/50">
                            <CardContent className="p-6 flex flex-col gap-2">
                              <Calendar className="h-6 w-6 text-primary mb-2" />
                              <p className="text-sm text-muted-foreground">Sessions Completed</p>
                              <h3 className="text-3xl font-bold text-foreground">{currentCoach.sessions}</h3>
                            </CardContent>
                          </Card>
                          <Card className="glass border-border/50">
                            <CardContent className="p-6 flex flex-col gap-2">
                              <MapPin className="h-6 w-6 text-primary mb-2" />
                              <p className="text-sm text-muted-foreground">Centres Visited</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {currentCoach.centres.split(',').map(c => c.trim()).filter(c => c).map(c => (
                                  <span key={c} className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-md">
                                    {c}
                                  </span>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </>
          )}

          {explorerMode === 'facilities' && (
            <>
              {!selectedExplorerFacility ? (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-foreground">Facilities Directory</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[...availableCentres, ...Object.values(schoolMapping).flat()].map(facility => (
                      <Card key={facility} className="glass hover:border-primary/50 cursor-pointer transition-all hover:scale-[1.02]" onClick={() => setSelectedExplorerFacility(facility)}>
                        <CardContent className="p-6 flex flex-col items-center justify-center gap-3 text-center">
                          <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                            <Building className="h-8 w-8" />
                          </div>
                          <h3 className="font-semibold text-lg">{facility}</h3>
                          <p className="text-sm text-muted-foreground">Tap to view dashboard</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <Button variant="outline" className="mb-4 rounded-xl" onClick={() => setSelectedExplorerFacility(null)}>
                    ← Back to Directory
                  </Button>
                  
                  <div className="flex items-center gap-4 mb-6 bg-background border border-border p-4 rounded-2xl">
                    <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                      <Building className="h-8 w-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{selectedExplorerFacility}</h2>
                      <p className="text-muted-foreground">Facility Performance Dashboard</p>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    {(() => {
                      const facilityStudents = students.filter(s => s.centre === selectedExplorerFacility || s.school === selectedExplorerFacility);
                      const totalFacilityStudents = facilityStudents.length;
                      const markedStudents = facilityStudents.filter(s => s.status === 'present' || s.status === 'absent');
                      const presentStudents = facilityStudents.filter(s => s.status === 'present');
                      const averageAttendance = markedStudents.length > 0 ? ((presentStudents.length / markedStudents.length) * 100).toFixed(1) : "0.0";
                      const currentTournament = tournamentStats[selectedExplorerFacility] || { played: 0, won: 0, lost: 0 };
                      
                      return (
                        <>
                          <Card className="glass border-border/50">
                            <CardContent className="p-6 flex flex-col gap-2">
                              <Activity className="h-6 w-6 text-primary mb-2" />
                              <p className="text-sm text-muted-foreground">Average Attendance (Today)</p>
                              <h3 className="text-3xl font-bold text-foreground">{averageAttendance}%</h3>
                            </CardContent>
                          </Card>
                          <Card className="glass border-border/50">
                            <CardContent className="p-6 flex flex-col gap-2">
                              <Users className="h-6 w-6 text-primary mb-2" />
                              <p className="text-sm text-muted-foreground">Total Enrolled Students</p>
                              <h3 className="text-3xl font-bold text-foreground">{totalFacilityStudents}</h3>
                            </CardContent>
                          </Card>
                          <Card className="glass border-border/50 md:col-span-2">
                            <CardHeader className="px-6 pt-6 pb-2 flex flex-row items-center justify-between">
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-accent" /> Tournament Performance
                              </CardTitle>
                              <Button variant="ghost" size="sm" className="h-8 hover:bg-muted" onClick={() => {
                                setTempTournamentStats(currentTournament);
                                setIsEditTournamentOpen(true);
                              }}>
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </CardHeader>
                            <CardContent className="p-6 grid grid-cols-3 gap-4">
                              <div className="bg-background/50 rounded-xl p-4 border border-border flex flex-col items-center justify-center text-center">
                                <p className="text-sm text-muted-foreground mb-1">Played</p>
                                <h4 className="text-3xl font-bold">{currentTournament.played}</h4>
                              </div>
                              <div className="bg-success/10 rounded-xl p-4 border border-success/20 flex flex-col items-center justify-center text-center text-success">
                                <CheckCircle className="h-6 w-6 mb-1" />
                                <p className="text-xs font-medium mb-1">Won</p>
                                <h4 className="text-2xl font-bold">{currentTournament.won}</h4>
                              </div>
                              <div className="bg-destructive/10 rounded-xl p-4 border border-destructive/20 flex flex-col items-center justify-center text-center text-destructive">
                                <XCircle className="h-6 w-6 mb-1" />
                                <p className="text-xs font-medium mb-1">Lost</p>
                                <h4 className="text-2xl font-bold">{currentTournament.lost}</h4>
                              </div>
                            </CardContent>
                          </Card>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-sm glass border-border/50 shadow-2xl animate-in fade-in zoom-in duration-200">
            <CardHeader>
              <CardTitle>Submit Attendance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Select Centre for Attendance</label>
                <select 
                  value={submitCentre}
                  onChange={(e) => setSubmitCentre(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Motilal">Motilal</option>
                  <option value="Poonam Nagar">Poonam Nagar</option>
                  {availableCentres.filter(c => c !== "Motilal" && c !== "Poonam Nagar").map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Coach Name</label>
                  {!isAddingCoach && (
                    <button onClick={() => setIsAddingCoach(true)} className="text-xs text-primary font-medium hover:underline flex items-center">
                      <Plus className="h-3 w-3 mr-1" /> Add Coach
                    </button>
                  )}
                </div>
                {isAddingCoach ? (
                  <div className="flex gap-2">
                    <Input 
                      value={newCoachName}
                      onChange={(e) => setNewCoachName(e.target.value)}
                      placeholder="Enter new coach name"
                      className="bg-background/50 h-10"
                    />
                    <Button 
                      type="button"
                      onClick={() => {
                        if (newCoachName.trim()) {
                          setCoaches([...coaches, newCoachName.trim()]);
                          setCoachName(newCoachName.trim());
                          setNewCoachName("");
                          setIsAddingCoach(false);
                        }
                      }}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-3"
                    >
                      Save
                    </Button>
                    <Button variant="outline" className="h-10 px-3" onClick={() => setIsAddingCoach(false)}>Cancel</Button>
                  </div>
                ) : (
                  <select 
                    value={coachName}
                    onChange={(e) => setCoachName(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Coach...</option>
                    {coaches.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Session Duration (Hours)</label>
                <Input
                  type="number"
                  step="0.5"
                  value={sessionHours}
                  onChange={(e) => setSessionHours(e.target.value)}
                  placeholder="E.g., 1.5"
                  className="bg-background/50"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button
                  className="bg-success hover:bg-success/90 text-white"
                  onClick={submitToGoogleSheets}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Confirm & Submit"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Facility Modal */}
      {addFacilityType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-sm glass border-border/50 shadow-2xl animate-in fade-in zoom-in duration-200">
            <CardHeader>
              <CardTitle>Add New {addFacilityType === 'centre' ? 'Centre' : 'School'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  value={newFacilityName}
                  onChange={(e) => setNewFacilityName(e.target.value)}
                  placeholder={`Enter ${addFacilityType} name...`}
                  className="bg-background/50"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-2">
                <Button variant="outline" onClick={() => { setAddFacilityType(null); setNewFacilityName(""); }}>Cancel</Button>
                <Button
                  className="bg-primary hover:bg-primary/90 text-white"
                  onClick={() => {
                    if (newFacilityName.trim()) {
                      if (addFacilityType === 'centre') {
                        setAvailableCentres([...availableCentres, newFacilityName.trim()]);
                        setSchoolMapping({ ...schoolMapping, [newFacilityName.trim()]: [] });
                        setSelectedCentre(newFacilityName.trim());
                      } else {
                        const targetCentre = selectedCentre === 'All Centres' ? availableCentres[0] : selectedCentre;
                        setSchoolMapping({
                          ...schoolMapping,
                          [targetCentre]: [...(schoolMapping[targetCentre] || []), newFacilityName.trim()]
                        });
                        setSelectedSchool(newFacilityName.trim());
                      }
                      setAddFacilityType(null);
                      setNewFacilityName("");
                    }
                  }}
                >
                  Save & Select
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Student Modal */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <Card className="w-full max-w-lg glass border-border/50 shadow-2xl animate-in fade-in zoom-in duration-200 mt-20 mb-20 flex flex-col max-h-[85vh]">
            <CardHeader className="pb-4 border-b border-border/50 shrink-0">
              <CardTitle className="text-xl">Add New Student</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 overflow-y-auto">
              {/* Student Details */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-primary">Student Details</h3>
                <Input value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} placeholder="Full Name *" className="bg-background/50" />
                <div className="flex gap-3">
                  <Input type="number" value={newStudent.age} onChange={e => setNewStudent({...newStudent, age: e.target.value})} placeholder="Age" className="w-1/3 bg-background/50" />
                  <div className="w-2/3 relative flex items-center bg-background/50 border border-border rounded-md px-3 h-10 hover:border-primary/50 transition-colors cursor-pointer">
                    <span className="text-sm text-muted-foreground absolute pointer-events-none">
                      {newStudent.joiningDate ? `Joined: ${new Date(newStudent.joiningDate).toLocaleDateString('en-GB')}` : 'Joining Date'}
                    </span>
                    <input type="date" className="absolute inset-0 opacity-0 w-full cursor-pointer" value={newStudent.joiningDate} onChange={e => setNewStudent({...newStudent, joiningDate: e.target.value})} />
                  </div>
                </div>
              </div>

              {/* Assignment */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-primary">Facility Assignment</h3>
                <select value={newStudent.centre} onChange={e => setNewStudent({...newStudent, centre: e.target.value, school: ""})} className="flex h-10 w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm focus:outline-none">
                  {availableCentres.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={newStudent.school} onChange={e => setNewStudent({...newStudent, school: e.target.value})} className="flex h-10 w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm focus:outline-none">
                  <option value="">Select School...</option>
                  {(schoolMapping[newStudent.centre] || []).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Parent Info */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-primary">Parent Information</h3>
                <Input type="tel" value={newStudent.parentNumber} onChange={e => setNewStudent({...newStudent, parentNumber: e.target.value})} placeholder="Parent Phone Number" className="bg-background/50" />
                <Input type="email" value={newStudent.parentEmail} onChange={e => setNewStudent({...newStudent, parentEmail: e.target.value})} placeholder="Parent Email Address" className="bg-background/50" />
                <Input value={newStudent.parentAddress} onChange={e => setNewStudent({...newStudent, parentAddress: e.target.value})} placeholder="Residential Address" className="bg-background/50" />
              </div>

              {/* Document Uploads */}
              <div className="space-y-4 pt-2 pb-2">
                <h3 className="text-sm font-bold text-primary">Documents (Camera / Gallery)</h3>
                
                {/* School ID */}
                <div className="border-2 border-dashed border-border/80 hover:border-primary/50 transition-colors rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden bg-background/30 group">
                  {newStudent.schoolIdPic ? (
                    <img src={newStudent.schoolIdPic} className="max-h-32 rounded-lg object-contain" alt="School ID" />
                  ) : (
                    <div className="text-center text-muted-foreground flex flex-col items-center group-hover:text-primary transition-colors">
                      <Camera className="h-6 w-6 mb-2 opacity-50 group-hover:opacity-100" />
                      <span className="text-sm font-medium">Upload School ID</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" capture="environment" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, 'schoolIdPic')} />
                </div>

                {/* Aadhar */}
                <div className="border-2 border-dashed border-border/80 hover:border-primary/50 transition-colors rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden bg-background/30 group">
                  {newStudent.aadharPic ? (
                    <img src={newStudent.aadharPic} className="max-h-32 rounded-lg object-contain" alt="Aadhar" />
                  ) : (
                    <div className="text-center text-muted-foreground flex flex-col items-center group-hover:text-primary transition-colors">
                      <Camera className="h-6 w-6 mb-2 opacity-50 group-hover:opacity-100" />
                      <span className="text-sm font-medium">Upload Aadhar Card</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" capture="environment" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, 'aadharPic')} />
                </div>
              </div>
            </CardContent>
            <div className="p-4 border-t border-border/50 flex justify-end gap-3 bg-background/50 rounded-b-xl shrink-0">
              <Button variant="outline" onClick={() => setIsAddStudentOpen(false)}>Cancel</Button>
              <Button className="bg-primary hover:bg-primary/90 text-white" onClick={handleSaveStudent}>Save Profile</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Tournament Modal */}
      {isEditTournamentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-sm glass border-border/50 shadow-2xl animate-in fade-in zoom-in duration-200">
            <CardHeader>
              <CardTitle>Edit Tournament Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Tournaments Played</label>
                <Input type="number" value={tempTournamentStats.played} onChange={e => setTempTournamentStats({...tempTournamentStats, played: Number(e.target.value)})} className="bg-background/50" />
              </div>
              <div className="flex gap-3">
                <div className="space-y-2 flex-1">
                  <label className="text-sm text-success">Won</label>
                  <Input type="number" value={tempTournamentStats.won} onChange={e => setTempTournamentStats({...tempTournamentStats, won: Number(e.target.value)})} className="bg-background/50" />
                </div>
                <div className="space-y-2 flex-1">
                  <label className="text-sm text-destructive">Lost</label>
                  <Input type="number" value={tempTournamentStats.lost} onChange={e => setTempTournamentStats({...tempTournamentStats, lost: Number(e.target.value)})} className="bg-background/50" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-2">
                <Button variant="outline" onClick={() => setIsEditTournamentOpen(false)}>Cancel</Button>
                <Button className="bg-primary hover:bg-primary/90 text-white" onClick={() => {
                  setTournamentStats({...tournamentStats, [selectedExplorerFacility]: tempTournamentStats});
                  setIsEditTournamentOpen(false);
                }}>Save</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Coach Stats Modal */}
      {isEditCoachOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-sm glass border-border/50 shadow-2xl animate-in fade-in zoom-in duration-200">
            <CardHeader>
              <CardTitle>Edit Coach Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="space-y-2 flex-1">
                  <label className="text-sm text-muted-foreground">Total Hours</label>
                  <Input type="number" value={tempCoachStats.hours} onChange={e => setTempCoachStats({...tempCoachStats, hours: Number(e.target.value)})} className="bg-background/50" />
                </div>
                <div className="space-y-2 flex-1">
                  <label className="text-sm text-muted-foreground">Sessions</label>
                  <Input type="number" value={tempCoachStats.sessions} onChange={e => setTempCoachStats({...tempCoachStats, sessions: Number(e.target.value)})} className="bg-background/50" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Centres Visited (comma separated)</label>
                <Input value={tempCoachStats.centres} onChange={e => setTempCoachStats({...tempCoachStats, centres: e.target.value})} className="bg-background/50" placeholder="e.g. Motilal, Poonam Nagar" />
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-2">
                <Button variant="outline" onClick={() => setIsEditCoachOpen(false)}>Cancel</Button>
                <Button className="bg-primary hover:bg-primary/90 text-white" onClick={() => {
                  setCoachStats({...coachStats, [selectedExplorerCoach]: tempCoachStats});
                  setIsEditCoachOpen(false);
                }}>Save</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Attendance;
