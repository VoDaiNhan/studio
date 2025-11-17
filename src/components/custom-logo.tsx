'use client';

import { useEffect, useState } from 'react';
import { getAppearanceConfig } from '@/app/actions/appearance';
import { Scale } from 'lucide-react';

export function CustomLogo({ className = "h-6 w-6" }: { className?: string }) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState<string>('#3B82F6');

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const config = await getAppearanceConfig();
        setPrimaryColor(config.primaryColor);
        if (config.logoUrl) {
          setLogoUrl(config.logoUrl);
        }
      } catch (error) {
        console.error('Error loading logo:', error);
      }
    };
    loadLogo();
  }, []);

  if (logoUrl) {
    return <img src={logoUrl} alt="Logo" className={className} />;
  }

  return <Scale className={className} style={{ color: primaryColor }} />;
}
