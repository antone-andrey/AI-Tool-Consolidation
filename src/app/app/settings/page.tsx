import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteAccountAction } from "@/lib/actions/auth";

export default async function SettingsPage() {
  const session = await getServerSession(authConfig);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Account settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile and workspace access.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Name: {session?.user?.name ?? "—"}</p>
          <p className="text-sm">Email: {session?.user?.email ?? "—"}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={deleteAccountAction}>
            <Button variant="outline" type="submit">
              Delete account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
