import { Doc } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { useState } from "react";

interface DesignGridProps {
  designs: Doc<"designs">[];
  onDesignClick: (designId: string, event: React.MouseEvent) => void;
}

export default function DesignGrid({
  designs,
  onDesignClick,
}: DesignGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {designs.map((design) => (
        <DesignCard key={design._id} design={design} onClick={onDesignClick} />
      ))}
    </div>
  );
}

function DesignCard({
  design,
  onClick,
}: {
  design: Doc<"designs">;
  onClick: (designId: string, event: React.MouseEvent) => void;
}) {
  const [imgSrc, setImgSrc] = useState(
    design.thumbnailUrl || "/placeholder.jpg",
  );

  return (
    <div
      className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-gray-700 cursor-pointer"
      onClick={(e) => onClick(design._id, e)}
    >
      <Image
        src={imgSrc}
        alt={`Design ${design._id}`}
        width={300}
        height={300}
        className="object-cover w-full h-48"
        onError={() => setImgSrc("/placeholder.jpg")}
      />
      <div className="p-2">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {design.platform}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(design._creationTime).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
