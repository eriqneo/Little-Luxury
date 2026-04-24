import logoImg from '../assets/images/logo.png';

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <img 
      src={logoImg} 
      alt="Little Luxury Logo" 
      className={`w-[70px] h-[70px] rounded-full object-cover ${className}`}
    />
  );
}
