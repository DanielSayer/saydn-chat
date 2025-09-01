import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

function SignedOutCTA() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 p-4 text-center md:p-6">
        <p className="text-muted-foreground text-sm">
          Sign in to ask a quick question or jump straight into the app.
        </p>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link to="/auth/sign-in">Sign in</Link>
          </Button>
          <Button variant="secondary" asChild>
            <a href="/chat">Open app</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export { SignedOutCTA };
