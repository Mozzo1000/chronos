import * as Icons from 'lucide-preact';

export default function IconRenderer({ name, ...props }) {
  const IconComponent = Icons[name] || Icons.Activity; // Fallback to Activity
  return <IconComponent {...props} />;
}