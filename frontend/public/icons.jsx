// icons.jsx — line icons (stroke-based, consistent 1.6 weight)
// All icons take size + className props.

const Icon = ({ d, size = 18, sw = 1.6, fill = false, children, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"}
       stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {d ? <path d={d} /> : children}
  </svg>
);

// ── Navegación principal ──────────────────────────────────────────────
const IconHome     = (p) => <Icon {...p}><path d="m3 11 9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></Icon>;
const IconRoute    = (p) => <Icon {...p}><circle cx="6" cy="19" r="2.2"/><circle cx="18" cy="5" r="2.2"/><path d="M8 19h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h5"/></Icon>;
const IconTarget   = (p) => <Icon {...p}><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/></Icon>;
const IconBrain    = (p) => <Icon {...p}><path d="M12 3c.5 3.6 1.7 4.8 5.3 5.3-3.6.5-4.8 1.7-5.3 5.3-.5-3.6-1.7-4.8-5.3-5.3C10.3 7.8 11.5 6.6 12 3Z" fill="currentColor" stroke="none"/><circle cx="6.3" cy="17.7" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.6" cy="16.4" r="1.2" fill="currentColor" stroke="none"/></Icon>;
const IconChart    = (p) => <Icon {...p}><path d="M4 20h16"/><path d="M7 20v-5"/><path d="M12 20V8"/><path d="M17 20v-8"/></Icon>;

// ── Regularización · matemáticas ──────────────────────────────────────
const IconPulse    = (p) => <Icon {...p}><path d="M3 12h4l2.5-7 4.5 14 2.5-7H21"/></Icon>;
const IconClipboard= (p) => <Icon {...p}><rect x="6" y="4.5" width="12" height="16" rx="2"/><path d="M9 4.5a3 3 0 0 1 6 0"/><path d="M9.5 12.5l1.6 1.6 3.4-3.6"/></Icon>;
const IconFlame    = (p) => <Icon {...p}><path d="M12 3c.6 3 4.5 4.8 4.5 9a4.5 4.5 0 0 1-9 0c0-1.6.7-2.6 1.6-3.5C10.4 10.4 11 9 11 7.5c.7.7 1 1.4 1 2.5.5-2 0-4.7 0-7Z"/></Icon>;
const IconTrophy   = (p) => <Icon {...p}><path d="M7 4h10v4.5a5 5 0 0 1-10 0V4Z"/><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3"/><path d="M12 13.5V17M9 21h6M9.5 21c0-1.5.8-2.5 2.5-2.5s2.5 1 2.5 2.5"/></Icon>;
const IconMedal    = (p) => <Icon {...p}><circle cx="12" cy="14" r="5"/><path d="m9 3 3 6 3-6"/><path d="M12 12.2 13 14l2 .2-1.4 1.4.3 2L12 16.7l-1.9 1 .3-2L9 14.2l2-.2 1-1.8Z" fill="currentColor" stroke="none"/></Icon>;
const IconLock     = (p) => <Icon {...p}><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></Icon>;
const IconBulb     = (p) => <Icon {...p}><path d="M12 3a6 6 0 0 0-3.8 10.6c.6.5.8 1 .8 1.9v.5h6v-.5c0-.9.2-1.4.8-1.9A6 6 0 0 0 12 3Z"/><path d="M9.5 20h5M10.5 22h3"/></Icon>;
const IconRefresh  = (p) => <Icon {...p}><path d="M4 12a8 8 0 0 1 13.7-5.6L20 8"/><path d="M20 3.5V8h-4.5"/><path d="M20 12a8 8 0 0 1-13.7 5.6L4 16"/><path d="M4 20.5V16h4.5"/></Icon>;
const IconPlay     = (p) => <Icon {...p}><path d="M8 5.5v13l10-6.5-10-6.5Z" fill="currentColor"/></Icon>;
const IconCamera   = (p) => <Icon {...p}><path d="M4 8h3l1.5-2.2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13" r="3.2"/></Icon>;
const IconShapes   = (p) => <Icon {...p}><path d="M12 3.5 8.3 10h7.4L12 3.5Z"/><rect x="13" y="12.5" width="7.5" height="7.5" rx="1.2"/><circle cx="7" cy="16.2" r="3.6"/></Icon>;
const IconRuler    = (p) => <Icon {...p}><path d="M4 14.5 14.5 4 20 9.5 9.5 20 4 14.5Z"/><path d="M8 10.5l1.6 1.6M11 7.5l1.6 1.6M14 4.5l1.6 1.6M5.5 13l1.6 1.6"/></Icon>;
const IconDivide   = (p) => <Icon {...p}><circle cx="12" cy="6.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="17.5" r="1.3" fill="currentColor" stroke="none"/><path d="M5.5 12h13"/></Icon>;
const IconFx       = (p) => <Icon {...p}><path d="M6 20V8a3 3 0 0 1 3-3M4.5 12H10"/><path d="m13.5 10.5 6 8M19.5 10.5l-6 8"/></Icon>;

// ── Utilidad ──────────────────────────────────────────────────────────
const IconSearch   = (p) => <Icon {...p}><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4-4"/></Icon>;
const IconBell     = (p) => <Icon {...p}><path d="M6 17h12l-1.5-2V11a4.5 4.5 0 1 0-9 0v4L6 17Z"/><path d="M10 20a2 2 0 0 0 4 0"/></Icon>;
const IconCheck    = (p) => <Icon {...p} d="M4 12l5 5L20 6"/>;
const IconArrow    = (p) => <Icon {...p} d="M5 12h14m-5-6 6 6-6 6"/>;
const IconArrowL   = (p) => <Icon {...p} d="M19 12H5m6 6-6-6 6-6"/>;
const IconPlus     = (p) => <Icon {...p} d="M12 5v14M5 12h14"/>;
const IconX        = (p) => <Icon {...p} d="M6 6l12 12M18 6 6 18"/>;
const IconClock    = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Icon>;
const IconWarn     = (p) => <Icon {...p}><path d="M12 4 2.5 20h19L12 4Z"/><path d="M12 10v4"/><circle cx="12" cy="17" r=".8" fill="currentColor" stroke="none"/></Icon>;
const IconStar     = (p) => <Icon {...p}><path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3Z"/></Icon>;
const IconChevR    = (p) => <Icon {...p} d="m9 6 6 6-6 6"/>;
const IconChevD    = (p) => <Icon {...p} d="m6 9 6 6 6-6"/>;
const IconDot      = (p) => <Icon {...p}><circle cx="6" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="18" cy="12" r="1.4" fill="currentColor" stroke="none"/></Icon>;
const IconWifi     = (p) => <Icon {...p}><path d="M3 9a14 14 0 0 1 18 0"/><path d="M6 12.5a10 10 0 0 1 12 0"/><path d="M9 16a6 6 0 0 1 6 0"/><circle cx="12" cy="19" r=".9" fill="currentColor" stroke="none"/></Icon>;
const IconWifiOff  = (p) => <Icon {...p}><path d="M3 9a14 14 0 0 1 18 0"/><path d="M6 12.5a10 10 0 0 1 12 0"/><path d="M3 3l18 18"/></Icon>;
const IconChat     = (p) => <Icon {...p}><path d="M4 5h16v11H9l-5 4V5Z"/></Icon>;
const IconSend     = (p) => <Icon {...p} d="M4 12 20 4l-3 16-4-7-9-1Z"/>;
const IconBook     = (p) => <Icon {...p}><path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2V5Z"/><path d="M4 19a2 2 0 0 1 2-2h12"/></Icon>;
const IconSettings = (p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></Icon>;
const IconLogout   = (p) => <Icon {...p}><path d="M14 4h5v16h-5"/><path d="M3 12h13m-4-4 4 4-4 4"/></Icon>;
const IconCuenta   = (p) => <Icon {...p}><circle cx="12" cy="8" r="3.5"/><path d="M5 20c1-3.5 4-5 7-5s6 1.5 7 5"/></Icon>;
const IconAyuda    = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 1.1-1 1.7v.5"/><circle cx="12" cy="17" r=".8" fill="currentColor" stroke="none"/></Icon>;
const IconHeart    = (p) => <Icon {...p}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"/></Icon>;

const Sparkle = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2c.6 4.8 2.2 6.4 7 7-4.8.6-6.4 2.2-7 7-.6-4.8-2.2-6.4-7-7 4.8-.6 6.4-2.2 7-7Z"/>
  </svg>
);

Object.assign(window, {
  Icon, IconHome, IconRoute, IconTarget, IconBrain, IconChart,
  IconPulse, IconClipboard, IconFlame, IconTrophy, IconMedal, IconLock,
  IconBulb, IconRefresh, IconPlay, IconCamera, IconShapes, IconRuler, IconDivide, IconFx,
  IconSearch, IconBell, IconCheck, IconArrow, IconArrowL, IconPlus, IconX,
  IconClock, IconWarn, IconStar, IconChevR, IconChevD, IconDot, IconWifi, IconWifiOff,
  IconChat, IconSend, IconBook, IconSettings, IconLogout, IconCuenta, IconAyuda, IconHeart, Sparkle,
});
