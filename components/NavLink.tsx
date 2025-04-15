'use client';

import { motion } from 'framer-motion';

interface NavItem {
  name: string;
  href: string;
}

interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function NavLink({ item, isActive, onClick }: NavLinkProps) {
  return (
    <motion.div whileHover={{ scale: 1.05 }}>
      <a
        href={item.href}
        onClick={onClick}
        className={`text-white hover:text-indigo-400 transition-colors font-bold relative py-1 ${
          isActive ? 'text-indigo-400' : ''
        }`}
      >
        {item.name}
        {isActive && (
          <motion.div
            layoutId="activeSection"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.3 }}
          />
        )}
      </a>
    </motion.div>
  );
} 