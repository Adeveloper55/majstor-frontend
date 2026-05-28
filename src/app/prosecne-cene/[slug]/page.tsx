import { CategoryLanding } from "@/components/category/CategoryLanding";
import { SERVICE_CATEGORIES } from "@/constants/categories";

export function generateStaticParams() {
  return SERVICE_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export default function ProsecneCeneCategoryPage({ params }: { params: { slug: string } }) {
  return <CategoryLanding slug={params.slug} variant="prosecne-cene" />;
}
