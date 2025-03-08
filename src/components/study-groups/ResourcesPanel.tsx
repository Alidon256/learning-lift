
import { StudyGroupResource } from "@/models/StudyGroup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, FileText, ExternalLink, FileType } from "lucide-react";
import { format } from "date-fns";

interface ResourcesPanelProps {
  resources: StudyGroupResource[];
}

const ResourcesPanel = ({ resources }: ResourcesPanelProps) => {
  if (resources.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            No resources have been shared yet
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Group resources by type
  const links = resources.filter(r => r.type === "link");
  const files = resources.filter(r => r.type === "file");
  const notes = resources.filter(r => r.type === "note");
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Resources</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {links.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-1">
                <Link className="h-4 w-4" />
                Helpful Links
              </h3>
              <div className="space-y-2">
                {links.map(resource => (
                  <LinkResource key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          )}
          
          {files.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Files & Documents
              </h3>
              <div className="space-y-2">
                {files.map(resource => (
                  <FileResource key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          )}
          
          {notes.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-1">
                <FileType className="h-4 w-4" />
                Study Notes
              </h3>
              <div className="space-y-2">
                {notes.map(resource => (
                  <NoteResource key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface ResourceItemProps {
  resource: StudyGroupResource;
}

const LinkResource = ({ resource }: ResourceItemProps) => {
  return (
    <a 
      href={resource.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block border rounded-lg p-3 hover:bg-muted/50 transition-colors"
    >
      <div className="flex justify-between items-start">
        <h4 className="font-medium flex items-center gap-1">
          {resource.title}
          <ExternalLink className="h-3 w-3 inline" />
        </h4>
        <Badge variant="outline">Link</Badge>
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        Added {format(new Date(resource.addedAt), "MMM d, yyyy")}
      </div>
    </a>
  );
};

const FileResource = ({ resource }: ResourceItemProps) => {
  return (
    <a 
      href={resource.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block border rounded-lg p-3 hover:bg-muted/50 transition-colors"
    >
      <div className="flex justify-between items-start">
        <h4 className="font-medium">{resource.title}</h4>
        <Badge variant="outline">File</Badge>
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        Added {format(new Date(resource.addedAt), "MMM d, yyyy")}
      </div>
    </a>
  );
};

const NoteResource = ({ resource }: ResourceItemProps) => {
  return (
    <div className="border rounded-lg p-3">
      <div className="flex justify-between items-start">
        <h4 className="font-medium">{resource.title}</h4>
        <Badge variant="outline">Note</Badge>
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        Added {format(new Date(resource.addedAt), "MMM d, yyyy")}
      </div>
    </div>
  );
};

export default ResourcesPanel;
