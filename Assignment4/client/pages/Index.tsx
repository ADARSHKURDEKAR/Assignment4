import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Field {
  id: string;
  name: string;
  type: string;
  children?: Field[];
}

function SchemaBuilder() {
  const [fields, setFields] = useState<Field[]>([
    { id: "1", name: "name", type: "String" },
  ]);
  const [activeTab, setActiveTab] = useState("builder");

  function addField(parentId?: string) {
    const newField = {
      id: Date.now().toString(),
      name: "field" + Date.now(),
      type: "String",
    };

    if (parentId) {
      setFields(
        fields.map((field) => {
          if (field.id === parentId) {
            return {
              ...field,
              children: [...(field.children || []), newField],
            };
          }
          return field;
        }),
      );
    } else {
      setFields([...fields, newField]);
    }
  }

  function deleteField(fieldId: string, parentId?: string) {
    if (parentId) {
      setFields(
        fields.map((field) => {
          if (field.id === parentId) {
            return {
              ...field,
              children: (field.children || []).filter((f) => f.id !== fieldId),
            };
          }
          return field;
        }),
      );
    } else {
      setFields(fields.filter((f) => f.id !== fieldId));
    }
  }

  function updateFieldName(
    fieldId: string,
    newName: string,
    parentId?: string,
  ) {
    if (parentId) {
      setFields(
        fields.map((field) => {
          if (field.id === parentId) {
            return {
              ...field,
              children: (field.children || []).map((f) =>
                f.id === fieldId ? { ...f, name: newName } : f,
              ),
            };
          }
          return field;
        }),
      );
    } else {
      setFields(
        fields.map((f) => (f.id === fieldId ? { ...f, name: newName } : f)),
      );
    }
  }

  function updateFieldType(
    fieldId: string,
    newType: string,
    parentId?: string,
  ) {
    if (parentId) {
      setFields(
        fields.map((field) => {
          if (field.id === parentId) {
            return {
              ...field,
              children: (field.children || []).map((f) => {
                if (f.id === fieldId) {
                  if (newType === "Nested") {
                    return { ...f, type: newType, children: [] };
                  } else {
                    const updated = { ...f, type: newType };
                    delete updated.children;
                    return updated;
                  }
                }
                return f;
              }),
            };
          }
          return field;
        }),
      );
    } else {
      setFields(
        fields.map((f) => {
          if (f.id === fieldId) {
            if (newType === "Nested") {
              return { ...f, type: newType, children: [] };
            } else {
              const updated = { ...f, type: newType };
              delete updated.children;
              return updated;
            }
          }
          return f;
        }),
      );
    }
  }

  function generateJSON(fieldList: Field[]): any {
    const result: any = {};

    fieldList.forEach((field) => {
      if (field.type === "String") {
        result[field.name] = "sample_string";
      } else if (field.type === "Number") {
        result[field.name] = 42;
      } else if (field.type === "Boolean") {
        result[field.name] = true;
      } else if (field.type === "Float") {
        result[field.name] = 3.14;
      } else if (field.type === "ObjectId") {
        result[field.name] = "507f1f77bcf86cd799439011";
      } else if (field.type === "Nested") {
        if (field.children && field.children.length > 0) {
          result[field.name] = generateJSON(field.children);
        } else {
          result[field.name] = {};
        }
      }
    });

    return result;
  }

  function renderField(field: Field, parentId?: string) {
    return (
      <Card key={field.id} className="mb-4 border border-gray-200">
        <CardContent className="pt-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Field Name
              </label>
              <Input
                value={field.name}
                onChange={(e) =>
                  updateFieldName(field.id, e.target.value, parentId)
                }
                className="w-full"
                placeholder="Enter field name"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Type
              </label>
              <Select
                value={field.type}
                onValueChange={(value) =>
                  updateFieldType(field.id, value, parentId)
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="String">string</SelectItem>
                  <SelectItem value="Number">number</SelectItem>
                  <SelectItem value="Boolean">boolean</SelectItem>
                  <SelectItem value="Float">float</SelectItem>
                  <SelectItem value="ObjectId">objectId</SelectItem>
                  <SelectItem value="Nested">nested</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-6">
              <Button
                variant="destructive"
                onClick={() => deleteField(field.id, parentId)}
                size="sm"
              >
                Delete
              </Button>
            </div>
          </div>

          {field.type === "Nested" && (
            <div className="mt-4 ml-6 p-4 bg-gray-50 border border-gray-200 rounded">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">
                  Nested Fields
                </span>
                <Button
                  onClick={() => addField(field.id)}
                  size="sm"
                  variant="outline"
                >
                  Add Nested Field
                </Button>
              </div>
              {field.children?.map((child) => renderField(child, field.id))}
              {(!field.children || field.children.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No nested fields yet
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-blue-50 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          JSON Schema Builder
        </h1>
        <p className="text-gray-600">
          Build JSON schemas by adding fields dynamically
        </p>
      </div>

      <div className="mb-6 flex justify-center gap-2">
        <Button
          variant={activeTab === "builder" ? "default" : "outline"}
          onClick={() => setActiveTab("builder")}
        >
          Schema Builder
        </Button>
        <Button
          variant={activeTab === "json" ? "default" : "outline"}
          onClick={() => setActiveTab("json")}
        >
          JSON Preview
        </Button>
      </div>

      {activeTab === "builder" && (
        <div>
          <div className="mb-6 text-center">
            <Button
              onClick={() => addField()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add Field
            </Button>
          </div>

          <div>
            {fields.map((field) => renderField(field))}
            {fields.length === 0 && (
              <Card className="text-center py-8">
                <CardContent>
                  <p className="text-gray-500 mb-4">No fields yet</p>
                  <Button onClick={() => addField()}>
                    Add Your First Field
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {activeTab === "json" && (
        <Card>
          <CardHeader>
            <CardTitle>Generated JSON</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto border">
              {JSON.stringify(generateJSON(fields), null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default SchemaBuilder;
