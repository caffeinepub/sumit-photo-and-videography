import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldAlert, Copy, CheckCircle2, Info, RefreshCw, Terminal } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminAccessHelper() {
  const { identity, clear } = useInternetIdentity();
  const [copied, setCopied] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const principalId = identity?.getPrincipal().toString() || '';

  // Known admin principal for Sumit (this should match the backend initialization)
  const sumitPrincipal = 'YOUR_SUMIT_PRINCIPAL_HERE'; // Replace with actual principal

  const handleCopyPrincipal = () => {
    navigator.clipboard.writeText(principalId);
    setCopied(true);
    toast.success('Principal ID copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCommand = () => {
    const command = `dfx canister call backend assignCallerUserRole '(principal "${principalId}", variant { admin })'`;
    navigator.clipboard.writeText(command);
    setCopiedCommand(true);
    toast.success('Command copied to clipboard');
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  const handleReInitialize = async () => {
    toast.info('Logging out to re-initialize...');
    await clear();
    toast.info('Please add ?caffeineAdminToken=YOUR_SECRET to the URL and log in again');
  };

  return (
    <div className="space-y-6">
      <Alert className="glass-strong border-accent/50">
        <ShieldAlert className="h-5 w-5 text-accent" />
        <AlertTitle className="text-lg">Admin Access Required</AlertTitle>
        <AlertDescription className="text-base">
          You need admin privileges to access this section. Follow the instructions below to gain admin access.
        </AlertDescription>
      </Alert>

      <Card className="glass-strong">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-accent" />
            Your Principal ID
          </CardTitle>
          <CardDescription>This is your unique identifier on the Internet Computer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="principal">Principal ID</Label>
            <div className="flex gap-2">
              <Input
                id="principal"
                value={principalId}
                readOnly
                className="font-mono text-sm glass"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyPrincipal}
                className="glass flex-shrink-0"
              >
                {copied ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-strong">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-accent" />
            How to Gain Admin Access
          </CardTitle>
          <CardDescription>Follow these steps to become an administrator</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-accent/20 text-sm font-bold text-accent">
                1
              </div>
              <div>
                <p className="font-semibold mb-1">Copy your Principal ID</p>
                <p className="text-sm text-muted-foreground">
                  Use the copy button above to copy your principal ID to the clipboard.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-accent/20 text-sm font-bold text-accent">
                2
              </div>
              <div>
                <p className="font-semibold mb-1">Contact the System Administrator</p>
                <p className="text-sm text-muted-foreground">
                  Share your principal ID with the person who deployed this application. They can assign you admin privileges using the backend canister.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-accent/20 text-sm font-bold text-accent">
                3
              </div>
              <div>
                <p className="font-semibold mb-1">Alternative: Use Admin Token (Advanced)</p>
                <p className="text-sm text-muted-foreground mb-2">
                  If you have the admin secret token, you can re-initialize the access control system.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowInstructions(!showInstructions)}
                  className="glass"
                >
                  {showInstructions ? 'Hide' : 'Show'} Advanced Instructions
                </Button>
              </div>
            </div>

            {showInstructions && (
              <div className="ml-10 space-y-3 rounded-lg border border-accent/30 bg-accent/5 p-4">
                <p className="text-sm font-semibold text-accent">Advanced Method:</p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Log out from your current session</li>
                  <li>Add <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">?caffeineAdminToken=YOUR_SECRET</code> to the URL</li>
                  <li>Log in again with Internet Identity</li>
                  <li>You will be assigned as the admin automatically</li>
                </ol>
                <Alert className="mt-3 border-amber-500/50 bg-amber-500/10">
                  <Info className="h-4 w-4 text-amber-500" />
                  <AlertDescription className="text-xs text-amber-200">
                    <strong>Note:</strong> The admin token is set during canister deployment. If you don't have it, contact the system administrator.
                  </AlertDescription>
                </Alert>
                <Button
                  variant="outline"
                  onClick={handleReInitialize}
                  className="w-full glass mt-3"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Log Out to Re-Initialize
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-strong border-blue-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-400">
            <Terminal className="h-5 w-5" />
            For Developers
          </CardTitle>
          <CardDescription>Use these commands to assign admin privileges via dfx</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">
                Assign Admin Role Command:
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyCommand}
                className="h-8"
              >
                {copiedCommand ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <code className="block rounded-lg bg-muted p-3 font-mono text-xs overflow-x-auto">
              {`dfx canister call backend assignCallerUserRole '(principal "${principalId}", variant { admin })'`}
            </code>
          </div>
          
          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <Info className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-xs text-yellow-200">
              <strong>Important:</strong> Run this command from your terminal where you have dfx installed and the project deployed.
            </AlertDescription>
          </Alert>

          <div className="space-y-2 pt-2 border-t border-border/50">
            <p className="text-sm font-semibold">
              Restore Sumit's Admin Access:
            </p>
            <p className="text-xs text-muted-foreground mb-2">
              If Sumit needs to regain admin access, use this command with Sumit's principal ID:
            </p>
            <code className="block rounded-lg bg-muted p-3 font-mono text-xs overflow-x-auto">
              {`dfx canister call backend assignCallerUserRole '(principal "SUMIT_PRINCIPAL_ID", variant { admin })'`}
            </code>
            <p className="text-xs text-muted-foreground mt-2">
              Replace <code className="rounded bg-muted px-1 py-0.5">SUMIT_PRINCIPAL_ID</code> with Sumit's actual principal ID.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

