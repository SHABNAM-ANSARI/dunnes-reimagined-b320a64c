import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LogOut, Mail, Phone, MessageSquare, RefreshCw, Eye, Send, Reply,
  Upload, Trash2, Image, X, Settings, Lock, AlertCircle, Megaphone, Save,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

// --- Types ---
interface HelpMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface GalleryPhoto {
  id: string;
  title: string | null;
  description: string | null;
  url: string;
  file_path: string;
  category: string;
  created_at: string;
}

interface SiteSetting {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

const categoryOptions = [
  { value: "events", label: "Events" },
  { value: "sports", label: "Sports" },
  { value: "cultural", label: "Cultural" },
  { value: "academics", label: "Academics" },
  { value: "celebrations", label: "Celebrations" },
  { value: "campus", label: "Campus Life" },
];

const statusOptions = ["pending", "in_progress", "resolved", "closed"];

// --- Login Gate ---
function PortalLogin({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, user, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && isAdmin) {
      onAuthenticated();
    }
  }, [user, isAdmin, loading, onAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!email || !password) {
      setError("Please enter both email and password");
      setIsSubmitting(false);
      return;
    }

    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError(signInError.message || "Invalid credentials");
      setIsSubmitting(false);
      return;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="font-heading text-2xl text-primary">Secure Portal</CardTitle>
          <CardDescription>Admin authentication required</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="portal-email">Email</Label>
              <Input id="portal-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portal-password">Password</Label>
              <Input id="portal-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isSubmitting} />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Authenticating..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Main Dashboard ---
export default function SecretPortal() {
  const [authenticated, setAuthenticated] = useState(false);
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [messages, setMessages] = useState<HelpMessage[]>([]);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSetting[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [selectedMessage, setSelectedMessage] = useState<HelpMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [isUploading, setIsUploading] = useState(false);
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoDescription, setPhotoDescription] = useState("");
  const [photoCategory, setPhotoCategory] = useState("events");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editedSettings, setEditedSettings] = useState<Record<string, string>>({});
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      setAuthenticated(true);
    }
  }, [user, isAdmin, authLoading]);

  useEffect(() => {
    if (authenticated) {
      fetchAllData();
    }
  }, [authenticated]);

  const fetchAllData = async () => {
    setDataLoading(true);
    await Promise.all([fetchMessages(), fetchPhotos(), fetchSettings()]);
    setDataLoading(false);
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase.from("help_messages").select("*").order("created_at", { ascending: false });
    if (!error) setMessages(data || []);
  };

  const fetchPhotos = async () => {
    const { data, error } = await supabase.from("gallery_photos").select("*").order("created_at", { ascending: false });
    if (!error) setPhotos(data || []);
  };

  const fetchSettings = async () => {
    const { data, error } = await supabase.from("site_settings").select("*").order("key");
    if (!error) {
      setSiteSettings(data || []);
      const mapped: Record<string, string> = {};
      data?.forEach((s: SiteSetting) => { mapped[s.key] = s.value; });
      setEditedSettings(mapped);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("help_messages").update({ status: newStatus }).eq("id", id);
    if (!error) {
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, status: newStatus } : m));
      if (selectedMessage?.id === id) setSelectedMessage((prev) => prev ? { ...prev, status: newStatus } : null);
      toast({ title: "Status Updated", description: `Marked as ${newStatus}` });
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Delete this enquiry permanently?")) return;
    const { error } = await supabase.from("help_messages").delete().eq("id", id);
    if (!error) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast({ title: "Deleted", description: "Enquiry removed" });
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    setIsSendingReply(true);
    try {
      await supabase.functions.invoke("send-reply-email", {
        body: {
          to_email: selectedMessage.email,
          to_name: selectedMessage.name,
          subject: selectedMessage.subject,
          original_message: selectedMessage.message,
          reply_message: replyText,
        },
      });
      toast({ title: "Reply Sent", description: `Reply sent to ${selectedMessage.email}` });
      await updateStatus(selectedMessage.id, "in_progress");
      setReplyText("");
      setShowReplyForm(false);
    } catch {
      toast({ title: "Error", description: "Failed to send reply", variant: "destructive" });
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    setSelectedFiles((prev) => [...prev, ...files]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith("image/"));
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadPhotos = async () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);
    let successCount = 0;

    for (const file of selectedFiles) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `photos/${fileName}`;

      const { error: uploadError } = await supabase.storage.from("gallery").upload(filePath, file);
      if (uploadError) continue;

      const { data: { publicUrl } } = supabase.storage.from("gallery").getPublicUrl(filePath);

      const { error: dbError } = await supabase.from("gallery_photos").insert({
        title: photoTitle || null,
        description: photoDescription || null,
        url: publicUrl,
        file_path: filePath,
        category: photoCategory as "events" | "sports" | "cultural" | "academics" | "celebrations" | "campus",
        uploaded_by: user?.id,
      });

      if (dbError) {
        await supabase.storage.from("gallery").remove([filePath]);
        continue;
      }
      successCount++;
    }

    if (successCount > 0) {
      toast({ title: "Uploaded", description: `${successCount} photo(s) uploaded` });
      setSelectedFiles([]);
      setPhotoTitle("");
      setPhotoDescription("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchPhotos();
    } else {
      toast({ title: "Failed", description: "Could not upload photos", variant: "destructive" });
    }
    setIsUploading(false);
  };

  const handleDeletePhoto = async (photo: GalleryPhoto) => {
    if (!confirm("Delete this photo?")) return;
    await supabase.storage.from("gallery").remove([photo.file_path]);
    const { error } = await supabase.from("gallery_photos").delete().eq("id", photo.id);
    if (!error) {
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
      toast({ title: "Deleted", description: "Photo removed" });
    }
  };

  const handleSettingChange = (key: string, value: string) => {
    setEditedSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      for (const setting of siteSettings) {
        const newValue = editedSettings[setting.key];
        if (newValue !== undefined && newValue !== setting.value) {
          await supabase.from("site_settings").update({ value: newValue }).eq("key", setting.key);
        }
      }
      toast({ title: "Settings Saved", description: "All changes have been saved. They will reflect across the website." });
      await fetchSettings();
    } catch {
      toast({ title: "Error", description: "Failed to save settings", variant: "destructive" });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setAuthenticated(false);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      in_progress: "bg-blue-100 text-blue-800 border-blue-200",
      resolved: "bg-green-100 text-green-800 border-green-200",
      closed: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status] || colors.closed;
  };

  const settingLabels: Record<string, string> = {
    school_address: "School Address",
    contact_phone_1: "Contact Phone 1",
    contact_phone_2: "Contact Phone 2",
    contact_email: "Contact Email",
    announcement_ticker: "Announcement Ticker Text",
    principal_name: "Principal Name",
    education_advisor: "Education Advisor",
    school_fees_info: "School Fees Information",
  };

  if (!authenticated) {
    return <PortalLogin onAuthenticated={() => setAuthenticated(true)} />;
  }

  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="animate-pulse text-muted-foreground">Loading portal data...</div>
      </div>
    );
  }

  const filteredMessages = filterStatus === "all" ? messages : messages.filter((m) => m.status === filterStatus);
  const pendingCount = messages.filter((m) => m.status === "pending").length;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-2xl font-bold">🔒 Secret Admin Portal</h1>
              <p className="text-sm text-primary-foreground/80">Dunne's Institute — Content Management</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={fetchAllData} className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <RefreshCw className="h-4 w-4 mr-2" /> Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout} className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="enquiries" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="enquiries" className="flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Enquiries</span>
              {pendingCount > 0 && <Badge variant="destructive" className="ml-1 text-xs px-1.5">{pendingCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-1.5">
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">Gallery</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1.5">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
            <TabsTrigger value="ticker" className="flex items-center gap-1.5">
              <Megaphone className="h-4 w-4" />
              <span className="hidden sm:inline">Ticker</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="enquiries" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total", count: messages.length, color: "text-foreground" },
                { label: "Pending", count: pendingCount, color: "text-yellow-600" },
                { label: "In Progress", count: messages.filter((m) => m.status === "in_progress").length, color: "text-blue-600" },
                { label: "Resolved", count: messages.filter((m) => m.status === "resolved").length, color: "text-green-600" },
              ].map((s) => (
                <Card key={s.label}>
                  <CardContent className="pt-6">
                    <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
                    <p className="text-muted-foreground text-sm">{s.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Label>Filter:</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardContent className="pt-6">
                {filteredMessages.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No enquiries found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMessages.map((msg) => (
                          <TableRow key={msg.id}>
                            <TableCell className="text-sm text-muted-foreground">{format(new Date(msg.created_at), "MMM d, yyyy")}</TableCell>
                            <TableCell className="font-medium">{msg.name}</TableCell>
                            <TableCell className="text-sm">{msg.email}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{msg.subject}</TableCell>
                            <TableCell><Badge className={getStatusColor(msg.status)}>{msg.status.replace("_", " ")}</Badge></TableCell>
                            <TableCell className="text-right space-x-1">
                              <Button variant="ghost" size="sm" onClick={() => setSelectedMessage(msg)}><Eye className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="sm" onClick={() => deleteMessage(msg.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Upload Photos</CardTitle>
                <CardDescription>Drag & drop images or click to browse</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/30 hover:border-primary/50"}`}
                >
                  <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">Drag & drop images here or click to browse</p>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />
                </div>

                {selectedFiles.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">{selectedFiles.length} file(s) selected:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {selectedFiles.map((file, i) => (
                        <div key={i} className="relative group">
                          <img src={URL.createObjectURL(file)} alt="" className="w-full h-24 object-cover rounded-lg" />
                          <button onClick={() => removeFile(i)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Title (optional)</Label>
                    <Input value={photoTitle} onChange={(e) => setPhotoTitle(e.target.value)} placeholder="Photo title" />
                  </div>
                  <div>
                    <Label>Description (optional)</Label>
                    <Input value={photoDescription} onChange={(e) => setPhotoDescription(e.target.value)} placeholder="Brief description" />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select value={photoCategory} onValueChange={setPhotoCategory}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleUploadPhotos} disabled={isUploading || selectedFiles.length === 0} className="w-full md:w-auto">
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? "Uploading..." : `Upload ${selectedFiles.length} Photo(s)`}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Gallery ({photos.length} photos)</CardTitle>
              </CardHeader>
              <CardContent>
                {photos.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No photos uploaded yet</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {photos.map((photo) => (
                      <div key={photo.id} className="relative group rounded-lg overflow-hidden border">
                        <img src={photo.url} alt={photo.title || "Gallery photo"} className="w-full h-32 object-cover" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Button variant="destructive" size="sm" onClick={() => handleDeletePhoto(photo)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="p-2">
                          <Badge variant="secondary" className="text-xs">{photo.category}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <Settings className="h-5 w-5" /> Content Settings
                </CardTitle>
                <CardDescription>
                  Changes here will automatically update across the entire website and the chatbot.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {siteSettings.map((setting) => (
                  <div key={setting.id} className="space-y-2">
                    <Label className="text-sm font-semibold">
                      {settingLabels[setting.key] || setting.key}
                    </Label>
                    {setting.key === "school_address" || setting.key === "school_fees_info" ? (
                      <Textarea
                        value={editedSettings[setting.key] || ""}
                        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                        rows={3}
                      />
                    ) : (
                      <Input
                        value={editedSettings[setting.key] || ""}
                        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                      />
                    )}
                    <p className="text-xs text-muted-foreground">
                      Last updated: {format(new Date(setting.updated_at), "MMM d, yyyy h:mm a")}
                    </p>
                  </div>
                ))}

                <Button onClick={handleSaveSettings} disabled={isSavingSettings} className="w-full md:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  {isSavingSettings ? "Saving..." : "Save All Settings"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ticker" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <Megaphone className="h-5 w-5" /> Announcement Ticker
                </CardTitle>
                <CardDescription>Edit the scrolling announcement text on the homepage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Ticker Text</Label>
                  <Textarea
                    value={editedSettings["announcement_ticker"] || ""}
                    onChange={(e) => handleSettingChange("announcement_ticker", e.target.value)}
                    rows={3}
                    placeholder="Enter announcement text..."
                  />
                </div>

                <div className="bg-primary text-primary-foreground p-3 rounded-lg overflow-hidden">
                  <p className="text-sm font-medium mb-1">Preview:</p>
                  <div className="overflow-hidden">
                    <p className="animate-marquee whitespace-nowrap text-secondary font-semibold">
                      📢 {editedSettings["announcement_ticker"] || "No announcement set"}
                    </p>
                  </div>
                </div>

                <Button onClick={handleSaveSettings} disabled={isSavingSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSavingSettings ? "Saving..." : "Update Ticker"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={!!selectedMessage} onOpenChange={(open) => { if (!open) { setSelectedMessage(null); setShowReplyForm(false); setReplyText(""); } }}>
        <DialogContent className="max-w-lg">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedMessage.subject}</DialogTitle>
                <DialogDescription>From {selectedMessage.name} — {format(new Date(selectedMessage.created_at), "PPP")}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-4 text-sm">
                  <span className="flex items-center gap-1"><Mail className="h-4 w-4" />{selectedMessage.email}</span>
                  {selectedMessage.phone && <span className="flex items-center gap-1"><Phone className="h-4 w-4" />{selectedMessage.phone}</span>}
                </div>
                <div className="bg-muted p-4 rounded-lg text-sm whitespace-pre-wrap">{selectedMessage.message}</div>
                <div className="flex items-center gap-3">
                  <Label>Status:</Label>
                  <Select value={selectedMessage.status} onValueChange={(v) => updateStatus(selectedMessage.id, v)}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((s) => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {!showReplyForm ? (
                  <Button variant="outline" onClick={() => setShowReplyForm(true)}>
                    <Reply className="h-4 w-4 mr-2" /> Reply via Email
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type your reply..." rows={4} />
                    <div className="flex gap-2">
                      <Button onClick={handleSendReply} disabled={isSendingReply || !replyText.trim()}>
                        <Send className="h-4 w-4 mr-2" /> {isSendingReply ? "Sending..." : "Send Reply"}
                      </Button>
                      <Button variant="outline" onClick={() => { setShowReplyForm(false); setReplyText(""); }}>Cancel</Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
