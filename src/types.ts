export type PlatformType =
  | 'Bing Image Creator'
  | 'ChatGPT'
  | 'Midjourney'
  | 'Gemini'
  | 'Web Scripts'
  | 'Web Script'
  | 'All';

export type BadgeType = 'Trending' | 'Hot' | 'Popular' | 'Free' | 'Pro' | 'New';

export interface PromptVariable {
  key: string;
  label: string;
  defaultValue: string;
  placeholder?: string;
  options?: string[];
}

export interface PromptItem {
  id: string;
  title: string;
  category: string;
  platform: PlatformType;
  promptText: string;
  previewImageUrl?: string;
  thumbnailUrl?: string;
  badge?: BadgeType;
  tags: string[];
  description?: string;
  variables?: PromptVariable[];
  directActionUrl?: string;
  actionType?: 'bing' | 'chatgpt' | 'download' | 'link';
  views: number;
  copies: number;
  likes?: number;
  featured?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  description?: string;
  color?: string;
}

export type AdNetwork =
  | 'Adsterra'
  | 'Monetag'
  | 'CPMBid'
  | 'HilltopAds'
  | 'Clickadu'
  | 'Custom';

export type AdPlacement =
  | 'header_banner'
  | 'in_feed_native'
  | 'under_prompt_modal'
  | 'sticky_footer'
  | 'direct_link_popunder'
  | 'sidebar_banner';

export interface AdSlot {
  id: string;
  name: string;
  placement: AdPlacement;
  network: AdNetwork;
  enabled: boolean;
  code: string; // Raw script, iframe, banner image link, or direct link
  codeSnippet?: string;
  bannerImageUrl?: string;
  targetUrl?: string;
  dimensions?: string; // e.g., '728x90', '300x250', 'Responsive'
  notes?: string;
  lastUpdated?: string;
}

export interface StoreSettings {
  siteName: string;
  tagline: string;
  announcementBar: {
    enabled: boolean;
    text: string;
    linkText?: string;
    linkUrl?: string;
  };
  telegramChannel?: string;
  whatsappGroup?: string;
  youtubeChannel?: string;
  contactEmail?: string;
  footerText: string;
  bingImageCreatorUrl: string;
  chatgptUrl: string;
  enableDirectLinkAdClick: boolean; // whether clicking external links routes through direct link
  enableGlobalAds: boolean;
}

export interface StoreData {
  prompts: PromptItem[];
  categories: Category[];
  adSlots: AdSlot[];
  settings: StoreSettings;
  lastUpdated: string;
  version: string;
}
