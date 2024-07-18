import { Doc } from "@/convex/_generated/dataModel";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface DesignGridProps {
  designs: Doc<"designs">[];
}

export default function DesignGrid({ designs }: DesignGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {designs.map((design) => (
        <Link key={design._id} href={`/designs/${design._id}`}>
          <DesignCard design={design} />
        </Link>
      ))}
    </div>
  );
}

function DesignCard({ design }: { design: Doc<"designs"> }) {
  const [imgSrc, setImgSrc] = useState(
    design.thumbnailUrl || "/placeholder.jpg",
  );

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-gray-700">
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
