import Link from "next/link";

interface CalculatorCardProps {
  name: string;
  description: string;
  url: string;
  category: string;
}

export default function CalculatorCard({ name, description, url, category }: CalculatorCardProps) {
  return (
    <Link href={url}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer h-full">
        {/* Category Badge */}
        <span className="inline-block px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full mb-3">
          {category}
        </span>
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {name}
        </h3>
        
        {/* Description */}
        <p className="text-gray-500 text-sm">
          {description}
        </p>
      </div>
    </Link>
  );
}
