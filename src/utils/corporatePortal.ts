import { Platform } from 'react-native';

/** Open the corporate web experience as its own full-window app. */
export function openCorporatePortalInNewTab(): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return false;

  const portalUrl = new URL(window.location.href);
  portalUrl.searchParams.set('corporate', '1');
  const portalWindow = window.open(portalUrl.toString(), '_blank');
  return portalWindow !== null;
}
