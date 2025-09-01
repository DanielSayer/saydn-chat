import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

function FeatureCard(props: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  body: string;
}) {
  const { icon: Icon, title, body } = props;
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="text-primary h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        {body}
      </CardContent>
    </Card>
  );
}

export { FeatureCard };
