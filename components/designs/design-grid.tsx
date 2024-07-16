import { Doc } from "@/convex/_generated/dataModel";
import Image from "next/image";
import Link from "next/link";

interface DesignGridProps {
  designs: Doc<"designs">[];
}

export default function DesignGrid({ designs }: DesignGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {designs.map((design) => (
        <Link key={design._id} href={`/designs/${design._id}`}>
          <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <Image
              src={design.thumbnailUrl || "/placeholder.jpg"}
              alt={`Design ${design._id}`}
              width={300}
              height={300}
              className="object-cover w-full h-48"
            />
            <div className="p-2">
              <p className="text-sm font-semibold">{design.platform}</p>
              <p className="text-xs text-gray-500">
                {new Date(design._creationTime).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
