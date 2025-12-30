import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Database, Trash2, Edit, Loader2, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface DbIssue {
  id: string;
  image_url: string;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
  area: string | null;
  city: string | null;
  status: string;
  likes: number;
  reports: number;
  assigned_to: string | null;
  created_at: string;
  user_id: string | null;
}

interface EditFormData {
  category: string;
  description: string;
  status: string;
  likes: number;
  reports: number;
}

const AdminDashboard = () => {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const navigate = useNavigate();

  const [issues, setIssues] = useState<DbIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingIssue, setEditingIssue] = useState<DbIssue | null>(null);
  const [editForm, setEditForm] = useState<EditFormData>({
    category: '',
    description: '',
    status: '',
    likes: 0,
    reports: 0,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !adminLoading) {
      if (!user || !isAdmin) {
        navigate('/');
        return;
      }
      fetchIssues();
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate]);

  const fetchIssues = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load issues');
      console.error(error);
    } else {
      setIssues(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('issues').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete issue');
      console.error(error);
    } else {
      toast.success('Issue deleted successfully');
      setIssues((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const openEditDialog = (issue: DbIssue) => {
    setEditingIssue(issue);
    setEditForm({
      category: issue.category,
      description: issue.description,
      status: issue.status,
      likes: issue.likes,
      reports: issue.reports,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingIssue) return;

    setSaving(true);
    const { error } = await supabase
      .from('issues')
      .update({
        category: editForm.category,
        description: editForm.description,
        status: editForm.status,
        likes: editForm.likes,
        reports: editForm.reports,
      })
      .eq('id', editingIssue.id);

    if (error) {
      toast.error('Failed to update issue');
      console.error(error);
    } else {
      toast.success('Issue updated successfully');
      setIssues((prev) =>
        prev.map((i) =>
          i.id === editingIssue.id
            ? { ...i, ...editForm }
            : i
        )
      );
      setEditingIssue(null);
    }
    setSaving(false);
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800',
    inProgress: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
  };

  const categoryOptions = [
    'pothole',
    'streetlight',
    'garbage',
    'graffiti',
    'sidewalk',
    'drainage',
    'other',
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-6">
        <div className="container">
          <Card>
            <CardHeader className="border-b bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Admin Dashboard - Issues Database
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : issues.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  No issues in the database.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20">Image</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="max-w-[200px]">Description</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Likes</TableHead>
                        <TableHead className="text-center">Reports</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {issues.map((issue) => (
                        <TableRow key={issue.id}>
                          <TableCell>
                            <img
                              src={issue.image_url}
                              alt={issue.category}
                              className="h-12 w-16 object-cover rounded"
                            />
                          </TableCell>
                          <TableCell className="capitalize font-medium">
                            {issue.category}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {issue.description}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span>
                                {issue.area && issue.city
                                  ? `${issue.area}, ${issue.city}`
                                  : `${issue.latitude.toFixed(4)}, ${issue.longitude.toFixed(4)}`}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={statusColors[issue.status] || 'bg-gray-100'}>
                              {t(issue.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">{issue.likes}</TableCell>
                          <TableCell className="text-center">{issue.reports}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(issue.created_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog(issue)}
                                className="h-8 w-8"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Issue?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the
                                      issue from the database.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(issue.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={!!editingIssue} onOpenChange={(open) => !open && setEditingIssue(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Issue</DialogTitle>
            <DialogDescription>
              Update the issue details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={editForm.category}
                onValueChange={(val) => setEditForm({ ...editForm, category: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat} value={cat} className="capitalize">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(val) => setEditForm({ ...editForm, status: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inProgress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="likes">Likes</Label>
                <Input
                  id="likes"
                  type="number"
                  min="0"
                  value={editForm.likes}
                  onChange={(e) => setEditForm({ ...editForm, likes: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reports">Reports</Label>
                <Input
                  id="reports"
                  type="number"
                  min="0"
                  value={editForm.reports}
                  onChange={(e) => setEditForm({ ...editForm, reports: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingIssue(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
