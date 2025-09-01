import { Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

function ModelStrip(props: { models: string[] }) {
  const { models } = props;
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="text-primary h-4 w-4" />
          Models available
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {models.map((m) => (
          <Badge key={m} variant="secondary" className="text-xs">
            {m}
          </Badge>
        ))}
        <span className="text-muted-foreground text-xs">
          and more as they’re added
        </span>
      </CardContent>
    </Card>
  );
}

export { ModelStrip };
