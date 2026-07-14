import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/api";

// ===== AUTH =====
export const useLogin = () => useMutation({
  mutationFn: (data: { email: string; password: string }) => api.post("/auth/login", data).then(r => r.data),
});

export const useRegister = () => useMutation({
  mutationFn: (data: { email: string; password: string; name: string; phone?: string; location?: string; role?: string }) =>
    api.post("/auth/register", data).then(r => r.data),
});

export const useMe = () => useQuery({
  queryKey: ["me"],
  queryFn: () => api.get("/auth/me").then(r => r.data),
  retry: false,
  staleTime: 5 * 60 * 1000,
});

// ===== PROFILE =====
export const useProfile = () => useQuery({
  queryKey: ["profile"],
  queryFn: () => api.get("/profile/me").then(r => r.data),
});

export const useUpdateProfile = () => useMutation({
  mutationFn: (data: { name?: string; phone?: string; location?: string; bio?: string }) =>
    api.put("/profile/me", data).then(r => r.data),
});

export const useChangePassword = () => useMutation({
  mutationFn: (data: { currentPassword: string; newPassword: string }) =>
    api.put("/profile/change-password", data).then(r => r.data),
});

export const useUpdateTechnicianProfile = () => useMutation({
  mutationFn: (data: { bio?: string; experienceYears?: number; skills?: string[]; baseHourlyRate?: number }) =>
    api.put("/profile/technician", data).then(r => r.data),
});

// ===== SERVICES =====
export const useServices = (params?: { search?: string; categoryId?: string; minRating?: string }) => useQuery({
  queryKey: ["services", params],
  queryFn: () => api.get("/services", { params }).then(r => r.data),
});

export const useService = (id: string) => useQuery({
  queryKey: ["service", id],
  queryFn: () => api.get(`/services/${id}`).then(r => r.data),
  enabled: !!id,
});

export const useTechnicianServices = (technicianId: string) => useQuery({
  queryKey: ["technicianServices", technicianId],
  queryFn: () => api.get(`/services/technician/${technicianId}`).then(r => r.data),
  enabled: !!technicianId,
});

export const useCategories = () => useQuery({
  queryKey: ["categories"],
  queryFn: () => api.get("/services/categories").then(r => r.data),
});

export const useCreateService = () => useMutation({
  mutationFn: (data: { categoryId: string; title: string; description?: string; price: number }) =>
    api.post("/services", data).then(r => r.data),
});

// ===== BOOKINGS =====
export const useCreateBooking = () => useMutation({
  mutationFn: (data: { serviceId: string; scheduledAt: string; timeSlot?: string }) =>
    api.post("/bookings", data).then(r => r.data),
});

export const useUpdateBookingStatus = () => useMutation({
  mutationFn: ({ id, status }: { id: string; status: string }) =>
    api.patch(`/bookings/${id}/status`, { status }).then(r => r.data),
});

export const useCustomerBookings = () => useQuery({
  queryKey: ["customerBookings"],
  queryFn: () => api.get("/bookings/customer").then(r => r.data),
});

export const useTechnicianBookings = () => useQuery({
  queryKey: ["technicianBookings"],
  queryFn: () => api.get("/bookings/technician").then(r => r.data),
});

// ===== PAYMENTS =====
export const useCreatePayment = () => useMutation({
  mutationFn: (data: { bookingId: string }) =>
    api.post("/payments/create", data).then(r => r.data),
});

// ===== REVIEWS =====
export const useCreateReview = () => useMutation({
  mutationFn: (data: { bookingId: string; rating: number; comment?: string }) =>
    api.post("/reviews", data).then(r => r.data),
});

export const useTechnicianReviews = (technicianId: string) => useQuery({
  queryKey: ["technicianReviews", technicianId],
  queryFn: () => api.get(`/reviews/technician/${technicianId}`).then(r => r.data),
  enabled: !!technicianId,
});

// ===== WALLET =====
export const useWallet = () => useQuery({
  queryKey: ["wallet"],
  queryFn: () => api.get("/wallet").then(r => r.data),
});

export const useAddMoney = () => useMutation({
  mutationFn: (data: { amount: number; description?: string }) =>
    api.post("/wallet/add", data).then(r => r.data),
});

export const useWalletTransactions = () => useQuery({
  queryKey: ["walletTransactions"],
  queryFn: () => api.get("/wallet/transactions").then(r => r.data),
});

// ===== NOTIFICATIONS =====
export const useNotifications = () => useQuery({
  queryKey: ["notifications"],
  queryFn: () => api.get("/notifications").then(r => r.data),
});

export const useMarkNotificationRead = () => useMutation({
  mutationFn: (id: string) => api.patch(`/notifications/${id}/read`).then(r => r.data),
});

export const useMarkAllNotificationsRead = () => useMutation({
  mutationFn: () => api.patch("/notifications/read-all").then(r => r.data),
});

// ===== ADMIN =====
export const useAdminStats = () => useQuery({
  queryKey: ["adminStats"],
  queryFn: () => api.get("/admin/stats").then(r => r.data),
});

export const useAdminUsers = () => useQuery({
  queryKey: ["adminUsers"],
  queryFn: () => api.get("/admin/users").then(r => r.data),
});

export const useAdminBanUser = () => useMutation({
  mutationFn: ({ id, status }: { id: string; status: string }) =>
    api.patch(`/admin/users/${id}/ban`, { status }).then(r => r.data),
});

export const useAdminBookings = () => useQuery({
  queryKey: ["adminBookings"],
  queryFn: () => api.get("/admin/bookings").then(r => r.data),
});

export const useAdminCategories = () => useQuery({
  queryKey: ["adminCategories"],
  queryFn: () => api.get("/admin/categories").then(r => r.data),
});
