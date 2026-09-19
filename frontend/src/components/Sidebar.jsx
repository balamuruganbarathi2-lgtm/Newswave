import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Grid,
  TrendingUp,
  Bookmark,
  Shield,
  Flag,
  MapPin,
  Globe,
  Cpu,
  TrendingUp as BusinessIcon,
  Trophy,
  HeartPulse,
  FlaskConical,
  Film,
  Leaf,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SOUTH_INDIA_STATES = [
  { name: 'All South India', slug: 'south-india', isRegion: true },
  { name: 'Tamil Nadu', slug: 'tamil-nadu' },
  { name: 'Kerala', slug: 'kerala' },
  { name: 'Karnataka', slug: 'karnataka' },
  { name: 'Andhra Pradesh', slug: 'andhra-pradesh' },
  { name: 'Telangana', slug: 'telangana' },
  { name: 'Puducherry', slug: 'puducherry' },
];

const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { isAdmin } = useAuth();

  const activeStyle = 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20';
  const inactiveStyle = 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium';

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
        ></div>
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-16 left-0 bottom-0 w-64 bg-white border-r border-slate-200/80 p-4 z-40 overflow-y-auto transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          
          {/* Main Navigation */}
          <div>
            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
              MAIN MENU
            </p>
            <nav className="space-y-1">
              <NavLink
                to="/"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs transition-all ${
                    isActive ? activeStyle : inactiveStyle
                  }`
                }
              >
                <Home className="w-4 h-4" />
                <span>Home Dashboard</span>
              </NavLink>

              <NavLink
                to="/categories"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs transition-all ${
                    isActive ? activeStyle : inactiveStyle
                  }`
                }
              >
                <Grid className="w-4 h-4" />
                <span>All Categories</span>
              </NavLink>

              <NavLink
                to="/trending"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs transition-all ${
                    isActive ? activeStyle : inactiveStyle
                  }`
                }
              >
                <TrendingUp className="w-4 h-4" />
                <span>Trending & Analytics</span>
              </NavLink>
            </nav>
          </div>

          {/* SOUTH INDIA SECTION (Requirement 8) */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-3.5 rounded-2xl text-white space-y-2 shadow-sm border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-indigo-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                SOUTH INDIA
              </span>
              <span className="text-[9px] font-bold bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-400/30">
                HUB
              </span>
            </div>

            <nav className="space-y-1 pt-1">
              {SOUTH_INDIA_STATES.map((st) => (
                <NavLink
                  key={st.slug}
                  to={st.isRegion ? '/region/south-india' : `/state/${st.slug}`}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white font-bold shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white font-medium'
                    }`
                  }
                >
                  <span>{st.name}</span>
                  <span className="text-[10px] opacity-60">→</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* INDIA NATIONAL SECTION */}
          <div>
            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5 text-emerald-600" />
              INDIA NEWS
            </p>
            <nav className="space-y-0.5">
              <NavLink
                to="/region/india"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-1.5 rounded-xl text-xs transition-all ${
                    isActive ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
                  }`
                }
              >
                <span>All India News</span>
              </NavLink>
              <NavLink
                to="/category/technology"
                onClick={onCloseMobile}
                className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
              >
                <Cpu className="w-3.5 h-3.5 text-slate-400" />
                <span>Technology</span>
              </NavLink>
              <NavLink
                to="/category/business"
                onClick={onCloseMobile}
                className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
              >
                <BusinessIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>Business & Economy</span>
              </NavLink>
              <NavLink
                to="/category/sports"
                onClick={onCloseMobile}
                className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
              >
                <Trophy className="w-3.5 h-3.5 text-slate-400" />
                <span>Sports</span>
              </NavLink>
              <NavLink
                to="/category/education"
                onClick={onCloseMobile}
                className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
              >
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                <span>Education & Exams</span>
              </NavLink>
            </nav>
          </div>

          {/* OTHER WORLD & CHANNELS */}
          <div>
            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
              OTHER CHANNELS
            </p>
            <nav className="space-y-0.5">
              <NavLink
                to="/category/world"
                onClick={onCloseMobile}
                className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>World Affairs</span>
              </NavLink>
              <NavLink
                to="/category/science"
                onClick={onCloseMobile}
                className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
              >
                <FlaskConical className="w-3.5 h-3.5 text-slate-400" />
                <span>Science & Space</span>
              </NavLink>
              <NavLink
                to="/category/environment"
                onClick={onCloseMobile}
                className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
              >
                <Leaf className="w-3.5 h-3.5 text-slate-400" />
                <span>Environment</span>
              </NavLink>
              <NavLink
                to="/bookmarks"
                onClick={onCloseMobile}
                className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
              >
                <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                <span>Saved Bookmarks</span>
              </NavLink>
            </nav>
          </div>

          {/* Admin Dashboard Section */}
          {isAdmin && (
            <div className="pt-3 border-t border-slate-100">
              <NavLink
                to="/admin"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                    isActive ? 'bg-blue-600 text-white font-bold' : 'text-blue-700 bg-blue-50/70 hover:bg-blue-100/70 font-semibold'
                  }`
                }
              >
                <Shield className="w-4 h-4 text-blue-600" />
                <span>Admin Panel</span>
              </NavLink>
            </div>
          )}

        </div>
      </aside>
    </>
  );
};

export default Sidebar;
