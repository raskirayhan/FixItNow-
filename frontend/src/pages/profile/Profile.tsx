import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Lock,
  Shield,
  Bell,
  Home,
  Pencil,
  Trash2,
  Plus,
  LogOut,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useProfile, useUpdateProfile, useChangePassword } from "@/hooks/useApi";
import { useThemeContext } from "@/context/ThemeContext";
import { cn, formatDate, getInitials } from "@/lib/utils";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

const addressSchema = z.object({
  name: z.string().min(1, "Label is required"),
  address: z.string().min(1, "Address is required"),
  type: z.enum(["Home", "Work", "Other"]),
});

type AddressForm = z.infer<typeof addressSchema>;

const mockAddresses = [
  { id: "addr-1", name: "Home", address: "123 Maple Ave, Brooklyn, NY 11201", type: "Home" as const },
  { id: "addr-2", name: "Office", address: "456 Business Blvd, Manhattan, NY 10001", type: "Work" as const },
  { id: "addr-3", name: "Mom's House", address: "789 Oak Lane, Queens, NY 11375", type: "Other" as const },
];

const mockSessions = [
  { id: "s1", device: "Chrome on MacBook", ip: "192.168.1.1", lastActive: "2026-07-14T10:30:00Z", current: true },
  { id: "s2", device: "Safari on iPhone", ip: "192.168.1.2", lastActive: "2026-07-14T08:00:00Z", current: false },
  { id: "s3", device: "Firefox on Windows", ip: "10.0.0.5", lastActive: "2026-07-12T15:00:00Z", current: false },
];

export default function Profile() {
  const { isDark } = useThemeContext();
  const { data: profileData, isLoading: profileLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const profile = profileData?.data;

  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addresses, setAddresses] = useState(mockAddresses);

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      location: profile?.location || "",
      bio: "",
    },
  });

  useEffect(() => {
    if (profile) {
      profileForm.reset({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        location: profile.location || "",
        bio: "",
      });
    }
  }, [profile]);

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const addressForm = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
  });

  const onProfileSubmit = (data: ProfileForm) => {
    updateProfile.mutate({
      name: data.name,
      phone: data.phone,
      location: data.location,
      bio: data.bio,
    });
  };

  const onPasswordSubmit = (data: PasswordForm) => {
    changePassword.mutate(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      { onSuccess: () => passwordForm.reset() }
    );
  };

  const onAddressSubmit = (data: AddressForm) => {
    if (editingAddress) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === editingAddress ? { ...a, ...data } : a))
      );
    } else {
      setAddresses((prev) => [...prev, { ...data, id: `addr-${Date.now()}` }]);
    }
    setAddressDialogOpen(false);
    setEditingAddress(null);
    addressForm.reset();
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  if (profileLoading) {
    return (
      <DashboardLayout role="CUSTOMER">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      </DashboardLayout>
    );
  }

  const user = profile || { id: "", email: "", name: "", phone: "", location: "", role: "CUSTOMER", status: "ACTIVE", createdAt: "" };

  return (
    <DashboardLayout role="CUSTOMER">
      <div className="space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-100 text-3xl font-bold text-primary-700">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    ) : (
                      getInitials(user.name)
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                    {user.name}
                  </h2>
                  <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                    {user.email}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <Badge variant="default">{user.role}</Badge>
                    <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                      Member since {formatDate(user.createdAt)}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Pencil className="h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="personal" className="gap-2">
                <User className="h-4 w-4" />
                Personal Info
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Lock className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="addresses" className="gap-2">
                <MapPin className="h-4 w-4" />
                Addresses
              </TabsTrigger>
            </TabsList>

            {/* Personal Info Tab */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Input
                        label="Full Name"
                        icon={<User className="h-4 w-4" />}
                        error={profileForm.formState.errors.name?.message}
                        {...profileForm.register("name")}
                      />
                      <Input
                        label="Email"
                        type="email"
                        icon={<Mail className="h-4 w-4" />}
                        error={profileForm.formState.errors.email?.message}
                        {...profileForm.register("email")}
                      />
                      <Input
                        label="Phone"
                        type="tel"
                        icon={<Phone className="h-4 w-4" />}
                        error={profileForm.formState.errors.phone?.message}
                        {...profileForm.register("phone")}
                      />
                      <Input
                        label="Location"
                        icon={<MapPin className="h-4 w-4" />}
                        error={profileForm.formState.errors.location?.message}
                        {...profileForm.register("location")}
                      />
                    </div>
                    <Textarea
                      label="Bio"
                      placeholder="Tell us about yourself..."
                      maxLength={500}
                      showCount
                      error={profileForm.formState.errors.bio?.message}
                      {...profileForm.register("bio")}
                    />

                    <Separator />

                    <div className="space-y-4">
                      <h3 className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>
                        Emergency Contact
                      </h3>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Input label="Contact Name" placeholder="Jane Doe" />
                        <Input label="Contact Phone" type="tel" placeholder="+1 (555) 000-0000" />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>
                        Saved Locations
                      </h3>
                      <div className="space-y-3">
                        {addresses.map((addr) => (
                          <div
                            key={addr.id}
                            className={cn(
                              "flex items-center justify-between rounded-xl border p-3",
                              isDark ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-slate-50"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <Home className="h-4 w-4 text-slate-400" />
                              <div>
                                <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                                  {addr.name}
                                </p>
                                <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                                  {addr.address}
                                </p>
                              </div>
                            </div>
                            <Badge variant="secondary">{addr.type}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit">
                        <Save className="h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                    className="space-y-4"
                  >
                    <Input
                      label="Current Password"
                      type="password"
                      icon={<Lock className="h-4 w-4" />}
                      error={passwordForm.formState.errors.currentPassword?.message}
                      {...passwordForm.register("currentPassword")}
                    />
                    <Input
                      label="New Password"
                      type="password"
                      icon={<Lock className="h-4 w-4" />}
                      error={passwordForm.formState.errors.newPassword?.message}
                      {...passwordForm.register("newPassword")}
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      icon={<Lock className="h-4 w-4" />}
                      error={passwordForm.formState.errors.confirmPassword?.message}
                      {...passwordForm.register("confirmPassword")}
                    />
                    <div className="flex justify-end">
                      <Button type="submit">Update Password</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-primary-600" />
                      <div>
                        <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                          Authenticator App
                        </p>
                        <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                          Use an authenticator app to generate one-time codes
                        </p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockSessions.map((session) => (
                      <div
                        key={session.id}
                        className={cn(
                          "flex items-center justify-between rounded-xl border p-3",
                          isDark ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-slate-50"
                        )}
                      >
                        <div>
                          <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                            {session.device}
                            {session.current && (
                              <Badge variant="success" className="ml-2">
                                Current
                              </Badge>
                            )}
                          </p>
                          <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                            IP: {session.ip} &middot; {formatDate(session.lastActive)}
                          </p>
                        </div>
                        {!session.current && (
                          <Button variant="ghost" size="sm">
                            <LogOut className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                        Delete Account
                      </p>
                      <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>
                      Channels
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-700")}>
                          Email Notifications
                        </p>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-700")}>
                          Push Notifications
                        </p>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-700")}>
                          SMS Notifications
                        </p>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-700")}>
                          Marketing Communications
                        </p>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>
                      Frequency
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-700")}>
                          Instant notifications
                        </p>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-700")}>
                          Daily digest
                        </p>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-700")}>
                          Weekly summary
                        </p>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>
                      <Save className="h-4 w-4" />
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Saved Addresses</CardTitle>
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingAddress(null);
                      addressForm.reset();
                      setAddressDialogOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Add New
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <motion.div
                        key={addr.id}
                        layout
                        className={cn(
                          "flex items-center justify-between rounded-xl border p-4",
                          isDark ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-slate-50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Home className="h-5 w-5 text-slate-400" />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                                {addr.name}
                              </p>
                              <Badge variant="secondary">{addr.type}</Badge>
                            </div>
                            <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                              {addr.address}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingAddress(addr.id);
                              addressForm.setValue("name", addr.name);
                              addressForm.setValue("address", addr.address);
                              addressForm.setValue("type", addr.type);
                              setAddressDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteAddress(addr.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Address Dialog */}
      <Dialog
        open={addressDialogOpen}
        onOpenChange={(open) => {
          setAddressDialogOpen(open);
          if (!open) {
            setEditingAddress(null);
            addressForm.reset();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
            <DialogDescription>
              {editingAddress
                ? "Update your saved address details."
                : "Add a new address to your saved locations."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4">
            <Input
              label="Label"
              placeholder="e.g. Home, Office"
              error={addressForm.formState.errors.name?.message}
              {...addressForm.register("name")}
            />
            <Input
              label="Address"
              placeholder="Full address"
              error={addressForm.formState.errors.address?.message}
              {...addressForm.register("address")}
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Type</label>
              <div className="flex gap-2">
                {(["Home", "Work", "Other"] as const).map((type) => (
                  <Button
                    key={type}
                    type="button"
                    variant={addressForm.watch("type") === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => addressForm.setValue("type", type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAddressDialogOpen(false);
                  setEditingAddress(null);
                  addressForm.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingAddress ? "Save Changes" : "Add Address"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Account
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All your data, bookings, and history will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700">
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
