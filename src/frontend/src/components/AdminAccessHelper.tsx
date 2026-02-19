import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldAlert, Copy, CheckCircle2, Info, Terminal, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useInitializeAccessControl, useAssignUserRole } from '../hooks/useQueries';
import { UserRole } from '../backend';

export default function AdminAccessHelper() {
  const { identity } = useInternetIdentity();
  const [copied, setCopied] = useState(false);
  const [targetPrincipal, setTargetPrincipal] = useState('');
  
  const initializeAccessControl = useInitializeAccessControl();
  const assignUserRole = useAssignUserRole();

  const principalId = identity?.getPrincipal().toString() || '';

  const handleCopyPrincipal = () => {
    navigator.clipboard.writeText(principalId);
    setCopied(true);
    toast.success('Principal ID copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaimAdmin = async () => {
    try {
      await initializeAccessControl.mutateAsync();
    } catch (error: any) {
      // Error is already handled by the mutation
      console.error('Failed to claim admin:', error);
    }
  };

  const handleAssignRole = async () => {
    if (!targetPrincipal.trim()) {
      toast.error('Please enter a principal ID');
      return;
    }
    
    try {
      await assignUserRole.mutateAsync({
        principal: targetPrincipal.trim(),
        role: UserRole.admin,
      });
      setTargetPrincipal('');
    } catch (error: any) {
      // Error is already handled by the mutation
      console.error('Failed to assign role:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Alert className="border-accent/50">
        <ShieldAlert className="h-5 w-5 text-accent" />
        <AlertTitle className="text-lg">Admin Access Required</AlertTitle>
        <AlertDescription className="text-base">
          You need admin privileges to access this section. Follow the instructions below to gain admin access.
        </AlertDescription>
      </Alert>

      <Card>
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
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyPrincipal}
                className="flex-shrink-0"
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-accent" />
            Claim Admin Access
          </CardTitle>
          <CardDescription>
            If no admin exists yet, you can claim admin access for yourself
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Click the button below to attempt to claim admin access. This will only work if no admin has been assigned yet.
          </p>
          <Button
            onClick={handleClaimAdmin}
            disabled={initializeAccessControl.isPending}
            className="w-full"
          >
            {initializeAccessControl.isPending ? 'Claiming...' : 'Claim Admin Access'}
          </Button>
          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <Info className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-xs">
              <strong>Note:</strong> If an admin already exists, this will fail with an error message.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card className="border-blue-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-400">
            <Terminal className="h-5 w-5" />
            Assign Admin Role (Admin Only)
          </CardTitle>
          <CardDescription>
            If you are already an admin, you can assign admin role to another user
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="targetPrincipal">Target Principal ID</Label>
            <Input
              id="targetPrincipal"
              value={targetPrincipal}
              onChange={(e) => setTargetPrincipal(e.target.value)}
              placeholder="Enter principal ID to make admin"
              className="font-mono text-sm"
            />
          </div>
          <Button
            onClick={handleAssignRole}
            disabled={assignUserRole.isPending || !targetPrincipal.trim()}
            className="w-full"
          >
            {assignUserRole.isPending ? 'Assigning...' : 'Assign Admin Role'}
          </Button>
          <Alert className="border-blue-500/50 bg-blue-500/10">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-xs">
              <strong>Important:</strong> Only existing admins can assign roles to other users.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card className="border-gray-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Alternative: Use dfx Command Line
          </CardTitle>
          <CardDescription>For developers with terminal access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            If you have access to the dfx command line tool, you can assign admin role directly:
          </p>
          <code className="block rounded-lg bg-muted p-3 font-mono text-xs overflow-x-auto">
            {`dfx canister call backend assignCallerUserRole '(principal "${principalId}", variant { admin })'`}
          </code>
          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <Info className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-xs">
              <strong>Note:</strong> Run this command from your terminal where you have dfx installed and the project deployed.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
