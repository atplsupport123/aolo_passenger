import React from 'react';
import CorporateComponent from '../components/CorporateScreen';

interface CorporateScreenProps {
  navigation?: {
    goBack: () => void;
  };
}

export default function CorporateScreen({ navigation }: CorporateScreenProps) {
  return <CorporateComponent onClose={() => navigation?.goBack?.()} />;
}
