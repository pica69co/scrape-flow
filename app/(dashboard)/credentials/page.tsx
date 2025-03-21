import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { LockKeyholeIcon, ShieldIcon, ShieldOffIcon } from "lucide-react";
import React, { Suspense } from "react";
import { GetCredentialsForUser } from "@/actions/credentials/get-credentials-for-user";
import { Card } from "@/components/ui/card";
import { CreateCredentialDialog } from "./_components/create-credential-dialog";
import { formatDistanceToNow } from "date-fns";
import DeleteCredentialDialog from "./_components/delete-credential-dialog";

const CredentialsPage = () => {
  return (
    <div className="flex flex-1 flex-col h-full ml-2">
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Credentials</h1>
          <p className="text-muted-foreground">Manage your credentials here.</p>
        </div>
        <CreateCredentialDialog />
      </div>

      <div className="h-full py-6 space-y-8">
        <Alert>
          <ShieldIcon className="h-4 w-4 stroke-emerald-600" />
          <AlertTitle className="text-emerald-600">Encryption</AlertTitle>
          <AlertDescription>
            Your credentials are stored securely and encrypted, ensuring your
            data remains safe
          </AlertDescription>
        </Alert>

        <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
          <UserCredentials />
        </Suspense>
      </div>
    </div>
  );
};

export default CredentialsPage;

async function UserCredentials() {
  const credentials = await GetCredentialsForUser();
  if (!credentials) {
    return (
      <Alert variant="destructive">
        <ShieldIcon className="h-4 w-4" />
        <AlertTitle>Credentials not found</AlertTitle>
        <AlertDescription>
          You do not have any credentials stored. Please add some.
        </AlertDescription>
      </Alert>
    );
  }
  if (credentials.length === 0) {
    return (
      <Card className="w-full p-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-200">
            <ShieldOffIcon size={40} className="stroke-emerald-600" />
          </div>
          <div className="flex flex-col text-center gap-1">
            <p className="text-bold">No credentials created yet</p>
            <p className="text-sm text-muted-foreground">
              Click the button below to create your first credential
            </p>
          </div>
          <CreateCredentialDialog triggerText="Create your first credential" />
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {credentials.map((credential) => {
        const createdAt = formatDistanceToNow(credential.createdAt, {
          addSuffix: true,
        });
        return (
          <Card key={credential.id} className="w-full p-4 flex justify-between">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200/10">
                <LockKeyholeIcon size={18} className="stroke-emerald-600" />
              </div>
              <div>
                <p className="font-bold">{credential.name}</p>
                <p className="text-xs text-muted-foreground">{createdAt}</p>
              </div>
            </div>
            <DeleteCredentialDialog name={credential.name} />
          </Card>
        );
      })}
    </div>
  );
}
