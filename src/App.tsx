import React, { useState, useRef, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { v4 as uuidv4 } from 'uuid';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Radio,
  Mic2,
  Heart,
  Share2,
  Mail,
  Phone,
  MapPin,
  Volume2,
  Calendar,
  Clock,
  Star,
  Download,
  Eye,
  Code,
  Trash2,
  GripVertical,
  Plus,
  Settings,
  Monitor,
  Smartphone,
  Palette,
  Type,
  Image as ImageIcon,
  Layout,
  Music,
} from 'lucide-react';

// Types
interface ComponentData {
  id: string;
  type: string;
  props: Record<string, any>;
}

interface WebsiteData {
  title: string;
  description: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
  };
  components: ComponentData[];
}

// Initial website data
const initialWebsiteData: WebsiteData = {
  title: 'One Wave Radio',
  description: 'Your Original Music Station',
  theme: {
    primaryColor: '#8B5CF6',
    secondaryColor: '#EC4899',
    backgroundColor: '#0F0F23',
    textColor: '#FFFFFF',
    fontFamily: 'Inter',
  },
  components: [
    {
      id: uuidv4(),
      type: 'hero',
      props: {
        title: 'One Wave Radio',
        subtitle: 'Streaming Original Music 24/7',
        backgroundImage: '',
        backgroundOverlay: '40',
        showPlayButton: true,
        buttonText: 'Start Listening',
        buttonBgColor: '#8B5CF6',
        buttonTextColor: '#FFFFFF',
        buttonBorderRadius: '9999px',
        minHeight: '500px',
      },
    },
    {
      id: uuidv4(),
      type: 'musicPlayer',
      props: {
        stationName: 'One Wave Radio',
        trackList: [
          'https://example.com/track1.mp3',
          'https://example.com/track2.mp3',
          'https://example.com/track3.mp3',
        ],
        currentTrackIndex: 0,
        isPlaying: false,
        buttonBgColor: '#8B5CF6',
        buttonTextColor: '#FFFFFF',
        buttonBorderRadius: '12px',
        buttonBorderWidth: '0',
        buttonBorderColor: '#8B5CF6',
        backgroundImage: '',
      },
    },
  ],
};

// Available components to add
const availableComponents = [
  { type: 'hero', name: 'Hero Section', icon: Layout, description: 'Large header with background image' },
  { type: 'musicPlayer', name: 'Music Player', icon: Music, description: 'Custom player with skip controls' },
  { type: 'about', name: 'About Section', icon: Star, description: 'Tell your story' },
  { type: 'schedule', name: 'Schedule', icon: Calendar, description: 'Show programming schedule' },
  { type: 'shows', name: 'Shows/Hosts', icon: Mic2, description: 'Feature your shows' },
  { type: 'gallery', name: 'Image Gallery', icon: ImageIcon, description: 'Photo gallery' },
  { type: 'contact', name: 'Contact Form', icon: Mail, description: 'Contact information' },
  { type: 'social', name: 'Social Links', icon: Share2, description: 'Social media links' },
  { type: 'text', name: 'Text Block', icon: Type, description: 'Simple text content' },
  { type: 'cta', name: 'Call to Action', icon: Heart, description: 'Action button section' },
  { type: 'button', name: 'Custom Button', icon: Plus, description: 'Fully customizable button' },
];

// Custom Music Player Component
const MusicPlayer: React.FC<{ props: any; theme: any }> = ({ props, theme }) => {
  const [isPlaying, setIsPlaying] = useState(props.isPlaying || false);
  const [currentTrack, setCurrentTrack] = useState(props.currentTrackIndex || 0);
  const [volume, setVolume] = useState(80);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tracks = props.trackList || [];

  // Shuffle tracks on initial load
  const [shuffledTracks, setShuffledTracks] = useState<string[]>([]);
  
  useEffect(() => {
    const shuffled = [...tracks].sort(() => Math.random() - 0.5);
    setShuffledTracks(shuffled.length > 0 ? shuffled : tracks);
  }, [tracks]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSkipBack = () => {
    const newIndex = currentTrack === 0 ? shuffledTracks.length - 1 : currentTrack - 1;
    setCurrentTrack(newIndex);
    if (audioRef.current) {
      audioRef.current.src = shuffledTracks[newIndex];
      if (isPlaying) audioRef.current.play();
    }
  };

  const handleSkipForward = () => {
    const newIndex = currentTrack === shuffledTracks.length - 1 ? 0 : currentTrack + 1;
    setCurrentTrack(newIndex);
    if (audioRef.current) {
      audioRef.current.src = shuffledTracks[newIndex];
      if (isPlaying) audioRef.current.play();
    }
  };

  const buttonStyle = {
    backgroundColor: props.buttonBgColor || theme.primaryColor,
    color: props.buttonTextColor || '#FFFFFF',
    borderRadius: props.buttonBorderRadius || '12px',
    borderWidth: props.buttonBorderWidth || '0',
    borderColor: props.buttonBorderColor || theme.primaryColor,
    borderStyle: 'solid',
  };

  return (
    <section 
      className="py-12 px-4 relative" 
      style={{ 
        background: props.backgroundImage 
          ? `linear-gradient(rgba(0,0,0,${(props.backgroundOverlay || 40) / 100}), rgba(0,0,0,${(props.backgroundOverlay || 40) / 100})), url(${props.backgroundImage})`
          : `${theme.backgroundColor}dd`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <audio ref={audioRef} src={shuffledTracks[currentTrack]} />
      <div className="max-w-2xl mx-auto">
        <div 
          className="rounded-2xl p-8 shadow-2xl" 
          style={{ 
            background: `${theme.primaryColor}20`, 
            border: `1px solid ${theme.primaryColor}40`,
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center" 
                style={{ background: theme.primaryColor }}
              >
                <Radio className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold" style={{ color: theme.textColor }}>{props.stationName}</h3>
                <p className="text-sm opacity-70" style={{ color: theme.textColor }}>Now Playing</p>
              </div>
            </div>
            <div 
              className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium" 
              style={{ background: '#22C55E', color: 'white' }}
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> LIVE
            </div>
          </div>
          
          {/* Track Info */}
          <div className="text-center mb-6">
            <p className="text-lg font-medium" style={{ color: theme.textColor }}>
              Track {currentTrack + 1} of {shuffledTracks.length}
            </p>
          </div>
          
          {/* Control Buttons - Skip Back | Listen Live | Skip Forward */}
          <div className="flex items-center justify-center gap-6 mb-6">
            {/* Skip Back Button */}
            <button
              onClick={handleSkipBack}
              className="w-14 h-14 flex items-center justify-center transition-transform hover:scale-110"
              style={{ ...buttonStyle }}
              title="Previous Track"
            >
              <SkipBack className="w-6 h-6" />
            </button>
            
            {/* Listen Live Button (Main) */}
            <button
              onClick={handlePlayPause}
              className="px-8 py-4 font-bold text-lg flex items-center gap-2 transition-transform hover:scale-105"
              style={{ ...buttonStyle, minWidth: '180px', justifyContent: 'center' }}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              {isPlaying ? 'Pause' : 'Listen Live'}
            </button>
            
            {/* Skip Forward Button */}
            <button
              onClick={handleSkipForward}
              className="w-14 h-14 flex items-center justify-center transition-transform hover:scale-110"
              style={{ ...buttonStyle }}
              title="Next Track"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="h-2 rounded-full overflow-hidden" style={{ background: `${theme.primaryColor}30` }}>
                <div 
                  className="h-full rounded-full transition-all duration-300" 
                  style={{ width: `${isPlaying ? '100%' : '0%'}`, background: theme.primaryColor }} 
                />
              </div>
            </div>
          </div>
          
          {/* Volume Control */}
          <div className="flex items-center justify-center gap-2">
            <Volume2 className="w-5 h-5" style={{ color: theme.textColor }} />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-32 accent-purple-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Component Renderer
const ComponentRenderer: React.FC<{
  component: ComponentData;
  isPreview?: boolean;
  onUpdate?: (id: string, props: Record<string, any>) => void;
  onDelete?: (id: string) => void;
}> = ({ component, isPreview, onDelete }) => {
  const { theme } = initialWebsiteData;
  
  const getBackgroundStyle = (props: any) => {
    if (props.backgroundImage) {
      const overlay = props.backgroundOverlay || '40';
      return {
        backgroundImage: `linear-gradient(rgba(0,0,0,${parseInt(overlay) / 100}), rgba(0,0,0,${parseInt(overlay) / 100})), url(${props.backgroundImage})`,
        backgroundSize: props.backgroundSize || 'cover',
        backgroundPosition: props.backgroundPosition || 'center',
        backgroundRepeat: 'no-repeat',
      };
    }
    return {};
  };

  const getButtonStyle = (props: any) => ({
    backgroundColor: props.buttonBgColor || theme.primaryColor,
    color: props.buttonTextColor || '#FFFFFF',
    borderRadius: props.buttonBorderRadius || '9999px',
    borderWidth: props.buttonBorderWidth || '0',
    borderColor: props.buttonBorderColor || theme.primaryColor,
    borderStyle: 'solid',
    padding: props.buttonPadding || '1rem 2rem',
    fontSize: props.buttonFontSize || '1rem',
  });

  const renderHero = () => (
    <section 
      className="relative flex items-center justify-center overflow-hidden"
      style={{ 
        minHeight: component.props.minHeight || '500px',
        ...getBackgroundStyle(component.props),
        backgroundColor: component.props.backgroundImage ? undefined : `${theme.primaryColor}22`,
      }}
    >
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-4" style={{ color: theme.textColor }}>
          {component.props.title}
        </h1>
        <p className="text-xl md:text-2xl opacity-80" style={{ color: theme.textColor }}>
          {component.props.subtitle}
        </p>
        {component.props.showPlayButton && (
          <button 
            className="mt-8 font-semibold flex items-center gap-2 mx-auto transition-transform hover:scale-105"
            style={getButtonStyle(component.props)}
          >
            <Play className="w-6 h-6" /> {component.props.buttonText || 'Start Listening'}
          </button>
        )}
      </div>
    </section>
  );

  const renderMusicPlayer = () => (
    <MusicPlayer props={component.props} theme={theme} />
  );

  const renderAbout = () => (
    <section 
      className="py-16 px-4" 
      style={{ 
        backgroundColor: theme.backgroundColor,
        ...getBackgroundStyle(component.props),
      }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: theme.textColor }}>
          {component.props.title || 'About One Wave Radio'}
        </h2>
        <p className="text-lg leading-relaxed opacity-80" style={{ color: theme.textColor }}>
          {component.props.content || 'Welcome to One Wave Radio - your destination for original music created by independent artists. We believe in the power of authentic sound and support musicians who create from the heart.'}
        </p>
        {component.props.buttonText && (
          <button 
            className="mt-6 font-semibold transition-transform hover:scale-105"
            style={getButtonStyle(component.props)}
          >
            {component.props.buttonText}
          </button>
        )}
      </div>
    </section>
  );

  const renderSchedule = () => (
    <section 
      className="py-16 px-4" 
      style={{ 
        backgroundColor: `${theme.backgroundColor}f0`,
        ...getBackgroundStyle(component.props),
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center" style={{ color: theme.textColor }}>
          {component.props.title || 'Programming Schedule'}
        </h2>
        <div className="space-y-4">
          {[
            { time: '6:00 AM - 10:00 AM', show: 'Morning Wave', host: 'DJ Sunrise' },
            { time: '10:00 AM - 2:00 PM', show: 'Midday Mix', host: 'DJ Noon' },
            { time: '2:00 PM - 6:00 PM', show: 'Afternoon Vibes', host: 'DJ Groove' },
            { time: '6:00 PM - 10:00 PM', show: 'Evening Sessions', host: 'DJ Sunset' },
            { time: '10:00 PM - 2:00 AM', show: 'Night Owls', host: 'DJ Moon' },
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-between p-4 rounded-xl"
              style={{ background: `${theme.primaryColor}15`, border: `1px solid ${theme.primaryColor}30` }}
            >
              <div className="flex items-center gap-4">
                <Clock className="w-5 h-5" style={{ color: theme.primaryColor }} />
                <span className="font-medium" style={{ color: theme.textColor }}>{item.time}</span>
              </div>
              <div className="text-right">
                <p className="font-semibold" style={{ color: theme.textColor }}>{item.show}</p>
                <p className="text-sm opacity-70" style={{ color: theme.textColor }}>with {item.host}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderShows = () => (
    <section 
      className="py-16 px-4" 
      style={{ 
        backgroundColor: theme.backgroundColor,
        ...getBackgroundStyle(component.props),
      }}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center" style={{ color: theme.textColor }}>
          {component.props.title || 'Our Shows & Hosts'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'DJ Sunrise', show: 'Morning Wave', image: '🌅' },
            { name: 'DJ Groove', show: 'Afternoon Vibes', image: '🎵' },
            { name: 'DJ Sunset', show: 'Evening Sessions', image: '🌇' },
          ].map((host, idx) => (
            <div 
              key={idx} 
              className="p-6 rounded-2xl text-center transition-transform hover:scale-105"
              style={{ background: `${theme.primaryColor}10`, border: `1px solid ${theme.primaryColor}30` }}
            >
              <div 
                className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl"
                style={{ background: theme.primaryColor }}
              >
                {host.image}
              </div>
              <h3 className="text-xl font-bold mb-1" style={{ color: theme.textColor }}>{host.name}</h3>
              <p className="opacity-70" style={{ color: theme.textColor }}>{host.show}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderGallery = () => (
    <section 
      className="py-16 px-4" 
      style={{ 
        backgroundColor: `${theme.backgroundColor}f5`,
        ...getBackgroundStyle(component.props),
      }}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center" style={{ color: theme.textColor }}>
          {component.props.title || 'Gallery'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div 
              key={i} 
              className="aspect-square rounded-xl flex items-center justify-center text-4xl"
              style={{ background: `${theme.primaryColor}20` }}
            >
              🎧
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderContact = () => (
    <section 
      className="py-16 px-4" 
      style={{ 
        backgroundColor: theme.backgroundColor,
        ...getBackgroundStyle(component.props),
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center" style={{ color: theme.textColor }}>
          {component.props.title || 'Get In Touch'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3" style={{ color: theme.textColor }}>
              <Mail className="w-5 h-5" style={{ color: theme.primaryColor }} />
              <span>{component.props.email || 'contact@onewaveradio.com'}</span>
            </div>
            <div className="flex items-center gap-3" style={{ color: theme.textColor }}>
              <Phone className="w-5 h-5" style={{ color: theme.primaryColor }} />
              <span>{component.props.phone || '+1 (555) 123-4567'}</span>
            </div>
            <div className="flex items-center gap-3" style={{ color: theme.textColor }}>
              <MapPin className="w-5 h-5" style={{ color: theme.primaryColor }} />
              <span>{component.props.address || '123 Music Street, Audio City'}</span>
            </div>
          </div>
          <form className="space-y-4">
            <input type="text" placeholder="Your Name" className="w-full px-4 py-3 rounded-xl border-0 outline-none" style={{ background: `${theme.primaryColor}15`, color: theme.textColor }} />
            <input type="email" placeholder="Your Email" className="w-full px-4 py-3 rounded-xl border-0 outline-none" style={{ background: `${theme.primaryColor}15`, color: theme.textColor }} />
            <textarea placeholder="Your Message" rows={4} className="w-full px-4 py-3 rounded-xl border-0 outline-none resize-none" style={{ background: `${theme.primaryColor}15`, color: theme.textColor }} />
            <button 
              type="button" 
              className="w-full font-semibold transition-transform hover:scale-105"
              style={getButtonStyle(component.props)}
            >
              {component.props.buttonText || 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );

  const renderSocial = () => {
    const socialIcons = [
      { icon: 'f', label: 'Facebook', url: component.props.facebook || '#' },
      { icon: '𝕏', label: 'Twitter', url: component.props.twitter || '#' },
      { icon: '📷', label: 'Instagram', url: component.props.instagram || '#' },
      { icon: '▶', label: 'YouTube', url: component.props.youtube || '#' },
    ];
    return (
      <section 
        className="py-12 px-4"
        style={{ 
          backgroundColor: `${theme.primaryColor}10`,
          ...getBackgroundStyle(component.props),
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-xl font-semibold mb-6" style={{ color: theme.textColor }}>
            {component.props.title || 'Follow Us'}
          </h3>
          <div className="flex justify-center gap-4">
            {socialIcons.map((social, idx) => (
              <a
                key={idx}
                href={social.url}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 text-lg"
                style={{ background: theme.primaryColor, color: 'white', textDecoration: 'none' }}
                title={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderText = () => (
    <section 
      className="py-12 px-4"
      style={{ 
        backgroundColor: theme.backgroundColor,
        ...getBackgroundStyle(component.props),
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: theme.textColor }}>
          {component.props.title || 'Text Section'}
        </h2>
        <div className="prose max-w-none" style={{ color: theme.textColor }}>
          <p className="opacity-80">{component.props.content || 'Add your content here. This is a simple text block where you can write anything you want.'}</p>
        </div>
      </div>
    </section>
  );

  const renderCTA = () => (
    <section 
      className="py-16 px-4"
      style={{ 
        background: component.props.backgroundImage 
          ? `linear-gradient(rgba(0,0,0,${(component.props.backgroundOverlay || 50) / 100}), rgba(0,0,0,${(component.props.backgroundOverlay || 50) / 100})), url(${component.props.backgroundImage})`
          : `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{component.props.title || 'Join the Wave'}</h2>
        <p className="text-lg text-white opacity-90 mb-8">{component.props.subtitle || 'Subscribe to stay updated with the latest shows and music releases.'}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <input type="email" placeholder="Enter your email" className="flex-1 px-6 py-3 rounded-full text-gray-900 outline-none" />
          <button 
            className="font-semibold transition-transform hover:scale-105"
            style={getButtonStyle({ ...component.props, buttonBgColor: component.props.buttonBgColor || '#FFFFFF', buttonTextColor: component.props.buttonTextColor || theme.primaryColor })}
          >
            {component.props.buttonText || 'Subscribe'}
          </button>
        </div>
      </div>
    </section>
  );

  const renderButton = () => (
    <section 
      className="py-12 px-4 flex justify-center"
      style={{ 
        backgroundColor: theme.backgroundColor,
        ...getBackgroundStyle(component.props),
      }}
    >
      <a 
        href={component.props.buttonLink || '#'}
        className="font-semibold transition-transform hover:scale-105 inline-block"
        style={getButtonStyle(component.props)}
      >
        {component.props.buttonText || 'Click Me'}
      </a>
    </section>
  );

  const components: Record<string, () => React.ReactElement> = {
    hero: renderHero,
    musicPlayer: renderMusicPlayer,
    about: renderAbout,
    schedule: renderSchedule,
    shows: renderShows,
    gallery: renderGallery,
    contact: renderContact,
    social: renderSocial,
    text: renderText,
    cta: renderCTA,
    button: renderButton,
  };

  const renderContent = components[component.type] || (() => <div>Unknown Component</div>) as () => React.ReactElement;

  if (isPreview) {
    return <div className="component-wrapper">{renderContent()}</div>;
  }

  return (
    <div className="component-wrapper group relative">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-50">
        <button
          onClick={() => onDelete?.(component.id)}
          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

// Sortable Component Wrapper
const SortableComponent: React.FC<{
  component: ComponentData;
  onUpdate: (id: string, props: Record<string, any>) => void;
  onDelete: (id: string) => void;
}> = ({ component, onUpdate, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative border-2 border-transparent hover:border-purple-500/50 rounded-lg overflow-hidden"
    >
      <div className="absolute top-2 left-2 z-50 opacity-0 hover:opacity-100 transition-opacity">
        <button
          {...attributes}
          {...listeners}
          className="p-2 bg-purple-600 text-white rounded-lg cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </div>
      <ComponentRenderer
        component={component}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </div>
  );
};

// Property Editor with organized sections
const PropertyEditor: React.FC<{
  component: ComponentData;
  onUpdate: (id: string, props: Record<string, any>) => void;
}> = ({ component, onUpdate }) => {
  const handleChange = (key: string, value: any) => {
    onUpdate(component.id, { ...component.props, [key]: value });
  };

  const renderInput = (key: string, value: any) => {
    const label = key.replace(/([A-Z])/g, ' $1').trim();
    
    if (typeof value === 'boolean') {
      return (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => handleChange(key, e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <span className="text-sm text-gray-600">Enable</span>
        </label>
      );
    }

    if (key.toLowerCase().includes('color')) {
      return (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value || '#8B5CF6'}
            onChange={(e) => handleChange(key, e.target.value)}
            className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleChange(key, e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder={`Enter ${label}`}
          />
        </div>
      );
    }

    if (key.toLowerCase().includes('image') || key.toLowerCase() === 'backgroundimage') {
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="Enter image URL or upload to Cloudflare"
          />
          <p className="text-xs text-gray-500">
            Tip: Upload images to Cloudflare R2 and paste the public URL here
          </p>
        </div>
      );
    }

    if (key === 'trackList') {
      return (
        <div className="space-y-2">
          <textarea
            value={Array.isArray(value) ? value.join('\n') : value || ''}
            onChange={(e) => handleChange(key, e.target.value.split('\n').filter(t => t.trim()))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
            rows={4}
            placeholder="Enter track URLs, one per line"
          />
          <p className="text-xs text-gray-500">
            Enter direct MP3 URLs from Cloudflare, one per line
          </p>
        </div>
      );
    }

    return (
      <input
        type="text"
        value={value || ''}
        onChange={(e) => handleChange(key, e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        placeholder={`Enter ${label}`}
      />
    );
  };

  // Group properties into sections
  const contentProps = Object.entries(component.props).filter(([key]) => 
    !key.toLowerCase().includes('color') && 
    !key.toLowerCase().includes('border') && 
    !key.toLowerCase().includes('padding') && 
    !key.toLowerCase().includes('fontsize') &&
    !key.toLowerCase().includes('background') &&
    !key.toLowerCase().includes('minheight') &&
    key !== 'trackList'
  );

  const styleProps = Object.entries(component.props).filter(([key]) => 
    key.toLowerCase().includes('color') || 
    key.toLowerCase().includes('border') || 
    key.toLowerCase().includes('padding') || 
    key.toLowerCase().includes('fontsize')
  );

  const backgroundProps = Object.entries(component.props).filter(([key]) => 
    key.toLowerCase().includes('background') ||
    key.toLowerCase().includes('minheight')
  );

  const trackProps = Object.entries(component.props).filter(([key]) => 
    key === 'trackList'
  );

  return (
    <div className="p-4 space-y-6">
      <h4 className="font-semibold text-gray-800 capitalize flex items-center gap-2">
        {availableComponents.find(c => c.type === component.type)?.icon && (
          React.createElement(availableComponents.find(c => c.type === component.type)!.icon, { className: 'w-4 h-4' })
        )}
        {component.type} Properties
      </h4>
      
      {/* Content Section */}
      {contentProps.length > 0 && (
        <div className="space-y-4">
          <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Content</h5>
          {contentProps.map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              {renderInput(key, value)}
            </div>
          ))}
        </div>
      )}

      {/* Track List Section */}
      {trackProps.length > 0 && (
        <div className="space-y-4">
          <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Music Tracks</h5>
          {trackProps.map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                Track URLs
              </label>
              {renderInput(key, value)}
            </div>
          ))}
        </div>
      )}

      {/* Background Section */}
      {backgroundProps.length > 0 && (
        <div className="space-y-4">
          <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Background</h5>
          {backgroundProps.map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              {renderInput(key, value)}
            </div>
          ))}
        </div>
      )}

      {/* Button Styles Section */}
      {styleProps.length > 0 && (
        <div className="space-y-4">
          <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Button Styles</h5>
          {styleProps.map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              {renderInput(key, value)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main App
function App() {
  const [websiteData, setWebsiteData] = useState<WebsiteData>(initialWebsiteData);
  const [activeTab, setActiveTab] = useState<'builder' | 'preview' | 'code'>('builder');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setWebsiteData((data) => {
        const oldIndex = data.components.findIndex((c) => c.id === active.id);
        const newIndex = data.components.findIndex((c) => c.id === over.id);
        return {
          ...data,
          components: arrayMove(data.components, oldIndex, newIndex),
        };
      });
    }

    setActiveId(null);
  };

  const addComponent = (type: string) => {
    const defaultProps: Record<string, any> = {
      hero: { 
        title: 'One Wave Radio', 
        subtitle: 'Streaming Original Music 24/7', 
        backgroundImage: '', 
        backgroundOverlay: '40',
        showPlayButton: true,
        buttonText: 'Start Listening',
        buttonBgColor: websiteData.theme.primaryColor,
        buttonTextColor: '#FFFFFF',
        buttonBorderRadius: '9999px',
        minHeight: '500px',
      },
      musicPlayer: { 
        stationName: 'One Wave Radio',
        trackList: [],
        currentTrackIndex: 0,
        isPlaying: false,
        buttonBgColor: websiteData.theme.primaryColor,
        buttonTextColor: '#FFFFFF',
        buttonBorderRadius: '12px',
        buttonBorderWidth: '0',
        buttonBorderColor: websiteData.theme.primaryColor,
        backgroundImage: '',
      },
      about: { 
        title: 'About Us', 
        content: 'Welcome to One Wave Radio...',
        buttonText: '',
        buttonBgColor: websiteData.theme.primaryColor,
        buttonTextColor: '#FFFFFF',
        buttonBorderRadius: '8px',
      },
      schedule: { title: 'Programming Schedule' },
      shows: { title: 'Our Shows & Hosts' },
      gallery: { title: 'Gallery' },
      contact: { 
        title: 'Get In Touch',
        email: 'contact@onewaveradio.com',
        phone: '+1 (555) 123-4567',
        address: '123 Music Street, Audio City',
        buttonText: 'Send Message',
        buttonBgColor: websiteData.theme.primaryColor,
        buttonTextColor: '#FFFFFF',
        buttonBorderRadius: '8px',
      },
      social: { 
        title: 'Follow Us',
        facebook: '#',
        twitter: '#',
        instagram: '#',
        youtube: '#',
      },
      text: { title: 'Text Section', content: 'Your content here...' },
      cta: { 
        title: 'Join the Wave', 
        subtitle: 'Subscribe for updates', 
        buttonText: 'Subscribe',
        buttonBgColor: '#FFFFFF',
        buttonTextColor: websiteData.theme.primaryColor,
        buttonBorderRadius: '9999px',
        backgroundImage: '',
        backgroundOverlay: '50',
      },
      button: {
        buttonText: 'Click Me',
        buttonLink: '#',
        buttonBgColor: websiteData.theme.primaryColor,
        buttonTextColor: '#FFFFFF',
        buttonBorderRadius: '8px',
        buttonBorderWidth: '0',
        buttonBorderColor: websiteData.theme.primaryColor,
        buttonPadding: '12px 24px',
        buttonFontSize: '16px',
      },
    };

    const newComponent: ComponentData = {
      id: uuidv4(),
      type,
      props: defaultProps[type] || {},
    };

    setWebsiteData((data) => ({
      ...data,
      components: [...data.components, newComponent],
    }));
  };

  const updateComponent = (id: string, props: Record<string, any>) => {
    setWebsiteData((data) => ({
      ...data,
      components: data.components.map((c) =>
        c.id === id ? { ...c, props } : c
      ),
    }));
  };

  const deleteComponent = (id: string) => {
    setWebsiteData((data) => ({
      ...data,
      components: data.components.filter((c) => c.id !== id),
    }));
    if (selectedComponent === id) {
      setSelectedComponent(null);
    }
  };

  const exportHTML = () => {
    const html = generateHTML(websiteData);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateHTML = (data: WebsiteData) => {
    const componentHTML = data.components.map((c) => {
      const btnStyle = (props: any) => {
        const style = [];
        if (props.buttonBgColor) style.push(`background-color: ${props.buttonBgColor}`);
        if (props.buttonTextColor) style.push(`color: ${props.buttonTextColor}`);
        if (props.buttonBorderRadius) style.push(`border-radius: ${props.buttonBorderRadius}`);
        if (props.buttonBorderWidth && props.buttonBorderWidth !== '0') {
          style.push(`border: ${props.buttonBorderWidth}px solid ${props.buttonBorderColor || props.buttonBgColor}`);
        }
        if (props.buttonPadding) style.push(`padding: ${props.buttonPadding}`);
        if (props.buttonFontSize) style.push(`font-size: ${props.buttonFontSize}`);
        return style.join('; ');
      };

      const bgStyle = (props: any) => {
        if (props.backgroundImage) {
          const overlay = props.backgroundOverlay || '40';
          return `background-image: linear-gradient(rgba(0,0,0,${parseInt(overlay) / 100}), rgba(0,0,0,${parseInt(overlay) / 100})), url('${props.backgroundImage}'); background-size: cover; background-position: center;`;
        }
        return '';
      };

      const templates: Record<string, string> = {
        hero: `
          <section style="${bgStyle(c.props)} background: ${c.props.backgroundImage ? '' : `linear-gradient(135deg, ${data.theme.primaryColor}22, ${data.theme.secondaryColor}22)`}; min-height: ${c.props.minHeight || '500px'}; display: flex; align-items: center; justify-content: center; text-align: center; padding: 2rem;">
            <div>
              <h1 style="color: ${data.theme.textColor}; font-size: 4rem; margin-bottom: 1rem;">${c.props.title}</h1>
              <p style="color: ${data.theme.textColor}; font-size: 1.5rem; opacity: 0.8;">${c.props.subtitle}</p>
              ${c.props.showPlayButton ? `<button style="${btnStyle(c.props)}; border: none; margin-top: 2rem; cursor: pointer; font-weight: 600; transition: transform 0.2s;">▶ ${c.props.buttonText || 'Start Listening'}</button>` : ''}
            </div>
          </section>
        `,
        musicPlayer: `
          <section style="${bgStyle(c.props)} background: ${c.props.backgroundImage ? '' : `${data.theme.backgroundColor}dd`}; padding: 3rem 1rem;">
            <div style="max-width: 600px; margin: 0 auto; background: ${data.theme.primaryColor}20; border: 1px solid ${data.theme.primaryColor}40; border-radius: 1rem; padding: 2rem; backdrop-filter: blur(10px);">
              <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="width: 60px; height: 60px; background: ${data.theme.primaryColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">📻</div>
                <div>
                  <h3 style="color: ${data.theme.textColor}; margin: 0;">${c.props.stationName}</h3>
                  <p style="color: ${data.theme.textColor}; opacity: 0.7; margin: 0; font-size: 0.9rem;">Now Playing</p>
                </div>
                <span style="background: #22C55E; color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.8rem; margin-left: auto;">● LIVE</span>
              </div>
              <div style="text-align: center; margin-bottom: 1rem; color: ${data.theme.textColor};">Shuffle Mode Active</div>
              <div style="display: flex; align-items: center; justify-content: center; gap: 1.5rem; margin-bottom: 1.5rem;">
                <button style="${btnStyle(c.props)}; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none;">⏮</button>
                <button style="${btnStyle(c.props)}; padding: 1rem 2rem; font-size: 1.1rem; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; border: none; font-weight: 600;" onclick="this.textContent = this.textContent.includes('Listen') ? '⏸ Pause' : '▶ Listen Live'">▶ Listen Live</button>
                <button style="${btnStyle(c.props)}; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none;">⏭</button>
              </div>
              <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                <span style="color: ${data.theme.textColor};">🔊</span>
                <input type="range" min="0" max="100" value="80" style="width: 120px;">
              </div>
            </div>
          </section>
        `,
        about: `
          <section style="${bgStyle(c.props)} background: ${data.theme.backgroundColor}; padding: 4rem 1rem; text-align: center;">
            <div style="max-width: 800px; margin: 0 auto;">
              <h2 style="color: ${data.theme.textColor}; font-size: 2.5rem; margin-bottom: 1.5rem;">${c.props.title}</h2>
              <p style="color: ${data.theme.textColor}; opacity: 0.8; font-size: 1.1rem; line-height: 1.7;">${c.props.content}</p>
              ${c.props.buttonText ? `<button style="${btnStyle(c.props)}; border: none; margin-top: 1.5rem; cursor: pointer; font-weight: 600;">${c.props.buttonText}</button>` : ''}
            </div>
          </section>
        `,
        schedule: `
          <section style="${bgStyle(c.props)} background: ${data.theme.backgroundColor}f0; padding: 4rem 1rem;">
            <div style="max-width: 800px; margin: 0 auto;">
              <h2 style="color: ${data.theme.textColor}; font-size: 2.5rem; text-align: center; margin-bottom: 2rem;">${c.props.title}</h2>
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                <div style="background: ${data.theme.primaryColor}15; border: 1px solid ${data.theme.primaryColor}30; padding: 1rem; border-radius: 0.75rem; display: flex; justify-content: space-between;">
                  <span style="color: ${data.theme.textColor};">🕐 6:00 AM - 10:00 AM</span>
                  <span style="color: ${data.theme.textColor};"><strong>Morning Wave</strong> with DJ Sunrise</span>
                </div>
                <div style="background: ${data.theme.primaryColor}15; border: 1px solid ${data.theme.primaryColor}30; padding: 1rem; border-radius: 0.75rem; display: flex; justify-content: space-between;">
                  <span style="color: ${data.theme.textColor};">🕐 10:00 AM - 2:00 PM</span>
                  <span style="color: ${data.theme.textColor};"><strong>Midday Mix</strong> with DJ Noon</span>
                </div>
                <div style="background: ${data.theme.primaryColor}15; border: 1px solid ${data.theme.primaryColor}30; padding: 1rem; border-radius: 0.75rem; display: flex; justify-content: space-between;">
                  <span style="color: ${data.theme.textColor};">🕐 2:00 PM - 6:00 PM</span>
                  <span style="color: ${data.theme.textColor};"><strong>Afternoon Vibes</strong> with DJ Groove</span>
                </div>
              </div>
            </div>
          </section>
        `,
        shows: `
          <section style="${bgStyle(c.props)} background: ${data.theme.backgroundColor}; padding: 4rem 1rem;">
            <div style="max-width: 1000px; margin: 0 auto;">
              <h2 style="color: ${data.theme.textColor}; font-size: 2.5rem; text-align: center; margin-bottom: 3rem;">${c.props.title}</h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
                <div style="background: ${data.theme.primaryColor}10; border: 1px solid ${data.theme.primaryColor}30; padding: 1.5rem; border-radius: 1rem; text-align: center;">
                  <div style="width: 80px; height: 80px; background: ${data.theme.primaryColor}; border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; font-size: 2rem;">🌅</div>
                  <h3 style="color: ${data.theme.textColor}; margin: 0 0 0.5rem;">DJ Sunrise</h3>
                  <p style="color: ${data.theme.textColor}; opacity: 0.7; margin: 0;">Morning Wave</p>
                </div>
                <div style="background: ${data.theme.primaryColor}10; border: 1px solid ${data.theme.primaryColor}30; padding: 1.5rem; border-radius: 1rem; text-align: center;">
                  <div style="width: 80px; height: 80px; background: ${data.theme.primaryColor}; border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; font-size: 2rem;">🎵</div>
                  <h3 style="color: ${data.theme.textColor}; margin: 0 0 0.5rem;">DJ Groove</h3>
                  <p style="color: ${data.theme.textColor}; opacity: 0.7; margin: 0;">Afternoon Vibes</p>
                </div>
                <div style="background: ${data.theme.primaryColor}10; border: 1px solid ${data.theme.primaryColor}30; padding: 1.5rem; border-radius: 1rem; text-align: center;">
                  <div style="width: 80px; height: 80px; background: ${data.theme.primaryColor}; border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; font-size: 2rem;">🌇</div>
                  <h3 style="color: ${data.theme.textColor}; margin: 0 0 0.5rem;">DJ Sunset</h3>
                  <p style="color: ${data.theme.textColor}; opacity: 0.7; margin: 0;">Evening Sessions</p>
                </div>
              </div>
            </div>
          </section>
        `,
        contact: `
          <section style="${bgStyle(c.props)} background: ${data.theme.backgroundColor}; padding: 4rem 1rem;">
            <div style="max-width: 800px; margin: 0 auto;">
              <h2 style="color: ${data.theme.textColor}; font-size: 2.5rem; text-align: center; margin-bottom: 2rem;">${c.props.title}</h2>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                <div style="color: ${data.theme.textColor};">
                  <p style="margin-bottom: 1rem;">✉️ ${c.props.email || 'contact@onewaveradio.com'}</p>
                  <p style="margin-bottom: 1rem;">📞 ${c.props.phone || '+1 (555) 123-4567'}</p>
                  <p>📍 ${c.props.address || '123 Music Street, Audio City'}</p>
                </div>
                <form style="display: flex; flex-direction: column; gap: 1rem;">
                  <input type="text" placeholder="Your Name" style="padding: 0.75rem; border-radius: 0.5rem; border: none; background: ${data.theme.primaryColor}15; color: ${data.theme.textColor};">
                  <input type="email" placeholder="Your Email" style="padding: 0.75rem; border-radius: 0.5rem; border: none; background: ${data.theme.primaryColor}15; color: ${data.theme.textColor};">
                  <textarea placeholder="Your Message" rows="4" style="padding: 0.75rem; border-radius: 0.5rem; border: none; background: ${data.theme.primaryColor}15; color: ${data.theme.textColor}; resize: none;"></textarea>
                  <button type="button" style="${btnStyle(c.props)}; border: none; cursor: pointer; font-weight: 600;">${c.props.buttonText || 'Send Message'}</button>
                </form>
              </div>
            </div>
          </section>
        `,
        social: `
          <section style="${bgStyle(c.props)} background: ${data.theme.primaryColor}10; padding: 3rem 1rem; text-align: center;">
            <h3 style="color: ${data.theme.textColor}; margin-bottom: 1.5rem;">${c.props.title}</h3>
            <div style="display: flex; justify-content: center; gap: 1rem;">
              <a href="${c.props.facebook || '#'}" style="width: 48px; height: 48px; background: ${data.theme.primaryColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; text-decoration: none;">f</a>
              <a href="${c.props.twitter || '#'}" style="width: 48px; height: 48px; background: ${data.theme.primaryColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; text-decoration: none;">𝕏</a>
              <a href="${c.props.instagram || '#'}" style="width: 48px; height: 48px; background: ${data.theme.primaryColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; text-decoration: none;">📷</a>
              <a href="${c.props.youtube || '#'}" style="width: 48px; height: 48px; background: ${data.theme.primaryColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; text-decoration: none;">▶</a>
            </div>
          </section>
        `,
        text: `
          <section style="${bgStyle(c.props)} background: ${data.theme.backgroundColor}; padding: 3rem 1rem;">
            <div style="max-width: 800px; margin: 0 auto;">
              <h2 style="color: ${data.theme.textColor}; font-size: 2rem; margin-bottom: 1rem;">${c.props.title}</h2>
              <p style="color: ${data.theme.textColor}; opacity: 0.8; line-height: 1.7;">${c.props.content}</p>
            </div>
          </section>
        `,
        cta: `
          <section style="${bgStyle(c.props)} background: ${c.props.backgroundImage ? '' : `linear-gradient(135deg, ${data.theme.primaryColor}, ${data.theme.secondaryColor})`}; padding: 4rem 1rem; text-align: center;">
            <h2 style="color: white; font-size: 2.5rem; margin-bottom: 1rem;">${c.props.title}</h2>
            <p style="color: white; opacity: 0.9; margin-bottom: 2rem;">${c.props.subtitle}</p>
            <form style="display: flex; gap: 1rem; justify-content: center; max-width: 500px; margin: 0 auto; flex-wrap: wrap;">
              <input type="email" placeholder="Enter your email" style="flex: 1; min-width: 200px; padding: 0.75rem 1.5rem; border-radius: 9999px; border: none;">
              <button type="button" style="${btnStyle(c.props)}; border: none; cursor: pointer; font-weight: 600;">${c.props.buttonText}</button>
            </form>
          </section>
        `,
        button: `
          <section style="${bgStyle(c.props)} background: ${data.theme.backgroundColor}; padding: 3rem 1rem; text-align: center;">
            <a href="${c.props.buttonLink || '#'}" style="${btnStyle(c.props)}; text-decoration: none; display: inline-block; cursor: pointer; font-weight: 600;">${c.props.buttonText || 'Click Me'}</a>
          </section>
        `,
      };
      return templates[c.type] || '';
    }).join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title}</title>
  <meta name="description" content="${data.description}">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: ${data.theme.fontFamily}, system-ui, sans-serif; background: ${data.theme.backgroundColor}; min-height: 100vh; }
    audio { border-radius: 0.5rem; }
    input::placeholder, textarea::placeholder { color: ${data.theme.textColor}40; }
    button:hover, a:hover { transform: scale(1.05); }
  </style>
</head>
<body>
${componentHTML}
</body>
</html>`;
  };

  const selectedComponentData = websiteData.components.find(c => c.id === selectedComponent);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Navigation */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Radio className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-800">One Wave Builder</span>
          </div>
          <div className="h-6 w-px bg-gray-200 mx-2" />
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('builder')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'builder' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Layout className="w-4 h-4" /> Builder
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'preview' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Eye className="w-4 h-4" /> Preview
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'code' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Code className="w-4 h-4" /> Code
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'preview' && (
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg mr-2">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`p-1.5 rounded-md transition-all ${deviceMode === 'desktop' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600'}`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`p-1.5 rounded-md transition-all ${deviceMode === 'mobile' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600'}`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          )}
          <button
            onClick={exportHTML}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export HTML
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Components */}
        {activeTab === 'builder' && (
          <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Components
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 gap-2">
                {availableComponents.map((comp) => (
                  <button
                    key={comp.type}
                    onClick={() => addComponent(comp.type)}
                    className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <comp.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{comp.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{comp.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* Center - Canvas */}
        <main className="flex-1 bg-gray-100 overflow-hidden flex flex-col">
          {activeTab === 'builder' && (
            <>
              <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Website Canvas</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{websiteData.components.length} components</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-8">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCorners}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={websiteData.components.map(c => c.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="max-w-5xl mx-auto space-y-4">
                      {websiteData.components.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
                          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus className="w-8 h-8 text-purple-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">Start Building Your Website</h3>
                          <p className="text-gray-500 max-w-md mx-auto">Click on components from the left sidebar to add them to your website. Drag to reorder.</p>
                        </div>
                      ) : (
                        websiteData.components.map((component) => (
                          <div
                            key={component.id}
                            onClick={() => setSelectedComponent(component.id)}
                            className={`cursor-pointer ${selectedComponent === component.id ? 'ring-2 ring-purple-500 ring-offset-2' : ''}`}
                          >
                            <SortableComponent
                              component={component}
                              onUpdate={updateComponent}
                              onDelete={deleteComponent}
                            />
                          </div>
                        ))
                      )}
                    </div>
                  </SortableContext>
                  <DragOverlay>
                    {activeId ? (
                      <div className="opacity-50">
                        <ComponentRenderer
                          component={websiteData.components.find(c => c.id === activeId)!}
                          isPreview
                        />
                      </div>
                    ) : null}
                  </DragOverlay>
                </DndContext>
              </div>
            </>
          )}

          {activeTab === 'preview' && (
            <div className="flex-1 overflow-y-auto bg-gray-800 p-8">
              <div className={`mx-auto transition-all duration-300 ${deviceMode === 'mobile' ? 'max-w-[375px]' : 'max-w-5xl'}`}>
                <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                  {websiteData.components.map((component) => (
                    <ComponentRenderer
                      key={component.id}
                      component={component}
                      isPreview
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="flex-1 overflow-hidden bg-gray-900">
              <div className="h-full overflow-auto p-6">
                <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                  {generateHTML(websiteData)}
                </pre>
              </div>
            </div>
          )}
        </main>

        {/* Right Sidebar - Properties */}
        {activeTab === 'builder' && (
          <aside className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Settings className="w-4 h-4" /> Properties
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              {selectedComponentData ? (
                <PropertyEditor
                  component={selectedComponentData}
                  onUpdate={updateComponent}
                />
              ) : (
                <div className="p-4 space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Palette className="w-4 h-4" /> Theme Settings
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Primary Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={websiteData.theme.primaryColor}
                            onChange={(e) => setWebsiteData(d => ({ ...d, theme: { ...d.theme, primaryColor: e.target.value } }))}
                            className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={websiteData.theme.primaryColor}
                            onChange={(e) => setWebsiteData(d => ({ ...d, theme: { ...d.theme, primaryColor: e.target.value } }))}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Secondary Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={websiteData.theme.secondaryColor}
                            onChange={(e) => setWebsiteData(d => ({ ...d, theme: { ...d.theme, secondaryColor: e.target.value } }))}
                            className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={websiteData.theme.secondaryColor}
                            onChange={(e) => setWebsiteData(d => ({ ...d, theme: { ...d.theme, secondaryColor: e.target.value } }))}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Background Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={websiteData.theme.backgroundColor}
                            onChange={(e) => setWebsiteData(d => ({ ...d, theme: { ...d.theme, backgroundColor: e.target.value } }))}
                            className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={websiteData.theme.backgroundColor}
                            onChange={(e) => setWebsiteData(d => ({ ...d, theme: { ...d.theme, backgroundColor: e.target.value } }))}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Text Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={websiteData.theme.textColor}
                            onChange={(e) => setWebsiteData(d => ({ ...d, theme: { ...d.theme, textColor: e.target.value } }))}
                            className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={websiteData.theme.textColor}
                            onChange={(e) => setWebsiteData(d => ({ ...d, theme: { ...d.theme, textColor: e.target.value } }))}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Type className="w-4 h-4" /> Site Info
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Website Title</label>
                        <input
                          type="text"
                          value={websiteData.title}
                          onChange={(e) => setWebsiteData(d => ({ ...d, title: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                        <textarea
                          value={websiteData.description}
                          onChange={(e) => setWebsiteData(d => ({ ...d, description: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

export default App;
