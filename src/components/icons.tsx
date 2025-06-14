
import type { LucideProps } from 'lucide-react';
import { AlertTriangle, Award, BarChart2, ChevronDown, ChevronUp, Download, MapPin, Phone, Search, Star, TrendingUp, User, Users, X } from 'lucide-react';

export const Icons = {
  AlertTriangle,
  Award,
  BarChart2,
  ChevronDown,
  ChevronUp,
  Download,
  MapPin,
  Phone,
  Search,
  Star,
  TrendingUp,
  User,
  Users,
  Spinner: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  X,
};

export type Icon = keyof typeof Icons;
