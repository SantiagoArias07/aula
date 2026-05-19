// icons.jsx — line icons (stroke-based, consistent 1.5 weight)
// All icons take size + className props.

const Icon = ({ d, size = 18, sw = 1.6, fill = false, children, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"}
       stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {d ? <path d={d} /> : children}
  </svg>
);

const IconTablero  = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 12 L17 8"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/></Icon>;
const IconCursos   = (p) => <Icon {...p}><path d="M4 5.5c0-.83.67-1.5 1.5-1.5H19v15H5.5A1.5 1.5 0 0 1 4 17.5v-12Z"/><path d="M4 17.5A1.5 1.5 0 0 1 5.5 16H19"/></Icon>;
const IconGrupos   = (p) => <Icon {...p}><circle cx="9" cy="9" r="3"/><circle cx="17" cy="11" r="2.4"/><path d="M3 20c.5-3 3-4.5 6-4.5s5.5 1.5 6 4.5"/><path d="M15 20c.3-1.8 1.6-2.7 3-2.7s2.6.9 3 2.7"/></Icon>;
const IconCalendario = (p) => <Icon {...p}><rect x="3.5" y="4.5" width="17" height="16" rx="2"/><path d="M3.5 9.5h17M8 3v3M16 3v3"/></Icon>;
const IconBandeja  = (p) => <Icon {...p}><path d="M3.5 6.5h17v11a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-11Z"/><path d="M3.5 6.5 12 13l8.5-6.5"/></Icon>;
const IconHistorial = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></Icon>;
const IconAyuda    = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 1.1-1 1.7v.5"/><circle cx="12" cy="17" r=".8" fill="currentColor" stroke="none"/></Icon>;
const IconCuenta   = (p) => <Icon {...p}><circle cx="12" cy="8" r="3.5"/><path d="M5 20c1-3.5 4-5 7-5s6 1.5 7 5"/></Icon>;
const IconSearch   = (p) => <Icon {...p}><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4-4"/></Icon>;
const IconBell     = (p) => <Icon {...p}><path d="M6 17h12l-1.5-2V11a4.5 4.5 0 1 0-9 0v4L6 17Z"/><path d="M10 20a2 2 0 0 0 4 0"/></Icon>;
const IconCheck    = (p) => <Icon {...p} d="M4 12l5 5L20 6"/>;
const IconArrow    = (p) => <Icon {...p} d="M5 12h14m-5-6 6 6-6 6"/>;
const IconArrowL   = (p) => <Icon {...p} d="M19 12H5m6 6-6-6 6-6"/>;
const IconPlus     = (p) => <Icon {...p} d="M12 5v14M5 12h14"/>;
const IconClock    = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Icon>;
const IconWarn     = (p) => <Icon {...p}><path d="M12 4 2.5 20h19L12 4Z"/><path d="M12 10v4"/><circle cx="12" cy="17" r=".8" fill="currentColor" stroke="none"/></Icon>;
const IconFile     = (p) => <Icon {...p}><path d="M6 3h8l4 4v14H6V3Z"/><path d="M14 3v4h4"/></Icon>;
const IconPaper    = (p) => <Icon {...p}><path d="M6 4h12v16H6z"/><path d="M9 8h6M9 12h6M9 16h4"/></Icon>;
const IconUpload   = (p) => <Icon {...p}><path d="M12 16V5"/><path d="m7 10 5-5 5 5"/><path d="M4 19h16"/></Icon>;
const IconSend     = (p) => <Icon {...p} d="M4 12 20 4l-3 16-4-7-9-1Z"/>;
const IconChevR    = (p) => <Icon {...p} d="m9 6 6 6-6 6"/>;
const IconChevD    = (p) => <Icon {...p} d="m6 9 6 6 6-6"/>;
const IconDot      = (p) => <Icon {...p}><circle cx="6" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="18" cy="12" r="1.4" fill="currentColor" stroke="none"/></Icon>;
const IconWifi     = (p) => <Icon {...p}><path d="M3 9a14 14 0 0 1 18 0"/><path d="M6 12.5a10 10 0 0 1 12 0"/><path d="M9 16a6 6 0 0 1 6 0"/><circle cx="12" cy="19" r=".9" fill="currentColor" stroke="none"/></Icon>;
const IconWifiOff  = (p) => <Icon {...p}><path d="M3 9a14 14 0 0 1 18 0"/><path d="M6 12.5a10 10 0 0 1 12 0"/><path d="M3 3l18 18"/></Icon>;
const IconChat     = (p) => <Icon {...p}><path d="M4 5h16v11H9l-5 4V5Z"/></Icon>;
const IconHeart    = (p) => <Icon {...p}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"/></Icon>;
const IconBook     = (p) => <Icon {...p}><path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2V5Z"/><path d="M4 19a2 2 0 0 1 2-2h12"/></Icon>;
const IconStar     = (p) => <Icon {...p}><path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3Z"/></Icon>;
const IconFilter   = (p) => <Icon {...p}><path d="M4 5h16l-6 8v6l-4-2v-4L4 5Z"/></Icon>;
const IconSettings = (p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></Icon>;
const IconLogout   = (p) => <Icon {...p}><path d="M14 4h5v16h-5"/><path d="M3 12h13m-4-4 4 4-4 4"/></Icon>;

const Sparkle = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2c.6 4.8 2.2 6.4 7 7-4.8.6-6.4 2.2-7 7-.6-4.8-2.2-6.4-7-7 4.8-.6 6.4-2.2 7-7Z"/>
  </svg>
);

Object.assign(window, {
  Icon, IconTablero, IconCursos, IconGrupos, IconCalendario, IconBandeja,
  IconHistorial, IconAyuda, IconCuenta, IconSearch, IconBell, IconCheck, IconArrow,
  IconArrowL, IconPlus, IconClock, IconWarn, IconFile, IconPaper, IconUpload,
  IconSend, IconChevR, IconChevD, IconDot, IconWifi, IconWifiOff, IconChat,
  IconHeart, IconBook, IconStar, IconFilter, IconSettings, IconLogout, Sparkle,
});
