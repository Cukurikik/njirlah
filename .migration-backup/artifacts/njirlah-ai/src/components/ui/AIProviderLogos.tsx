interface LogoProps { size?: number; className?: string; }

export function OpenAILogo({ size = 20, className = "" }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-6.75-3.021 10.079 10.079 0 0 0-9.614 6.977 9.967 9.967 0 0 0-6.466 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 6.75 3.021 10.079 10.079 0 0 0 9.617-6.981 9.967 9.967 0 0 0 6.463-4.834 10.079 10.079 0 0 0-1.24-11.814zM22.498 37.886a7.474 7.474 0 0 1-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.496zM6.392 31.006a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103L16.5 33.811a7.505 7.505 0 0 1-10.108-2.805zM4.297 13.62A7.469 7.469 0 0 1 8.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.012L7.044 23.86a7.504 7.504 0 0 1-2.747-10.24zm27.658 6.437l-9.724-5.615 3.367-1.943a.121.121 0 0 1 .114-.012l8.048 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.647-1.13zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.048-4.648a7.498 7.498 0 0 1 11.135 7.767zm-21.063 6.929l-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225zm1.829-3.943l4.33-2.501 4.332 2.497v4.998l-4.331 2.5-4.331-2.5V18z" fill="currentColor"/>
    </svg>
  );
}

export function AnthropicLogo({ size = 20, className = "" }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0H10.2L16.77 20h-3.603L6.57 3.52zM0 20l6.57-16.48h3.603L3.603 20H0z" fill="currentColor"/>
    </svg>
  );
}

export function MetaLogo({ size = 20, className = "" }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973.14.604.35 1.094.614 1.444.264.35.588.524.985.524.36 0 .734-.143 1.208-.44a15.31 15.31 0 0 0 1.34-1.014 20.05 20.05 0 0 0 1.468-1.55c.48-.57.97-1.14 1.468-1.712.498-.571.97-1.142 1.468-1.712.497-.57.988-1.14 1.468-1.712.48-.57.97-1.142 1.455-1.7.488-.555.97-1.08 1.455-1.578.485-.498.97-.955 1.468-1.37.498-.416.994-.8 1.455-1.113.466-.307.95-.55 1.42-.7.473-.149.948-.21 1.468-.21 1.46 0 2.607.646 3.456 1.937.849 1.291 1.273 3.04 1.273 5.247 0 .846-.073 1.629-.22 2.346-.147.717-.36 1.35-.634 1.896a4.52 4.52 0 0 1-1.02 1.4c-.4.375-.858.666-1.37.869-.515.202-1.07.303-1.663.303-.498 0-.964-.1-1.4-.303a4.02 4.02 0 0 1-1.154-.8 6.66 6.66 0 0 1-.94-1.223 9.38 9.38 0 0 1-.68-1.55 9.77 9.77 0 0 1-.4-1.786 13.13 13.13 0 0 1-.133-1.921c0-1.103.103-2.033.31-2.79.207-.757.497-1.35.87-1.78.372-.43.798-.705 1.28-.826.48-.12.985-.12 1.503 0 .52.12.99.415 1.41.882.42.468.74 1.11.956 1.927.218.817.327 1.837.327 3.06 0 .81-.065 1.57-.196 2.278a8.22 8.22 0 0 1-.56 1.87 5.14 5.14 0 0 1-.88 1.38c-.342.378-.73.668-1.168.867-.438.2-.91.3-1.416.3-.545 0-1.023-.108-1.432-.325a3.09 3.09 0 0 1-.975-.876 3.87 3.87 0 0 1-.566-1.268 5.88 5.88 0 0 1-.183-1.49c0-.633.07-1.217.213-1.75.142-.534.35-.993.62-1.376.272-.384.6-.672.985-.866.384-.194.81-.29 1.28-.29.525 0 .972.127 1.342.38.37.252.655.605.856 1.058.2.454.3.993.3 1.617 0 .526-.068 1.012-.203 1.458a3.63 3.63 0 0 1-.565 1.123 2.44 2.44 0 0 1-.863.717c-.334.163-.706.244-1.116.244-.46 0-.85-.1-1.17-.3-.32-.2-.567-.478-.74-.834a2.76 2.76 0 0 1-.258-1.198c0-.461.083-.878.248-1.252.166-.374.4-.668.702-.882.302-.214.65-.32 1.046-.32.36 0 .666.087.916.26.25.173.444.415.58.726.136.31.204.67.204 1.076 0 .35-.052.676-.155.978a2.16 2.16 0 0 1-.435.75 1.75 1.75 0 0 1-.642.46c-.24.1-.5.15-.782.15-.316 0-.587-.063-.81-.19a1.47 1.47 0 0 1-.538-.53 1.55 1.55 0 0 1-.193-.768z" fill="currentColor"/>
    </svg>
  );
}

export function GoogleGemmaLogo({ size = 20, className = "" }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export function MistralLogo({ size = 20, className = "" }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="2" y="2" width="4.5" height="4.5" fill="#F7631B"/>
      <rect x="8.5" y="2" width="4.5" height="4.5" fill="#F7631B"/>
      <rect x="15" y="2" width="7" height="4.5" fill="#F7631B"/>
      <rect x="2" y="8.5" width="4.5" height="4.5" fill="#333"/>
      <rect x="8.5" y="8.5" width="4.5" height="4.5" fill="#F7631B"/>
      <rect x="15" y="8.5" width="4.5" height="4.5" fill="#333"/>
      <rect x="2" y="15" width="4.5" height="7" fill="#F7631B"/>
      <rect x="8.5" y="17.5" width="4.5" height="4.5" fill="#F7631B"/>
      <rect x="15" y="17.5" width="7" height="4.5" fill="#F7631B"/>
    </svg>
  );
}

export function CloudflareLogo({ size = 20, className = "" }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 109 44" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M72.67 21.14L71.4 20.5c-.11-.04-.22-.07-.33-.07H25.8c-.39 0-.71.32-.71.71v6.48c0 .39.32.71.71.71h45.5c.11 0 .22-.02.32-.07l1.27-.64c.63-.32.63-1.22-.02-1.54l-.21-.11v-.97l.21-.11c.65-.33.65-1.22.01-1.55z" fill="#F6821F"/>
      <path d="M70.36 23.35l-.64-.33H27.17c-.32 0-.58.26-.58.58v5.22c0 .32.26.58.58.58h42.55c.09 0 .18-.02.27-.06l1.03-.52c.52-.26.52-.98 0-1.24l-.17-.09v-.79l.17-.09c.52-.26.52-.98 0-1.24l-.64-.02z" fill="#FBAD41"/>
      <path d="M52.5 7C46.47 7 41.5 11.97 41.5 18c0 .67.07 1.32.18 1.96H28.3c-4.83 0-8.76 3.93-8.76 8.76 0 4.83 3.93 8.76 8.76 8.76h48.57c5.25 0 9.5-4.26 9.5-9.5 0-4.71-3.44-8.63-7.96-9.39.04-.38.07-.77.07-1.16C78.48 11.21 75.94 7 72.04 7 70.12 7 68.38 7.78 67.1 9.05 65.04 7.75 62.61 7 59.99 7c-2.5 0-4.84.69-6.81 1.87C52.87 8.62 52.69 7 52.5 7z" fill="#F6821F"/>
    </svg>
  );
}

export function DeepSeekLogo({ size = 20, className = "" }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="12" cy="12" r="10" fill="#4D6BFE"/>
      <path d="M7.5 9.5c0-1.38 1.12-2.5 2.5-2.5h4c1.38 0 2.5 1.12 2.5 2.5v2c0 .83-.4 1.57-1.03 2.02L17 16.5H7l1.53-3.08A2.5 2.5 0 0 1 7.5 11.5V9.5z" fill="white"/>
      <circle cx="10" cy="10" r="1" fill="#4D6BFE"/>
      <circle cx="14" cy="10" r="1" fill="#4D6BFE"/>
    </svg>
  );
}

export function QwenLogo({ size = 20, className = "" }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="12" cy="12" r="10" fill="#615EF0"/>
      <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white" fontFamily="sans-serif">Q</text>
    </svg>
  );
}

export function XAILogo({ size = 20, className = "" }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M17.3 3L12 10.3 6.7 3H3l7.4 10L3 21h3.7l5.3-7.3 5.3 7.3H21l-7.4-10L21 3h-3.7z" fill="currentColor"/>
    </svg>
  );
}

export function LlamaLogo({ size = 20, className = "" }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="24" height="24" rx="4" fill="#0064E0"/>
      <text x="12" y="16.5" textAnchor="middle" fontSize="10" fontWeight="900" fill="white" fontFamily="sans-serif">META</text>
    </svg>
  );
}

export function CerebrasLogo({ size = 20, className = "" }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="12" cy="12" r="10" fill="#FF5C35"/>
      <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white" fontFamily="sans-serif">CS</text>
    </svg>
  );
}

export function NjirlaLogo({ size = 20, className = "" }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="nj-grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8B5CF6"/>
          <stop offset="100%" stopColor="#3B82F6"/>
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#nj-grad)"/>
      <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="900" fill="white" fontFamily="sans-serif">N</text>
    </svg>
  );
}

export function getProviderLogo(provider: string, size = 16): React.ReactNode {
  const p = provider.toLowerCase();
  if (p.includes("openai") || p.includes("gpt") || p.includes("o3") || p.includes("o4")) return <OpenAILogo size={size} />;
  if (p.includes("anthropic") || p.includes("claude")) return <AnthropicLogo size={size} />;
  if (p.includes("meta") || p.includes("llama")) return <LlamaLogo size={size} />;
  if (p.includes("google") || p.includes("gemini") || p.includes("gemma")) return <GoogleGemmaLogo size={size} />;
  if (p.includes("mistral") || p.includes("mixtral")) return <MistralLogo size={size} />;
  if (p.includes("cloudflare") || p.includes("cf/")) return <CloudflareLogo size={size} />;
  if (p.includes("deepseek")) return <DeepSeekLogo size={size} />;
  if (p.includes("qwen") || p.includes("alibaba")) return <QwenLogo size={size} />;
  if (p.includes("xai") || p.includes("grok")) return <XAILogo size={size} />;
  if (p.includes("cerebras")) return <CerebrasLogo size={size} />;
  return <NjirlaLogo size={size} />;
}
