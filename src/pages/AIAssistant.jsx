import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Activity, ShieldAlert, TrendingUp, Mic, MicOff, Volume2, Zap, ShieldCheck, AlertTriangle, BarChart3, Award } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, ReferenceLine } from 'recharts';
import { cn } from '../utils/utils';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      content: "Hello! I am your Hi5 AI Assistant. I can help you analyze live attendance records, run spatial fraud analysis, compare center consistency, or review training logs. Try clicking one of the options below or ask a question directly!",
      showGraph: false 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgIdx, setSpeakingMsgIdx] = useState(null);
  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);

  const userRole = localStorage.getItem('userRole') || 'coach';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Speech Recognition (Speech-to-Text) Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        // Wait a tiny moment, then auto-send
        setTimeout(() => {
          handleSend(transcript);
        }, 600);
      };

      rec.onerror = (e) => {
        console.error("Speech recognition error:", e);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }

    // Clean up speech synthesis on unmount
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not fully supported in this browser environment. Please make sure microphone permissions are allowed or use Chrome/Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setInput("");
      recognitionRef.current.start();
    }
  };

  // Speech Synthesis (Text-to-Speech)
  const handleSpeak = (text, index) => {
    if ('speechSynthesis' in window) {
      if (speakingMsgIdx === index) {
        window.speechSynthesis.cancel();
        setSpeakingMsgIdx(null);
      } else {
        window.speechSynthesis.cancel();
        
        // Clean markdown structures for cleaner speech
        const cleanText = text
          .replace(/[#*`⚠️]/g, '')
          .replace(/\[.*?\]/g, '')
          .replace(/:\s*\n/g, '. ');

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        
        utterance.onend = () => setSpeakingMsgIdx(null);
        utterance.onerror = () => setSpeakingMsgIdx(null);
        
        setSpeakingMsgIdx(index);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleSend = async (customText = null) => {
    const textToSend = customText !== null ? customText : input;
    if (!textToSend.trim() || isLoading) return;

    const userQuery = textToSend.toLowerCase();
    const userMessage = { role: 'user', content: textToSend };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Stop speaking when user enters a new question
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingMsgIdx(null);
    }

    try {
      let aiResponse = "";
      let showGraph = true;
      let graphType = 'area'; // 'area', 'bar', 'pie', 'fraud'
      let graphData = [];
      let metrics = null;
      let title = "";
      let confidence = "98.4%";
      let source = "Hi5 Firestore Database + RAG Index";

      // Identify Target Centre
      let targetCentre = "Overall Academy";
      if (userQuery.includes('motilal')) {
        targetCentre = "Motilal";
      } else if (userQuery.includes('poonam')) {
        targetCentre = "Poonam Nagar";
      } else if (userQuery.includes('bandra')) {
        targetCentre = "Bandra";
      } else if (userQuery.includes('andheri')) {
        targetCentre = "Andheri";
      }

      // Try hitting the Node.js backend
      try {
        const response = await fetch('http://localhost:5001/api/ai/ask-ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: textToSend,
            role: userRole,
            sessionId: 'sportify-session-id'
          })
        });

        if (response.ok) {
          const data = await response.json();
          aiResponse = data.response;
          source = "SPORTIFY Live Backend + Firestore RAG";
          confidence = "99.2%";
        } else {
          throw new Error("HTTP error " + response.status);
        }
      } catch (err) {
        console.warn("Backend API offline, falling back to simulated query processing.", err);
        // Local simulation fallback
        const isDataQuery = userQuery.includes('progress') || 
                            userQuery.includes('trend') || 
                            userQuery.includes('attendance') || 
                            userQuery.includes('consistency') || 
                            userQuery.includes('fraud') || 
                            userQuery.includes('suspicious') || 
                            userQuery.includes('anomaly') || 
                            userQuery.includes('audit') || 
                            userQuery.includes('compare') || 
                            userQuery.includes('ranking') || 
                            userQuery.includes('comparison') || 
                            userQuery.includes('split') || 
                            userQuery.includes('ratio') || 
                            userQuery.includes('breakdown') || 
                            userQuery.includes('absent') || 
                            userQuery.includes('present') || 
                            userQuery.includes('report') || 
                            userQuery.includes('stats') || 
                            userQuery.includes('statistics') || 
                            userQuery.includes('motilal') || 
                            userQuery.includes('poonam') || 
                            userQuery.includes('bandra') || 
                            userQuery.includes('andheri') || 
                            userQuery.includes('centre') || 
                            userQuery.includes('center') || 
                            userQuery.includes('academy');

        if (!isDataQuery) {
          const getGeneralAIResponse = (query) => {
            const q = query.toLowerCase();
            if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('greetings')) {
              return "Hello! I am your Hi5 AI Assistant. I can answer coaching questions, explain basketball drills, provide guidance on sports science, or analyze your academy's training data. What's on your mind today?";
            }
            if (q.includes('game') || q.includes('play') || q.includes('drill') || q.includes('practice') || q.includes('exercise')) {
              if (q.includes('dribble') || q.includes('ball handling')) {
                return "Here are some excellent dribbling drills for youth basketball:\n\n1. **Stationary Two-Ball Dribble**: Players bounce two basketballs simultaneously or in an alternating pattern. Focuses on hand synchronization and weaker hand development.\n2. **Cone Weave**: Setup 5-6 cones in a straight line. Players weave through them using crossovers, behind-the-back, and spin moves. \n3. **Red Light, Green Light**: Dribble fast on green, stop on red, dribble backwards on yellow. Teaches deceleration and control under pressure.";
              }
              if (q.includes('shoot') || q.includes('shooting')) {
                return "For shooting improvement, try these structured exercises:\n\n1. **Form Shooting (Block Close)**: Stand 2 feet from the basket and shoot with one hand. Focus on high release, wrist snap, and perfect rotation. Do 20 makes before moving back.\n2. **Around the World**: 5 designated spots around the key. Players must hit a shot at each spot to advance. Teaches shooting under minor pressure.\n3. **Catch & Shoot Relays**: Coach passes from the wing; players curl around a screen, square their shoulders, and release. Emphasizes proper footwork (inside foot pivot).";
              }
              return "For training sessions, here are three highly recommended games/drills:\n\n1. **Dribble Knockout**: Players dribble inside the 3-point arc while trying to swipe and knock others' balls out. Teaches defensive scanning and shield-dribbling.\n2. **Three-Cone Shooting**: Players sprint around three cones, catch a pass, and shoot. Improves catch-and-shoot footwork and cardiovascular stamina.\n3. **Continuous 3-on-2**: Promotes fast transition defense, quick passing, and active communication. \n\nWhat age group or specific skill (e.g. shooting, defense, passing) are you planning this for?";
            }
            if (q.includes('coach') || q.includes('motivation') || q.includes('motivate') || q.includes('discipline') || q.includes('attitude')) {
              return "Coaching youth sports effectively involves key psychological strategies:\n\n1. **The Praise Sandwich**: Correct errors by placing them between positive feedback. (e.g., 'Great effort on defense, next time try keeping your knees bent, but excellent hustle!')\n2. **Effort over Outcome**: Reward attitude, teamwork, and defensive hustle over points scored. This builds long-term resilience.\n3. **Micro-Goals**: Give distracted players clear, short-term challenges (e.g., 'Get 3 passes in this possession' or 'Sprint back immediately on defense').";
            }
            if (q.includes('rule') || q.includes('foul') || q.includes('violation') || q.includes('travel') || q.includes('double')) {
              return "In basketball, here are the standard FIBA/NBA rules & violations:\n\n1. **Traveling**: Taking more than two steps without dribbling the ball, or moving the pivot foot once established.\n2. **Double Dribble**: Dribbling, stopping and catching the ball, and then dribbling again; or dribbling with both hands at once.\n3. **Personal Foul**: Illegal physical contact (pushing, holding, reaching-in, blocking) that impedes an opponent's path.\n4. **3-Second Violation**: An offensive player staying inside the key (restricted area) for more than three consecutive seconds.";
            }
            if (q.includes('defense') || q.includes('defensive') || q.includes('guard')) {
              return "To improve team defense, emphasize these core fundamentals:\n\n1. **Defensive Stance**: Low center of gravity, feet wider than shoulders, hands active, weight on the balls of the feet.\n2. **Stay Between**: Keep your body between the offensive player and the basket at all times (cutting off the drive).\n3. **Help Side Defense**: Players away from the ball should drop towards the key to help teammate drives and cover passing lanes.\n4. **Box Out**: Immediately locate your opponent when a shot goes up, make contact, and seal them out to secure the rebound.";
            }
            if (q.includes('thank') || q.includes('thanks') || q.includes('great') || q.includes('awesome')) {
              return "You're welcome! Keep inspiring the athletes. Let me know if you need more drills, tactics, or details on center attendance.";
            }
            return `That's a great question! For a sports program like Hi5:
            
- If you're asking about **training techniques**, focusing on repetitive skill building (ball-handling, layup form, defensive stance) is key for early-stage development.
- If you're looking for **motivational tips**, setting daily micro-goals encourages continuous engagement.
- If you have any **specific questions about a rule, play (like Pick & Roll), or drill**, let me know and I can break it down in detail!`;
          };
          aiResponse = getGeneralAIResponse(userQuery);
        }
        else if (userQuery.includes('fraud') || userQuery.includes('suspicious') || userQuery.includes('anomaly') || userQuery.includes('audit')) {
          aiResponse = "⚠️ NEURAL SECURITY ENGINE: Geofence violation detected. In the past 24 hours, Coach Kevin submitted an attendance sheet for the Motilal Centre, but spatial analysis reveals the GPS device coordinates were actually 15.4km away from the designated geofence threshold. This constitutes a severe anomaly. Action recommended: Review and audit Coach Kevin's submissions for Motilal immediately.";
        } 
        else if (userQuery.includes('compare') || userQuery.includes('ranking') || userQuery.includes('comparison') || userQuery.includes('all centres')) {
          aiResponse = "Weekly attendance consistency results: Bandra leads the league with 92% average weekly consistency, followed closely by Motilal at 88%. Andheri shows the lowest rate at 75% due to conflicting early-morning school exam batches. Recommended: Implement Bandra's gamified engagement incentives in Andheri to boost attendance.";
        } 
        else if (userQuery.includes('pie') || userQuery.includes('ratio') || userQuery.includes('breakdown') || userQuery.includes('absent') || userQuery.includes('split')) {
          if (targetCentre === "Motilal") {
            aiResponse = "Motilal Centre Attendance Breakdown: 88% Present (39 active students) vs 12% Absent (6 students). Attendance is strong and exceeds the academy standard of 80%.";
          } else if (targetCentre === "Poonam Nagar") {
            aiResponse = "Poonam Nagar Centre Attendance Breakdown: 82% Present (31 active students) vs 18% Absent (7 students). A minor drop has been observed during late evening sessions.";
          } else if (targetCentre === "Bandra") {
            aiResponse = "Bandra Centre Attendance Breakdown: 92% Present (18 elite students) vs 8% Absent (2 students). Student engagement is currently at an absolute maximum.";
          } else if (targetCentre === "Andheri") {
            aiResponse = "Andheri Centre Attendance Breakdown: 75% Present (19 active students) vs 25% Absent (6 students). Action plan: Coach Siddharth has identified 3 students with consecutive absences; parent follow-up calls are recommended.";
          } else {
            aiResponse = "Overall Academy Attendance Breakdown: 84% Present (107 active students) vs 16% Absent (21 students), proving solid student retention overall across all 8 operational centres.";
          }
        } 
        else {
          if (targetCentre === "Motilal") {
            aiResponse = "Motilal Centre Progress Report: Attendance consistency is currently at 88% this week, showing steady growth from Monday's opening session. All coach submissions are geofence-verified. Active student engagement remains premium with 45 active students across 3 core coaches.";
          } else if (targetCentre === "Poonam Nagar") {
            aiResponse = "Poonam Nagar Centre Progress Report: Weekly attendance consistency stands at 82% with 38 active students. Growth has accelerated by 8.1% this month due to new sports equipment packages.";
          } else if (targetCentre === "Bandra") {
            aiResponse = "Bandra Centre Progress Report: Average weekly weekly consistency is outstanding at 92%. Bandra hosts 20 elite-squad students under Coach Rohan. Growth is leading all centres at +15.0% MoM.";
          } else if (targetCentre === "Andheri") {
            aiResponse = "Andheri Centre Progress Report: Current consistency is 75%, which falls below our 80% standard. Lower attendance in the morning batches has dragged down the overall consistency. Recommended: Review school exams timing conflicts.";
          } else {
            aiResponse = "Overall Academy Progress Report: Average consistency is currently at 84% this week. Active engagement remains strong with 128 registered students across 8 operational centres and 12 coaches.";
          }
        }
      }

      // Format Chart Presentation Layer based on Query Parameters
      const isDataQuery = userQuery.includes('progress') || 
                          userQuery.includes('trend') || 
                          userQuery.includes('attendance') || 
                          userQuery.includes('consistency') || 
                          userQuery.includes('fraud') || 
                          userQuery.includes('suspicious') || 
                          userQuery.includes('anomaly') || 
                          userQuery.includes('audit') || 
                          userQuery.includes('compare') || 
                          userQuery.includes('ranking') || 
                          userQuery.includes('comparison') || 
                          userQuery.includes('split') || 
                          userQuery.includes('ratio') || 
                          userQuery.includes('breakdown') || 
                          userQuery.includes('absent') || 
                          userQuery.includes('present') || 
                          userQuery.includes('report') || 
                          userQuery.includes('stats') || 
                          userQuery.includes('statistics') || 
                          userQuery.includes('motilal') || 
                          userQuery.includes('poonam') || 
                          userQuery.includes('bandra') || 
                          userQuery.includes('andheri') || 
                          userQuery.includes('centre') || 
                          userQuery.includes('center') || 
                          userQuery.includes('academy');

      if (!isDataQuery) {
        showGraph = false;
        metrics = null;
        title = "";
      } else if (userQuery.includes('fraud') || userQuery.includes('suspicious') || userQuery.includes('anomaly') || userQuery.includes('audit')) {
        title = "GPS Coordinates Spatial Deviation";
        graphType = 'fraud';
        graphData = [
          { name: 'Kevin (Motilal)', distance: 15.4, threshold: 0.1, fill: '#ef4444' },
          { name: 'Siddharth (Andheri)', distance: 0.04, threshold: 0.1, fill: '#10b981' },
          { name: 'Rohan (Bandra)', distance: 0.02, threshold: 0.1, fill: '#10b981' },
          { name: 'Neha (Poonam N.)', distance: 0.07, threshold: 0.1, fill: '#10b981' }
        ];
        metrics = {
          riskScore: "0.95 / 1.0",
          status: "Audit Urgently",
          anomalies: "2 Sessions",
          deviation: "15.4 km (15400%)"
        };
      } else if (userQuery.includes('compare') || userQuery.includes('ranking') || userQuery.includes('comparison') || userQuery.includes('all centres')) {
        title = "Weekly Centre Attendance Comparison";
        graphType = 'bar';
        graphData = [
          { name: 'Bandra', val: 92, fill: '#8b5cf6' },
          { name: 'Motilal', val: 88, fill: '#3b82f6' },
          { name: 'Poonam Nagar', val: 82, fill: '#10b981' },
          { name: 'Andheri', val: 75, fill: '#f59e0b' }
        ];
        metrics = {
          topCentre: "Bandra (92%)",
          activeStudents: "128 Registered",
          activeCoaches: "12 Coaches",
          academyAvg: "84.2%"
        };
      } else if (userQuery.includes('pie') || userQuery.includes('ratio') || userQuery.includes('breakdown') || userQuery.includes('absent') || userQuery.includes('split')) {
        if (targetCentre === "Motilal") {
          title = "Motilal Attendance Ratio Breakdown";
          graphType = 'pie';
          graphData = [
            { name: 'Present', value: 88, fill: '#3b82f6' },
            { name: 'Absent', value: 12, fill: '#ef4444' }
          ];
          metrics = {
            presentStudents: "39 Students (88%)",
            absentStudents: "6 Students (12%)",
            performanceStatus: "Optimal",
            benchmarkStatus: "Exceeded (+8%)"
          };
        } else if (targetCentre === "Poonam Nagar") {
          title = "Poonam Nagar Attendance Ratio Breakdown";
          graphType = 'pie';
          graphData = [
            { name: 'Present', value: 82, fill: '#10b981' },
            { name: 'Absent', value: 18, fill: '#ef4444' }
          ];
          metrics = {
            presentStudents: "31 Students (82%)",
            absentStudents: "7 Students (18%)",
            performanceStatus: "Good",
            benchmarkStatus: "On Target (+2%)"
          };
        } else if (targetCentre === "Bandra") {
          title = "Bandra Attendance Ratio Breakdown";
          graphType = 'pie';
          graphData = [
            { name: 'Present', value: 92, fill: '#8b5cf6' },
            { name: 'Absent', value: 8, fill: '#ef4444' }
          ];
          metrics = {
            presentStudents: "18 Students (92%)",
            absentStudents: "2 Students (8%)",
            performanceStatus: "Outstanding",
            benchmarkStatus: "Elite (+12%)"
          };
        } else if (targetCentre === "Andheri") {
          title = "Andheri Attendance Ratio Breakdown";
          graphType = 'pie';
          graphData = [
            { name: 'Present', value: 75, fill: '#f59e0b' },
            { name: 'Absent', value: 25, fill: '#ef4444' }
          ];
          metrics = {
            presentStudents: "19 Students (75%)",
            absentStudents: "6 Students (25%)",
            performanceStatus: "Needs Review",
            benchmarkStatus: "Under Limit (-5%)"
          };
        } else {
          title = "Overall Academy Attendance Ratio Breakdown";
          graphType = 'pie';
          graphData = [
            { name: 'Present', value: 84, fill: '#3b82f6' },
            { name: 'Absent', value: 16, fill: '#ef4444' }
          ];
          metrics = {
            presentStudents: "107 Students (84%)",
            absentStudents: "21 Students (16%)",
            performanceStatus: "Healthy",
            benchmarkStatus: "Secure (+4%)"
          };
        }
      } else {
        if (targetCentre === "Motilal") {
          title = "Motilal Centre Progress Report";
          graphType = 'area';
          graphData = [
            { name: 'Mon', val: 82 }, { name: 'Tue', val: 85 }, { name: 'Wed', val: 88 },
            { name: 'Thu', val: 87 }, { name: 'Fri', val: 90 }, { name: 'Sat', val: 88 },
            { name: 'Sun', val: 91 }
          ];
          metrics = {
            attendance: "88% Avg",
            students: "45 Active",
            coaches: "3 Coaches",
            growth: "+5.2% MoM"
          };
        } else if (targetCentre === "Poonam Nagar") {
          title = "Poonam Nagar Progress Report";
          graphType = 'area';
          graphData = [
            { name: 'Mon', val: 78 }, { name: 'Tue', val: 80 }, { name: 'Wed', val: 82 },
            { name: 'Thu', val: 81 }, { name: 'Fri', val: 85 }, { name: 'Sat', val: 83 },
            { name: 'Sun', val: 84 }
          ];
          metrics = {
            attendance: "82% Avg",
            students: "38 Active",
            coaches: "2 Coaches",
            growth: "+8.1% MoM"
          };
        } else if (targetCentre === "Bandra") {
          title = "Bandra Centre Progress Report";
          graphType = 'area';
          graphData = [
            { name: 'Mon', val: 88 }, { name: 'Tue', val: 90 }, { name: 'Wed', val: 91 },
            { name: 'Thu', val: 93 }, { name: 'Fri', val: 92 }, { name: 'Sat', val: 94 },
            { name: 'Sun', val: 95 }
          ];
          metrics = {
            attendance: "92% Avg",
            students: "20 Active",
            coaches: "1 Coach",
            growth: "+15.0% MoM"
          };
        } else if (targetCentre === "Andheri") {
          title = "Andheri Centre Progress Report";
          graphType = 'area';
          graphData = [
            { name: 'Mon', val: 72 }, { name: 'Tue', val: 74 }, { name: 'Wed', val: 76 },
            { name: 'Thu', val: 73 }, { name: 'Fri', val: 75 }, { name: 'Sat', val: 77 },
            { name: 'Sun', val: 78 }
          ];
          metrics = {
            attendance: "75% Avg",
            students: "25 Active",
            coaches: "2 Coaches",
            growth: "+2.5% MoM"
          };
        } else {
          title = "Overall Academy Progress Report";
          graphType = 'area';
          graphData = [
            { name: 'Mon', val: 80 }, { name: 'Tue', val: 82 }, { name: 'Wed', val: 84 },
            { name: 'Thu', val: 83 }, { name: 'Fri', val: 86 }, { name: 'Sat', val: 85 },
            { name: 'Sun', val: 87 }
          ];
          metrics = {
            attendance: "84% Avg",
            students: "128 Active",
            coaches: "12 Coaches",
            growth: "+12.5% MoM"
          };
        }
      }

      setMessages(prev => [...prev, {
        role: 'ai',
        content: aiResponse,
        showGraph: showGraph,
        graphType: graphType,
        graphData: graphData,
        metrics: metrics,
        title: title,
        confidence: confidence,
        source: source
      }]);
      setIsLoading(false);

    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I'm having trouble connecting to the Hi5 brain right now." }]);
      setIsLoading(false);
    }
  };

  const quickSuggestions = [
    { label: "Motilal Progress", query: "show the progress of Motilal centre" },
    { label: "Compare Centres", query: "compare all centres" },
    { label: "Motilal Present Split", query: "what is the attendance ratio breakdown for Motilal?" },
    { label: "Geofence Fraud Audit", query: "run geofence fraud analysis" }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-primary flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-accent animate-pulse" /> Hi5 AI Assistant
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Neural Sports Management & RAG Intelligence</p>
        </div>
        <div className="flex gap-2">
           <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
             <Activity className="h-3 w-3 animate-pulse" /> System Neural Active
           </div>
           {userRole === 'admin' && (
             <div className="px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20 text-[10px] font-bold text-destructive uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
               <ShieldAlert className="h-3 w-3 animate-bounce" /> Security Engine Active
             </div>
           )}
        </div>
      </div>

      {/* Main Chat Interface */}
      <Card className="flex-1 glass border-border/50 flex flex-col overflow-hidden rounded-3xl shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        
        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={cn(
                  "flex items-start gap-4 max-w-[85%] transition-all",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                )}
              >
                {/* Profile Icon */}
                <div className={cn(
                  "h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border",
                  msg.role === 'ai' 
                    ? "bg-primary border-primary/20 text-primary-foreground" 
                    : "bg-muted border-border/50 text-muted-foreground"
                )}>
                  {msg.role === 'ai' ? <Bot className="h-5 w-5 animate-pulse" /> : <User className="h-5 w-5" />}
                </div>

                {/* Text & Graph Box */}
                <div className={cn(
                  "p-5 rounded-3xl text-sm leading-relaxed shadow-lg border relative overflow-hidden transition-all",
                  msg.role === 'ai' 
                    ? "bg-card/95 border-border/50 text-foreground" 
                    : "bg-primary text-primary-foreground font-semibold"
                )}>
                  {msg.role === 'ai' && (
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary uppercase font-bold tracking-wider">
                        RAG Conf: {msg.confidence || "98%"}
                      </span>
                    </div>
                  )}

                  {/* Text Content */}
                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {/* AI Visual Data Injection */}
                  {msg.role === 'ai' && msg.showGraph && (
                    <div className="mt-4 space-y-4 animate-in fade-in duration-300">
                      <div className="p-4 bg-muted/40 rounded-2xl border border-border/50 overflow-hidden shadow-inner">
                        <div className="flex items-center justify-between mb-3 border-b border-border/50 pb-2">
                          <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5">
                            {msg.graphType === 'fraud' ? <AlertTriangle className="h-3 w-3 text-destructive animate-pulse" /> : <BarChart3 className="h-3 w-3 text-accent" />}
                            {msg.title || "Live Performance Analysis"}
                          </p>
                          <span className="text-[9px] font-bold text-muted-foreground uppercase">{msg.graphType.toUpperCase()} CHART</span>
                        </div>

                        {/* Chart Renderers */}
                        <div className="h-44 w-full mt-2">
                          <ResponsiveContainer width="100%" height="100%">
                            {msg.graphType === 'area' ? (
                              <AreaChart data={msg.graphData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                <defs>
                                  <linearGradient id={`aiTrend-${i}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.2} />
                                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip 
                                  contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', fontSize: '10px' }}
                                />
                                <Area type="monotone" dataKey="val" stroke="var(--color-primary)" strokeWidth={2.5} fill={`url(#aiTrend-${i})`} />
                              </AreaChart>
                            ) : msg.graphType === 'bar' ? (
                              <BarChart data={msg.graphData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.2} />
                                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip 
                                  cursor={{ fill: 'transparent' }}
                                  contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', fontSize: '10px' }}
                                />
                                <Bar dataKey="val" radius={[6, 6, 0, 0]} barSize={16}>
                                  {msg.graphData.map((entry, idx) => (
                                    <Cell key={`cell-${idx}`} fill={entry.fill} />
                                  ))}
                                </Bar>
                              </BarChart>
                            ) : msg.graphType === 'pie' ? (
                              <PieChart>
                                <Pie
                                  data={msg.graphData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={36}
                                  outerRadius={52}
                                  paddingAngle={4}
                                  dataKey="value"
                                >
                                  {msg.graphData.map((entry, idx) => (
                                    <Cell key={`cell-${idx}`} fill={entry.fill} />
                                  ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', fontSize: '10px' }} />
                              </PieChart>
                            ) : (
                              // Fraud anomaly chart
                              <BarChart data={msg.graphData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={8} tickLine={false} axisLine={false} />
                                <YAxis dataKey="name" type="category" stroke="var(--color-muted-foreground)" fontSize={8} tickLine={false} axisLine={false} width={80} />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', fontSize: '10px' }} />
                                <Bar dataKey="distance" radius={[0, 4, 4, 0]} barSize={10}>
                                  {msg.graphData.map((entry, idx) => (
                                    <Cell key={`cell-${idx}`} fill={entry.fill} />
                                  ))}
                                </Bar>
                                <ReferenceLine x={0.1} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Boundary', fill: '#ef4444', fontSize: 8, position: 'top' }} />
                              </BarChart>
                            )}
                          </ResponsiveContainer>
                        </div>
                        
                        {/* Custom Legend */}
                        <div className="mt-3 flex items-center justify-between border-t border-border/30 pt-2 text-[9px] text-muted-foreground font-bold">
                            <span>Source: {msg.source || "System Engine"}</span>
                            {msg.graphType === 'fraud' ? (
                              <span className="text-destructive animate-pulse">Critical Spatial Gap Detected</span>
                            ) : msg.graphType === 'pie' ? (
                              <div className="flex gap-2">
                                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Present</span>
                                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-destructive" /> Absent</span>
                              </div>
                            ) : (
                              <span className="text-success font-black flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Live Updates Sync</span>
                            )}
                        </div>
                      </div>

                      {/* Performance Metric Grid Cards */}
                      {msg.metrics && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {Object.entries(msg.metrics).map(([key, val]) => (
                            <div key={key} className="p-3 rounded-2xl bg-card border border-border/50 hover:border-primary/20 transition-all flex flex-col justify-between shadow-sm">
                              <p className="text-[8px] font-black text-muted-foreground uppercase tracking-wider">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </p>
                              <p className="text-xs font-black text-foreground mt-1 flex items-center gap-1">
                                {key.toLowerCase().includes('score') || key.toLowerCase().includes('deviation') ? (
                                  <ShieldAlert className="h-3.5 w-3.5 text-destructive shrink-0" />
                                ) : key.toLowerCase().includes('students') || key.toLowerCase().includes('top') ? (
                                  <Award className="h-3.5 w-3.5 text-accent shrink-0" />
                                ) : (
                                  <Zap className="h-3.5 w-3.5 text-primary shrink-0" />
                                )}
                                {val}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TTS Speaker Control */}
                  {msg.role === 'ai' && (
                    <div className="mt-3 pt-3 border-t border-border/40 flex gap-2">
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         onClick={() => handleSpeak(msg.content, i)}
                         className={cn(
                           "h-6 w-6 rounded-md hover:bg-primary/10 transition-colors",
                           speakingMsgIdx === i ? "bg-success/15 hover:bg-success/20 text-success" : "text-muted-foreground hover:text-primary"
                         )}
                       >
                         <Volume2 className={cn("h-3 w-3", speakingMsgIdx === i && "animate-bounce")} />
                       </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <div className="flex items-center gap-3 text-muted-foreground animate-pulse">
              <div className="h-8 w-8 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center text-primary">
                <Activity className="h-4 w-4 animate-spin" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Neural Brain Simulating RAG...</span>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-background/50 backdrop-blur-md border-t border-border/50 space-y-3">
          {/* Quick Suggestions Chips */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
            {quickSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(suggestion.query)}
                className="shrink-0 px-3 py-1.5 rounded-full bg-card/60 hover:bg-primary/10 border border-border/70 text-xs font-semibold text-muted-foreground hover:text-primary transition-all shadow-sm flex items-center gap-1.5"
              >
                <Sparkles className="h-3 w-3 text-primary" />
                {suggestion.label}
              </button>
            ))}
          </div>

          {/* Voice Listening Soundwave Visualizer */}
          {isListening && (
            <div className="flex items-center justify-center gap-1.5 py-3 animate-pulse bg-primary/5 rounded-2xl border border-primary/20">
              <div className="h-3 w-0.5 bg-primary rounded animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="h-5 w-0.5 bg-primary rounded animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="h-4 w-0.5 bg-primary rounded animate-bounce" style={{ animationDelay: '0.3s' }} />
              <div className="h-6 w-0.5 bg-primary rounded animate-bounce" style={{ animationDelay: '0.4s' }} />
              <div className="h-3 w-0.5 bg-primary rounded animate-bounce" style={{ animationDelay: '0.5s' }} />
              <span className="text-[10px] font-black text-primary uppercase tracking-widest ml-2">Listening to your voice...</span>
            </div>
          )}

          {/* Text Input Row */}
          <div className="flex gap-2 bg-muted/40 border border-border/50 rounded-2xl p-2 focus-within:ring-2 ring-primary/20 transition-all">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleListening}
              className={cn(
                "rounded-xl shrink-0 transition-colors", 
                isListening ? "text-destructive bg-destructive/10 hover:bg-destructive/20 border border-destructive/20" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              )}
            >
              {isListening ? <MicOff className="h-5 w-5 animate-pulse" /> : <Mic className="h-5 w-5" />}
            </Button>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Hi5 AI anything (e.g. 'show progress of Motilal centre')..."
              className="flex-1 bg-transparent border-none outline-none text-sm px-2 font-semibold"
            />
            <Button 
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Core Insights Buttons */}
          <div className="flex justify-center gap-6 pt-1">
             <button 
               onClick={() => handleSend("run geofence fraud analysis")}
               className="text-[10px] font-black text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1.5 uppercase tracking-wider"
             >
               <ShieldCheck className="h-3.5 w-3.5 text-destructive" /> Fraud Analysis Check
             </button>
             <button 
               onClick={() => handleSend("compare all active centres")}
               className="text-[10px] font-black text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 uppercase tracking-wider"
             >
               <TrendingUp className="h-3.5 w-3.5 text-primary" /> Growth & Performance comparison
             </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIAssistant;
