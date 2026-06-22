import React, { useState } from 'react';
import { Doctor, Appointment } from '../types';
import { getMockDoctors } from '../utils/aiSimulator';
import { 
  User, Calendar, Video, X, Check, ShieldAlert, Search, VideoOff
} from 'lucide-react';

interface AppointmentBookingProps {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
}

export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ appointments, setAppointments }) => {
  const doctors = getMockDoctors();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Booking states
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingTime, setBookingTime] = useState<string>('');

  // Telehealth Active Room state
  const [activeRoomAppointment, setActiveRoomAppointment] = useState<Appointment | null>(null);
  const [videoMuted, setVideoMuted] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);

  const specialties = ['All', 'General Physician', 'Psychiatrist & Therapist', 'Cardiologist', 'Pediatrician', 'Neurologist'];

  const filteredDoctors = doctors.filter(doc => {
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !bookingDate || !bookingTime) return;

    const newAppointment: Appointment = {
      id: `appt-${Date.now()}`,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorSpecialty: selectedDoctor.specialty,
      doctorImage: selectedDoctor.imageUrl,
      date: bookingDate,
      time: bookingTime,
      status: 'scheduled',
      roomUrl: `/teleconsultation/aarogya-${Date.now()}`
    };

    setAppointments(prev => [newAppointment, ...prev]);
    setSelectedDoctor(null);
    setBookingDate('');
    setBookingTime('');
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments(prev => prev.map(appt => 
      appt.id === id ? { ...appt, status: 'cancelled' } : appt
    ));
  };

  const handleJoinConsultation = (appt: Appointment) => {
    setActiveRoomAppointment(appt);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Active Telehealth Call Simulator overlay if active */}
      {activeRoomAppointment && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col p-4 sm:p-6 text-white animate-fadeIn">
          {/* Room Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500 rounded-2xl">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold flex items-center gap-2">
                  Aarogya Live Telehealth Room
                  <span className="animate-pulse bg-red-500 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full tracking-wide">Live</span>
                </h2>
                <p className="text-xs text-slate-400">Consultation with {activeRoomAppointment.doctorName} • {activeRoomAppointment.doctorSpecialty}</p>
              </div>
            </div>
            <button onClick={() => setActiveRoomAppointment(null)} className="bg-white/10 hover:bg-red-500 p-2 rounded-full transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Video Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center max-w-5xl mx-auto w-full mb-6">
            {/* Physician view */}
            <div className="relative bg-slate-900 border border-white/10 rounded-3xl overflow-hidden h-72 sm:h-96 flex items-center justify-center">
              <img src={activeRoomAppointment.doctorImage} alt="Doctor" className="w-full h-full object-cover opacity-80" />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-semibold flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div> {activeRoomAppointment.doctorName} (Physician)
              </div>
              {/* Fake Clinical Telemetry Overlay */}
              <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-[10px] font-bold space-y-1">
                <p className="text-emerald-400 flex justify-between gap-4"><span>Heart Rate:</span> <span>72 bpm</span></p>
                <p className="text-cyan-400 flex justify-between gap-4"><span>Oxygen SpO2:</span> <span>99%</span></p>
                <p className="text-amber-400 flex justify-between gap-4"><span>Network Latency:</span> <span>12ms</span></p>
              </div>
            </div>

            {/* Patient view */}
            <div className="relative bg-slate-900 border border-white/10 rounded-3xl overflow-hidden h-72 sm:h-96 flex items-center justify-center">
              {videoMuted ? (
                <div className="flex flex-col items-center gap-2 text-slate-500">
                  <VideoOff className="w-12 h-12" />
                  <p className="text-xs font-bold">Your camera is off</p>
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-slate-800 to-indigo-900 flex flex-col items-center justify-center">
                  <User className="w-16 h-16 text-white/40 mb-2" />
                  <p className="text-xs font-bold text-white/70">Simulating Patient Camera...</p>
                </div>
              )}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-semibold">
                You (Patient)
              </div>
            </div>
          </div>

          {/* Telehealth Controls */}
          <div className="border-t border-white/10 pt-4 flex flex-wrap justify-center items-center gap-4 bg-slate-900 p-4 rounded-3xl max-w-lg mx-auto w-full mb-6">
            <button onClick={() => setVideoMuted(!videoMuted)} className={`px-4 py-2 rounded-2xl text-xs font-bold transition-colors ${videoMuted ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white/10 hover:bg-white/20'}`}>
              {videoMuted ? 'Turn Camera On' : 'Mute Camera'}
            </button>
            <button onClick={() => setAudioMuted(!audioMuted)} className={`px-4 py-2 rounded-2xl text-xs font-bold transition-colors ${audioMuted ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white/10 hover:bg-white/20'}`}>
              {audioMuted ? 'Unmute Audio' : 'Mute Audio'}
            </button>
            <button onClick={() => setActiveRoomAppointment(null)} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-2xl text-xs font-extrabold shadow-lg shadow-red-600/20">
              End Consultation
            </button>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-2">
          <Video className="text-sky-500 w-7 h-7" /> Telehealth & Doctor Booking
        </h1>
        <p className="text-sm text-slate-500 mt-1">Schedule video consultations, check availability, or access clinical diagnostic suites instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List Doctors & Search / Specialty Filters */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input type="text" placeholder="Search doctor by name, keyword..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>

            {/* Specialty Selector */}
            <div className="flex gap-1.5 overflow-x-auto pb-1.5 sm:pb-0">
              {specialties.map(spec => (
                <button key={spec} onClick={() => setSelectedSpecialty(spec)} className={`flex-shrink-0 text-xs font-bold px-3 py-2 rounded-xl transition-all ${selectedSpecialty === spec ? 'bg-sky-500 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
                  {spec === 'All' ? 'All Specialties' : spec}
                </button>
              ))}
            </div>
          </div>

          {/* Doctor Cards */}
          <div className="space-y-4">
            {filteredDoctors.map(doc => (
              <div key={doc.id} className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img src={doc.imageUrl} alt={doc.name} className="w-20 h-20 rounded-2xl object-cover border border-slate-100" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-800">{doc.name}</h3>
                    <span className="bg-sky-50 text-sky-700 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">{doc.specialty}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{doc.bio}</p>
                  <div className="flex flex-wrap gap-4 pt-1.5">
                    <span className="text-xs text-slate-400 flex items-center gap-1">⏱️ {doc.experience} years exp</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">⭐ {doc.rating} ({doc.reviews} reviews)</span>
                    <span className="text-xs font-extrabold text-sky-600 flex items-center gap-1">💵 Fee: ${doc.fee}</span>
                  </div>
                </div>

                <button onClick={() => setSelectedDoctor(doc)} className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-md shadow-sky-500/10">
                  Book Consultation
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Bookings Sidebar & Active Appointments */}
        <div className="space-y-6">
          {/* Scheduling Form Panel if a doctor is selected */}
          {selectedDoctor && (
            <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm border-t-4 border-t-sky-500">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">Configure Booking</h3>
                <button onClick={() => setSelectedDoctor(null)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
              </div>

              <div className="flex items-center gap-2 mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <img src={selectedDoctor.imageUrl} alt="Doctor" className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{selectedDoctor.name}</h4>
                  <p className="text-[10px] text-slate-400">{selectedDoctor.specialty}</p>
                </div>
              </div>

              <form onSubmit={handleBookAppointment} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Select Consultation Date</label>
                  <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Choose Slot Time</label>
                  <select value={bookingTime} onChange={e => setBookingTime(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500" required>
                    <option value="">Select available slot</option>
                    {selectedDoctor.availability.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/10">
                  <Check className="w-3.5 h-3.5" /> Confirm Teleconsultation
                </button>
              </form>
            </div>
          )}

          {/* User Appointments Panel */}
          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-sky-500" /> Active Appointments
            </h3>

            {appointments.length === 0 ? (
              <div className="text-center py-6 text-slate-400">
                <ShieldAlert className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs font-semibold">No scheduled visits</p>
                <p className="text-[10px] mt-1">Book doctors on the left panel to begin teleconsultations.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map(appt => (
                  <div key={appt.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-3">
                    <div className="flex gap-2.5">
                      <img src={appt.doctorImage} alt="Doc" className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{appt.doctorName}</h4>
                        <p className="text-[10px] text-slate-400">{appt.doctorSpecialty}</p>
                      </div>
                    </div>

                    <div className="flex gap-4 border-t border-slate-200/60 pt-2 text-[10px] text-slate-500 font-semibold">
                      <span className="flex items-center gap-1">📅 {appt.date}</span>
                      <span className="flex items-center gap-1">⏱️ {appt.time}</span>
                    </div>

                    <div className="flex gap-2">
                      {appt.status === 'scheduled' ? (
                        <>
                          <button onClick={() => handleJoinConsultation(appt)} className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-bold py-1.5 rounded-xl text-[10px] flex items-center justify-center gap-1 transition-colors">
                            <Video className="w-3 h-3" /> Join Room
                          </button>
                          <button onClick={() => handleCancelAppointment(appt.id)} className="flex-1 bg-slate-200 hover:bg-red-50 hover:text-red-600 text-slate-600 font-bold py-1.5 rounded-xl text-[10px] transition-colors">
                            Cancel
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] font-bold text-red-500 italic px-2 py-1 bg-red-50 rounded-lg w-full text-center">
                          Appointment Cancelled
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
