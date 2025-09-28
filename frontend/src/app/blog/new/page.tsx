import { Card, CardContent, CardHeader } from "@/components/ui/card";

const AddBlog = () => {
  const handleSubmit = () => {};
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Add New Blog</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}></form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBlog;
