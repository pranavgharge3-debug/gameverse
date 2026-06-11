import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlay, FiUsers, FiTrophy, FiZap, FiShield, FiTarget } from 'react-icons/fi';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-dark-darker to-dark-bg" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,92,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(6,182,212,0.1),transparent_50%)]" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-primary/10 border border-purple-primary/30">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-semibold text-purple-primary">Live Gaming Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
              <span className="text-white">Where Gamers</span>
              <br />
              <span className="gradient-text">Become Legends</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Join the ultimate gaming social platform. Build your clan, compete in tournaments, and connect with gamers worldwide.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/register" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                <FiPlay size={20} />
                Get Started Free
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                Sign In
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-24 bg-dark-card/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to <span className="gradient-text-cyan">Dominate</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Powerful features designed for competitive gamers and esports enthusiasts
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<FiZap size={28} />}
              title="Real-Time Feed"
              description="Share your best moments, clips, and strategies with instant engagement from the community."
              color="purple"
            />
            <FeatureCard
              icon={<FiUsers size={28} />}
              title="Clan System"
              description="Form or join competitive clans, manage rosters, and coordinate with your team in real-time."
              color="cyan"
            />
            <FeatureCard
              icon={<FiTrophy size={28} />}
              title="Tournaments"
              description="Compete in organized tournaments, track brackets, and climb the global leaderboards."
              color="magenta"
            />
            <FeatureCard
              icon={<FiShield size={28} />}
              title="Secure & Private"
              description="Enterprise-grade security with end-to-end encryption for all your communications."
              color="purple"
            />
            <FeatureCard
              icon={<FiTarget size={28} />}
              title="Matchmaking"
 description="Find players at your skill level and queue up for competitive matches instantly."
              color="cyan"
            />
            <FeatureCard
              icon={<FiPlay size={28} />}
              title="Live Streaming"
              description="Integrated streaming support to broadcast your gameplay to your followers."
              color="magenta"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card glass p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-primary/20 via-transparent to-cyan-accent/20" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Level Up?
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Join thousands of gamers already competing on GamerVerse. Your legend starts here.
              </p>
              <Link to="/register" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2">
                Join Now - It's Free
                <FiPlay size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode; title: string; description: string; color: 'purple' | 'cyan' | 'magenta' }) {
  const colorClasses = {
    purple: 'from-purple-primary/20 to-purple-primary/5 border-purple-primary/30 text-purple-primary',
    cyan: 'from-cyan-accent/20 to-cyan-accent/5 border-cyan-accent/30 text-cyan-accent',
    magenta: 'from-magenta-accent/20 to-magenta-accent/5 border-magenta-accent/30 text-magenta-accent',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className={`card p-6 relative overflow-hidden group`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      <div className="relative z-10">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center mb-4`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
