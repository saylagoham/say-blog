import { getCategories } from "@/lib/posts";
import CategoryManager from "@/components/admin/CategoryManager";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  return <CategoryManager categories={categories} />;
}
