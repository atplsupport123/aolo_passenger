import React from 'react';
import CorporateApp from './corporate/CorporateApp';

interface CorporateScreenProps {
  onClose?: () => void;
}

export default function CorporateScreen({ onClose }: CorporateScreenProps) {
  return <CorporateApp onClose={onClose} />;
}
