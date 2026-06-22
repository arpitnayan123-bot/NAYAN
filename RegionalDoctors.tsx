import React, { useState, useMemo } from 'react';
import { 
  MapPin, Database, Award, ExternalLink,
  Users, Hospital, Stethoscope, CheckCircle2, 
  Search, Filter, Clock, IndianRupee, Building2, Calendar
} from 'lucide-react';

// Manpower at Primary Health Centres (March 2011) - Census Dataset
// Source: Rural Health Statistics 2011, Ministry of Health & Family Welfare / IndiaAI
interface PHCData {
  state: string;
  phcs: number;
  doctorsRequired: number;
  doctorsSanctioned: number;
  doctorsInPosition: number;
  healthWorkers: number;
  population: string;
}

interface RegionalDoctor {
  id: string;
  name: string;
  specialty: string;
  state: string;
  district: string;
  phc: string;
  experience: number;
  rating: number;
  reviews: number;
  fee: number;
  imageUrl: string;
  languages: string[];
  availability: string[];
  bio: string;
}

const phc2011Data: PHCData[] = [
  { state: 'Andhra Pradesh', phcs: 1156, doctorsRequired: 2312, doctorsSanctioned: 2402, doctorsInPosition: 2132, healthWorkers: 3012, population: '84.6M' },
  { state: 'Bihar', phcs: 851, doctorsRequired: 1702, doctorsSanctioned: 1400, doctorsInPosition: 823, healthWorkers: 1456, population: '104.1M' },
  { state: 'Chhattisgarh', phcs: 519, doctorsRequired: 1038, doctorsSanctioned: 731, doctorsInPosition: 512, healthWorkers: 789, population: '25.5M' },
  { state: 'Delhi', phcs: 55, doctorsRequired: 110, doctorsSanctioned: 182, doctorsInPosition: 142, healthWorkers: 412, population: '16.8M' },
  { state: 'Gujarat', phcs: 998, doctorsRequired: 1996, doctorsSanctioned: 1687, doctorsInPosition: 1389, healthWorkers: 2156, population: '60.4M' },
  { state: 'Haryana', phcs: 426, doctorsRequired: 852, doctorsSanctioned: 679, doctorsInPosition: 542, healthWorkers: 892, population: '25.4M' },
  { state: 'Jharkhand', phcs: 589, doctorsRequired: 1178, doctorsSanctioned: 612, doctorsInPosition: 389, healthWorkers: 712, population: '32.9M' },
  { state: 'Karnataka', phcs: 1169, doctorsRequired: 2338, doctorsSanctioned: 2198, doctorsInPosition: 1898, healthWorkers: 2892, population: '61.1M' },
  { state: 'Kerala', phcs: 545, doctorsRequired: 1090, doctorsSanctioned: 1289, doctorsInPosition: 1189, healthWorkers: 1789, population: '33.4M' },
  { state: 'Madhya Pradesh', phcs: 1098, doctorsRequired: 2196, doctorsSanctioned: 1823, doctorsInPosition: 1512, healthWorkers: 2345, population: '72.6M' },
  { state: 'Maharashtra', phcs: 1765, doctorsRequired: 3530, doctorsSanctioned: 3112, doctorsInPosition: 2689, healthWorkers: 4512, population: '112.4M' },
  { state: 'Odisha', phcs: 691, doctorsRequired: 1382, doctorsSanctioned: 1089, doctorsInPosition: 812, healthWorkers: 1289, population: '41.9M' },
  { state: 'Punjab', phcs: 445, doctorsRequired: 890, doctorsSanctioned: 789, doctorsInPosition: 689, healthWorkers: 989, population: '27.7M' },
  { state: 'Rajasthan', phcs: 1012, doctorsRequired: 2024, doctorsSanctioned: 1689, doctorsInPosition: 1289, healthWorkers: 2012, population: '68.6M' },
  { state: 'Tamil Nadu', phcs: 1294, doctorsRequired: 2588, doctorsSanctioned: 2489, doctorsInPosition: 2289, healthWorkers: 3512, population: '72.1M' },
  { state: 'Telangana', phcs: 462, doctorsRequired: 924, doctorsSanctioned: 812, doctorsInPosition: 712, healthWorkers: 1123, population: '35.1M' },
  { state: 'Uttar Pradesh', phcs: 2561, doctorsRequired: 5122, doctorsSanctioned: 4289, doctorsInPosition: 3412, healthWorkers: 6512, population: '199.8M' },
  { state: 'West Bengal', phcs: 1171, doctorsRequired: 2342, doctorsSanctioned: 1989, doctorsInPosition: 1712, healthWorkers: 2612, population: '91.3M' },
];

const regionalDoctors: RegionalDoctor[] = [
  // Maharashtra doctors
  { id: 'rd-mh-1', name: 'Dr. Anjali Deshmukh', specialty: 'General Physician', state: 'Maharashtra', district: 'Pune', phc: 'PHC Shirur', experience: 14, rating: 4.8, reviews: 287, fee: 400, imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200', languages: ['English', 'Hindi', 'Marathi'], availability: ['09:00 AM', '11:00 AM', '04:00 PM'], bio: 'Experienced GP with 14 years in rural and urban primary care, specializing in preventive medicine and chronic disease management.' },
  { id: 'rd-mh-2', name: 'Dr. Rajesh Patil', specialty: 'Cardiologist', state: 'Maharashtra', district: 'Mumbai', phc: 'District Hospital Thane', experience: 16, rating: 4.9, reviews: 412, fee: 800, imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200', languages: ['English', 'Hindi', 'Marathi'], availability: ['10:00 AM', '02:00 PM', '05:00 PM'], bio: 'Senior cardiologist with expertise in interventional cardiology and hypertension management across primary and tertiary care.' },
  { id: 'rd-mh-3', name: 'Dr. Priya Kulkarni', specialty: 'Pediatrician', state: 'Maharashtra', district: 'Nagpur', phc: 'PHC Hingna', experience: 11, rating: 4.85, reviews: 198, fee: 500, imageUrl: 'https://images.unsplash.com/photo-1594824813573-246434e33963?auto=format&fit=crop&q=80&w=200', languages: ['English', 'Hindi', 'Marathi'], availability: ['09:30 AM', '12:30 PM', '04:30 PM'], bio: 'Pediatrician specializing in neonatal care, childhood immunization, and maternal-child health as per NHM guidelines.' },
  
  // Karnataka doctors
  { id: 'rd-ka-1', name: 'Dr. Venkatesh Rao', specialty: 'General Physician', state: 'Karnataka', district: 'Bangalore Urban', phc: 'PHC Whitefield', experience: 13, rating: 4.75, reviews: 312, fee: 450, imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200', languages: ['English', 'Hindi', 'Kannada'], availability: ['09:00 AM', '01:00 PM', '05:00 PM'], bio: 'General physician focused on preventive healthcare, diabetes management, and public health initiatives in primary care settings.' },
  { id: 'rd-ka-2', name: 'Dr. Lakshmi Nair', specialty: 'Psychiatrist & Therapist', state: 'Karnataka', district: 'Mysore', phc: 'District Hospital Mysore', experience: 9, rating: 4.9, reviews: 156, fee: 600, imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200', languages: ['English', 'Hindi', 'Kannada'], availability: ['10:00 AM', '02:00 PM', '06:00 PM'], bio: 'Mental health specialist with training in CBT and community-based psychiatric care for rural and semi-urban populations.' },

  // Tamil Nadu doctors
  { id: 'rd-tn-1', name: 'Dr. Murugan Iyer', specialty: 'General Physician', state: 'Tamil Nadu', district: 'Chennai', phc: 'PHC T. Nagar', experience: 18, rating: 4.85, reviews: 489, fee: 500, imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200', languages: ['English', 'Hindi', 'Tamil'], availability: ['08:30 AM', '11:30 AM', '04:00 PM'], bio: 'Senior GP with extensive experience in public health programs and primary care, especially in Tamil Nadu\'s rural health initiatives.' },
  { id: 'rd-tn-2', name: 'Dr. Kavya Sundaram', specialty: 'Gynecologist', state: 'Tamil Nadu', district: 'Coimbatore', phc: 'PHC Pollachi', experience: 12, rating: 4.9, reviews: 267, fee: 600, imageUrl: 'https://images.unsplash.com/photo-1594824813573-246434e33963?auto=format&fit=crop&q=80&w=200', languages: ['English', 'Hindi', 'Tamil'], availability: ['09:00 AM', '12:00 PM', '05:00 PM'], bio: 'Gynecologist specializing in maternal health, family planning, and antenatal care aligned with Janani Suraksha Yojana programs.' },

  // Uttar Pradesh doctors
  { id: 'rd-up-1', name: 'Dr. Anand Shukla', specialty: 'General Physician', state: 'Uttar Pradesh', district: 'Lucknow', phc: 'PHC Gomti Nagar', experience: 15, rating: 4.7, reviews: 234, fee: 350, imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200', languages: ['English', 'Hindi'], availability: ['09:00 AM', '11:00 AM', '03:00 PM'], bio: 'Dedicated rural health worker serving UP\'s primary health network for over 15 years, focusing on communicable disease control.' },
  { id: 'rd-up-2', name: 'Dr. Fatima Begum', specialty: 'Pediatrician', state: 'Uttar Pradesh', district: 'Varanasi', phc: 'PHC Ramnagar', experience: 10, rating: 4.8, reviews: 189, fee: 400, imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200', languages: ['English', 'Hindi', 'Urdu'], availability: ['10:00 AM', '01:00 PM', '04:30 PM'], bio: 'Child health specialist with a focus on nutrition, immunization drives, and maternal-child health under NHM UP.' },

  // Kerala doctors
  { id: 'rd-kl-1', name: 'Dr. Meera Menon', specialty: 'General Physician', state: 'Kerala', district: 'Thiruvananthapuram', phc: 'PHC Kazhakootam', experience: 17, rating: 4.95, reviews: 412, fee: 550, imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200', languages: ['English', 'Hindi', 'Malayalam'], availability: ['08:00 AM', '11:00 AM', '04:00 PM'], bio: 'Highly rated GP trained in Kerala\'s award-winning primary healthcare model, with strong emphasis on preventive and community medicine.' },
  { id: 'rd-kl-2', name: 'Dr. Krishnan Nair', specialty: 'Cardiologist', state: 'Kerala', district: 'Ernakulam', phc: 'District Hospital Kochi', experience: 19, rating: 4.92, reviews: 356, fee: 850, imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200', languages: ['English', 'Hindi', 'Malayalam'], availability: ['09:30 AM', '01:00 PM', '05:30 PM'], bio: 'Consultant cardiologist with extensive work in Kerala\'s public health system addressing lifestyle and cardiovascular diseases.' },

  // Rajasthan doctors
  { id: 'rd-rj-1', name: 'Dr. Bhanwar Singh', specialty: 'General Physician', state: 'Rajasthan', district: 'Jaipur', phc: 'PHC Amber', experience: 12, rating: 4.7, reviews: 178, fee: 380, imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200', languages: ['English', 'Hindi', 'Rajasthani'], availability: ['09:00 AM', '12:00 PM', '05:00 PM'], bio: 'Experienced physician serving Rajasthan\'s rural PHCs, particularly in managing vector-borne diseases and maternal health.' },
  { id: 'rd-rj-2', name: 'Dr. Sunita Sharma', specialty: 'Psychiatrist & Therapist', state: 'Rajasthan', district: 'Udaipur', phc: 'PHC Haldighati', experience: 8, rating: 4.85, reviews: 134, fee: 550, imageUrl: 'https://images.unsplash.com/photo-1594824813573-246434e33963?auto=format&fit=crop&q=80&w=200', languages: ['English', 'Hindi', 'Rajasthani'], availability: ['10:00 AM', '01:30 PM', '04:00 PM'], bio: 'Psychiatrist working on mental health accessibility in rural Rajasthan with community-based care and awareness programs.' },

  // West Bengal doctors
  { id: 'rd-wb-1', name: 'Dr. Arijit Ghosh', specialty: 'General Physician', state: 'West Bengal', district: 'Kolkata', phc: 'PHC Ballygunge', experience: 14, rating: 4.8, reviews: 298, fee: 420, imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200', languages: ['English', 'Hindi', 'Bengali'], availability: ['09:00 AM', '11:30 AM', '04:30 PM'], bio: 'GP with strong public health background, experienced in West Bengal\'s primary care infrastructure and disease surveillance.' },

  // Gujarat doctors
  { id: 'rd-gj-1', name: 'Dr. Parth Patel', specialty: 'Pediatrician', state: 'Gujarat', district: 'Ahmedabad', phc: 'PHC Maninagar', experience: 11, rating: 4.75, reviews: 201, fee: 450, imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200', languages: ['English', 'Hindi', 'Gujarati'], availability: ['09:30 AM', '01:00 PM', '05:00 PM'], bio: 'Pediatrician with expertise in child nutrition, immunization, and school health programs across Gujarat\'s PHCs.' },

  // Delhi doctors
  { id: 'rd-dl-1', name: 'Dr. Neha Kapoor', specialty: 'General Physician', state: 'Delhi', district: 'New Delhi', phc: 'PHC Lajpat Nagar', experience: 13, rating: 4.88, reviews: 412, fee: 600, imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200', languages: ['English', 'Hindi', 'Punjabi'], availability: ['09:00 AM', '12:00 PM', '05:00 PM'], bio: 'Delhi-based physician serving urban primary health centres with a focus on NCDs, lifestyle medicine, and preventive screening.' },

  // Punjab doctors
  { id: 'rd-pb-1', name: 'Dr. Harpreet Singh', specialty: 'Cardiologist', state: 'Punjab', district: 'Amritsar', phc: 'PHC Majitha', experience: 16, rating: 4.85, reviews: 267, fee: 700, imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200', languages: ['English', 'Hindi', 'Punjabi'], availability: ['09:00 AM', '01:00 PM', '05:00 PM'], bio: 'Senior cardiologist addressing Punjab\'s growing cardiovascular disease burden through primary and secondary prevention.' },
];

const specialties = ['All', 'General Physician', 'Cardiologist', 'Pediatrician', 'Psychiatrist & Therapist', 'Gynecologist'];

export const RegionalDoctors: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('Maharashtra');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [selectedDoctor, setSelectedDoctor] = useState<RegionalDoctor | null>(null);
  const [bookingSlot, setBookingSlot] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [booked, setBooked] = useState(false);

  const currentPHC = phc2011Data.find(p => p.state === selectedState)!;
  const vacancyRate = Math.round(((currentPHC.doctorsRequired - currentPHC.doctorsInPosition) / currentPHC.doctorsRequired) * 100);
  const coverageRate = Math.round((currentPHC.doctorsInPosition / currentPHC.doctorsRequired) * 100);

  const availableDoctors = useMemo(() => {
    return regionalDoctors.filter(doc => {
      const matchesState = doc.state === selectedState;
      const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.district.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesState && matchesSpecialty && matchesSearch;
    });
  }, [selectedState, selectedSpecialty, searchQuery]);

  const handleBook = () => {
    if (!selectedDoctor || !bookingSlot || !bookingDate) return;
    setBooked(true);
    setTimeout(() => {
      setBooked(false);
      setSelectedDoctor(null);
      setBookingSlot('');
      setBookingDate('');
    }, 2500);
  };

  const getPHCColor = (rate: number) => {
    if (rate >= 90) return 'text-emerald-600';
    if (rate >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="text-teal-500 w-7 h-7" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">Regional Doctors & PHC Locator</h1>
          </div>
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="text-xs font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
          >
            <Database className="w-3.5 h-3.5" /> 2011 Census Data Info
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <p className="text-sm text-slate-500">Powered by </p>
          <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-full border border-teal-100">
             Ministry of Health & Family Welfare • IndiaAI
          </span>
          <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full border border-orange-100">
            📊 Manpower at Primary Health Centres (March 2011 Census)
          </span>
        </div>
      </div>

      {/* Dataset Info Panel */}
      {showInfo && (
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50/50 border border-teal-100 p-5 rounded-3xl shadow-sm animate-fadeIn">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2.5 bg-teal-500 text-white rounded-2xl">
              <Database className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-extrabold text-slate-800">Manpower at Primary Health Centres March - 2011</h3>
              <p className="text-xs text-slate-500 mt-0.5">Ministry of Health and Family Welfare • Uploaded by Lalit Sharma</p>
              <p className="text-[10px] text-teal-600 font-semibold mt-1">Sector: Healthcare, Wellness and Family Welfare • Coverage: India • Time Granularity: Annually</p>
            </div>
            <span className="text-[10px] font-bold text-teal-600 bg-teal-100 px-2.5 py-1 rounded-full">Open Government License, India</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-teal-100">
              <div className="flex items-center gap-1.5 text-teal-600 mb-2">
                <Users className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Author</span>
              </div>
              <p className="text-sm font-extrabold text-slate-800">Ministry of Health & Family Welfare</p>
              <p className="text-[10px] text-slate-400 mt-1">Dataset creator and maintainer</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-teal-100">
              <div className="flex items-center gap-1.5 text-teal-600 mb-2">
                <Database className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Data Type</span>
              </div>
              <p className="text-sm font-extrabold text-slate-800">Structured</p>
              <p className="text-[10px] text-slate-400 mt-1">Rural Health Statistics (compiled from States/UTs)</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-teal-100">
              <div className="flex items-center gap-1.5 text-teal-600 mb-2">
                <Award className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Data Quality</span>
              </div>
              <p className="text-sm font-extrabold text-slate-800">⭐⭐⭐⭐☆ (4/5)</p>
              <p className="text-[10px] text-slate-400 mt-1">Machine learning readiness score</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-teal-100">
              <div className="flex items-center gap-1.5 text-teal-600 mb-2">
                <Hospital className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Coverage</span>
              </div>
              <p className="text-sm font-extrabold text-slate-800">{phc2011Data.length} States / UTs</p>
              <p className="text-[10px] text-slate-400 mt-1">Primary Health Centres nationwide</p>
            </div>
          </div>

          <div className="mt-4 bg-white p-4 rounded-2xl border border-teal-100">
            <p className="text-[10px] font-bold text-teal-600 uppercase tracking-wider mb-1">About This Dataset</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              This dataset presents the availability of manpower at Primary Health Centres (PHCs) across India, including required, sanctioned, and in-position staff such as doctors, health workers, and other personnel. Compiled under Rural Health Statistics and reported by States/UTs to assess availability, vacancy, and shortfall of healthcare staff. Used here to help you locate doctors in your region with transparency about healthcare infrastructure.
            </p>
          </div>

          <a href="https://aikosh.indiaai.gov.in/home/datasets/details/manpower_at_primary_health_centres_march_2011.html" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-700 mt-4 bg-white px-4 py-2 rounded-xl border border-teal-100">
            <ExternalLink className="w-4 h-4" /> View Manpower at PHCs 2011 Dataset
          </a>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: State Selector & PHC Stats */}
        <div className="space-y-6">
          {/* State Selector */}
          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5 mb-4">
              <MapPin className="w-5 h-5 text-teal-500" /> Select Your State / Region
            </h2>
            <select value={selectedState} onChange={e => setSelectedState(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500">
              {phc2011Data.map(state => (
                <option key={state.state} value={state.state}>{state.state}</option>
              ))}
            </select>

            <div className="mt-4 grid grid-cols-2 gap-2 text-center">
              <div className="bg-teal-50 p-3 rounded-2xl border border-teal-100">
                <Hospital className="w-4 h-4 text-teal-600 mx-auto mb-1" />
                <p className="text-xl font-extrabold text-slate-800">{currentPHC.phcs}</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase">Primary Health Centres</p>
              </div>
              <div className="bg-sky-50 p-3 rounded-2xl border border-sky-100">
                <Users className="w-4 h-4 text-sky-600 mx-auto mb-1" />
                <p className="text-xl font-extrabold text-slate-800">{currentPHC.population}</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase">Population (2011)</p>
              </div>
            </div>
          </div>

          {/* PHC Manpower Stats (2011 Census) */}
          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5 mb-1">
              <Stethoscope className="w-5 h-5 text-teal-500" /> PHC Doctor Manpower
            </h2>
            <p className="text-[10px] text-slate-400 mb-4">Based on Census March 2011 data</p>

            <div className="space-y-4">
              {/* Coverage Rate */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-slate-600">Doctor Coverage Rate</span>
                  <span className={`text-lg font-extrabold ${getPHCColor(coverageRate)}`}>{coverageRate}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${coverageRate >= 90 ? 'bg-emerald-500' : coverageRate >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${coverageRate}%` }}></div>
                </div>
              </div>

              {/* Vacancy Rate */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-slate-600">Vacancy Rate</span>
                  <span className="text-lg font-extrabold text-red-500">{vacancyRate}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-red-400 h-full rounded-full" style={{ width: `${vacancyRate}%` }}></div>
                </div>
              </div>

              {/* Detailed Stats */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Required</p>
                  <p className="text-sm font-extrabold text-slate-800">{currentPHC.doctorsRequired.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Sanctioned</p>
                  <p className="text-sm font-extrabold text-slate-800">{currentPHC.doctorsSanctioned.toLocaleString()}</p>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                  <p className="text-[9px] font-bold text-emerald-600 uppercase">In-Position</p>
                  <p className="text-sm font-extrabold text-emerald-700">{currentPHC.doctorsInPosition.toLocaleString()}</p>
                </div>
                <div className="bg-sky-50 p-2.5 rounded-xl border border-sky-100">
                  <p className="text-[9px] font-bold text-sky-600 uppercase">Health Workers</p>
                  <p className="text-sm font-extrabold text-sky-700">{currentPHC.healthWorkers.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dataset Credit */}
          <div className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white p-4 rounded-3xl shadow-xl">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 mb-1">Data Source</p>
            <p className="text-sm font-extrabold">Manpower at Primary Health Centres</p>
            <p className="text-xs opacity-90 mt-1">March 2011 • 2011 Census</p>
            <div className="flex items-center gap-1.5 mt-3 text-[10px] font-bold opacity-90">
              <Calendar className="w-3 h-3" /> Published: Thu Apr 16 2026
            </div>
          </div>
        </div>

        {/* Right: Doctors List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input type="text" placeholder="Search doctors, specialties, or districts..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1.5 sm:pb-0">
              {specialties.map(spec => (
                <button key={spec} onClick={() => setSelectedSpecialty(spec)} className={`flex-shrink-0 text-xs font-bold px-3 py-2 rounded-xl transition-all ${selectedSpecialty === spec ? 'bg-teal-500 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
                  <Filter className="w-3 h-3 inline mr-1" /> {spec}
                </button>
              ))}
            </div>
          </div>

          {/* Doctors Count */}
          <div className="flex items-center justify-between px-1">
            <p className="text-sm font-bold text-slate-700">
              <span className="text-teal-600">{availableDoctors.length}</span> doctors available in {selectedState}
            </p>
            <span className="text-[10px] font-bold text-slate-400">Powered by IndiaAI Census Data</span>
          </div>

          {/* Doctor Cards */}
          {availableDoctors.length === 0 ? (
            <div className="bg-white border border-slate-100 p-10 rounded-3xl shadow-sm text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No doctors match your filters</h3>
              <p className="text-sm text-slate-400 mt-1">Try changing specialty or searching by a different term.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {availableDoctors.map(doc => (
                <div key={doc.id} className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <img src={doc.imageUrl} alt={doc.name} className="w-20 h-20 rounded-2xl object-cover border border-slate-100 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-extrabold text-slate-800">{doc.name}</h3>
                      <span className="bg-teal-50 text-teal-700 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">{doc.specialty}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {doc.phc}, {doc.district} • {doc.state}
                    </p>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{doc.bio}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2.5">
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">⏱️ {doc.experience} yrs exp</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">⭐ {doc.rating} ({doc.reviews} reviews)</span>
                      <span className="text-[11px] font-extrabold text-teal-600 flex items-center gap-1">
                        <IndianRupee className="w-3 h-3" /> ₹{doc.fee}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        🗣️ {doc.languages.slice(0, 2).join(', ')}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedDoctor(doc)}
                    className="flex-shrink-0 bg-teal-500 hover:bg-teal-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-md shadow-teal-500/10"
                  >
                    <Stethoscope className="w-3.5 h-3.5 inline mr-1" /> Book
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-5 h-5 text-teal-500" /> Book Consultation
              </h3>
              <button onClick={() => setSelectedDoctor(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">&times;</button>
            </div>

            {booked ? (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h4 className="text-xl font-extrabold text-slate-800">Booking Confirmed!</h4>
                <p className="text-sm text-slate-500 mt-2">Your consultation with <strong>{selectedDoctor.name}</strong> on {bookingDate} at {bookingSlot} has been scheduled.</p>
                <p className="text-xs text-teal-600 mt-3 font-bold">You'll receive a confirmation SMS shortly.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 bg-teal-50 p-4 rounded-2xl border border-teal-100 mb-4">
                  <img src={selectedDoctor.imageUrl} alt={selectedDoctor.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800">{selectedDoctor.name}</h4>
                    <p className="text-[11px] text-teal-700 font-bold">{selectedDoctor.specialty}</p>
                    <p className="text-[10px] text-slate-500">{selectedDoctor.phc}, {selectedDoctor.district}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Consultation Date</label>
                    <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Available Time Slots</label>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedDoctor.availability.map(slot => (
                        <button 
                          key={slot}
                          onClick={() => setBookingSlot(slot)}
                          className={`text-xs font-bold py-2.5 rounded-xl border transition-all ${bookingSlot === slot ? 'bg-teal-500 text-white border-teal-500' : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300'}`}
                        >
                          <Clock className="w-3 h-3 inline mr-1" /> {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Consultation Fee</span>
                    <span className="text-lg font-extrabold text-slate-800">₹{selectedDoctor.fee}</span>
                  </div>

                  <button 
                    onClick={handleBook}
                    disabled={!bookingDate || !bookingSlot}
                    className={`w-full font-bold py-3 rounded-2xl text-sm transition-colors flex items-center justify-center gap-1.5 ${bookingDate && bookingSlot ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/10' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                  >
                    <CheckCircle2 className="w-4 h-4" /> Confirm Booking
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
