"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw } from "lucide-react";

const blogCategories = [
  "Technology",
  "Health",
  "Finance",
  "Travel",
  "Education",
  "Entertainment",
  "Study",
];

const AddBlog = () => {
  const handleSubmit = () => {};
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Add New Blog</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Label>Title</Label>
            <div className="flex justify-center items-center gap-2">
              <Input name="title" required />
              <Button type="button">
                <RefreshCw />
              </Button>
            </div>
            <Label>Description</Label>
            <div className="flex justify-center items-center gap-2">
              <Input name="description" required />
              <Button type="button">
                <RefreshCw />
              </Button>
            </div>

            <Label>Category</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={"Select category"} />
              </SelectTrigger>
              <SelectContent>
                {blogCategories.map((e, i) => (
                  <SelectItem key={i} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div>
              <Label>Image Upload</Label>
              <Input type="file" accept="image/*" />
            </div>

            <div>
              <Label>Blog Content</Label>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-muted-foreground">
                  Paste you blog or type here. You can use rich text formatting.
                  Please add image after improving your grammar.
                </p>
                <Button type="button" size={"sm"}>
                  <RefreshCw size={16} />
                  <span className="ml-2">Fix Grammar</span>
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBlog;
